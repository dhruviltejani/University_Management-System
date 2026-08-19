import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import Sidebar from "../../../components/Admin/Sidebar";
import SubjectForm from "../../../components/Admin/Subject/SubjectForm";
import subjectSchema from "../../../Validation/subjectSchema";
import { createSubject } from "../../../services/subjectService";
import { getCourses } from "../../../services/courseService";
import { getTeachers } from "../../../services/teacherService";

const AddSubject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  
  const [formData, setFormData] = useState({
    subject_code: "",
    subject_name: "",
    course_id: "",
    teacher_ids: [],
    semester: "",
    credits: "",
    status: "Active",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, teacherRes] = await Promise.all([
          getCourses("", "", "", 1, 100),
          getTeachers("", "", "", "", 1, 100)
        ]);
        setCourses(courseRes.data);
        setTeachers(teacherRes.data);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value === "") {
      setErrors((prev) => ({ ...prev, [name]: '' }));
      return;
    }

    if (errors[name]) {
      try {
        const newFormData = { ...formData, [name]: value };
        await subjectSchema.validateAt(name, newFormData);
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
      await subjectSchema.validateAt(name, formData);
      setErrors((prev) => ({ ...prev, [name]: '' }));
    } catch (error) {
      if (error.name === 'ValidationError') {
        setErrors((prev) => ({ ...prev, [name]: error.message }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await subjectSchema.validate(formData, { abortEarly: false });
      setErrors({});
    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await createSubject(formData);
      toast.success("Subject created successfully!");
      navigate("/admin/subjects");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create subject.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex">
      <Sidebar />
      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8 space-y-6">
        <div>
          <Link to="/admin/subjects" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-2 transition-colors">
            <ChevronLeft size={16} className="mr-1" />
            Back to Subjects
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Subject</h1>
          <p className="mt-2 text-slate-500">Fill in the details to create a new academic subject.</p>
        </div>
        <SubjectForm
          formData={formData}
          handleChange={handleChange}
          handleBlur={handleBlur}
          handleSubmit={handleSubmit}
          loading={loading}
          errors={errors}
          submitText="Create Subject"
          onCancel={() => navigate("/admin/subjects")}
          courses={courses}
          teachers={teachers}
        />
      </main>
    </div>
  );
};

export default AddSubject;
