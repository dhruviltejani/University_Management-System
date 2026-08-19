import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import Sidebar from "../../../components/Admin/sidebar";
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
  // =========================
  // FILTER STATES
  // =========================
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [teacher, setTeacher] = useState("");
  const [status, setStatus] = useState("");

  // =========================
  // DATA STATES
  // =========================
  const [subjects, setSubjects] = useState([]);
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
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // =========================
  // FILTER LISTS
  // =========================
  const [courseList, setCourseList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [courseRes, teacherRes] = await Promise.all([
          getCourses("", "", "Active", 1, 100),
          getTeachers("", "", "", "Active", 1, 100)
        ]);
        if (courseRes.success || courseRes.data) {
          setCourseList(courseRes.data || []);
        }
        if (teacherRes.success || teacherRes.data) {
          setTeacherList(teacherRes.data || []);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchFilterData();
  }, []);

  // =========================
  // FETCH SUBJECTS
  // =========================
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await getSubjects(
        search,
        course,
        teacher,
        status,
        page,
        limit
      );
      setSubjects(response.subjects || response.data || []);
      setTotalPages(response.totalPages || (response.pagination ? response.pagination.totalPages : 1));
      setTotalRecords(response.totalRecords || (response.pagination ? response.pagination.totalRecords : 0));
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD SUBJECTS
  // =========================
  useEffect(() => {
    fetchSubjects();
  }, [search, course, teacher, status, page, limit]);

  // =========================
  // RESET PAGE WHEN FILTERS CHANGE
  // =========================
  useEffect(() => {
    setPage(1);
  }, [search, course, teacher, status]);

  // =========================
  // RESET FILTERS
  // =========================
  const resetFilters = () => {
    setSearch("");
    setCourse("");
    setTeacher("");
    setStatus("");
  };

  // =========================
  // VIEW SUBJECT
  // =========================
  const handleViewSubject = (subject) => {
    setSelectedSubject(subject);
    setShowModal(true);
  };

  // =========================
  // OPEN DELETE MODAL
  // =========================
  const openDeleteModal = (subject) => {
    setSelectedSubject(subject);
    setDeleteModalOpen(true);
  };

  // =========================
  // DELETE SUBJECT
  // =========================
  const handleDelete = async () => {
    if (!selectedSubject) return;

    try {
      setLoading(true);
      await deleteSubject(selectedSubject.id);
      toast.success("Subject deleted successfully");
      setDeleteModalOpen(false);
      setSelectedSubject(null);

      // If last item on page is deleted, move to previous page
      if (subjects.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchSubjects();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete subject.");
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
          loading={loading}
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
          loading={loading}
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
