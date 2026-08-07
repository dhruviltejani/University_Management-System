import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../../components/Admin/sidebar";
import StudentForm from "../../../components/Admin/Student/StudentForm";

import { createStudent } from "../../../services/studentService";

const AddStudent = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    full_name: "",
    email: "",
    password: "",
    contact_no: "",
    dob: "",

    // Academic Information
    enrollment_no: "",
    department: "",
    course: "",
    semester: "",
    admission_year: "",

    // Guardian Information
    father_name: "",
    mother_name: "",
    guardian_phone: "",
    address: "",

    status: "",
  });

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // CREATE STUDENT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await createStudent(formData);

      alert(
        response.message ||
        "Student created successfully."
      );

      navigate("/admin/students");

    } catch (error) {
      console.error("Create student error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to create student."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CANCEL
  // =========================
  const handleCancel = () => {
    navigate("/admin/students");
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex">

      <Sidebar />

      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8">

        {/* Page Header */}
        <div className="mb-8">

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Add Student
          </h1>

          <p className="mt-3 text-slate-500">
            Create a new student profile and academic record.
          </p>

        </div>

        {/* Student Form */}
        <StudentForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          submitText="Create Student"
          showPassword={true}
          onCancel={handleCancel}
        />

      </main>

    </div>
  );
};

export default AddStudent;