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

    default:
      return "bg-slate-100 text-slate-600";
  }
};

const DepartmentTable = ({ 
  departments = [],
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
          Loading departments...
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
            Departments
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Showing all university departments
          </p>
        </div>

  <Link
    to="/admin/departments/add"
    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold shadow-sm transition"
  >
    <Plus size={18} />
    Add Department
  </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
        <thead className="bg-slate-50">
          <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4">Department</th>
            <th className="px-6 py-4">Code</th>
            <th className="px-6 py-4">HOD</th>
            <th className="px-6 py-4">Office</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-10 text-slate-500"
                >
                  No departments found.
                </td>
              </tr>
            ) : (
              departments.map((department) => {
              const departmentName =
                department.department_name || "Unknown Department";

                const initials = departmentName
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase();

                return (
                  <tr
                    key={department.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    {/* Departments */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        {initials}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {department.department_name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {department.email || "-"}
                        </p>
                      </div>
                    </div>
                  </td>

                    <td className="px-6 py-5 font-medium">
                      {department.department_code || "-"}
                    </td>

                    <td className="px-6 py-5">
                      {department.hod_name || "-"}
                    </td>

                    <td className="px-6 py-5">
                      {department.office_location || "-"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(
                          department.status || "Inactive"
                        )}`}
                      >
                        {department.status || "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onView(department)}
                        className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
                      >
                        <Eye size={18} />
                      </button>

                        <button
        onClick={() =>
          navigate(`/admin/departments/edit/${department.id}`)
        }
        className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition"
      >
        <Pencil size={18} />
      </button>

        <button
          onClick={() => onDelete(department)}
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
          Showing {departments.length}{" "}
          {departments.length === 1 ? "department" : "departments"}
        </p>

        <div className="flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>

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

export default DepartmentTable;