import { useEffect, useState } from "react";

import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Building2,
} from "lucide-react";

import { getCourseStats } from "../../../services/courseService";

const CourseStats = () => {

  const [stats, setStats] = useState({
    total_courses: 0,
    active_courses: 0,
    inactive_courses: 0,
    departments: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {

    try {

      setLoading(true);

      const response = await getCourseStats();

      setStats(response.data);

    } catch (error) {

      console.error("Failed to fetch course stats:", error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchStats();

  }, []);

  const cards = [
    {
      title: "Total Courses",
      value: stats.total_courses,
      icon: BookOpen,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Active Courses",
      value: stats.active_courses,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Inactive Courses",
      value: stats.inactive_courses,
      icon: XCircle,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

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

export default CourseStats;