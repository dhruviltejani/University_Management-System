import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import forgotPasswordSchema from '../Validation/forgotPasswordSchema';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = async (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value === "") {
      setErrors({});
      return;
    }

    if (errors.email) {
      try {
        await forgotPasswordSchema.validateAt('email', { email: value.trim() });
        setErrors({});
      } catch (error) {
        if (error.name === 'ValidationError') {
          setErrors({ email: error.message });
        }
      }
    }
  };

  const handleBlur = async (e) => {
    const { value } = e.target;
    if (value === "") {
      setErrors({});
      return;
    }

    try {
      await forgotPasswordSchema.validateAt('email', { email: email.trim() });
      setErrors({});
    } catch (error) {
      if (error.name === 'ValidationError') {
        setErrors({ email: error.message });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await forgotPasswordSchema.validate({ email: email.trim() }, { abortEarly: false });
      setErrors({});
    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      console.log("Sending password reset request for:", email);

      const response = await axios.post(
        `${API_BASE_URL}/auth/forgot-password`,
        { email: email.trim() }
      );

      toast.success(response.data.message || "If an account with this email exists, we've sent a password reset link.");
      
        setSubmittedEmail(email);
        setIsSubmitted(true);
        setEmail("");

    } catch (error) {
      console.error(error.response?.data || error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center p-6 text-slate-800 font-sans">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12 my-auto">
        
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-between max-w-lg space-y-8">
          {/* Heading */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
              Forgot Your<br />Password?
            </h1>
            <p className="mt-4 text-slate-500 text-base sm:text-lg font-normal">
              No worries, it happens! Enter your registered email address and we'll send you instructions to reset it.
            </p>
          </div>

          {/* Card / Image Container */}
          <div className="bg-[#F3F4F8] rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="relative w-full aspect-square max-w-sm rounded-2xl overflow-hidden flex items-center justify-center">
              {/* Decorative 3D Glassmorphism Illustration */}
              <div className="w-full h-full bg-gradient-to-tr from-purple-200 via-blue-100 to-indigo-200 flex items-center justify-center relative">
                <div className="w-48 h-48 rounded-full bg-indigo-500/20 blur-xl absolute"></div>
                <div className="w-40 h-40 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl flex items-center justify-center relative z-10 transform -rotate-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center text-white">
                    <KeyRound className="w-12 h-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Form Card) */}
        <div className="w-full md:w-1/2 max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 p-8 sm:p-10 border border-slate-100">
            
            {!isSubmitted ? (
              <>
                {/* Form Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Enter the email account associated with your profile
                  </p>
                </div>

                {/* Input Form */}
                <form className="space-y-4" onSubmit={handleSubmit} onBlur={handleBlur}>
                  {/* Email */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      disabled={loading}
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all text-sm mt-2"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>
              </>
            ) : (
              /* Success State Header & Message */
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Check Your Email</h2>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  We've sent a password reset link to <span className="font-semibold text-slate-800">{submittedEmail}</span>.
                </p>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSubmittedEmail("");}}

                  className="mt-6 text-xs text-indigo-600 font-bold hover:underline"
                >
                  Didn't receive the email? Try again
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
            </div>

            {/* Back to Sign In Link */}
            <p className="text-center text-xs text-slate-500 mt-6 font-medium flex items-center justify-center gap-1.5">
              <ArrowLeft size={14} className="text-slate-400" />
              Remember your password?{" "}
              <Link
                to="/signin"
                className="text-indigo-600 font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;