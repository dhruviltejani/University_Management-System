import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, Calendar, BookOpen, Building2 } from "lucide-react";
import toast from "react-hot-toast";

const TeacherProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/teachers/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-screen ml-56 bg-slate-50">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="flex-1 min-h-screen ml-56 bg-slate-50">
      <main className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your personal and professional information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          
          <div className="px-8 pb-8">
            <div className="flex justify-between items-end -mt-12 mb-8">
              <div className="flex items-end gap-6">
                <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-lg border border-slate-100">
                  <div className="w-full h-full bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-3xl font-bold">
                    {profile.full_name ? profile.full_name.charAt(0) : "T"}
                  </div>
                </div>
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-slate-900">{profile.full_name}</h2>
                  <p className="text-emerald-600 font-medium">{profile.qualification || "Faculty Member"}</p>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Personal Info */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                  Personal Information
                </h3>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400 mt-0.5">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Full Name</p>
                    <p className="text-sm text-slate-900 font-medium">{profile.full_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400 mt-0.5">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Email Address</p>
                    <p className="text-sm text-slate-900 font-medium">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400 mt-0.5">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Contact Number</p>
                    <p className="text-sm text-slate-900 font-medium">{profile.contact_no || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400 mt-0.5">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Date of Birth</p>
                    <p className="text-sm text-slate-900 font-medium">
                      {profile.dob ? new Date(profile.dob).toLocaleDateString() : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                  Professional Information
                </h3>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400 mt-0.5">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Department</p>
                    <p className="text-sm text-slate-900 font-medium">{profile.department_name || "Unassigned"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400 mt-0.5">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Qualification</p>
                    <p className="text-sm text-slate-900 font-medium">{profile.qualification || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400 mt-0.5">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Join Date</p>
                    <p className="text-sm text-slate-900 font-medium">
                      {profile.join_date ? new Date(profile.join_date).toLocaleDateString() : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherProfile;
