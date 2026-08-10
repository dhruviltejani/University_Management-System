import React from "react";

const CourseForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading = false,
  submitText = "Save Course",
  readOnly = false,
  onCancel,
}) => {

  return (
    <form id="course-form" onSubmit={handleSubmit} className="space-y-8">

      {/* Course Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Course Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Course Code
            </label>

            <input
              type="text"
              name="course_code"
              value={formData.course_code}
              onChange={handleChange}
              readOnly={readOnly}
              placeholder="e.g. CSE101"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Course Name
            </label>

            <input
              type="text"
              name="course_name"
              value={formData.course_name}
              onChange={handleChange}
              readOnly={readOnly}
              placeholder="e.g. Bachelor of Technology"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
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
              Department
            </label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select Department</option>
              <option>Computer Science</option>
              <option>Information Technology</option>
              <option>Civil Engineering</option>
              <option>Mechanical Engineering</option>
              <option>Electrical Engineering</option>
              <option>Electronics</option>
              <option>Business Administration</option>
              <option>Commerce</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Duration (Years)
            </label>

            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              readOnly={readOnly}
              min="1"
              max="10"
              placeholder="e.g. 4"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Total Semesters
            </label>

            <input
              type="number"
              name="total_semesters"
              value={formData.total_semesters}
              onChange={handleChange}
              readOnly={readOnly}
              min="1"
              max="20"
              placeholder="e.g. 8"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Course Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              readOnly={readOnly}
              rows={5}
              placeholder="Enter course description..."
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
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
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Select Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

        </div>

      </div>

      {/* Action Buttons */}
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

export default CourseForm;