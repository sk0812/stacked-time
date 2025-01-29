"use client";

import { useState } from "react";
import { Clock, Plus, Tag, ChevronDown } from "lucide-react";

type TimerStatus = "running" | "paused" | "finished";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Timer {
  id: string;
  projectName: string;
  clientName: string;
  status: TimerStatus;
  time: number;
  startedAt: Date;
  categoryId?: string;
}

export default function TimerDashboard() {
  const [activeFilter, setActiveFilter] = useState<TimerStatus | "all">("all");
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<string>("all");

  // Sample categories
  const [categories] = useState<Category[]>([
    { id: "1", name: "Development", color: "bg-blue-500" },
    { id: "2", name: "Design", color: "bg-purple-500" },
    { id: "3", name: "Marketing", color: "bg-green-500" },
    { id: "4", name: "Research", color: "bg-amber-500" },
  ]);

  const [timers, setTimers] = useState<Timer[]>([
    {
      id: "1",
      projectName: "Mobile App Development",
      clientName: "TechCorp Inc.",
      status: "running",
      time: 13335,
      startedAt: new Date(2024, 2, 18, 9, 30),
      categoryId: "1",
    },
    {
      id: "2",
      projectName: "Website Redesign",
      clientName: "Design Studio",
      status: "paused",
      time: 5445,
      startedAt: new Date(2024, 2, 18, 14, 15),
      categoryId: "2",
    },
    {
      id: "3",
      projectName: "API Integration",
      clientName: "Tech Solutions",
      status: "finished",
      time: 28800,
      startedAt: new Date(2024, 2, 17, 10, 0),
      categoryId: "1",
    },
  ]);

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
    categories.find((cat) => cat.id === categoryId);

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Status Filters - Matched height with category filter */}
          <div className="tabs tabs-boxed bg-slate-800/80 p-1.5 rounded-lg h-[48px] flex items-center">
            <button
              className={`tab h-full px-4 transition-colors duration-200 font-medium ${
                activeFilter === "all"
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              onClick={() => setActiveFilter("all")}
            >
              All Timers
            </button>
            <button
              className={`tab h-full px-4 transition-colors duration-200 font-medium ${
                activeFilter === "running"
                  ? "bg-emerald-500/20 text-emerald-200"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              onClick={() => setActiveFilter("running")}
            >
              Running
            </button>
            <button
              className={`tab h-full px-4 transition-colors duration-200 font-medium ${
                activeFilter === "paused"
                  ? "bg-amber-500/20 text-amber-200"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              onClick={() => setActiveFilter("paused")}
            >
              Paused
            </button>
            <button
              className={`tab h-full px-4 transition-colors duration-200 font-medium ${
                activeFilter === "finished"
                  ? "bg-blue-500/20 text-blue-200"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              onClick={() => setActiveFilter("finished")}
            >
              Finished
            </button>
          </div>

          {/* Category Filter Dropdown - Improved text readability */}
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn h-[48px] bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 gap-2 font-medium min-w-[200px] justify-start px-4"
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
              className="dropdown-content z-[1] menu p-3 shadow-xl bg-slate-800/95 backdrop-blur-sm rounded-box w-[200px] mt-2 border border-slate-700"
            >
              <li>
                <button
                  className="text-slate-200 hover:bg-slate-700/70 py-3 text-base font-medium"
                  onClick={() => setActiveCategoryFilter("all")}
                >
                  All Categories
                </button>
              </li>
              <div className="divider my-2 before:bg-slate-700 after:bg-slate-700"></div>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    className="text-slate-200 hover:bg-slate-700/70 py-3 flex items-center gap-3 text-base"
                    onClick={() => setActiveCategoryFilter(category.id)}
                  >
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <span className="font-medium text-white">
                      {category.name}
                    </span>
                  </button>
                </li>
              ))}
              <div className="divider my-2 before:bg-slate-700 after:bg-slate-700"></div>
              <li>
                <button className="text-slate-200 hover:bg-slate-700/70 py-3 text-base font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Category
                </button>
              </li>
            </ul>
          </div>
        </div>

        <button className="btn btn-lg btn-primary gap-2">
          <Clock className="w-5 h-5" />
          <span className="text-base font-medium">New Timer</span>
        </button>
      </div>

      {/* Timer Cards - Updated category dot */}
      <div className="space-y-4">
        {filteredTimers.map((timer) => (
          <div
            key={timer.id}
            className={`rounded-xl border p-5 ${
              timer.status === "running"
                ? "bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-blue-500/20"
                : timer.status === "finished"
                ? "bg-slate-800/30 border-slate-700/30"
                : "bg-slate-800/50 border-slate-700/50"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  {timer.categoryId && (
                    <div
                      className={`w-3 h-3 rounded-full ${
                        getCategory(timer.categoryId)?.color
                      }`}
                    ></div>
                  )}
                  <h3
                    className={`font-medium text-lg ${
                      timer.status === "running"
                        ? "text-blue-100"
                        : "text-slate-200"
                    }`}
                  >
                    {timer.projectName}
                  </h3>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 text-sm">
                    Client: {timer.clientName}
                  </p>
                  <p className="text-slate-500 text-xs">
                    Started: {timer.startedAt.toLocaleString()}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
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
            <div className="flex items-end justify-between">
              <div
                className={`font-mono text-4xl font-bold tracking-wider ${
                  timer.status === "running" ? "text-white" : "text-slate-300"
                }`}
              >
                {formatTime(timer.time)}
              </div>
              <div className="flex gap-2">
                {timer.status !== "finished" && (
                  <button
                    className={`h-8 w-16 rounded flex items-center justify-center text-sm ${
                      timer.status === "running"
                        ? "bg-red-500/20 text-red-200"
                        : "bg-emerald-500/20 text-emerald-200"
                    }`}
                  >
                    {timer.status === "running" ? "Stop" : "Start"}
                  </button>
                )}
                <button className="h-8 w-16 bg-slate-700/30 rounded flex items-center justify-center text-slate-300 text-sm">
                  Log
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Timer Button */}
        <button className="flex items-center justify-center w-full h-14 rounded-xl border border-dashed border-slate-700 text-slate-400 bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
          <Plus className="w-5 h-5 mr-2 opacity-50" />
          New Timer
        </button>
      </div>
    </div>
  );
}
