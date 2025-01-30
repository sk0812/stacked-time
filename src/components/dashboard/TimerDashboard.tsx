"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Clock,
  Plus,
  Tag,
  ChevronDown,
  ClipboardList,
  Trash2,
  Pencil,
} from "lucide-react";
import AddTimerModal from "./AddTimerModal";
import LogsModal from "./LogsModal";
import ConfirmDialog from "./ConfirmDialog";
import EditTimerModal from "./EditTimerModal";
import AddCategoryModal from "./AddCategoryModal";

type TimerStatus = "running" | "paused" | "finished";

interface Category {
  _id: string;
  name: string;
  color: string;
}

interface Timer {
  _id: string;
  projectName: string;
  description: string;
  status: TimerStatus;
  time: number;
  startedAt: string;
  categoryId?: string;
}

export default function TimerDashboard() {
  const [activeFilter, setActiveFilter] = useState<TimerStatus | "all">("all");
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [timers, setTimers] = useState<Timer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimer, setSelectedTimer] = useState<Timer | null>(null);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [timerToDelete, setTimerToDelete] = useState<Timer | null>(null);
  const [timerToEdit, setTimerToEdit] = useState<Timer | null>(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Use ref instead of state for intervals to prevent re-renders
  const intervalsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach((interval) =>
        clearInterval(interval)
      );
    };
  }, []);

  // Start intervals for running timers and handle page refresh
  useEffect(() => {
    // Clear all existing intervals first
    Object.values(intervalsRef.current).forEach((interval) =>
      clearInterval(interval)
    );
    intervalsRef.current = {};

    // Start new intervals for all running timers
    timers.forEach((timer) => {
      if (timer.status === "running") {
        const interval = setInterval(() => {
          setTimers((prev) =>
            prev.map((t) =>
              t._id === timer._id ? { ...t, time: t.time + 1 } : t
            )
          );
        }, 1000);

        intervalsRef.current[timer._id] = interval;
      }
    });

    // No cleanup needed here as it's handled in the unmount effect
  }, [timers]);

  // Calculate elapsed time for running timers
  const calculateElapsedTime = useCallback((timer: Timer) => {
    if (timer.status !== "running") return timer.time;

    const startTime = new Date(timer.startedAt).getTime();
    const currentTime = new Date().getTime();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

    return timer.time + elapsedSeconds;
  }, []);

  const fetchTimers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/timers");

      if (!response.ok) {
        throw new Error("Failed to fetch timers");
      }

      const data = await response.json();

      // Update times for running timers
      const updatedTimers = data.map((timer: Timer) => ({
        ...timer,
        time: calculateElapsedTime(timer),
      }));

      setTimers(updatedTimers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch timers");
    } finally {
      setIsLoading(false);
    }
  }, [calculateElapsedTime]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchTimers();
    fetchCategories();
  }, [fetchTimers]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredTimers = timers.filter(
    (timer) =>
      (activeFilter === "all" || timer.status === activeFilter) &&
      (activeCategoryFilter === "all" ||
        timer.categoryId === activeCategoryFilter)
  );

  const getCategory = (categoryId?: string) =>
    categories.find((cat) => cat._id === categoryId);

  const updateTimer = useCallback(
    async (timerId: string, status: TimerStatus, currentTime: number) => {
      try {
        const response = await fetch(`/api/timers/${timerId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            time: currentTime,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update timer");
        }

        // Only fetch timers if the update was successful
        await fetchTimers();
      } catch (err) {
        console.error("Error updating timer:", err);
        setError(err instanceof Error ? err.message : "Failed to update timer");

        // Revert the timer state on error
        await fetchTimers();
      }
    },
    [fetchTimers]
  );

  const startTimer = useCallback(
    async (timerId: string, currentTime: number) => {
      try {
        // Update timer status in database first
        const response = await fetch(`/api/timers/${timerId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "running",
            time: currentTime,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to start timer");
        }

        // If successful, update local state
        setTimers((prev) =>
          prev.map((timer) =>
            timer._id === timerId
              ? { ...timer, status: "running", time: currentTime }
              : timer
          )
        );

        // Create new interval
        const interval = setInterval(() => {
          setTimers((prev) =>
            prev.map((timer) =>
              timer._id === timerId ? { ...timer, time: timer.time + 1 } : timer
            )
          );
        }, 1000);

        // Save interval reference
        intervalsRef.current[timerId] = interval;
      } catch (err) {
        console.error("Error starting timer:", err);
        setError(err instanceof Error ? err.message : "Failed to start timer");
        await fetchTimers(); // Refresh timer state on error
      }
    },
    [fetchTimers]
  );

  const stopTimer = useCallback(
    async (timerId: string, currentTime: number) => {
      try {
        // Clear interval first
        if (intervalsRef.current[timerId]) {
          clearInterval(intervalsRef.current[timerId]);
          const newIntervals = { ...intervalsRef.current };
          delete newIntervals[timerId];
          intervalsRef.current = newIntervals;
        }

        // Update timer status in database
        const response = await fetch(`/api/timers/${timerId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "paused",
            time: currentTime,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to stop timer");
        }

        // Update local state
        setTimers((prev) =>
          prev.map((timer) =>
            timer._id === timerId
              ? { ...timer, status: "paused", time: currentTime }
              : timer
          )
        );
      } catch (err) {
        console.error("Error stopping timer:", err);
        setError(err instanceof Error ? err.message : "Failed to stop timer");
        await fetchTimers(); // Refresh timer state on error
      }
    },
    [fetchTimers]
  );

  const finishTimer = useCallback(
    (timerId: string, currentTime: number) => {
      // Clear interval
      if (intervalsRef.current[timerId]) {
        clearInterval(intervalsRef.current[timerId]);
        const newIntervals = { ...intervalsRef.current };
        delete newIntervals[timerId];
        intervalsRef.current = newIntervals;
      }

      // Update timer status in database
      updateTimer(timerId, "finished", currentTime);
    },
    [updateTimer]
  );

  const deleteTimer = useCallback(async (timerId: string) => {
    try {
      const response = await fetch(`/api/timers/${timerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete timer");
      }

      // Remove timer from local state
      setTimers((prev) => prev.filter((timer) => timer._id !== timerId));
    } catch (err) {
      console.error("Error deleting timer:", err);
      setError(err instanceof Error ? err.message : "Failed to delete timer");
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="space-y-4 sm:space-y-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Status Filters - Matched height with category filter */}
          <div className="tabs tabs-boxed bg-slate-800/80 p-1.5 rounded-lg h-[48px] flex items-center overflow-x-auto hide-scrollbar">
            <button
              className={`tab h-full px-4 transition-colors duration-200 font-medium whitespace-nowrap ${
                activeFilter === "all"
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              onClick={() => setActiveFilter("all")}
            >
              All Timers
            </button>
            <button
              className={`tab h-full px-4 transition-colors duration-200 font-medium whitespace-nowrap ${
                activeFilter === "running"
                  ? "bg-emerald-500/20 text-emerald-200"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              onClick={() => setActiveFilter("running")}
            >
              Running
            </button>
            <button
              className={`tab h-full px-4 transition-colors duration-200 font-medium whitespace-nowrap ${
                activeFilter === "paused"
                  ? "bg-amber-500/20 text-amber-200"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              onClick={() => setActiveFilter("paused")}
            >
              Paused
            </button>
            <button
              className={`tab h-full px-4 transition-colors duration-200 font-medium whitespace-nowrap ${
                activeFilter === "finished"
                  ? "bg-blue-500/20 text-blue-200"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              onClick={() => setActiveFilter("finished")}
            >
              Finished
            </button>
          </div>

          {/* Category Filter Dropdown */}
          <div className="dropdown w-full sm:w-auto">
            <label
              tabIndex={0}
              className="btn h-[48px] bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 gap-2 font-medium w-full sm:min-w-[200px] justify-start px-4"
            >
              <Tag className="w-5 h-5" />
              <span className="text-base text-slate-200 flex items-center gap-2">
                {activeCategoryFilter === "all" ? (
                  "All Categories"
                ) : (
                  <>
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        getCategory(activeCategoryFilter)?.color
                      }`}
                    />
                    <span className="text-white">
                      {getCategory(activeCategoryFilter)?.name}
                    </span>
                  </>
                )}
              </span>
              <ChevronDown className="w-5 h-5 opacity-60 ml-auto" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-3 shadow-xl bg-slate-800/95 backdrop-blur-sm rounded-box w-full sm:w-[200px] mt-2 border border-slate-700"
            >
              <li>
                <button
                  className="text-slate-200 hover:bg-slate-700/70 py-3 text-base font-medium"
                  onClick={() => setActiveCategoryFilter("all")}
                >
                  All Categories
                </button>
              </li>
              {categories.length > 0 && (
                <>
                  <div className="divider my-2 before:bg-slate-700 after:bg-slate-700"></div>
                  {categories.map((category) => (
                    <li key={category._id}>
                      <button
                        className="text-slate-200 hover:bg-slate-700/70 py-3 flex items-center gap-3 text-base"
                        onClick={() => setActiveCategoryFilter(category._id)}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${category.color}`}
                        />
                        <span className="font-medium text-white">
                          {category.name}
                        </span>
                      </button>
                    </li>
                  ))}
                </>
              )}
              <div className="divider my-2 before:bg-slate-700 after:bg-slate-700"></div>
              <li>
                <button
                  onClick={() => setIsAddCategoryModalOpen(true)}
                  className="text-slate-200 hover:bg-slate-700/70 py-3 text-base font-medium flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Category
                </button>
              </li>
            </ul>
          </div>
        </div>

        <button
          className="btn btn-lg btn-primary gap-2 w-full sm:w-auto"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Clock className="w-5 h-5" />
          <span className="text-base font-medium">New Timer</span>
        </button>
      </div>

      {/* Timer Cards */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-200">
            {error}
          </div>
        ) : filteredTimers.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <h3 className="text-lg font-medium mb-2">No timers found</h3>
            <p className="text-sm opacity-75">
              {activeFilter === "all" && activeCategoryFilter === "all"
                ? "Create your first timer to get started"
                : "Try changing your filters"}
            </p>
          </div>
        ) : (
          filteredTimers.map((timer) => (
            <div
              key={timer._id}
              className={`rounded-xl border p-4 sm:p-5 ${
                timer.status === "running"
                  ? "bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-blue-500/20"
                  : timer.status === "finished"
                  ? "bg-slate-800/30 border-slate-700/30"
                  : "bg-slate-800/50 border-slate-700/50"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-0">
                <div className="space-y-2 sm:space-y-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap sm:flex-nowrap">
                    {timer.categoryId && (
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            getCategory(timer.categoryId)?.color
                          }`}
                        ></div>
                        <span className="text-sm text-slate-400">
                          {getCategory(timer.categoryId)?.name}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 flex-1">
                      <h3
                        className={`font-medium text-lg ${
                          timer.status === "running"
                            ? "text-blue-100"
                            : "text-slate-200"
                        }`}
                      >
                        {timer.projectName}
                      </h3>
                      <button
                        onClick={() => setTimerToEdit(timer)}
                        className="p-1 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-700/50"
                        title="Edit Timer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {timer.description}
                    </p>
                    <p className="text-slate-500 text-xs">
                      Started: {new Date(timer.startedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border w-fit ${
                    timer.status === "running"
                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                      : timer.status === "finished"
                      ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                      : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                  }`}
                >
                  {timer.status.charAt(0).toUpperCase() + timer.status.slice(1)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-0">
                <div
                  className={`font-mono text-3xl sm:text-4xl font-bold tracking-wider ${
                    timer.status === "running" ? "text-white" : "text-slate-300"
                  }`}
                >
                  {formatTime(timer.time)}
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  {timer.status !== "finished" && (
                    <button
                      onClick={() => {
                        if (timer.status === "running") {
                          stopTimer(timer._id, timer.time);
                        } else {
                          startTimer(timer._id, timer.time);
                        }
                      }}
                      className={`h-8 flex-1 sm:w-16 sm:flex-none rounded flex items-center justify-center text-sm ${
                        timer.status === "running"
                          ? "bg-red-500/20 text-red-200 hover:bg-red-500/30"
                          : "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
                      }`}
                    >
                      {timer.status === "running" ? "Stop" : "Start"}
                    </button>
                  )}
                  {timer.status === "paused" && (
                    <button
                      onClick={() => finishTimer(timer._id, timer.time)}
                      className="h-8 flex-1 sm:w-16 sm:flex-none bg-slate-700/30 hover:bg-slate-700/50 rounded flex items-center justify-center text-slate-300 text-sm"
                    >
                      Finish
                    </button>
                  )}
                  {(timer.status === "finished" ||
                    timer.status === "paused") && (
                    <button
                      onClick={() => {
                        setSelectedTimer(timer);
                        setIsLogsModalOpen(true);
                      }}
                      className="h-8 flex-1 sm:w-auto sm:flex-none px-3 bg-slate-700/30 hover:bg-slate-700/50 rounded flex items-center gap-1.5 justify-center text-slate-300 text-sm"
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                      Logs
                    </button>
                  )}
                  {timer.status === "finished" && (
                    <button
                      onClick={() => setTimerToDelete(timer)}
                      className="h-8 w-8 bg-red-500/20 hover:bg-red-500/30 rounded flex items-center justify-center text-red-200"
                      title="Delete Timer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Add New Timer Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center w-full h-14 rounded-xl border border-dashed border-slate-700 text-slate-400 bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2 opacity-50" />
          New Timer
        </button>
      </div>

      {/* Add Timer Modal */}
      <AddTimerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchTimers}
        categories={categories}
      />

      {/* Logs Modal */}
      {selectedTimer && (
        <LogsModal
          isOpen={isLogsModalOpen}
          onClose={() => {
            setIsLogsModalOpen(false);
            setSelectedTimer(null);
          }}
          timer={selectedTimer}
        />
      )}

      {/* Confirm Delete Dialog */}
      {timerToDelete && (
        <ConfirmDialog
          isOpen={!!timerToDelete}
          onClose={() => setTimerToDelete(null)}
          onConfirm={() => {
            deleteTimer(timerToDelete._id);
            setTimerToDelete(null);
          }}
          title="Delete Timer"
          message="Are you sure you want to delete this timer? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}

      {/* Edit Timer Modal */}
      {timerToEdit && (
        <EditTimerModal
          isOpen={!!timerToEdit}
          onClose={() => setTimerToEdit(null)}
          onSuccess={fetchTimers}
          timer={timerToEdit}
          categories={categories}
        />
      )}

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onSuccess={fetchCategories}
      />
    </div>
  );
}
