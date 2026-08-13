import React from "react";
import { Search, RotateCcw, Filter } from "lucide-react";

const SearchAndFilter = ({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters = [], // Array of { value, onChange, placeholder, options: [{ label, value }] }
  onReset,
}) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
      {/* Top Heading */}
      <div className="flex items-center gap-2 mb-5">
        <Filter size={18} className="text-indigo-600" />
        <h2 className="text-sm font-bold text-slate-800">
          Search & Filters
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center flex-wrap w-full">
        {/* Search */}
        <div className="flex-[2] min-w-[250px] relative w-full md:w-auto">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
          />
        </div>

        {/* Dynamic Filters */}
        {filters.map((filter, index) => (
          <div key={index} className="flex-1 min-w-[160px] w-full md:w-auto">
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">{filter.placeholder || "All"}</option>
              {filter.options.map((opt, i) => (
                <option key={i} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Reset Button */}
        <div className="w-full md:w-auto flex justify-end md:justify-start">
          <button
            onClick={onReset}
            className="px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center gap-2"
            title="Reset Filters"
          >
            <RotateCcw size={18} className="text-slate-600" />
            <span className="md:hidden text-sm font-medium text-slate-700">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
