
const ClassForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading = false,
  submitText = "Save Class",
  readOnly = false,
  onCancel,
  errors = {},
  courses = [],
  teachers = [],
  handleBlur,
  hideActions = false,
}) => {
  return (
    <form id="class-form" onSubmit={handleSubmit} className="space-y-8" onBlur={handleBlur}>
      {/* Class Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Class Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Class Name
            </label>
            <input
              type="text"
              name="class_name"
              value={formData.class_name}
              onChange={handleChange}
              readOnly={readOnly}
              placeholder="e.g. 1cse1"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.class_name && (
              <p className="text-red-500 text-xs mt-1">{errors.class_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Course
            </label>
            <select
              name="course_id"
              value={formData.course_id || ""}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </select>
            {errors.course_id && (
              <p className="text-red-500 text-xs mt-1">{errors.course_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Semester
            </label>
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
            {errors.semester && (
              <p className="text-red-500 text-xs mt-1">{errors.semester}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Division
            </label>
            <input
              type="text"
              name="division"
              value={formData.division}
              onChange={handleChange}
              readOnly={readOnly}
              placeholder="e.g. A"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.division && (
              <p className="text-red-500 text-xs mt-1">{errors.division}</p>
            )}
          </div>
        </div>
      </div>

      {/* Teacher Assignment */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Class Teacher (MFT) Assignment
        </h2>

        <div className="max-w-md">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Class Teacher
          </label>
          <select
            name="mft_id"
            value={formData.mft_id || ""}
            onChange={handleChange}
            disabled={readOnly}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            <option value="">Unassigned</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.full_name}
              </option>
            ))}
          </select>
          {errors.mft_id && (
            <p className="text-red-500 text-xs mt-1">{errors.mft_id}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {!readOnly && !hideActions && (
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Saving..." : submitText}
          </button>
        </div>
      )}
    </form>
  );
};

export default ClassForm;
