import React from "react";
import { Search, RotateCcw, Filter } from "lucide-react";

const DepartmentFilters = ({search , setSearch , status , setStatus , resetFilters}) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
      {/* Top Heading */}
      <div className="flex items-center gap-2 mb-5">
        <Filter size={18} className="text-indigo-600" />
        <h2 className="text-sm font-bold text-slate-800">
          Search & Filters
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        {/* Search */}
        <div className="xl:col-span-2 relative">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

        <input
          type="text"
          placeholder="Search by department name, code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
        />
        </div>

        {/* Status */}

        <div className="flex gap-3">

        <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        </select>

        <button
          onClick={resetFilters}
          className="px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
        >
          <RotateCcw size={18} />
        </button>

        </div>

      </div>
    </div>
  );
};

export default DepartmentFilters;