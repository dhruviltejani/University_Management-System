import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../../../components/Admin/sidebar";
import CourseForm from "../../../components/Admin/Course/CourseForm";

import {
  getCourseById,
  updateCourse,
} from "../../../services/courseService";

const EditCourse = () => {

  const navigate = useNavigate();

  // Read :id from URL
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    course_code: "",
    course_name: "",
    department: "",
    duration: "",
    total_semesters: "",
    description: "",
    status: "Active",
  });

  // =========================
  // FETCH COURSE BY ID
  // =========================
  useEffect(() => {

    const fetchCourse = async () => {

      try {

        setFetching(true);

        const response = await getCourseById(id);

        setFormData(response.data);

      } catch (error) {

        console.error("Failed to fetch course:", error);

        alert("Course not found.");

        navigate("/admin/courses");

      } finally {

        setFetching(false);
      }
    };

    fetchCourse();

  }, [id, navigate]);

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
  // UPDATE COURSE
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await updateCourse(id, formData);

      alert(
        response.message ||
        "Course updated successfully."
      );

      navigate("/admin/courses");

    } catch (error) {

      console.error("Update course error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to update course."
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

  // =========================
  // LOADING STATE
  // =========================
  if (fetching) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8F9FD]">
        <div className="text-slate-500 text-lg">
          Loading course...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex">

      <Sidebar />

      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8">

        {/* Page Header */}
        <div className="mb-8">

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Edit Course
          </h1>

          <p className="mt-3 text-slate-500">
            Update course information and academic details.
          </p>

        </div>

        {/* Reusable Form */}
        <CourseForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          submitText="Update Course"
          onCancel={handleCancel}
        />

      </main>

    </div>
  );
};

export default EditCourse;