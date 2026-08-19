import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import TeacherSidebar from "../../components/Teacher/TeacherSidebar";
import * as Yup from "yup";
import { leaveSchema } from "../../validations/leaveValidation";

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState({ "Casual Leave": 0, "Sick Leave": 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    leave_type: "Casual Leave",
    start_date: "",
    end_date: "",
    reason: ""
  });

  const calculateDays = () => {
    if (!formData.start_date || !formData.end_date) return 0;
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    if (end < start) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const daysApplied = calculateDays();

  const leaveTypes = ["Casual Leave", "Sick Leave"]; // As per user request

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/leaves/my-leaves", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.leaves) {
        setLeaves(res.data.leaves);
        if (res.data.balances) {
          setBalances(res.data.balances);
        }
      } else {
        setLeaves(res.data);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      toast.error("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await leaveSchema.validate(formData, { abortEarly: false });
      setErrors({});
      
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/leaves/apply", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Leave applied successfully");
      setShowModal(false);
      setFormData({ leave_type: "Casual Leave", start_date: "", end_date: "", reason: "" });
      fetchLeaves();
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
        return;
      }
      console.error("Error applying for leave:", error);
      toast.error(error.response?.data?.message || "Failed to apply for leave");
    }
  };

  const handleDeleteLeave = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-slate-800">
          Are you sure you want to delete this leave application?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://localhost:5000/api/leaves/${id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Leave deleted successfully");
                fetchLeaves();
              } catch (error) {
                console.error("Error deleting leave:", error);
                toast.error("Failed to delete leave");
              }
            }}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved": return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "Rejected": return <XCircle size={16} className="text-rose-500" />;
      default: return <Clock size={16} className="text-amber-500" />;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex text-slate-700 font-sans">
      <TeacherSidebar />
      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
            <p className="text-slate-500 text-sm mt-1">Manage and apply for your leaves</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-emerald-200"
          >
            <Plus size={18} />
            Apply Leave
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500">Casual Leave (Balance)</h3>
              <p className="text-2xl font-bold text-slate-900">{balances["Casual Leave"]} <span className="text-sm font-medium text-slate-400">Available</span></p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
              <Plus size={24} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500">Sick Leave (Balance)</h3>
              <p className="text-2xl font-bold text-slate-900">{balances["Sick Leave"]} <span className="text-sm font-medium text-slate-400">Available</span></p>
            </div>
          </div>
        </div>

        {/* Leaves Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Leave Type</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Range</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Applied On</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">Loading...</td>
                  </tr>
                ) : leaves.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">No leaves applied yet.</td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave.leave_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-medium text-slate-900">{leave.leave_type}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-slate-700">
                          {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                        </div>
                        <div className="text-xs font-medium text-emerald-600 mt-0.5">
                          {Math.ceil(Math.abs(new Date(leave.end_date) - new Date(leave.start_date)) / (1000 * 60 * 60 * 24)) + 1} day(s)
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-slate-600 truncate max-w-[200px] block" title={leave.reason}>
                          {leave.reason}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500">
                        {new Date(leave.applied_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(leave.status)}
                          <span className={`text-sm font-medium ${
                            leave.status === 'Approved' ? 'text-emerald-700' :
                            leave.status === 'Rejected' ? 'text-rose-700' : 'text-amber-700'
                          }`}>
                            {leave.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {leave.status !== 'Approved' ? (
                          <button
                            onClick={() => handleDeleteLeave(leave.leave_id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Leave"
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic px-2">Locked</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Apply for Leave</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <form onSubmit={handleApplyLeave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Leave Type
                </label>
                <select
                  value={formData.leave_type}
                  onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  required
                >
                  {leaveTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.leave_type && <p className="text-xs text-rose-500 mt-1">{errors.leave_type}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    required
                  />
                  {errors.start_date && <p className="text-xs text-rose-500 mt-1">{errors.start_date}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    min={formData.start_date}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    required
                  />
                  {errors.end_date && <p className="text-xs text-rose-500 mt-1">{errors.end_date}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Reason
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                  placeholder="Please provide a brief reason for your leave..."
                  required
                ></textarea>
                {errors.reason && <p className="text-xs text-rose-500 mt-1">{errors.reason}</p>}
              </div>

              {daysApplied > 0 && (
                <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CalendarIcon size={16} />
                  </div>
                  <p className="text-sm font-medium text-emerald-800">
                    Applying for <span className="font-bold text-emerald-900">{daysApplied}</span> day{daysApplied > 1 ? 's' : ''} of leave
                  </p>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </main>
    </div>
  );
};

export default LeaveManagement;
