import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import Sidebar from "../../../components/Admin/Sidebar";
import CourseStats from "../../../components/Admin/Course/CourseStats";
import SearchAndFilter from "../../../components/Common/SearchAndFilter";
import CourseTable from "../../../components/Admin/Course/CourseTable";

import { DeleteModal } from "../../../components/Common/DeleteModal";
import { DetailsModal } from "../../../components/Common/DetailsModal";

import {
  getCourses,
  deleteCourse,
} from "../../../services/courseService";
import { getActiveDepartments } from "../../../services/departmentService";

import courseDetailsConfig from "../../../config/courseDetailsConfig";
import deleteCourseConfig from "../../../config/deleteCourseConfig";

const Courses = () => {

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: departmentList = [] } = useQuery({
    queryKey: ['activeDepartments'],
    queryFn: async () => {
      const res = await getActiveDepartments();
      return res.success ? res.data : [];
    }
  });

  const { data: coursesData, isLoading, refetch } = useQuery({
    queryKey: ['courses', search, department, status, page, limit],
    queryFn: () => getCourses(search, department, status, page, limit)
  });

  const courses = coursesData?.data || [];
  const totalPages = coursesData?.pagination?.totalPages || 1;
  const totalRecords = coursesData?.pagination?.totalRecords || 0;

  useEffect(() => {
    setPage(1);
  }, [search, department, status]);

  const resetFilters = () => {
    setSearch("");
    setDepartment("");
    setStatus("");
  };
  
  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const openDeleteModal = (course) => {
    setSelectedCourse(course);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;

    try {
      setIsDeleting(true);
      const response = await deleteCourse(selectedCourse.id);
      toast.success(response.message);

      setDeleteModalOpen(false);
      setSelectedCourse(null);

      if (courses.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await refetch();
      }

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        "Failed to delete course."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  
  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex">

      <Sidebar />

      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8 space-y-6">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

        <div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Course Management
            </h1>

            <p className="mt-3 max-w-3xl text-slate-500 leading-7">
            Manage university courses, departments, duration,
            semesters and academic offerings from a centralized dashboard.
            </p>

        </div>


        </div>

        {/* Statistics */}
        <CourseStats />

        {/* Filters */}
        <SearchAndFilter
          searchPlaceholder="Search course name or code..."
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

        {/* Course Table */}
        <CourseTable
          courses={courses}
          loading={isLoading}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          onDelete={openDeleteModal}
          onView={handleViewCourse}
        />

        {/* Delete Modal */}
        <DeleteModal
          isOpen={deleteModalOpen}
          data={selectedCourse}
          config={deleteCourseConfig}
          loading={isDeleting}
          onCancel={() => {
            setDeleteModalOpen(false);
            setSelectedCourse(null);
          }}
          onConfirm={handleDelete}
        />

        {/* Details Modal */}
           <DetailsModal
            isOpen={showModal}
            data={selectedCourse}
            config={courseDetailsConfig}
            onClose={() => {
                setShowModal(false);
                setSelectedCourse(null);
            }}
            />

      </main>

    </div>
  );
};

export default Courses;
