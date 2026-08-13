import React from "react";

const DepartmentForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading = false,
  submitText = "Save Changes",
  readOnly = false,
  onCancel,
  errors = {},
}) => {

  return (
    <form 
    id="department-form"
    onSubmit={handleSubmit} 
    className="space-y-8">
      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Department Information
        </h2>

<div className="grid grid-cols-1 md:grid-cols-2 gap-5">

  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Department Name
    </label>

    <input
      type="text"
      name="department_name"
      value={formData.department_name}
      onChange={handleChange}
      readOnly={readOnly}
      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
    />
    {errors.department_name && <p className="text-red-500 text-xs mt-1">{errors.department_name}</p>}
  </div>

  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Department Code
    </label>

    <input
      type="text"
      name="department_code"
      value={formData.department_code}
      onChange={handleChange}
      readOnly={readOnly}

      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
    />
    {errors.department_code && <p className="text-red-500 text-xs mt-1">{errors.department_code}</p>}
  </div>

  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Head of Department
    </label>

    <input
      type="text"
      name="hod_name"
      value={formData.hod_name}
      onChange={handleChange}
      readOnly={readOnly}
      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
    />
    {errors.hod_name && <p className="text-red-500 text-xs mt-1">{errors.hod_name}</p>}
  </div>

  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Email Address
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

</div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Additional Information
        </h2>

<div className="grid grid-cols-1 md:grid-cols-2 gap-5">

  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Contact Number
    </label>

    <input
      type="text"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      readOnly={readOnly}
      className="
                  w-full
                  border
                  border-slate-200
                  rounded-xl
                  px-4
                  py-3
                  bg-slate-50
                  focus:bg-white
                  focus:ring-2
                  focus:ring-indigo-500
                  outline-none
                  "
    />
    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
  </div>

  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Office Location
    </label>

    <input
      type="text"
      name="office_location"
      value={formData.office_location}
      onChange={handleChange}
      readOnly={readOnly}
      className="
                  w-full
                  border
                  border-slate-200
                  rounded-xl
                  px-4
                  py-3
                  bg-slate-50
                  focus:bg-white
                  focus:ring-2
                  focus:ring-indigo-500
                  outline-none
                  "
    />
    {errors.office_location && <p className="text-red-500 text-xs mt-1">{errors.office_location}</p>}
  </div>

  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Description
    </label>

    <textarea
      name="description"
      value={formData.description}
      onChange={handleChange}
      readOnly={readOnly}
      rows={4}
      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
    />
    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
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
            className="
                        w-full
                        border
                        border-slate-200
                        rounded-xl
                        px-4
                        py-3
                        bg-slate-50
                        focus:bg-white
                        focus:ring-2
                        focus:ring-indigo-500
                        outline-none
                        "
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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

export default DepartmentForm;