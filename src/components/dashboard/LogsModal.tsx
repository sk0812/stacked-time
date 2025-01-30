"use client";

import { Clock, X } from "lucide-react";

interface LogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  timer: {
    projectName: string;
    description: string;
    startedAt: string;
    time: number;
    status: string;
  };
}

export default function LogsModal({ isOpen, onClose, timer }: LogsModalProps) {
  if (!isOpen) return null;

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-900 rounded-xl shadow-xl border border-slate-800 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-white">Timer Logs</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
            <div>
              <h3 className="text-lg font-medium text-white mb-1">
                {timer.projectName}
              </h3>
              <p className="text-slate-400 whitespace-pre-wrap">
                {timer.description}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Started</span>
                <span className="text-slate-200">
                  {new Date(timer.startedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Time</span>
                <span className="text-slate-200 font-mono">
                  {formatTime(timer.time)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Status</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    timer.status === "running"
                      ? "bg-emerald-500/10 text-emerald-300"
                      : timer.status === "finished"
                      ? "bg-blue-500/10 text-blue-300"
                      : "bg-amber-500/10 text-amber-300"
                  }`}
                >
                  {timer.status.charAt(0).toUpperCase() + timer.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Future: Add detailed logs here */}
          <div className="bg-slate-800/30 rounded-lg p-4 text-center">
            <p className="text-slate-400 text-sm">
              Detailed activity logs coming soon...
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="btn btn-ghost text-slate-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
