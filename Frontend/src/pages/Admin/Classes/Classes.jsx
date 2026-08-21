import SearchAndFilter from "../../../components/Common/SearchAndFilter";
import ClassTable from "../../../components/Admin/Class/ClassTable";
import { DetailsModal } from "../../../components/Common/DetailsModal";
import { classDetailsConfig } from "../../../config/classDetailsConfig.jsx";
import { deleteClassConfig } from "../../../config/deleteClassConfig.jsx";
import { DeleteModal } from "../../../components/Common/DeleteModal";

import Sidebar from "../../../components/Admin/Sidebar";
import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { useQuery } from "@tanstack/react-query";
import { getClasses, deleteClass } from "../../../services/classService";

const Classes = () => {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data: classesData, isLoading, refetch } = useQuery({
    queryKey: ['classes', search, courseFilter, page, limit],
    queryFn: () => getClasses(search, courseFilter, page, limit)
  });

  const classes = classesData?.data || [];
  const totalPages = classesData?.pagination?.totalPages || 1;
  const totalRecords = classesData?.pagination?.totalRecords || 0;

  useEffect(() => {
    setPage(1);
  }, [search, courseFilter]);

  const handleViewClass = (cls) => {
    setSelectedClass(cls);
    setShowModal(true);
  };

  const resetFilters = () => {
    setSearch("");
    setCourseFilter("");
  };

  const openDeleteModal = (cls) => {
    setSelectedClass(cls);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedClass) return;

    try {
      setDeleteLoading(true);
      const response = await deleteClass(selectedClass.id);
      toast.success(response.message);
      
      setDeleteModalOpen(false);
      setSelectedClass(null);

      if (classes.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await refetch();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to delete class."
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
              Class Management 
            </h1>
            <p className="mt-3 max-w-3xl text-slate-500 leading-7">
              Manage class divisions, map them to courses and semesters, and assign Class Teachers (MFTs).
            </p>
          </div>
        </div>

        <SearchAndFilter
          searchPlaceholder="Search by class name (e.g. 1cse1)..."
          searchValue={search}
          onSearchChange={setSearch}
          onReset={resetFilters}
          filters={[]} // Can add course dropdown filter here later
        />
        
        <ClassTable
          classes={classes}
          loading={isLoading}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          onDelete={openDeleteModal}
          onView={handleViewClass}
        />
        
        <DeleteModal
          isOpen={deleteModalOpen}
          data={selectedClass}
          config={deleteClassConfig}
          loading={deleteLoading}
          onCancel={() => {
            setDeleteModalOpen(false);
            setSelectedClass(null);
          }}
          onConfirm={handleDelete}
        />

        {showModal && (
          <DetailsModal
            isOpen={showModal}
            config={classDetailsConfig}
            data={selectedClass}
            onClose={() => {
              setShowModal(false);
              setSelectedClass(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Classes;
