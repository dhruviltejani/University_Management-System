import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import Sidebar from "../../../components/Admin/Sidebar";
import SubjectStats from "../../../components/Admin/Subject/SubjectStats";
import SearchAndFilter from "../../../components/Common/SearchAndFilter";
import SubjectTable from "../../../components/Admin/Subject/SubjectTable";
import { DeleteModal } from "../../../components/Common/DeleteModal";
import { DetailsModal } from "../../../components/Common/DetailsModal";

import { getSubjects, deleteSubject } from "../../../services/subjectService";
import { getCourses } from "../../../services/courseService";
import { getTeachers } from "../../../services/teacherService";

import subjectDetailsConfig from "../../../config/subjectDetailsConfig";
import deleteSubjectConfig from "../../../config/deleteSubjectConfig";

const Subjects = () => {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [teacher, setTeacher] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: dropdownData = { courses: [], teachers: [] } } = useQuery({
    queryKey: ['subjectDropdowns'],
    queryFn: async () => {
      const [courseRes, teacherRes] = await Promise.all([
        getCourses("", "", "Active", 1, 100),
        getTeachers("", "", "", "Active", 1, 100)
      ]);
      return {
        courses: courseRes.success || courseRes.data ? courseRes.data || [] : [],
        teachers: teacherRes.success || teacherRes.data ? teacherRes.data || [] : []
      };
    }
  });

  const { courses: courseList, teachers: teacherList } = dropdownData;

  const { data: subjectsData, isLoading, refetch } = useQuery({
    queryKey: ['subjects', search, course, teacher, status, page, limit],
    queryFn: () => getSubjects(search, course, teacher, status, page, limit)
  });

  const subjects = subjectsData?.subjects || subjectsData?.data || [];
  const totalPages = subjectsData?.totalPages || (subjectsData?.pagination ? subjectsData.pagination.totalPages : 1);
  const totalRecords = subjectsData?.totalRecords || (subjectsData?.pagination ? subjectsData.pagination.totalRecords : 0);

  useEffect(() => {
    setPage(1);
  }, [search, course, teacher, status]);

  const resetFilters = () => {
    setSearch("");
    setCourse("");
    setTeacher("");
    setStatus("");
  };

  const handleViewSubject = (subject) => {
    setSelectedSubject(subject);
    setShowModal(true);
  };

  const openDeleteModal = (subject) => {
    setSelectedSubject(subject);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSubject) return;

    try {
      setIsDeleting(true);
      await deleteSubject(selectedSubject.id);
      toast.success("Subject deleted successfully");
      setDeleteModalOpen(false);
      setSelectedSubject(null);

      if (subjects.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete subject.");
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
              Subject Management
            </h1>
            <p className="mt-3 max-w-3xl text-slate-500 leading-7">
              Manage subjects, assign teachers, and organize classes from a centralized dashboard.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <SubjectStats />

        {/* Filters */}
        <SearchAndFilter
          searchPlaceholder="Search subject name or code..."
          searchValue={search}
          onSearchChange={setSearch}
          onReset={resetFilters}
          filters={[
            {
              value: course,
              onChange: setCourse,
              placeholder: "All Courses",
              options: courseList.map((c) => ({
                label: c.course_name,
                value: c.id,
              })),
            },
            {
              value: teacher,
              onChange: setTeacher,
              placeholder: "All Teachers",
              options: teacherList.map((t) => ({
                label: t.full_name,
                value: t.id,
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

        {/* Subject Table */}
        <SubjectTable
          subjects={subjects}
          loading={isLoading}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          onDelete={openDeleteModal}
          onView={handleViewSubject}
        />

        {/* Delete Modal */}
        <DeleteModal
          isOpen={deleteModalOpen}
          data={selectedSubject}
          config={deleteSubjectConfig}
          loading={isDeleting}
          onCancel={() => {
            setDeleteModalOpen(false);
            setSelectedSubject(null);
          }}
          onConfirm={handleDelete}
        />

        {/* Details Modal */}
        <DetailsModal
          isOpen={showModal}
          data={selectedSubject}
          config={subjectDetailsConfig}
          onClose={() => {
            setShowModal(false);
            setSelectedSubject(null);
          }}
        />
      </main>
    </div>
  );
};

export default Subjects;
