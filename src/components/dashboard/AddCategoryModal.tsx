"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Tag, X } from "lucide-react";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CategoryFormData {
  name: string;
  color: string;
}

const colorOptions = [
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-amber-500", label: "Amber" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-pink-500", label: "Pink" },
  { value: "bg-indigo-500", label: "Indigo" },
  { value: "bg-teal-500", label: "Teal" },
];

export default function AddCategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: AddCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      color: colorOptions[0].value,
    },
  });

  const selectedColor = watch("color");

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create category");
      }

      reset();
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
      <div className="relative w-full max-w-md bg-slate-900 rounded-xl shadow-xl border border-slate-800 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Tag className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-white">New Category</h2>
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
              <span className="label-text text-slate-200">Category Name</span>
            </label>
            <input
              type="text"
              className={`input input-bordered bg-slate-800/50 border-slate-700 text-white ${
                errors.name ? "input-error" : ""
              }`}
              placeholder="Enter category name"
              {...register("name", { required: "Category name is required" })}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.name.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-slate-200">Color</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((color) => (
                <label
                  key={color.value}
                  className={`relative flex items-center justify-center p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedColor === color.value
                      ? "border-primary bg-slate-800/80"
                      : "border-transparent hover:border-slate-700 bg-slate-800/50"
                  }`}
                >
                  <input
                    type="radio"
                    value={color.value}
                    className="sr-only"
                    {...register("color", { required: true })}
                  />
                  <div className="space-y-2 text-center">
                    <div
                      className={`w-6 h-6 rounded-full mx-auto ${color.value}`}
                    ></div>
                    <span className="text-xs text-slate-300">
                      {color.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
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
                "Create Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
