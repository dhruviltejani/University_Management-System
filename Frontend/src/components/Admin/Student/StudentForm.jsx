import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const StudentForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading = false,
  submitText = "Save Changes",
  readOnly = false,
  showPassword = false,
  onCancel,
  errors = {},
  departments = [],
  courses = [],
  handleBlur,
}) => {
  const filteredCourses = courses.filter(
    (c) => String(c.department_id) === String(formData.department_id)
  );

  const selectedCourse = courses.find(
    (c) => String(c.id) === String(formData.course_id)
  );
  const totalSemesters = selectedCourse ? selectedCourse.total_semesters : 0;
  const semesterOptions = Array.from({ length: totalSemesters }, (_, i) => i + 1);

  const [showPasswordText, setShowPasswordText] = useState(false);

  return (
    <form id="student-form" onSubmit={handleSubmit} className="space-y-8" onBlur={handleBlur}>
      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name || ""}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {showPassword && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPasswordText ? "text" : "password"}
                  name="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none pr-10"
                  placeholder="Enter Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswordText ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Contact Number
            </label>
            <input
              type="text"
              name="contact_no"
              value={formData.contact_no || ""}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.contact_no && <p className="text-red-500 text-xs mt-1">{errors.contact_no}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob || ""}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Academic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Enrollment Number
            </label>
            <input
              type="text"
              name="enrollment_no"
              value={formData.enrollment_no || ""}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.enrollment_no && <p className="text-red-500 text-xs mt-1">{errors.enrollment_no}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Department
            </label>
            <select
              name="department_id"
              value={formData.department_id || ""}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.department_name}
                </option>
              ))}
            </select>
            {errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Course
            </label>
            <select
              name="course_id"
              value={formData.course_id || ""}
              onChange={handleChange}
              disabled={readOnly || !formData.department_id}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white disabled:bg-slate-50"
            >
              <option value="">Select Course</option>
              {filteredCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.course_name}
                </option>
              ))}
            </select>
            {errors.course_id && <p className="text-red-500 text-xs mt-1">{errors.course_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Semester
            </label>
            <select
              name="semester"
              value={formData.semester || ""}
              onChange={handleChange}
              disabled={readOnly || !formData.course_id}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white disabled:bg-slate-50"
            >
              <option value="">Select Semester</option>
              {semesterOptions.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
            {errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Admission Year
            </label>
            <input
              type="text"
              name="admission_year"
              value={formData.admission_year || ""}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.admission_year && <p className="text-red-500 text-xs mt-1">{errors.admission_year}</p>}
          </div>
        </div>
      </div>

      {/* Guardian & Contact Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Guardian & Contact Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Father's Name
            </label>
            <input
              type="text"
              name="father_name"
              value={formData.father_name || ""}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.father_name && <p className="text-red-500 text-xs mt-1">{errors.father_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mother's Name
            </label>
            <input
              type="text"
              name="mother_name"
              value={formData.mother_name || ""}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.mother_name && <p className="text-red-500 text-xs mt-1">{errors.mother_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Guardian Phone
            </label>
            <input
              type="text"
              name="guardian_phone"
              value={formData.guardian_phone || ""}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.guardian_phone && <p className="text-red-500 text-xs mt-1">{errors.guardian_phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Account Status
        </h2>

        <div className="max-w-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={readOnly}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="">Select Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
        </div>
      </div>

      {!readOnly && (
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : submitText}
          </button>
        </div>
      )}
    </form>
  );
};

export default StudentForm;
