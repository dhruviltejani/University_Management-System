import React from "react";
import { AlertTriangle, X } from "lucide-react";

        const ConfirmDeleteModal = ({
          isOpen,
          teacher,
          onCancel,
          onConfirm,
          loading = false,
        }) => {
          if (!isOpen) return null;

          return (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              {/* Blurred Background */}
              <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onCancel}
              />

              {/* Modal */}
              <div className="relative z-10 flex w-full max-w-3xl max-h-[96vh] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">                {/* Header */}
{/* Header */}
<div className="relative border-b border-slate-200 px-8 py-6">

  <button
    onClick={onCancel}
    className="
      absolute
      right-6
      top-6
      rounded-xl
      p-2
      text-slate-500
      hover:bg-slate-100
      transition
    "
  >
    <X size={20} />
  </button>

  <div className="flex flex-col items-center">

    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">

      <AlertTriangle
        size={38}
        className="text-red-600"
      />

    </div>

    <h2 className="mt-5 text-2xl font-bold text-slate-900">
      Delete Teacher
    </h2>

    <p className="mt-2 text-center text-slate-500">
      This action is permanent and cannot be undone.
    </p>

  </div>

</div>


       {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

          {/* Teacher Profile */}
          <div className="flex items-center gap-5">

            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600">
              {teacher?.full_name
                ?.trim()
                .split(" ")
                .map((name) => name[0])
                .join("")
                .slice(0, 2)}
            </div>

            <div>

              <h3 className="text-xl font-bold text-slate-900">
                {teacher?.full_name}
              </h3>

              <p className="text-slate-500">
                {teacher?.designation}
              </p>

              <div className="mt-2 flex items-center gap-2">

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
                  {teacher?.department}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    teacher?.status === "Active"
                      ? "bg-emerald-50 text-emerald-600"
                      : teacher?.status === "On Leave"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {teacher?.status || "Unknown"}
                </span>

              </div>

            </div>

          </div>

          {/* Teacher Information */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

            <div className="grid grid-cols-2 gap-5">

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Employee ID
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {teacher?.employee_id || '--'}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Department
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {teacher?.department}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Designation
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {teacher?.designation}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Status
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {teacher?.status}
                </p>
              </div>

            </div>

          </div>

          {/* Warning Card */}
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

            <div className="flex items-start gap-4">

              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle
                  size={20}
                  className="text-red-600"
                />
              </div>

              <div>

                <h4 className="text-base font-semibold text-red-700">
                  Permanent Deletion
                </h4>

                <p className="mt-2 text-sm leading-6 text-red-600">
                  Deleting this teacher will permanently remove all associated
                  professional information from the system.
                </p>

                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-red-600">
                  <li>Teacher profile</li>
                  <li>Professional information</li>
                  <li>Login access</li>
                  <li>Assigned records (if any)</li>
                </ul>

                <p className="mt-4 font-medium text-red-700">
                  This action cannot be undone.
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* Footer */}
        <div className="flex justify-end gap-4 border-t border-slate-200 px-8 py-6">

          <button
            onClick={onCancel}
            className="
              rounded-xl
              border
              border-slate-300
              bg-white
              px-6
              py-3
              font-medium
              text-slate-700
              transition
              hover:bg-slate-100
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="
              rounded-xl
              bg-red-600
              px-6
              py-3
              font-medium
              text-white
              shadow-lg
              transition
              hover:bg-red-700
              disabled:opacity-50
            "
          >
            {loading ? "Deleting..." : "Delete Teacher"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmDeleteModal;