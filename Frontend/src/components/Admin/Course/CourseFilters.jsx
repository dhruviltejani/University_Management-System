import { Search, RotateCcw } from "lucide-react";

const CourseFilters = ({
  search,
  setSearch,
  department,
  setDepartment,
  status,
  setStatus,
  resetFilters,
}) => {

  const departments = [
    "Computer Science",
    "Information Technology",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Electronics",
    "Business Administration",
    "Commerce",
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Search */}
        <div className="relative">

          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search course name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

        </div>

        {/* Department */}
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >

          <option value="">All Departments</option>

          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}

        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >

          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>

        </select>

        {/* Reset Button */}
        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
        >

          <RotateCcw size={18} />
          Reset Filters

        </button>

      </div>

    </div>
  );
};

export default CourseFilters;