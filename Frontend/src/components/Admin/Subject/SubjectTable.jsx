import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import Pagination from "../../Common/Pagination";

const badgeColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700";
    case "Inactive":
      return "bg-red-50 text-red-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
};
const SubjectTable = ({
  subjects = [],
  loading = false,
  page,
  setPage,
  totalPages,
  onView,
  onDelete,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
        <p className="text-slate-500 text-lg font-medium">Loading subjects...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div>
          <h2 className="font-bold text-slate-800">Academic Subjects</h2>
          <p className="text-sm text-slate-400 mt-1">
            Showing all registered subjects
          </p>
        </div>

        <Link
          to="/admin/subjects/add"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold shadow-sm transition"
        >
          <Plus size={18} />
          Add Subject
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4">Subject Code</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Teachers</th>
              <th className="px-6 py-4">Sem</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {subjects.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-slate-500">
                  No subjects found.
                </td>
              </tr>
            ) : (
              subjects.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-t border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-5 font-medium text-slate-900">
                    {sub.subject_code}
                  </td>
                  <td className="px-6 py-5 text-slate-700 font-semibold">
                    {sub.subject_name}
                  </td>
                  <td className="px-6 py-5 text-slate-600">
                    {sub.course}
                  </td>
                  <td className="px-6 py-5 text-slate-600">
                    {sub.teachers && sub.teachers.length > 0 ? (
                      sub.teachers.length > 2 ? (
                        <span title={sub.teachers.map((t) => t.name).join(", ")}>
                          {sub.teachers.slice(0, 2).map((t) => t.name).join(", ")}...
                        </span>
                      ) : (
                        sub.teachers.map((t) => t.name).join(", ")
                      )
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-slate-600">
                    {sub.semester}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(
                        sub.status || "Inactive"
                      )}`}
                    >
                      {sub.status || "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onView(sub)}
                        className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => navigate(`/admin/subjects/edit/${sub.id}`)}
                        className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => onDelete(sub)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                        title="Delete"
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
          Showing {subjects.length} {subjects.length === 1 ? "subject" : "subjects"}
        </p>

        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default SubjectTable;
