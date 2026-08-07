import React from "react";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const badgeColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
};

const StudentTable = ({
  students = [],
  loading = false,
  page,
  setPage,
  totalPages,
  onDelete,
  onView,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
        <p className="text-slate-500 text-lg font-medium">
          Loading students...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">

        <div>
          <h2 className="font-bold text-slate-800">
            Students
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Showing all registered students
          </p>
        </div>

        <Link
          to="/admin/students/add"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold shadow-sm transition"
        >
          <Plus size={18} />
          Add Student
        </Link>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

              <th className="px-6 py-4">Student</th>

              <th className="px-6 py-4">
                Enrollment No
              </th>

              <th className="px-6 py-4">
                Department
              </th>

              <th className="px-6 py-4">
                Course
              </th>

              <th className="px-6 py-4">
                Semester
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {students.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-10 text-slate-500"
                >
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((student) => {

                const fullName =
                  student.full_name ||
                  "Unknown Student";

                const initials = fullName
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase();

                return (
                  <tr
                    key={student.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >

                    {/* Student */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                          {initials}
                        </div>

                        <div>

                          <h3 className="font-semibold text-slate-800">
                            {fullName}
                          </h3>

                          <p className="text-sm text-slate-500">
                            {student.email}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Enrollment */}
                    <td className="px-6 py-5 font-medium">
                      {student.enrollment_no || "-"}
                    </td>

                    {/* Department */}
                    <td className="px-6 py-5">
                      {student.department || "-"}
                    </td>

                    {/* Course */}
                    <td className="px-6 py-5">
                      {student.course || "-"}
                    </td>

                    {/* Semester */}
                    <td className="px-6 py-5">
                      {student.semester
                        ? `Semester ${student.semester}`
                        : "-"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(
                          student.status || "Inactive"
                        )}`}
                      >
                        {student.status || "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">

                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => onView(student)}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/admin/students/edit/${student.id}`)
                          }
                          className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => onDelete(student)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })
            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">

        <p className="text-sm text-slate-500">
          Showing {students.length}{" "}
          {students.length === 1 ? "student" : "students"}
        </p>

        <div className="flex gap-2">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() => setPage(index + 1)}
                className={`w-9 h-9 rounded-lg ${
                  page === index + 1
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {index + 1}
              </button>
            )
          )}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>

        </div>

      </div>

    </div>
  );
};

export default StudentTable;