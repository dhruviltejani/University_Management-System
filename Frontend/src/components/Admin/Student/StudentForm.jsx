import React from "react";

const StudentForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading = false,
  submitText = "Save Changes",
  readOnly = false,
  showPassword = false,
  onCancel,
}) => {
  return (
    <form id="student-form" onSubmit={handleSubmit} className="space-y-8">
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
          </div>

          {showPassword && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter Password"
              />
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
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Department
            </label>
            <select
              name="department"
              value={formData.department || ""}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Course
            </label>
            <input
              type="text"
              name="course"
              value={formData.course || ""}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Semester
            </label>
            <input
              type="number"
              name="semester"
              value={formData.semester || ""}
              onChange={handleChange}
              readOnly={readOnly}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
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
