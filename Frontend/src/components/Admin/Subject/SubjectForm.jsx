import React from "react";
import Select from "react-select";

const SubjectForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading = false,
  submitText = "Save Subject",
  readOnly = false,
  onCancel,
  errors = {},
  courses = [],
  teachers = [],
  handleBlur,
}) => {

  const teacherOptions = teachers.map((t) => ({
    value: t.id,
    label: t.full_name,
  }));

  const handleTeacherChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    // Synthetic event to match existing handleChange signature
    handleChange({
      target: {
        name: "teacher_ids",
        value: selectedIds,
      },
    });
  };

  const selectedTeachers = teacherOptions.filter((opt) => 
    formData.teacher_ids?.includes(opt.value)
  );

  return (
    <form id="subject-form" onSubmit={handleSubmit} className="space-y-8" onBlur={handleBlur}>
      {/* Subject Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Subject Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Subject Code</label>
            <input
              type="text"
              name="subject_code"
              value={formData.subject_code}
              onChange={handleChange}
              readOnly={readOnly}
              placeholder="e.g. CS101"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.subject_code && <p className="text-red-500 text-xs mt-1">{errors.subject_code}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Subject Name</label>
            <input
              type="text"
              name="subject_name"
              value={formData.subject_name}
              onChange={handleChange}
              readOnly={readOnly}
              placeholder="e.g. Data Structures"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.subject_name && <p className="text-red-500 text-xs mt-1">{errors.subject_name}</p>}
          </div>
        </div>
      </div>

      {/* Academic & Assignment Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Academic Assignment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Course</label>
            <select
              name="course_id"
              value={formData.course_id || ""}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.course_name}</option>
              ))}
            </select>
            {errors.course_id && <p className="text-red-500 text-xs mt-1">{errors.course_id}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Teachers (Faculty)</label>
            <Select
              isMulti
              name="teacher_ids"
              options={teacherOptions}
              value={selectedTeachers}
              onChange={handleTeacherChange}
              isDisabled={readOnly}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Select Teachers..."
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '50px',
                  borderRadius: '0.75rem',
                  borderColor: '#e2e8f0',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#cbd5e1'
                  }
                })
              }}
            />
            {errors.teacher_ids && <p className="text-red-500 text-xs mt-1">{errors.teacher_ids}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Semester</label>
            <input
              type="number"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              readOnly={readOnly}
              min="1"
              max="10"
              placeholder="e.g. 1"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Credits</label>
            <input
              type="number"
              name="credits"
              value={formData.credits}
              onChange={handleChange}
              readOnly={readOnly}
              min="0"
              max="10"
              placeholder="e.g. 3"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.credits && <p className="text-red-500 text-xs mt-1">{errors.credits}</p>}
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Account Status</h2>
        <div className="max-w-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={readOnly}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            <option value="">Select Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
        </div>
      </div>

      {/* Action Buttons */}
      {!readOnly && (
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Saving..." : submitText}
          </button>
        </div>
      )}
    </form>
  );
};

export default SubjectForm;
