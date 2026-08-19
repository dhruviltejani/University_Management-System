import React from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  LogOut,
  UserCheck,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { NavLink , useNavigate } from "react-router-dom";

const TeacherSidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-white border-r border-slate-100 p-5 flex flex-col justify-between z-50">
      <div className="space-y-7">
        {/* Logo Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-200">
            <UserCheck size={20} />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-xs leading-tight">Faculty Portal</h2>
            <p className="text-[10px] text-slate-400 font-medium">University</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <NavLink
            to="/teacher/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                isActive
                  ? "bg-emerald-50 text-emerald-600 font-bold"
                  : "text-slate-500 hover:bg-slate-50 font-medium"
              }`
            }
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/teacher/classes"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                isActive
                  ? "bg-emerald-50 text-emerald-600 font-bold"
                  : "text-slate-500 hover:bg-slate-50 font-medium"
              }`
            }
          >
            <BookOpen size={16} />
            <span>My Classes</span>
          </NavLink>

          <NavLink
            to="/teacher/leave"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                isActive
                  ? "bg-emerald-50 text-emerald-600 font-bold"
                  : "text-slate-500 hover:bg-slate-50 font-medium"
              }`
            }
          >
            <Calendar size={16} />
            <span>Leave</span>
          </NavLink>

        </nav>
      </div>

      {/* Sidebar Bottom Actions & Profile */}
      <div className="pt-4 border-t border-slate-100 mt-auto">
        <div className="flex items-center justify-between px-1">
          {/* User Profile */}
          <div 
            onClick={() => navigate("/teacher/profile")}
            className="flex items-center gap-2.5 p-2 rounded-xl flex-1 group cursor-pointer hover:bg-slate-50 transition-colors"
            title="View Profile"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs border border-slate-200">
              {user.full_name ? user.full_name.charAt(0) : "T"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-slate-900 leading-tight truncate group-hover:text-emerald-600 transition-colors">{user.full_name || "Teacher"}</p>
              <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wide mt-0.5 truncate">
                 Faculty
              </p>
            </div>
          </div>
          
          {/* Logout Button */}
          <div className="relative group flex items-center justify-center">
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all ml-1"
            >
              <LogOut size={18} />
            </button>
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg pointer-events-none whitespace-nowrap shadow-md z-50">
              Logout
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default TeacherSidebar;
