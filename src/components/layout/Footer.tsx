"use client";

import { useState } from "react";

const reactions = [
  { emoji: "🐛", label: "Bug Report" },
  { emoji: "💡", label: "Feature Request" },
  { emoji: "👍", label: "General Feedback" },
];

interface FooterProps {
  variant?: "light" | "dark";
}

export default function Footer({ variant = "light" }: FooterProps) {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const styles = {
    light: {
      footer: "bg-slate-100 border-t border-slate-200",
      brand: "text-slate-800",
      copyright: "text-slate-600",
      button: "text-slate-600 hover:bg-slate-200",
      modal: {
        box: "bg-white border border-slate-200",
        title: "text-slate-800",
        description: "text-slate-600",
        input:
          "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400",
        reactionButton: "hover:bg-slate-100",
        reactionButtonActive: "bg-slate-200 scale-110",
        cancelButton: "text-slate-600",
        submitButton:
          "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 disabled:text-slate-500",
      },
    },
    dark: {
      footer: "border-t border-slate-800 bg-slate-900",
      brand: "text-slate-200",
      copyright: "text-slate-400",
      button: "text-slate-400 hover:bg-slate-800",
      modal: {
        box: "bg-slate-900 border border-slate-800",
        title: "text-slate-200",
        description: "text-slate-400",
        input:
          "bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500",
        reactionButton: "hover:bg-slate-800/50",
        reactionButtonActive: "bg-slate-800 scale-110",
        cancelButton: "text-slate-300",
        submitButton:
          "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-800 disabled:text-slate-600",
      },
    },
  };

  const currentStyle = styles[variant];

  return (
    <footer className={currentStyle.footer}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between min-h-[4rem] py-4 sm:py-0 gap-4 sm:gap-0">
          {/* Brand */}
          <div
            className={`text-base sm:text-lg font-semibold ${currentStyle.brand} text-center sm:text-left`}
          >
            Stacked Time
          </div>

          {/* Copyright */}
          <div
            className={`text-xs sm:text-sm ${currentStyle.copyright} text-center sm:text-left order-last sm:order-none`}
          >
            Copyright © 2025 - All right reserved
          </div>

          {/* Feedback Button */}
          <button
            className={`btn btn-ghost btn-sm ${currentStyle.button}`}
            onClick={() => {
              // @ts-expect-error showModal is available on HTMLDialogElement
              document.getElementById("feedback_modal").showModal();
            }}
          >
            Feedback
          </button>

          {/* Feedback Modal */}
          <dialog
            id="feedback_modal"
            className="modal modal-bottom sm:modal-middle"
          >
            <div
              className={`modal-box ${currentStyle.modal.box} w-full max-w-lg mx-auto`}
            >
              <h3
                className={`font-bold text-lg mb-2 ${currentStyle.modal.title} text-center sm:text-left`}
              >
                Share your feedback
              </h3>
              <p
                className={`text-sm mb-4 ${currentStyle.modal.description} text-center sm:text-left`}
              >
                If you found a bug or have a feature request, please write it
                below!
              </p>

              {/* Emoji Reactions */}
              <div className="flex flex-wrap sm:flex-nowrap justify-center gap-3 sm:gap-4 mb-6">
                {reactions.map((reaction) => (
                  <button
                    key={reaction.label}
                    onClick={() => setSelectedReaction(reaction.label)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all flex-1 sm:flex-initial ${
                      selectedReaction === reaction.label
                        ? currentStyle.modal.reactionButtonActive
                        : currentStyle.modal.reactionButton
                    }`}
                  >
                    <span className="text-xl sm:text-2xl">
                      {reaction.emoji}
                    </span>
                    <span
                      className={`text-xs ${currentStyle.modal.description}`}
                    >
                      {reaction.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="py-4">
                <textarea
                  className={`textarea textarea-bordered w-full h-24 sm:h-32 ${currentStyle.modal.input}`}
                  placeholder={`Tell us what you think...${
                    selectedReaction ? `\nType: ${selectedReaction}` : ""
                  }`}
                />
              </div>
              <div className="modal-action flex-col-reverse sm:flex-row gap-3 sm:gap-2">
                <form
                  method="dialog"
                  className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
                >
                  <button
                    className={`btn btn-ghost ${currentStyle.modal.cancelButton} w-full sm:w-auto order-last sm:order-first`}
                    onClick={() => setSelectedReaction(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className={`btn ${currentStyle.modal.submitButton} border-none w-full sm:w-auto`}
                    disabled={!selectedReaction}
                  >
                    Send Feedback
                  </button>
                </form>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>
      </div>
    </footer>
  );
}
