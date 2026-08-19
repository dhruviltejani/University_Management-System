import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

import Sidebar from "../../../components/Admin/sidebar";
import CourseForm from "../../../components/Admin/Course/CourseForm";
import courseSchema from "../../../Validation/courseSchema";

import { createCourse } from "../../../services/courseService";
import { getActiveDepartments } from "../../../services/departmentService";

const AddCourse = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    course_code: "",
    course_name: "",
    department_id: "",
    duration: "",
    total_semesters: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getActiveDepartments();
        setDepartments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };
    fetchDepartments();
  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = async (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (value === "") {
      setErrors((prev) => ({ ...prev, [name]: '' }));
      return;
    }

    if (errors[name]) {
      try {
        const newFormData = { ...formData, [name]: value };
        await courseSchema.validateAt(name, newFormData);
        setErrors((prev) => ({ ...prev, [name]: '' }));
      } catch (error) {
        if (error.name === 'ValidationError') {
          setErrors((prev) => ({ ...prev, [name]: error.message }));
        }
      }
    }
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    if (!name) return;

    if (value === "") {
      setErrors((prev) => ({ ...prev, [name]: '' }));
      return;
    }

    try {
      await courseSchema.validateAt(name, formData);
      setErrors((prev) => ({ ...prev, [name]: '' }));
    } catch (error) {
      if (error.name === 'ValidationError') {
        setErrors((prev) => ({ ...prev, [name]: error.message }));
      }
    }
  };

  // =========================
  // CREATE COURSE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await courseSchema.validate(formData, { abortEarly: false });
      setErrors({});
    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const response = await createCourse(formData);

      toast.success(
        response.message ||
        "Course created successfully."
      );

      navigate("/admin/courses");

    } catch (error) {

      console.error("Create course error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to create course."
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // CANCEL
  // =========================
  const handleCancel = () => {

    navigate("/admin/courses");
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex">

      <Sidebar />

      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8">

        {/* Page Header */}
        <div className="mb-8">

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Add Course
          </h1>

          <p className="mt-3 text-slate-500">
            Create a new academic course and program record.
          </p>

        </div>

        {/* Course Form */}
        <CourseForm
          handleBlur={handleBlur}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          submitText="Create Course"
          onCancel={handleCancel}
          errors={errors}
          departments={departments}
        />

      </main>

    </div>
  );
};

export default AddCourse;