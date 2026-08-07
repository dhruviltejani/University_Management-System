import { Search, RotateCcw } from "lucide-react";

const StudentFilters = ({
  search,
  setSearch,
  department,
  setDepartment,
  course,
  setCourse,
  semester,
  setSemester,
  status,
  setStatus,
  resetFilters,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">

        {/* Search */}
        <div className="xl:col-span-2 relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              py-3
              pl-11
              pr-4
              outline-none
              focus:border-indigo-500
            "
          />

        </div>

        {/* Department */}
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3"
        >
          <option value="">All Departments</option>
          <option>Computer Engineering</option>
          <option>Information Technology</option>
          <option>Mechanical Engineering</option>
          <option>Civil Engineering</option>
          <option>Electrical Engineering</option>
        </select>

        {/* Course */}
        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3"
        >
          <option value="">All Courses</option>
          <option>B.Tech</option>
          <option>M.Tech</option>
          <option>BCA</option>
          <option>MCA</option>
          <option>B.Sc</option>
        </select>

        {/* Semester */}
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3"
        >
          <option value="">Semester</option>

          {[1,2,3,4,5,6,7,8].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3"
        >
          <option value="">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

      </div>

      <div className="mt-5 flex justify-end">

        <button
          onClick={resetFilters}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            px-5
            py-3
            font-medium
            hover:bg-slate-50
          "
        >
          <RotateCcw size={18} />
          Reset Filters
        </button>

      </div>
    </div>
  );
};

export default StudentFilters;