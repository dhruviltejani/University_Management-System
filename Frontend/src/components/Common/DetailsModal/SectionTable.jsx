import React from "react";

const SectionTable = ({ title, columns = [], data = [] }) => {
  return (
    <div className="mt-10">
      <h3 className="text-lg font-bold text-slate-900 mb-5">{title}</h3>
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wider text-slate-500">
                {columns.map((col, i) => (
                  <th key={i} className="px-6 py-4 font-semibold whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data && data.length > 0 ? (
                data.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    {columns.map((col, j) => (
                      <td key={j} className="px-6 py-4 text-slate-700">
                        {col.render ? col.render(row) : row[col.key] || "-"}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-slate-400 italic"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SectionTable;
