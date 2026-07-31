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
        <div className="space-y-4 pt-6">
   
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <a href="#settings" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-50 font-medium rounded-xl text-xs transition-all">
              <Settings size={15} />
              <span>Settings</span>
            </a>
            
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-rose-500 hover:bg-rose-50 font-bold rounded-xl text-xs transition-all"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
          </div>

          {/* User Profile Footer in Sidebar */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5 px-1">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
              alt="Alex Rivera" 
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Alex Rivera</p>
              <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wide">REGISTRAR</p>
            </div>
          </div>
        </div>
      </aside>
  )
}

export default Sidebar
