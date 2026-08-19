import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

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

// =========================
  // FILTER STATES
  // =========================
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  // =========================
  // DATA STATES
  // =========================
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // PAGINATION STATES
  // =========================
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // =========================
  // MODAL STATES
  // =========================
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);

  useEffect(() => {
    const fetchActiveDepartments = async () => {
      try {
        const res = await getActiveDepartments();
        if (res.success) {
          setDepartmentList(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchActiveDepartments();
  }, []);

      // =========================
  // FETCH COURSES
  // =========================
  const fetchCourses = async () => {

    try {

      setLoading(true);

      const response = await getCourses(
        search,
        department,
        status,
        page,
        limit
      );

      setCourses(response.data);

      setTotalPages(response.pagination.totalPages);

      setTotalRecords(response.pagination.totalRecords);

    } catch (error) {

      console.error("Error fetching courses:", error);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // LOAD COURSES
  // =========================
  useEffect(() => {

    fetchCourses();

  }, [search, department, status, page, limit]);

  // =========================
  // RESET PAGE WHEN FILTERS CHANGE
  // =========================
  useEffect(() => {

    setPage(1);

  }, [search, department, status]);

  // =========================
  // RESET FILTERS
  // =========================
  const resetFilters = () => {

    setSearch("");
    setDepartment("");
    setStatus("");
  };
  
    // =========================
  // VIEW COURSE
  // =========================
  const handleViewCourse = (course) => {

    setSelectedCourse(course);

    setShowModal(true);
  };

  // =========================
  // OPEN DELETE MODAL
  // =========================
  const openDeleteModal = (course) => {

    setSelectedCourse(course);

    setDeleteModalOpen(true);
  };

  // =========================
  // DELETE COURSE
  // =========================
  const handleDelete = async () => {

    if (!selectedCourse) return;

    try {

      setLoading(true);

      const response = await deleteCourse(selectedCourse.id);

      toast.success(response.message);

      setDeleteModalOpen(false);

      setSelectedCourse(null);

      // If last item on page is deleted,
      // move to previous page
      if (courses.length === 1 && page > 1) {

        setPage((prev) => prev - 1);

      } else {

        await fetchCourses();
      }

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to delete course."
      );

    } finally {

      setLoading(false);
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
          loading={loading}
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
          loading={loading}
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
