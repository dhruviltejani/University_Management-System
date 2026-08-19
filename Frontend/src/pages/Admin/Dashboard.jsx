import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentStats } from '../../services/studentService';
import { getTeacherStats } from '../../services/teacherService';
import { getDepartmentStats } from '../../services/departmentService';
import { getCourseStats } from '../../services/courseService';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  Building2,
  FileText,
  Settings,
  LogOut,
  UserPlus,
  PlusSquare,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  CreditCard,
  Briefcase,
  Info,
  SlidersHorizontal
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import Sidebar from '../../components/Admin/sidebar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    students: 0,
    recentStudents: 0,
    teachers: 0,
    recentTeachers: 0,
    courses: 0,
    recentCourses: 0,
    departments: 0,
    deptDistribution: [],
    enrollmentTrends: [],
    courseDistribution: [],
    teacherDistribution: []
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [studentRes, teacherRes, deptRes, courseRes] = await Promise.all([
          getStudentStats(),
          getTeacherStats(),
          getDepartmentStats(),
          getCourseStats()
        ]);

        setStats({
          students: studentRes?.data?.total_students || 0,
          recentStudents: studentRes?.data?.recent_students || 0,
          teachers: teacherRes?.data?.total_teachers || 0,
          recentTeachers: teacherRes?.data?.recent_teachers || 0,
          departments: deptRes?.data?.total_departments || 0,
          courses: courseRes?.data?.active_courses || 0,
          recentCourses: courseRes?.data?.recent_courses || 0,
          deptDistribution: studentRes?.data?.department_distribution || [],
          enrollmentTrends: studentRes?.data?.enrollment_trends || [],
          courseDistribution: courseRes?.data?.department_distribution || [],
          teacherDistribution: teacherRes?.data?.department_distribution || []
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    fetchDashboardStats();
  }, []);

  // Compute dynamic area chart paths
  const maxEnrollment = Math.max(...stats.enrollmentTrends.map(t => Number(t.count)), 10);
  const getAreaPath = () => {
    if (!stats.enrollmentTrends || stats.enrollmentTrends.length === 0) {
      return "M 0 100 L 500 100";
    }
    const stepX = 500 / Math.max(stats.enrollmentTrends.length - 1, 1);
    const points = stats.enrollmentTrends.map((t, i) => {
      const x = i * stepX;
      const y = 100 - (Number(t.count) / maxEnrollment) * 90;
      return `${x} ${y}`;
    });
    return `M 0 100 L ${points[0].split(' ')[0]} ${points[0].split(' ')[1]} L ` + points.join(" L ") + ` L 500 100 Z`;
  };

  const getLinePath = () => {
    if (!stats.enrollmentTrends || stats.enrollmentTrends.length === 0) {
      return "M 0 100 L 500 100";
    }
    const stepX = 500 / Math.max(stats.enrollmentTrends.length - 1, 1);
    const points = stats.enrollmentTrends.map((t, i) => {
      const x = i * stepX;
      const y = 100 - (Number(t.count) / maxEnrollment) * 90;
      return `${x} ${y}`;
    });
    return "M " + points.join(" L ");
  };

  // Compute dynamic donut chart properties
  const donutColors = ["#3B29E3", "#0ea5e9", "#94a3b8", "#cbd5e1", "#818cf8", "#f472b6"];
  const totalDonutStudents = stats.deptDistribution.reduce((sum, d) => sum + Number(d.count), 0);
  let currentDonutOffset = 0;
  const donutSegments = stats.deptDistribution.map((dept, idx) => {
    const count = Number(dept.count);
    const percent = totalDonutStudents > 0 ? (count / totalDonutStudents) * 100 : 0;
    const segment = {
      ...dept,
      percent,
      offset: -currentDonutOffset,
      color: donutColors[idx % donutColors.length]
    };
    currentDonutOffset += percent;
    return segment;
  });

  return (
<div className="h-screen overflow-hidden bg-[#F8F9FD] flex text-slate-700 font-sans">      
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content Area */}
      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8 space-y-6">
        
        {/* Welcome Banner Header */}
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Good Morning, Admin 👋
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Here's an overview of today's university activities and system health.
          </p>
        </div>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 - Total Students */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
                <GraduationCap size={18} />
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold text-[10px] rounded-full">
                +{stats.recentStudents} this week
              </span>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Total Students</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.students}</p>
            </div>
          </div>

          {/* Card 2 - Faculty Members */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
                <UserCheck size={18} />
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold text-[10px] rounded-full">
                +{stats.recentTeachers} this month
              </span>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Faculty Members</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.teachers}</p>
            </div>
          </div>

          {/* Card 3 - Active Courses */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
                <BookOpen size={18} />
              </div>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 font-bold text-[10px] rounded-full">
                +{stats.recentCourses} recent
              </span>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Active Courses</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.courses}</p>
            </div>
          </div>

          {/* Card 4 - Academic Units */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <SlidersHorizontal size={18} />
              </div>
              <span className="px-2 py-0.5 bg-purple-50 text-purple-600 font-bold text-[10px] rounded-full">
                Operational
              </span>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Active Departments</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.departments}</p>
            </div>
          </div>

        </div>

        {/* Student Enrollment + Department Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Student Enrollment Area Chart */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Student Enrollment</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Overview of student admissions for the 2023–2024 academic year
                </p>
              </div>
              <select className="bg-slate-50 border border-slate-200/80 text-slate-600 text-[11px] font-semibold px-2.5 py-1 rounded-lg focus:outline-none">
                <option>Last 12 Months</option>
              </select>
            </div>

            {/* SVG Chart Graphic */}
            <div className="h-40 w-full flex flex-col justify-end mt-4">
              <div className="w-full h-28 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={getAreaPath()}
                    fill="url(#chartGradient)"
                  />
                  <path
                    d={getLinePath()}
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>

              {/* Chart X-Axis Month Labels */}
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase mt-3 px-1">
                {stats.enrollmentTrends && stats.enrollmentTrends.length > 0 ? (
                  stats.enrollmentTrends.map((t, idx) => (
                    <span key={idx}>{t.month}</span>
                  ))
                ) : (
                  <>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Department Distribution Donut */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <h3 className="text-xs font-bold text-slate-900">Department Distribution</h3>

            {/* SVG Donut Ring */}
            <div className="relative flex items-center justify-center my-3">
              <svg className="w-32 h-32" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {donutSegments.map((segment, idx) => (
                  <path
                    key={idx}
                    strokeDasharray={`${segment.percent}, 100`}
                    strokeDashoffset={segment.offset}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke={segment.color}
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-black text-slate-900">{stats.students}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Students</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500">
              {donutSegments.length > 0 ? (
                donutSegments.map((segment, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: segment.color }}></span>
                    <span className="truncate" title={segment.department_name}>
                      {segment.department_name} ({Math.round(segment.percent)}%)
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center text-slate-400">No data</div>
              )}
            </div>
          </div>

        </div>

        {/* Recent Activities & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Activities Feed */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Recent Activities</h3>
              <a href="#view-all" className="text-[11px] font-bold text-[#4F46E5] hover:underline">View All</a>
            </div>

            <div className="space-y-3.5">
              
              {/* Activity 1 */}
              <div className="flex items-start gap-3 text-xs">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" 
                  alt="John Smith" 
                  className="w-7 h-7 rounded-full object-cover mt-0.5"
                />
                <div className="flex-1 border-b border-slate-50 pb-2.5">
                  <p className="text-slate-700 text-[11px]">
                    <span className="font-bold text-slate-900">John Smith</span> registered as a new student
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">2 hours ago • Computer Science</p>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="flex items-start gap-3 text-xs">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" 
                  alt="Sarah Chen" 
                  className="w-7 h-7 rounded-full object-cover mt-0.5"
                />
                <div className="flex-1 border-b border-slate-50 pb-2.5">
                  <p className="text-slate-700 text-[11px]">
                    <span className="font-bold text-slate-900">Prof. Sarah Chen</span> was assigned to <span className="font-bold text-[#4F46E5]">Advanced AI (CS402)</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">4 hours ago • Faculty Assignment</p>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="flex items-start gap-3 text-xs">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold mt-0.5 shrink-0">
                  <Building2 size={13} />
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 text-[11px]">
                    System updated <span className="font-bold text-slate-900">Exam Schedule for Semester 2</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">6 hours ago • Administrative</p>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-2 gap-3">
            
            <button onClick={() => navigate('/admin/students/add')} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-all group">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center mb-2 group-hover:scale-105 transition-all">
                <UserPlus size={16} />
              </div>
              <span className="text-[11px] font-bold text-slate-800">Add Student</span>
              <span className="text-[9px] text-slate-400 mt-0.5">New Enrollment</span>
            </button>

            <button onClick={() => navigate('/admin/teachers/add')} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-all group">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center mb-2 group-hover:scale-105 transition-all">
                <UserCheck size={16} />
              </div>
              <span className="text-[11px] font-bold text-slate-800">Add Teacher</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Faculty Hire</span>
            </button>

            <button onClick={() => navigate('/admin/courses/add')} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-all group">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center mb-2 group-hover:scale-105 transition-all">
                <PlusSquare size={16} />
              </div>
              <span className="text-[11px] font-bold text-slate-800">Create Course</span>
              <span className="text-[9px] text-slate-400 mt-0.5">New Curriculum</span>
            </button>

            <button onClick={() => navigate('/admin/departments/add')} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-all group">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center mb-2 group-hover:scale-105 transition-all">
                <Building2 size={16}/>
              </div>
              <span className="text-[11px] font-bold text-slate-800">Create Department</span>
              <span className="text-[9px] text-slate-400 mt-0.5">New Department</span>
            </button>

          </div>

        </div>

        {/* Notifications & Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Notifications Side Stack */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900">Recent Notifications</h3>

            <div className="space-y-2.5">
              
              {/* Notification 1 */}
              <div className="bg-slate-50/80 border-l-4 border-[#3B29E3] p-2.5 rounded-r-xl space-y-0.5">
                <div className="flex items-center gap-1.5 text-[#3B29E3] font-bold text-[11px]">
                  <Calendar size={13} />
                  <span>Exam Schedule Released</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Final exams for Semester 1 now available in student portal.
                </p>
              </div>

              {/* Notification 2 */}
              <div className="bg-slate-50/80 border-l-4 border-rose-500 p-2.5 rounded-r-xl space-y-0.5">
                <div className="flex items-center gap-1.5 text-rose-600 font-bold text-[11px]">
                  <CreditCard size={13} />
                  <span>Fee Payment Reminder</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Outstanding balance alerts sent to 12% of total student body.
                </p>
              </div>

              {/* Notification 3 */}
              <div className="bg-slate-50/80 border-l-4 border-[#3B29E3] p-2.5 rounded-r-xl space-y-0.5">
                <div className="flex items-center gap-1.5 text-[#3B29E3] font-bold text-[11px]">
                  <Briefcase size={13} />
                  <span>Placement Drive</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  TechCorp campus recruitment scheduled for Oct 24th.
                </p>
              </div>

              {/* Notification 4 */}
              <div className="bg-slate-50/80 border-l-4 border-slate-400 p-2.5 rounded-r-xl space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[11px]">
                  <Info size={13} />
                  <span>Holiday Notice</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Campus closed for Founders Day on Monday.
                </p>
              </div>

            </div>
          </div>

          {/* Upcoming Events Data Table */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Upcoming Events</h3>
              <div className="flex items-center gap-1.5">
                <button className="p-1 rounded-md border border-slate-200 text-slate-400 hover:text-slate-600">
                  <ChevronLeft size={13} />
                </button>
                <button className="p-1 rounded-md border border-slate-200 text-slate-400 hover:text-slate-600">
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-[10px] text-slate-400 font-bold border-b border-slate-100 uppercase tracking-wider">
                    <th className="py-2.5 px-2">Event Name</th>
                    <th className="py-2.5 px-2">Department</th>
                    <th className="py-2.5 px-2">Date</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  
                  {/* Row 1 */}
                  <tr>
                    <td className="py-3 px-2 font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B29E3]"></span>
                      Annual Tech Symposium
                    </td>
                    <td className="py-3 px-2">Engineering</td>
                    <td className="py-3 px-2 text-slate-400">Oct 28, 2023</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold text-[9px] rounded-full">
                        Confirmed
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreHorizontal size={15} />
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr>
                    <td className="py-3 px-2 font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B29E3]"></span>
                      Cultural Night 2023
                    </td>
                    <td className="py-3 px-2">Arts & Humanity</td>
                    <td className="py-3 px-2 text-slate-400">Nov 02, 2023</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-600 font-bold text-[9px] rounded-full">
                        Planning
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreHorizontal size={15} />
                      </button>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr>
                    <td className="py-3 px-2 font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B29E3]"></span>
                      MBA Alumni Meetup
                    </td>
                    <td className="py-3 px-2">Business School</td>
                    <td className="py-3 px-2 text-slate-400">Nov 15, 2023</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold text-[9px] rounded-full">
                        Confirmed
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreHorizontal size={15} />
                      </button>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Analytics Graphs: Courses and Faculty by Department */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          
          {/* Courses by Department */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Courses per Department</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Distribution of academic courses across departments
              </p>
            </div>
            <div className="h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.courseDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="department_name" 
                    tick={{ fontSize: 10, fill: '#94a3b8', angle: -45, textAnchor: 'end' }} 
                    axisLine={false} 
                    tickLine={false} 
                    interval={0}
                    height={100}
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold', fontSize: '12px' }}
                    labelStyle={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}
                  />
                  <Bar dataKey="count" name="Courses" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Faculty by Department */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Faculty per Department</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Distribution of teaching staff across departments
              </p>
            </div>
            <div className="h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.teacherDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="department_name" 
                    tick={{ fontSize: 10, fill: '#94a3b8', angle: -45, textAnchor: 'end' }} 
                    axisLine={false} 
                    tickLine={false} 
                    interval={0}
                    height={100}
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold', fontSize: '12px' }}
                    labelStyle={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}
                  />
                  <Bar dataKey="count" name="Faculty" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
};

export default Dashboard;