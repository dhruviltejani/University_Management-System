import { useQuery } from "@tanstack/react-query";
import {
  Users,
  UserCheck,
  UserX,
  Building2,
} from "lucide-react";

import { getStudentStats } from "../../../services/studentService";

const StudentStats = () => {
  const { data: statsData, isLoading: loading } = useQuery({
    queryKey: ['studentStats'],
    queryFn: getStudentStats
  });

  const stats = statsData?.data || {
    total_students: 0,
    active_students: 0,
    inactive_students: 0,
    departments: 0,
  };

  const cards = [
    {
      title: "Total Students",
      value: stats.total_students,
      icon: Users,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Active Students",
      value: stats.active_students,
      icon: UserCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Inactive Students",
      value: stats.inactive_students,
      icon: UserX,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Departments",
      value: stats.departments,
      icon: Building2,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
          >
            <div className="flex justify-between items-start">

              <div>
                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  {loading ? "--" : card.value}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.color}`}
              >
                <Icon size={28} />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentStats;