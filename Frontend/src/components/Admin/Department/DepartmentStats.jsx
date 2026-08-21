import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getDepartmentStats } from "../../../services/departmentService";
import {
  UserCheck,
  Building2,
  Clock3,
} from "lucide-react";


const DepartmentStats = () => {
  const { data: queryData } = useQuery({
    queryKey: ['departmentStats'],
    queryFn: getDepartmentStats
  });

  const stats = queryData?.data || {
    total_departments: 0,
    active_departments: 0,
    inactive_departments: 0,
  };

const statsData = [
  {
    title: "Total Departments",
    value: stats.total_departments,
    change: "Overall",
    icon: Building2,
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-700",
  },
  {
    title: "Active Departments",
    value: stats.active_departments,
    change: "Operational",
    icon: UserCheck,
    bg: "bg-green-50",
    text: "text-green-600",
    badge: "bg-green-100 text-green-700",
  },
  {
    title: "Inactive Departments",
    value: stats.inactive_departments,
    change: "Currently Disabled",
    icon: Clock3,
    bg: "bg-orange-50",
    text: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
  },
];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {statsData.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.bg}`}
              >
                <Icon className={item.text} size={20} />
              </div>

              <span
                className={`text-[11px] font-semibold px-2 py-1 rounded-full ${item.badge}`}
              >
                {item.change}
              </span>
            </div>

            <div className="mt-5">
              <p className="text-xs text-slate-500">{item.title}</p>

              <h2 className="text-3xl font-black text-slate-800 mt-1">
                {item.value}
              </h2>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DepartmentStats;