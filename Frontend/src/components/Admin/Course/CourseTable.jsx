import React from "react";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Plus,

} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const badgeColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
};

const CourseTable = ({
  courses = [],
  loading = false,
  page,
  setPage,
  totalPages,
  onDelete,
  onView,
}) => {

  const navigate = useNavigate();

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 text-center text-slate-500">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-b border-slate-100">

        <div className="flex justify-between w-full">
          <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Academic Courses
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Showing all registered university courses
          </p>
          </div>

          <Link
            to="/admin/courses/add"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
            <Plus size={18} />
            Add Course
          </Link>

        </div>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

              <th className="px-6 py-4">Course</th>

              <th className="px-6 py-4">Department</th>

              <th className="px-6 py-4">Duration</th>

              <th className="px-6 py-4">Semesters</th>

              <th className="px-6 py-4">Status</th>

              <th className="px-6 py-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {courses.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="text-center py-10 text-slate-500"
                >
                  No courses found.
                </td>

              </tr>

            ) : (

              courses.map((course) => (

                <tr
                  key={course.id}
                  className="border-t border-slate-100 hover:bg-slate-50 transition"
                >

                  {/* Course */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">

                        <BookOpen size={20} />

                      </div>

                      <div>

                        <h3 className="font-semibold text-slate-800">
                          {course.course_name || "-"}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {course.course_code || "-"}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* Department */}
                  <td className="px-6 py-5 text-slate-700">
                    {course.department || "-"}
                  </td>

                  {/* Duration */}
                  <td className="px-6 py-5 text-slate-700">
                    {course.duration
                      ? `${course.duration} Years`
                      : "-"}
                  </td>

                  {/* Semesters */}
                  <td className="px-6 py-5 text-slate-700">
                    {course.total_semesters || "-"}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(
                        course.status || "Inactive"
                      )}`}
                    >
                      {course.status || "Inactive"}
                    </span>

                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">

                    <div className="flex justify-center gap-2">

                      {/* View */}
                      <button
                        onClick={() => onView(course)}
                        className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() =>
                          navigate(`/admin/courses/edit/${course.id}`)
                        }
                        className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete(course)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">

        <p className="text-sm text-slate-500">
          Showing {courses.length}{" "}
          {courses.length === 1 ? "course" : "courses"}
        </p>

        <div className="flex gap-2">

          {/* Previous */}
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, index) => (

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

          ))}

          {/* Next */}
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

export default CourseTable;