import Pagination from "../../Common/Pagination";
import React from "react";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate , Link } from "react-router-dom";
import { Plus } from "lucide-react";

const badgeColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700";

    case "On Leave":
      return "bg-orange-50 text-orange-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
};

const TeacherTable = ({ teachers = [], loading = false , page ,  setPage,  totalPages , onDelete , onView}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
        <p className="text-slate-500 text-lg font-medium">
          Loading teachers...
        </p>
      </div>
    );
  }

  const navigate = useNavigate();
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div>
          <h2 className="font-bold text-slate-800">
            Faculty Members
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Showing all registered teachers
          </p>
        </div>

  <Link
    to="/admin/teachers/add"
    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold shadow-sm transition"
  >
    <Plus size={18} />
    Add Teacher
  </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4">Teacher</th>
              <th className="px-6 py-4">Employee ID</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Designation</th>
              <th className="px-6 py-4">Experience</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-10 text-slate-500"
                >
                  No teachers found.
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => {
                const fullName =
                  teacher.full_name ||
                  teacher.name ||
                  "Unknown Teacher";

                const initials = fullName
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase();

                return (
                  <tr
                    key={
                      teacher.teacher_id ||
                      teacher.employee_id ||
                      teacher.id
                    }
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    {/* Teacher */}
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
                            {teacher.email || "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 font-medium">
                      {teacher.teacher_id ||
                        teacher.employee_id ||
                        teacher.id ||
                        "-"}
                    </td>

                    <td className="px-6 py-5">
                      {teacher.department || "-"}
                    </td>

                    <td className="px-6 py-5">
                      {teacher.designation || "-"}
                    </td>

                    <td className="px-6 py-5">
                      {teacher.experience_years
                        ? `${teacher.experience_years} Years`
                        : "-"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(
                          teacher.status || "Inactive"
                        )}`}
                      >
                        {teacher.status || "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onView(teacher)}
                        className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
                      >
                        <Eye size={18} />
                      </button>

                        <button
        onClick={() =>
          navigate(`/admin/teachers/edit/${teacher.id}`)
        }
        className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition"
      >
        <Pencil size={18} />
      </button>

        <button
          onClick={() => onDelete(teacher)}
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
          Showing {teachers.length}{" "}
          {teachers.length === 1 ? "teacher" : "teachers"}
        </p>

        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default TeacherTable;