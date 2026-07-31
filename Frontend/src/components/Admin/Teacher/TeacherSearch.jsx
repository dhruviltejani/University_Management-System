import React from 'react'

const TeacherSearcj = () => {
  return (
<div className="mb-6">
  <input
    type="text"
    placeholder="Search by name, email, employee ID or department..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
</div>
  )
}

export default TeacherSearcj
