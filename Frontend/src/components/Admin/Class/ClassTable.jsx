import Pagination from "../../Common/Pagination";
import React from "react";
import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate , Link } from "react-router-dom";
import { Plus } from "lucide-react";

const ClassTable = ({ 
  classes = [],
  loading = false , 
  page ,  
  setPage,  
  totalPages , 
  onDelete , 
  onView}) => {

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
        <p className="text-slate-500 text-lg font-medium">
          Loading classes...
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
            Classes (Divisions)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Showing all student classes and their MFTs
          </p>
        </div>

        <Link
          to="/admin/classes/add"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold shadow-sm transition"
        >
          <Plus size={18} />
          Add Class
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
        <thead className="bg-slate-50">
          <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4">Class Name</th>
            <th className="px-6 py-4">Course</th>
            <th className="px-6 py-4">Semester</th>
            <th className="px-6 py-4">Division</th>
            <th className="px-6 py-4">Class Teacher (MFT)</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

          <tbody>
            {classes.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-10 text-slate-500"
                >
                  No classes found.
                </td>
              </tr>
            ) : (
              classes.map((cls) => {
                const initials = (cls.class_name || "C")
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <tr
                    key={cls.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                          {initials}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {cls.class_name}
                          </h3>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 font-medium">
                      {cls.course_name || "-"}
                    </td>

                    <td className="px-6 py-5">
                      Semester {cls.semester || "-"}
                    </td>

                    <td className="px-6 py-5">
                      {cls.division || "-"}
                    </td>

                    <td className="px-6 py-5">
                      {cls.mft_name || "Unassigned"}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onView(cls)}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/admin/classes/edit/${cls.id}`)
                          }
                          className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => onDelete(cls)}
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
          Showing {classes.length}{" "}
          {classes.length === 1 ? "class" : "classes"}
        </p>
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default ClassTable;
