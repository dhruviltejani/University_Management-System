import { useState, useEffect } from "react";

import Sidebar from "../../../components/Admin/sidebar";

import StudentStats from "../../../components/Admin/Student/StudentStats";
import StudentFilters from "../../../components/Admin/Student/StudentFilters";
import StudentTable from "../../../components/Admin/Student/StudentTable";
import { DetailsModal } from "../../../components/Common/DetailsModal";
import { studentDetailsConfig } from "../../../config/studentDetailsConfig";
import { deleteStudentConfig } from "../../../config/deleteStudentConfig";
import { DeleteModal } from "../../../components/Common/DeleteModal";

import {
  getStudents,
  deleteStudent,
} from "../../../services/studentService";

const Students = () => {
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [status, setStatus] = useState("");

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [
    search,
    department,
    course,
    semester,
    status,
    page,
    limit,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    department,
    course,
    semester,
    status,
  ]);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await getStudents(
        search,
        department,
        course,
        semester,
        status,
        page,
        limit
      );

      setStudents(response.data);

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
    setCourse("");
    setSemester("");
    setStatus("");
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;

    try {
      setLoading(true);

      const response = await deleteStudent(selectedStudent.id);

      alert(response.message);

      setDeleteModalOpen(false);
      setSelectedStudent(null);

      if (students.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchStudents();
      }

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to delete student."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex">

      <Sidebar />

      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8 space-y-6">

        <div className="flex items-start justify-between">

          <div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Student Management
            </h1>

            <p className="mt-3 max-w-3xl text-slate-500 leading-7">
              Manage students, enrollment details, departments,
              courses and academic information from one centralized dashboard.
            </p>

          </div>

        </div>

        <StudentStats />

        <StudentFilters
          search={search}
          setSearch={setSearch}
          department={department}
          setDepartment={setDepartment}
          course={course}
          setCourse={setCourse}
          semester={semester}
          setSemester={setSemester}
          status={status}
          setStatus={setStatus}
          resetFilters={resetFilters}
        />

        <StudentTable
          students={students}
          loading={loading}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          onDelete={openDeleteModal}
          onView={handleViewStudent}
        />

        <DeleteModal
          isOpen={deleteModalOpen}
          data={selectedStudent}
          config={deleteStudentConfig}
          loading={loading}
          onCancel={() => {
            setDeleteModalOpen(false);
            setSelectedStudent(null);
          }}
          onConfirm={handleDelete}
        />

        <DetailsModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedStudent(null);
          }}
          config={studentDetailsConfig}
          data={selectedStudent}
        />

      </main>

    </div>
  );
};

export default Students;