import React, { useState, useEffect } from "react";
import { getStudents } from "../../../services/studentService";
import { X, Search } from "lucide-react";
import toast from "react-hot-toast";

const AssignStudentsModal = ({ isOpen, onClose, classId, courseId, semester, onAssign }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    if (isOpen) {
      fetchUnassignedStudents();
      setSelectedIds(new Set());
    }
  }, [isOpen, search]);

  const fetchUnassignedStudents = async () => {
    try {
      setLoading(true);
      // Fetch students with the same course and semester, but who are unassigned
      const res = await getStudents(search, "", courseId, semester, "Active", "unassigned", 1, 100);
      setStudents(res.data || res.students || []);
    } catch (error) {
      console.error("Failed to fetch unassigned students:", error);
      toast.error("Failed to fetch available students.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === students.length && students.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(students.map(s => s.id))); // using user_id which is u.id in getStudents
    }
  };

  const handleAssign = async () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one student.");
      return;
    }
    await onAssign(Array.from(selectedIds));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Assign Students</h2>
            <p className="text-sm text-slate-500 mt-1">Select students to add to this class</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or enrollment no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No unassigned students found for this course and semester.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="p-4 w-12">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.size === students.length && students.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrollment No</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => (
                    <tr 
                      key={student.id} 
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleToggleSelect(student.id)}
                    >
                      <td className="p-4 w-12">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.has(student.id)}
                          onChange={() => handleToggleSelect(student.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {student.profile_photo ? (
                            <img src={student.profile_photo} alt={student.full_name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                              {student.full_name?.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium text-slate-800">{student.full_name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{student.enrollment_no}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <span className="text-sm text-slate-500 font-medium">
            {selectedIds.size} student{selectedIds.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={selectedIds.size === 0}
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
            >
              Assign Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignStudentsModal;
