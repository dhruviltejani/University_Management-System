import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, Building2, Briefcase, Calendar } from 'lucide-react';
import TeacherSidebar from '../../components/Teacher/TeacherSidebar';

const TeacherDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/teachers/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(response.data.data);
      } catch (error) {
        console.error("Failed to fetch teacher profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex text-slate-700 font-sans">      
      {/* Sidebar */}
      <TeacherSidebar />
      
      {/* Main Content Area */}
      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500 font-medium animate-pulse">Loading dashboard...</p>
          </div>
        ) : profile ? (
          <>
            {/* Welcome Banner Header */}
            <div>
              <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Good Morning, {profile.full_name} 👋
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Here's an overview of your academic profile and activities.
              </p>
            </div>

            {/* Profile Info Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1 - Designation */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Briefcase size={18} />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Designation</p>
                  <p className="text-xl font-black text-slate-900 mt-0.5 truncate">{profile.designation || "Faculty"}</p>
                </div>
              </div>

              {/* Card 2 - Department */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Building2 size={18} />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Department</p>
                  <p className="text-xl font-black text-slate-900 mt-0.5 truncate">{profile.department || "Not Assigned"}</p>
                </div>
              </div>

              {/* Card 3 - Experience */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <UserCheck size={18} />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Experience</p>
                  <p className="text-xl font-black text-slate-900 mt-0.5">{profile.experience_years ? `${profile.experience_years} Years` : "0 Years"}</p>
                </div>
              </div>

              {/* Card 4 - Office Room */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Office Room</p>
                  <p className="text-xl font-black text-slate-900 mt-0.5 truncate">{profile.office_room || "--"}</p>
                </div>
              </div>

            </div>

            {/* Detailed Info Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-6">
               <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Full Profile Details</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 <div>
                   <p className="text-xs text-slate-400 font-medium">Employee ID</p>
                   <p className="text-sm font-semibold text-slate-800 mt-1">{profile.employee_id || "--"}</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 font-medium">Email</p>
                   <p className="text-sm font-semibold text-slate-800 mt-1">{profile.email}</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 font-medium">Contact</p>
                   <p className="text-sm font-semibold text-slate-800 mt-1">{profile.contact_no || "--"}</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 font-medium">Qualification</p>
                   <p className="text-sm font-semibold text-slate-800 mt-1">{profile.qualification || "--"}</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 font-medium">Specialization</p>
                   <p className="text-sm font-semibold text-slate-800 mt-1">{profile.specialization || "--"}</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 font-medium">Status</p>
                   <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">{profile.status || "Active"}</span>
                 </div>
               </div>
            </div>
            
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
             <p>Unable to load profile data.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
