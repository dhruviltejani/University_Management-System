import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle2, XCircle, Clock, Search, Calendar as CalendarIcon, User, Eye } from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../../../components/Admin/Sidebar";
import DetailsModal from "../../../components/Common/DetailsModal/DetailsModal";
import { leaveDetailsConfig } from "../../../config/leaveDetailsConfig";
import { API_BASE_URL } from "../../../config/api";

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/leaves/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      toast.error("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/leaves/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Leave marked as ${newStatus}`);
      fetchLeaves();
    } catch (error) {
      console.error("Error updating leave:", error);
      toast.error("Failed to update leave status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} /> Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = (leave.full_name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || leave.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex text-slate-700 font-sans">
      <Sidebar />
      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Leave Requests</h1>
            <p className="text-slate-500 text-sm mt-1">Manage all faculty leave applications</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by applicant name..."
              className="pl-10 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["All", "Pending", "Approved", "Rejected"].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filterStatus === status 
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200" 
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Leave Type</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Range</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">Loading leave requests...</td>
                  </tr>
                ) : filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      No leave requests found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map((leave) => (
                    <tr key={leave.leave_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                            {leave.full_name ? leave.full_name.charAt(0) : "U"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{leave.full_name}</p>
                            <p className="text-xs text-slate-500 capitalize">{leave.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-slate-700">{leave.leave_type}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <CalendarIcon size={14} className="text-slate-400" />
                            <span>{new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}</span>
                          </div>
                          <div className="text-xs font-medium text-indigo-600 mt-1 ml-5">
                            {Math.ceil(Math.abs(new Date(leave.end_date) - new Date(leave.start_date)) / (1000 * 60 * 60 * 24)) + 1} day(s)
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-slate-600 truncate max-w-[200px]" title={leave.reason}>
                          {leave.reason}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(leave.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedLeave(leave);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          {leave.status !== "Approved" && (
                            <button
                              onClick={() => handleUpdateStatus(leave.leave_id, "Approved")}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                          )}
                          {leave.status !== "Rejected" && (
                            <button
                              onClick={() => handleUpdateStatus(leave.leave_id, "Rejected")}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </main>

      <DetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedLeave} 
        config={leaveDetailsConfig} 
      />
    </div>
  );
};

export default AdminLeaves;
