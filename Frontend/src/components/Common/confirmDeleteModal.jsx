import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmDeleteModal = ({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="h-11 w-11 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle
                size={22}
                className="text-red-600"
              />
            </div>

            <h2 className="text-lg font-bold">
              {title}
            </h2>

          </div>

          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>

        </div>

        {/* Body */}
        <div className="px-6 py-5">

          <p className="text-slate-600">
            {message}
          </p>

          <p className="mt-3 text-sm font-medium text-red-600">
            This action cannot be undone.
          </p>

        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-xl border hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmDeleteModal;