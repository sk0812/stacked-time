"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

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
    <dialog
      id="edit_timer_modal"
      className={`modal modal-bottom sm:modal-middle ${
        isOpen ? "modal-open" : ""
      }`}
    >
      <div className="modal-box max-h-[90vh] sm:max-h-[85vh] w-full max-w-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Edit Timer</h3>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm p-0 hover:bg-transparent"
            >
              <X className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col flex-1"
          >
            <div className="space-y-4 flex-1">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-slate-200">
                    Project Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  className="input input-bordered bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
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
                  placeholder="Enter description"
                  className="textarea textarea-bordered bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 min-h-[100px]"
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
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <button
                type="button"
                className="btn btn-ghost order-2 sm:order-1 w-full"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary order-1 sm:order-2 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
