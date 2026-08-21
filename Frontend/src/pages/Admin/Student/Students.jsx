import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../../components/Admin/Sidebar";
import StudentStats from "../../../components/Admin/Student/StudentStats";
import toast from 'react-hot-toast';
import SearchAndFilter from "../../../components/Common/SearchAndFilter";
import StudentTable from "../../../components/Admin/Student/StudentTable";
import { DetailsModal } from "../../../components/Common/DetailsModal";
import { studentDetailsConfig } from "../../../config/studentDetailsConfig";
import { deleteStudentConfig } from "../../../config/deleteStudentConfig";
import { DeleteModal } from "../../../components/Common/DeleteModal";
import { getStudents, deleteStudent } from "../../../services/studentService";
import { getActiveDepartments } from "../../../services/departmentService";
import { getActiveCourses } from "../../../services/courseService";

const Students = () => {
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: dropdownData = { departments: [], courses: [] } } = useQuery({
    queryKey: ['dropdownData'],
    queryFn: async () => {
      const [deptRes, courseRes] = await Promise.all([
        getActiveDepartments(),
        getActiveCourses(),
      ]);
      return {
        departments: deptRes.success ? deptRes.data : [],
        courses: courseRes.success ? courseRes.data : [],
      };
    }
  });

  const { departments: departmentList, courses: courseList } = dropdownData;

  const { data: studentsData, isLoading, refetch } = useQuery({
    queryKey: ['students', search, department, course, semester, status, page, limit],
    queryFn: () => getStudents(search, department, course, semester, status, "", page, limit)
  });

  const students = studentsData?.data || [];
  const totalPages = studentsData?.pagination?.totalPages || 1;
  const totalRecords = studentsData?.pagination?.totalRecords || 0;

  useEffect(() => {
    setPage(1);
  }, [search, department, course, semester, status]);

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
      setIsDeleting(true);
      const response = await deleteStudent(selectedStudent.id);
      toast.success(response.message);
      setDeleteModalOpen(false);
      setSelectedStudent(null);

      if (students.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete student.");
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
              Student Management
            </h1>

            <p className="mt-3 max-w-3xl text-slate-500 leading-7">
              Manage students, enrollment details, departments,
              courses and academic information from one centralized dashboard.
            </p>

          </div>

        </div>

        <StudentStats />

        <SearchAndFilter
          searchPlaceholder="Search student..."
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
              value: course,
              onChange: setCourse,
              placeholder: "All Courses",
              options: courseList.map((c) => ({
                label: c.course_name,
                value: c.id,
              })),
            },
            {
              value: semester,
              onChange: setSemester,
              placeholder: "Semester",
              options: [1, 2, 3, 4, 5, 6, 7, 8].map((sem) => ({
                label: `Semester ${sem}`,
                value: String(sem),
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

        <StudentTable
          students={students}
          loading={isLoading}
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
          loading={isDeleting}
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
