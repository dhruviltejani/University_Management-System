import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DepartmentStats from "../../../components/Admin/Department/DepartmentStats";
import SearchAndFilter from "../../../components/Common/SearchAndFilter";
import DepartmentTable from "../../../components/Admin/Department/DepartmentTable";
import { DetailsModal } from "../../../components/Common/DetailsModal";
import { departmentDetailsConfig } from "../../../config/departmentDetailsConfig";
import { deleteDepartmentConfig } from "../../../config/deleteDepartmentConfig";
import { DeleteModal } from "../../../components/Common/DeleteModal";
import Sidebar from "../../../components/Admin/Sidebar";
import toast from 'react-hot-toast';
import { getDepartments , deleteDepartment } from "../../../services/departmentService";

const Departments = () => {

const [status, setStatus] = useState("");
const [search, setSearch] = useState("");
const [page, setPage] = useState(1);
const [limit] = useState(10);
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [selectedDepartment, setSelectedDepartment] = useState(null);
const [showModal, setShowModal] = useState(false);
const [deleteLoading, setDeleteLoading] = useState(false);

const { data: departmentsData, isLoading, refetch } = useQuery({
  queryKey: ['departments', search, status, page, limit],
  queryFn: () => getDepartments(search, status, page, limit)
});

const departments = departmentsData?.data || [];
const totalPages = departmentsData?.pagination?.totalPages || 1;
const totalRecords = departmentsData?.pagination?.totalRecords || 0;

useEffect(() => {
  setPage(1);
}, [search,status]);

const handleViewDepartment = (department) => {
  console.log("View clicked:", department);
  setSelectedDepartment(department);
  setShowModal(true);
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

    toast.success(response.message);

    setDeleteModalOpen(false);
    setSelectedDepartment(null);

    if (departments.length === 1 && page > 1) {
      setPage((prev) => prev - 1);
    } else {
      await refetch();
    }
  } catch (error) {
    toast.error(
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

      <SearchAndFilter
        searchPlaceholder="Search by department name, code..."
        searchValue={search}
        onSearchChange={setSearch}
        onReset={resetFilters}
        filters={[
          {
            value: status,
            onChange: setStatus,
            placeholder: "All Status",
            options: [
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ],
          },
        ]}
      />
        
        <DepartmentTable
            departments = {departments}
            loading={isLoading}
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
