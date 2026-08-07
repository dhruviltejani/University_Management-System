import DepartmentStats from "../../../components/Admin/Department/DepartmentStats";
import DepartmentFilters from "../../../components/Admin/Department/DepartmentFilters";
import DepartmentTable from "../../../components/Admin/Department/DepartmentTable";
import { DetailsModal } from "../../../components/Common/DetailsModal";
import { departmentDetailsConfig } from "../../../config/departmentDetailsConfig";
import { deleteDepartmentConfig } from "../../../config/deleteDepartmentConfig";
import { DeleteModal } from "../../../components/Common/DeleteModal";

import Sidebar from "../../../components/Admin/sidebar";
import { useState, useEffect } from "react";
import { getDepartments , deleteDepartment , } from "../../../services/departmentService";

const Departments = () => {

const [status, setStatus] = useState("");
const [departments, setDepartments] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [page, setPage] = useState(1);
const [limit] = useState(10);
const [totalPages, setTotalPages] = useState(1);
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [selectedDepartment, setSelectedDepartment] = useState(null);
const [showModal, setShowModal] = useState(false);
const [deleteLoading, setDeleteLoading] = useState(false);
const [totalRecords, setTotalRecords] = useState(0);

useEffect(() => {
  // setPage(1);
  fetchDepartments();
}, [
  search,
  status,
  page,
]);

useEffect(() => {
  setPage(1);
}, [search,status]);

const handleViewDepartment = (department) => {
  console.log("View clicked:", department);

  setSelectedDepartment(department);
  setShowModal(true);
};

// const handleViewTeacher = (teacher) => {
//   setSelectedTeacher(teacher);
//   setShowModal(true);
// };

const fetchDepartments = async () => {
  try {
    setLoading(true);

    const response = await getDepartments(
      search,
      status,
      page,
      limit
    );

    setDepartments(response.data);

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
  setStatus("");
};

const openDeleteModal = (department) => {
  setSelectedDepartment(department);
  setDeleteModalOpen(true);
};


const handleDelete = async () => {
  if (!selectedDepartment) return;

  try {
    setDeleteLoading(true);

    console.log(selectedDepartment);
console.log(selectedDepartment.department_id);

    const response = await deleteDepartment(
      selectedDepartment.id
    );

    alert(response.message);

    setDeleteModalOpen(false);
    setSelectedDepartment(null);

    if (departments.length === 1 && page > 1) {
      setPage((prev) => prev - 1);
    } else {
      await fetchDepartments();
    }
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Failed to delete department."
    );
  } finally {
    setDeleteLoading(false);
  }
};


  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex">

      <Sidebar />

      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8 space-y-6">
<div className="flex items-start justify-between">

  <div>

  <h1 className="text-4xl font-bold tracking-tight text-slate-900">
    Department Management 
  </h1>

  <p className="mt-3 max-w-3xl text-slate-500 leading-7">
Manage university departments, HODs, office details and departmental information from one place.
  </p>
  

</div>
</div>
        <DepartmentStats />

      <DepartmentFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        resetFilters={resetFilters}
      />
        
        <DepartmentTable
            departments = {departments}
            loading={loading}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            onDelete={openDeleteModal}
            onView={handleViewDepartment}
        />
        
        <DeleteModal
          isOpen={deleteModalOpen}
          data={selectedDepartment}
          config={deleteDepartmentConfig}
          loading={deleteLoading}
          onCancel={() => {
            setDeleteModalOpen(false);
            setSelectedDepartment(null);
          }}
          onConfirm={handleDelete}
        />

{showModal && (
  <DetailsModal
    isOpen={showModal}
    config={departmentDetailsConfig}
    data={selectedDepartment}
    onClose={() => {
      setShowModal(false);
      setSelectedDepartment(null);
    }}
  />
)}

      </main>

    </div>
  );
};

export default Departments;