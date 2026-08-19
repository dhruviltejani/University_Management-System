import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Calendar, Clock, GraduationCap } from 'lucide-react';
import TeacherSidebar from '../../components/Teacher/TeacherSidebar';

// Helper to format numbers like 1 -> 1st, 2 -> 2nd, etc.
const getOrdinalNum = (n) => {
  const num = parseInt(n, 10);
  if (isNaN(num)) return n;
  const s = ["th", "st", "nd", "rd"];
  const v = num % 100;
  return num + (s[(v - 20) % 10] || s[v] || s[0]);
};

const MyClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/teachers/me/classes", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setClasses(response.data.data);
      } catch (error) {
        console.error("Failed to fetch teacher classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex text-slate-700 font-sans">
      <TeacherSidebar />
      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Classes & Subjects
          </h1>
          <p className="mt-3 max-w-3xl text-slate-500 leading-7">
            View the academic subjects and courses you are assigned to teach this semester.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">Loading your classes...</p>
            </div>
          </div>
        ) : classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {classes.map((cls) => (
              <div 
                key={cls.id} 
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-6 h-full flex flex-col">
                  {/* Header: Code & Status */}
                  <div className="flex justify-between items-start mb-5">
                    <span className="inline-flex items-center justify-center px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-lg tracking-wide uppercase border border-indigo-100/50">
                      {cls.subject_code}
                    </span>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      cls.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-slate-50 text-slate-500 border border-slate-200'
                    }`}>
                      {cls.status}
                    </span>
                  </div>

                  {/* Title & Course */}
                  <div className="mb-8 flex-1">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                      {cls.subject_name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                      {cls.course}
                    </p>
                  </div>
                  
                  {/* Footer Stats */}
                  <div className="flex items-center gap-6 pt-5 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Semester</p>
                        <p className="text-sm font-bold text-slate-800">{getOrdinalNum(cls.semester)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credits</p>
                        <p className="text-sm font-bold text-slate-800">{cls.credits}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm max-w-2xl">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500">
              <GraduationCap size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Classes Assigned</h3>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              You are not currently assigned to teach any subjects for this semester. Please contact the administrator if this is an error.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyClasses;
