import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, GraduationCap, UserCheck, ShieldCheck, Building2 } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import signinschema from '../Validation/signinSchema';
import toast from 'react-hot-toast';

const Sign_in = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Added `role` to state management
  const [formData, setFormData] = useState({
    role: 'student', // 'student' | 'teacher' | 'admin'
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleRoleChange = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    if (value === "") {
      setErrors((prev) => ({ ...prev, [name]: '' }));
      return;
    }

    if (errors[name]) {
      try {
        await signinschema.validateAt(name, newFormData);
        setErrors((prev) => ({ ...prev, [name]: '' }));
      } catch (error) {
        setErrors((prev) => ({ ...prev, [name]: error.message }));
      }
    }
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    if (!name) return;

    if (value === "") {
      setErrors((prev) => ({ ...prev, [name]: '' }));
      return;
    }

    try {
      await signinschema.validateAt(name, formData);
      setErrors((prev) => ({ ...prev, [name]: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.message }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  try {
    // Validate form data using Yup
    await signinschema.validate(
      {
        email: formData.email,
        password: formData.password,
      },
      { abortEarly: false }
    );

    // Clear previous errors if validation passes
    setErrors({});

  } catch (validationError) {
    const newErrors = {};

    validationError.inner.forEach((err) => {
      newErrors[err.path] = err.message;
    });

    setErrors(newErrors);
    return; // Stop form submission
  }
    setLoading(true);
    try {
    // Backend request including the chosen role
      
      console.log(formData);
      
      const response = await axios.post(
        `${API_BASE_URL}/auth/signin`,
        formData
      );


      // Save JWT & user info
      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success(response.data.message);

      // Navigate based on role or generic dashboard

    const role = response.data.user.role;

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "teacher") {
      navigate("/teacher/dashboard");
    } else {
      navigate("/student/dashboard");
    }


    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper info for dynamic portal context
  const roleConfig = {
    student: {
      title: "Student Portal",
      placeholder: "student.id@university.edu",
      icon: GraduationCap,
      accent: "text-indigo-600 border-indigo-600 bg-indigo-50/50",
    },
    teacher: {
      title: "Faculty Portal",
      placeholder: "faculty.name@university.edu",
      icon: UserCheck,
      accent: "text-emerald-600 border-emerald-600 bg-emerald-50/50",
    },
    admin: {
      title: "Admin Portal",
      placeholder: "admin.name@university.edu",
      icon: ShieldCheck,
      accent: "text-amber-600 border-amber-600 bg-amber-50/50",
    },
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center p-6 text-slate-800 font-sans">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12 my-auto">
        
        {/* Left Section: Branding & University Visual */}
        <div className="w-full md:w-1/2 flex flex-col justify-between max-w-lg space-y-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-wide uppercase text-xs mb-3">
              <Building2 size={16} />
              <span>Campus Management System</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
              University Portal
            </h1>
            <p className="mt-4 text-slate-500 text-base sm:text-lg font-normal">
              Access your academic records, course materials, administrative tools, and campus services in one secure hub.
            </p>
          </div>

          {/* Decorative Card / Illustration */}
          <div className="bg-[#F3F4F8] rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="relative w-full aspect-square max-w-sm rounded-2xl overflow-hidden flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-tr from-indigo-200 via-blue-100 to-sky-200 flex items-center justify-center relative">
                <div className="w-48 h-48 rounded-full bg-indigo-500/20 blur-xl absolute"></div>
                
                {/* Academic Graphic */}
                <div className="w-44 h-44 bg-white/50 backdrop-blur-md rounded-2xl border border-white/80 shadow-2xl flex flex-col items-center justify-center relative z-10 transform -rotate-3 p-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-lg flex items-center justify-center text-white mb-3">
                    <GraduationCap className="w-10 h-10" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 text-center">Connected Campus Network</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Form Card */}
        <div className="w-full md:w-1/2 max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 p-8 sm:p-10 border border-slate-100">
            
            {/* Form Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
              <p className="text-slate-400 text-sm mt-1">Select your account type to proceed</p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-2xl mb-6">
              {[
                { id: 'student', label: 'Student', icon: GraduationCap },
                { id: 'teacher', label: 'Teacher', icon: UserCheck },
                { id: 'admin', label: 'Admin', icon: ShieldCheck },
              ].map((roleItem) => {
                const Icon = roleItem.icon;
                const isActive = formData.role === roleItem.id;
                return (
                  <button
                    key={roleItem.id}
                    type="button"
                    onClick={() => handleRoleChange(roleItem.id)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{roleItem.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Form */}
            <form className="space-y-4" onSubmit={handleSubmit} onBlur={handleBlur}>
              
              {/* Email / University ID */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={roleConfig[formData.role].placeholder}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
                {errors.email && (<p className="text-red-500 text-xs mt-1">{errors.email}</p>)}  

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}

                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
                  {errors.password && (<p className="text-red-500 text-xs mt-1">{errors.password}</p>)}   

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-600 font-medium hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all text-sm mt-2 flex items-center justify-center gap-2"
              >
                {loading ? "Signing In..." : `Sign In as ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}`}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative bg-white px-3 text-xs uppercase text-slate-400 font-medium">
                Campus Single Sign-On
              </span>
            </div>

            {/* Institutional SSO Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Edu Workspace
              </button>
              
              <button className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-all">
                {/* Microsoft icon for Azure AD SSO */}
                <svg className="w-4 h-4" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                Microsoft 365
              </button>
            </div>

            {/* Bottom Link */}
            <p className="text-center text-xs text-slate-500 mt-6 font-medium">
              Need access?{" "}
              <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
                Register Student / Staff Account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sign_in;