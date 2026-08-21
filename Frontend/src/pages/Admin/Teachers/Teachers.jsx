import TeacherStats from "../../../components/Admin/Teacher/TeacherStats";
import toast from 'react-hot-toast';
import SearchAndFilter from "../../../components/Common/SearchAndFilter";
import TeacherTable from "../../../components/Admin/Teacher/TeacherTable";
import Sidebar from "../../../components/Admin/Sidebar";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTeachers , deleteTeacher} from "../../../services/teacherService";
import { getActiveDepartments } from "../../../services/departmentService";
import { DeleteModal } from "../../../components/Common/DeleteModal";
import  {DetailsModal} from "../../../components/Common/DetailsModal";
import {teacherDetailsConfig} from "../../../config/teacherDetailsConfig";
import {deleteTeacherConfig} from "../../../config/deleteTeacherConfig";

const Teachers = () => {
const [department, setDepartment] = useState("");
const [designation, setDesignation] = useState("");
const [status, setStatus] = useState("");
const [search, setSearch] = useState("");
const [page, setPage] = useState(1);
const [limit] = useState(10);
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [selectedTeacher, setSelectedTeacher] = useState(null);
const [showModal, setShowModal] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);

const { data: departmentList = [] } = useQuery({
  queryKey: ['activeDepartments'],
  queryFn: async () => {
    const res = await getActiveDepartments();
    return res.success ? res.data : [];
  }
});

const { data: teachersData, isLoading, refetch } = useQuery({
  queryKey: ['teachers', search, department, designation, status, page, limit],
  queryFn: () => getTeachers(search, department, designation, status, page, limit)
});

const teachers = teachersData?.data || [];
const totalPages = teachersData?.pagination?.totalPages || 1;
const totalRecords = teachersData?.pagination?.totalRecords || 0;

useEffect(() => {
  setPage(1);
}, [search, department, designation, status]);

const handleViewTeacher = (teacher) => {
  setSelectedTeacher(teacher);
  setShowModal(true);
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
    setIsDeleting(true);

    const response = await deleteTeacher(selectedTeacher.id);
    toast.success(response.message);

    setDeleteModalOpen(false);
    setSelectedTeacher(null);

    if (teachers.length === 1 && page > 1) {
      setPage((prev) => prev - 1);
    } else {
      await refetch();
    }

  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.message ||
      "Failed to delete teacher."
    );
  } finally {
    setIsDeleting(false);
  }
};

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex">

      <Sidebar />

      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8 space-y-6">
<div className="flex items-start justify-between">

  <div>

  <h1 className="text-4xl font-bold tracking-tight text-slate-900">
    Teacher Management
  </h1>

  <p className="mt-3 max-w-3xl text-slate-500 leading-7">
    Manage faculty members, departments, qualifications,
    specializations and professional information from a
    centralized dashboard.
  </p>
  

</div>
</div>
        <TeacherStats />

      <SearchAndFilter
        searchPlaceholder="Search by name, employee ID or email..."
        searchValue={search}
        onSearchChange={setSearch}
        onReset={resetFilters}
        filters={[
          {
            value: department,
            onChange: setDepartment,
            placeholder: "All Departments",
            options: departmentList.map((dept) => ({
              label: dept.department_name,
              value: dept.id,
            })),
          },
          {
            value: designation,
            onChange: setDesignation,
            placeholder: "All Designations",
            options: [
              { label: "Professor", value: "Professor" },
              { label: "Associate Professor", value: "Associate Professor" },
              { label: "Assistant Professor", value: "Assistant Professor" },
              { label: "HOD", value: "HOD" },
            ],
          },
          {
            value: status,
            onChange: setStatus,
            placeholder: "All Status",
            options: [
              { label: "Active", value: "Active" },
              { label: "On Leave", value: "On Leave" },
              { label: "Inactive", value: "Inactive" },
            ],
          },
        ]}
      />
        
        <TeacherTable
            teachers={teachers}
            loading={isLoading}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            onDelete={openDeleteModal}
            onView={handleViewTeacher}
        />
        
<DeleteModal
  isOpen={deleteModalOpen}
  data={selectedTeacher}
  config={deleteTeacherConfig}
  loading={isDeleting}
  onCancel={() => {
    setDeleteModalOpen(false);
    setSelectedTeacher(null);
  }}
  onConfirm={handleDelete}
/>

{showModal && (
  <DetailsModal
    isOpen={showModal}
    config={teacherDetailsConfig}
    data={selectedTeacher}
    onClose={() => setShowModal(false)}
  />
)}

      </main>

    </div>
  );
};

export default Teachers;
