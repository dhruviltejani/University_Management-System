import React, { useState } from "react";
import { DoorOpen, Eye, EyeOff } from "lucide-react";

const TeacherForm = ({
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
  handleBlur,
}) => {
  const [showPasswordText, setShowPasswordText] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="space-y-8" onBlur={handleBlur}>
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
              value={formData.full_name}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
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
              value={formData.email}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
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
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
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
              value={formData.contact_no}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
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
              value={formData.dob}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gender
            </label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Professional Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Employee ID
            </label>
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border rounded-xl px-4 py-3"
            />
            {errors.employee_id && <p className="text-red-500 text-xs mt-1">{errors.employee_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Department
            </label>
            <select
                name="department_id"
                value={formData.department_id || ""}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
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
              Designation
            </label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="">Select Designation</option>
              <option>HOD</option>
              <option>Professor</option>
              <option>Associate Professor</option>
              <option>Assistant Professor</option>
              <option>Lecturer</option>
              <option>Guest Faculty</option>
            </select>
            {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Qualification
            </label>
            <select
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="">Select Qualification</option>
              <option>Ph.D.</option>
              <option>M.Tech</option>
              <option>M.Sc.</option>
              <option>M.A.</option>
              <option>B.Tech</option>
              <option>B.Sc.</option>
              <option>Other</option>
            </select>
            {errors.qualification && <p className="text-red-500 text-xs mt-1">{errors.qualification}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Specialization
            </label>

            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              readOnly={readOnly}
              placeholder="e.g. Artificial Intelligence"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Experience (Years)
            </label>
            <input
              type="number"
              name="experience_years"
              value={formData.experience_years}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border rounded-xl px-4 py-3"
            />
            {errors.experience_years && <p className="text-red-500 text-xs mt-1">{errors.experience_years}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Joining Date
            </label>
            <input
              type="date"
              name="joining_date"
              value={formData.joining_date}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border rounded-xl px-4 py-3"
            />
            {errors.joining_date && <p className="text-red-500 text-xs mt-1">{errors.joining_date}</p>}
          </div>

          <div>
  <label className="block text-sm font-semibold text-slate-700 mb-2">
    Office Room
  </label>

  <div className="relative">
    <DoorOpen
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
    />

    <input
      type="text"
      name="office_room"
      value={formData.office_room}
      onChange={handleChange}
      placeholder="e.g. Block A - 204"
      className="
        w-full
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        py-3
        pl-11
        pr-4
        text-sm
        text-slate-700
        placeholder:text-slate-400
        transition-all
        duration-200
        focus:bg-white
        focus:border-[#4F46E5]
        focus:ring-4
        focus:ring-indigo-100
        outline-none
      "
    />
    {errors.office_room && <p className="text-red-500 text-xs mt-1">{errors.office_room}</p>}
  </div>
</div>
        </div>
      </div>





      {/* Account Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Account Information
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
            <option>On Leave</option>
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
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-60"
          >
            {loading ? "Saving..." : submitText}
          </button>
        </div>
      )}
    </form>
  );
};

export default TeacherForm;