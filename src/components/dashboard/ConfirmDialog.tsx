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
      <dialog
        id="confirm_dialog"
        className={`modal modal-bottom sm:modal-middle ${
          isOpen ? "modal-open" : ""
        }`}
      >
        <div className="modal-box max-w-sm w-full">
          <div className="flex flex-col items-center text-center p-2">
            {type === "danger" && (
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            )}
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-300 mb-6">{message}</p>
            <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
              <button
                onClick={onClose}
                className="btn btn-ghost w-full sm:w-auto"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`btn w-full sm:w-auto ${
                  type === "danger"
                    ? "btn-error hover:bg-red-600"
                    : "btn-primary"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={onClose}>close</button>
        </form>
      </dialog>
    </div>
  );
}
