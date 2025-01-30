"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Clock, X } from "lucide-react";

interface EditTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  timer: {
    _id: string;
    projectName: string;
    description: string;
    categoryId?: string;
  };
  categories: Array<{
    _id: string;
    name: string;
    color: string;
  }>;
}

interface TimerFormData {
  projectName: string;
  description: string;
  categoryId?: string;
}

export default function EditTimerModal({
  isOpen,
  onClose,
  onSuccess,
  timer,
  categories,
}: EditTimerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TimerFormData>({
    defaultValues: {
      projectName: timer.projectName,
      description: timer.description,
      categoryId: timer.categoryId,
    },
  });

  const onSubmit = async (data: TimerFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/timers/${timer._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update timer");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
            <h2 className="text-xl font-semibold text-white">Edit Timer</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text text-slate-200">Project Name</span>
            </label>
            <input
              type="text"
              className={`input input-bordered bg-slate-800/50 border-slate-700 text-white ${
                errors.projectName ? "input-error" : ""
              }`}
              placeholder="Enter project name"
              {...register("projectName", {
                required: "Project name is required",
              })}
            />
            {errors.projectName && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.projectName.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-slate-200">Description</span>
            </label>
            <textarea
              className={`textarea textarea-bordered bg-slate-800/50 border-slate-700 text-white min-h-[100px] ${
                errors.description ? "textarea-error" : ""
              }`}
              placeholder="Enter project description"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.description.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-slate-200">Category</span>
            </label>
            <select
              className="select select-bordered bg-slate-800/50 border-slate-700 text-white"
              {...register("categoryId")}
              defaultValue={timer.categoryId}
            >
              <option value="">No Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
