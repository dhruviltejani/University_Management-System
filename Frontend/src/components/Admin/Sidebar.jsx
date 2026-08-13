import React from 'react'
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
import { NavLink , useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
  // Remove authentication data
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Redirect to sign in page
  navigate("/signin");
};

  return (

<aside className="fixed top-0 left-0 h-screen w-56 bg-white border-r border-slate-100 p-5 flex flex-col justify-between z-50">
        <div className="space-y-7">
          {/* Logo Header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap size={20} />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-xs leading-tight">CampusAdmin</h2>
              <p className="text-[10px] text-slate-400 font-medium">University Registrar</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-bold"
                  : "text-slate-500 hover:bg-slate-50 font-medium"
              }`
            }
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/students"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-bold"
                  : "text-slate-500 hover:bg-slate-50 font-medium"
              }`
            }
          >
            <Users size={16} />
            <span>Students</span>
          </NavLink>

          <NavLink
            to="/admin/teachers"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-bold"
                  : "text-slate-500 hover:bg-slate-50 font-medium"
              }`
            }
          >
            <UserCheck size={16} />
            <span>Teachers</span>
          </NavLink>

          <NavLink
            to="/admin/courses"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-bold"
                  : "text-slate-500 hover:bg-slate-50 font-medium"
              }`
            }
          >
            <BookOpen size={16} />
            <span>Courses</span>
          </NavLink>
            
          <NavLink
            to="/admin/departments"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-bold"
                  : "text-slate-500 hover:bg-slate-50 font-medium"
              }`
            }
          >
            <Building2 size={16} />
            <span>Departments</span>
          </NavLink>

          </nav>
        </div>

        {/* Sidebar Bottom Actions & Profile */}
        <div className="pt-4 border-t border-slate-100 mt-auto">
          <div className="flex items-center justify-between px-1">
            {/* User Profile as Settings Option */}
            <a href="#settings" className="flex items-center gap-2.5 hover:bg-slate-50 p-2 rounded-xl transition-all flex-1 group">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
                alt="Alex Rivera" 
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">Alex Rivera</p>
                <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wide mt-0.5 flex items-center gap-1">
                   Settings
                </p>
              </div>
            </a>
            
            {/* Logout Button with Tooltip */}
            <div className="relative group flex items-center justify-center">
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all ml-1"
              >
                <LogOut size={18} />
              </button>
              
              {/* Tooltip */}
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg pointer-events-none whitespace-nowrap shadow-md z-50">
                Logout
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>
  )
}

export default Sidebar
