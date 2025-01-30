"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning";
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-slate-900 rounded-xl shadow-xl border border-slate-800 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              type === "danger"
                ? "bg-red-500/10 text-red-500"
                : "bg-amber-500/10 text-amber-500"
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-slate-400 text-sm mb-6">{message}</p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="btn flex-1 btn-ghost text-slate-300"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`btn flex-1 ${
                type === "danger"
                  ? "btn-error text-white"
                  : "btn-warning text-white"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
