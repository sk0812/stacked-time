"use client";

import { MessageSquarePlus } from "lucide-react";
import { useState } from "react";

const reactions = [
  { emoji: "🐛", label: "Bug Report" },
  { emoji: "💡", label: "Feature Request" },
  { emoji: "👍", label: "General Feedback" },
];

export default function Footer() {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  return (
    <footer className="bg-slate-100 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="text-lg font-semibold text-slate-800">
            Stacked Time
          </div>

          {/* Copyright */}
          <div className="text-sm text-slate-600">
            Copyright © 2025 - All right reserved
          </div>

          {/* Feedback Button */}
          <button
            className="btn btn-ghost btn-sm text-slate-600 hover:bg-slate-200"
            onClick={() => {
              // @ts-ignore
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
            <div className="modal-box">
              <h3 className="font-bold text-lg text-slate-800 mb-2">
                Share your feedback
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                If you found a bug or have a feature request, please write it
                below!
              </p>

              {/* Emoji Reactions */}
              <div className="flex gap-4 justify-center mb-6">
                {reactions.map((reaction) => (
                  <button
                    key={reaction.label}
                    onClick={() => setSelectedReaction(reaction.label)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                      selectedReaction === reaction.label
                        ? "bg-blue-50 scale-110"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-2xl">{reaction.emoji}</span>
                    <span className="text-xs text-slate-600">
                      {reaction.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="py-4">
                <textarea
                  className="textarea textarea-bordered w-full h-32"
                  placeholder={`Tell us what you think...${
                    selectedReaction ? `\nType: ${selectedReaction}` : ""
                  }`}
                />
              </div>
              <div className="modal-action">
                <form method="dialog" className="flex gap-2">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setSelectedReaction(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!selectedReaction}
                  >
                    Send Feedback
                  </button>
                </form>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button onClick={() => setSelectedReaction(null)}>close</button>
            </form>
          </dialog>
        </div>
      </div>
    </footer>
  );
}
