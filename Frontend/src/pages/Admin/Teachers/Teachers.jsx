import TeacherStats from "../../../components/Admin/Teacher/TeacherStats";
import TeacherFilters from "../../../components/Admin/Teacher/TeacherFilters";
import TeacherTable from "../../../components/Admin/Teacher/TeacherTable";
import Sidebar from "../../../components/Admin/sidebar";
import ConfirmDeleteModal from "../../../components/Common/ConfirmDeleteModal";
import { useState, useEffect } from "react";
import TeacherDetailsModal from "../../../components/Admin/Teacher/TeacherDetailsModal";
import { getTeachers , deleteTeacher} from "../../../services/teacherService";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const Teachers = () => {
const [department, setDepartment] = useState("");
const [designation, setDesignation] = useState("");
const [status, setStatus] = useState("");
const [teachers, setTeachers] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [page, setPage] = useState(1);
const [limit] = useState(10);
const [totalPages, setTotalPages] = useState(1);
const [totalRecords, setTotalRecords] = useState(0);
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [selectedTeacher, setSelectedTeacher] = useState(null);
const [showModal, setShowModal] = useState(false);



useEffect(() => {
  // setPage(1);
  fetchTeachers();
}, [
  search,
  department,
  designation,
  status,
  page,
  limit
]);

useEffect(() => {
  setPage(1);
}, [search, department, designation, status]);

const handleViewTeacher = (teacher) => {
  console.log("View clicked:", teacher);

  setSelectedTeacher(teacher);
  setShowModal(true);
};

// const handleViewTeacher = (teacher) => {
//   setSelectedTeacher(teacher);
//   setShowModal(true);
// };

const fetchTeachers = async () => {
  try {
    setLoading(true);

    const response = await getTeachers(
      search,
      department,
      designation,
      status,
      page,
      limit
    );

    setTeachers(response.data);

    setTotalPages(response.pagination.totalPages);
    setTotalRecords(response.pagination.totalRecords);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const resetFilters = () => {
  setSearch("");
  setDepartment("");
  setDesignation("");
  setStatus("");
};

const openDeleteModal = (teacher) => {
  setSelectedTeacher(teacher);
  setDeleteModalOpen(true);
};


const handleDelete = async () => {
  if (!selectedTeacher) return;

  try {
    setLoading(true);

    const response = await deleteTeacher(selectedTeacher.id);

    alert(response.message);

    setDeleteModalOpen(false);
    setSelectedTeacher(null);

    if (teachers.length === 1 && page > 1) {
      setPage((prev) => prev - 1);
    } else {
      await fetchTeachers();
    }

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to delete teacher."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex">

      <Sidebar />

      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8 space-y-6">
      <div className="flex items-center justify-between">

        {/* Left Side */}
        <div>
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
            Admin Dashboard
          </span>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Teacher Management
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Manage faculty members, departments, qualifications, and professional
            information from a single dashboard.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Total Teachers
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {totalRecords}
            </p>
          </div>

        </div>

      </div>
        <TeacherStats />

      <TeacherFilters
  search={search}
  setSearch={setSearch}
  department={department}
  setDepartment={setDepartment}
  designation={designation}
  setDesignation={setDesignation}
  status={status}
  setStatus={setStatus}
  resetFilters={resetFilters}
/>
        
        <TeacherTable
            teachers={teachers}
            loading={loading}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            onDelete={openDeleteModal}
            onView={handleViewTeacher}
        />
        
<ConfirmDeleteModal
  isOpen={deleteModalOpen}
  teacher={selectedTeacher}
  loading={loading}
  onCancel={() => {
    setDeleteModalOpen(false);
    setSelectedTeacher(null);
  }}
  onConfirm={handleDelete}
/>

{showModal && (
  <TeacherDetailsModal
    teacher={selectedTeacher}
    onClose={() => setShowModal(false)}
  />
)}

      </main>

    </div>
  );
};

export default Teachers;