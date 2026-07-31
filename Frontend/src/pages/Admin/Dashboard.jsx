import React from 'react';
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
import Sidebar from '../../components/Admin/sidebar';

const Dashboard = () => {
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
                +14 this week
              </span>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Total Students</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">1,254</p>
            </div>
          </div>

          {/* Card 2 - Faculty Members */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
                <UserCheck size={18} />
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold text-[10px] rounded-full">
                +3 this month
              </span>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Faculty Members</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">86</p>
            </div>
          </div>

          {/* Card 3 - Active Courses */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
                <BookOpen size={18} />
              </div>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 font-bold text-[10px] rounded-full">
                +2 recent
              </span>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Active Courses</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">42</p>
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
              <p className="text-[11px] font-medium text-slate-400">Academic Units</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">8</p>
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
                    d="M 0 80 Q 70 30, 140 60 T 280 20 T 420 50 L 500 10 L 500 100 L 0 100 Z"
                    fill="url(#chartGradient)"
                  />
                  <path
                    d="M 0 80 Q 70 30, 140 60 T 280 20 T 420 50 L 500 10"
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>

              {/* Chart X-Axis Month Labels */}
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase mt-3 px-1">
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
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
                <path
                  className="text-[#3B29E3]"
                  strokeDasharray="75, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-black text-slate-900">1,254</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Students</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B29E3]"></span>
                <span>CS (42%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                <span>IT (28%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>Mech (15%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                <span>Other (15%)</span>
              </div>
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
            
            <button className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-all group">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center mb-2 group-hover:scale-105 transition-all">
                <UserPlus size={16} />
              </div>
              <span className="text-[11px] font-bold text-slate-800">Add Student</span>
              <span className="text-[9px] text-slate-400 mt-0.5">New Enrollment</span>
            </button>

            <button className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-all group">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center mb-2 group-hover:scale-105 transition-all">
                <UserCheck size={16} />
              </div>
              <span className="text-[11px] font-bold text-slate-800">Add Teacher</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Faculty Hire</span>
            </button>

            <button className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-all group">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center mb-2 group-hover:scale-105 transition-all">
                <PlusSquare size={16} />
              </div>
              <span className="text-[11px] font-bold text-slate-800">Create Course</span>
              <span className="text-[9px] text-slate-400 mt-0.5">New Curriculum</span>
            </button>

            <button className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-all group">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center mb-2 group-hover:scale-105 transition-all">
                <Megaphone size={16} />
              </div>
              <span className="text-[11px] font-bold text-slate-800">Publish Notice</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Global Broadcast</span>
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

      </main>

    </div>
  );
};

export default Dashboard;