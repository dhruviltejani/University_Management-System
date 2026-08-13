import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import resetPasswordSchema from '../Validation/resetPasswordSchema';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [statusMessage, setStatusMessage] = useState({
    type: "",
    text: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (statusMessage.text) {
      setStatusMessage({
        type: "",
        text: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPassword = formData.password.trim();
    const confirmPassword = formData.confirm_password.trim();

    if (!token) {
      setStatusMessage({
        type: "error",
        text: "Invalid password reset link.",
      });
      return;
    }

    try {
      await resetPasswordSchema.validate(
        {
          password: newPassword,
          confirm_password: confirmPassword,
        },
        { abortEarly: false }
      );
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
      const response = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          password: newPassword,
        }
      );

      setStatusMessage({
        type: "success",
        text:
          response.data.message ||
          "Password reset successfully.",
      });

      setTimeout(() => {
        navigate("/signin");
      }, 3000);

    } catch (error) {
      console.error(error);

      setStatusMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to reset password. The link may have expired.",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center p-6 text-slate-800">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-12 items-center">

        {/* Left Section */}
        <div className="w-full md:w-1/2 max-w-lg space-y-8">

          <div>
            <h1 className="text-5xl font-extrabold text-slate-900">
              Set New
              <br />
              Password
            </h1>

            <p className="mt-4 text-slate-500">
              Your new password should be different from your previous password.
            </p>
          </div>

          <div className="bg-slate-100 rounded-3xl p-6">
            <div className="w-full aspect-square flex justify-center items-center">

              <div className="relative">

                <div className="absolute w-48 h-48 rounded-full bg-indigo-400/20 blur-3xl"></div>

                <div className="relative bg-white/60 backdrop-blur-md rounded-3xl p-12 shadow-xl">

                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">

                    <ShieldCheck size={60} />

                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Right Section */}

        <div className="w-full md:w-1/2 max-w-md">

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-2xl font-bold mb-1">
              Reset Password
            </h2>

            <p className="text-sm text-slate-500 mb-6">
              Enter your new password below.
            </p>

            {statusMessage.text && (

              <div
                className={`mb-5 flex gap-2 items-center rounded-xl p-3 border ${
                  statusMessage.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >

                {statusMessage.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}

                <span className="text-sm">
                  {statusMessage.text}
                </span>

              </div>

            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Password */}

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="New Password"
                  className="w-full border rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

              {/* Confirm Password */}

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirm_password"
                  required
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full border rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
              {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold disabled:opacity-70"
              >
                {loading
                  ? "Resetting Password..."
                  : "Reset Password"}
              </button>

            </form>

            <p className="mt-6 text-center text-sm text-slate-500 flex justify-center items-center gap-1">

              <ArrowLeft size={14} />

              <Link
                to="/signin"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Back to Sign In
              </Link>

            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ResetPassword;