import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import Sidebar from "../../../components/Admin/sidebar";
import SubjectForm from "../../../components/Admin/Subject/SubjectForm";
import subjectSchema from "../../../Validation/subjectSchema";
import { getSubjectById, updateSubject } from "../../../services/subjectService";
import { getCourses } from "../../../services/courseService";
import { getTeachers } from "../../../services/teacherService";

const EditSubject = () => {
  const { id } = useParams();
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
        const [subjectRes, courseRes, teacherRes] = await Promise.all([
          getSubjectById(id),
          getCourses("", "", "", 1, 100),
          getTeachers("", "", "", "", 1, 100)
        ]);
        
        const subject = subjectRes.data;
        // The backend now returns teachers as an array of objects
        const assignedTeacherIds = subject.teachers ? subject.teachers.map(t => t.id) : [];

        setFormData({
          subject_code: subject.subject_code || "",
          subject_name: subject.subject_name || "",
          course_id: subject.course_id || "",
          teacher_ids: assignedTeacherIds,
          semester: subject.semester || "",
          credits: subject.credits || "",
          status: subject.status || "Active",
        });
        
        setCourses(courseRes.data);
        setTeachers(teacherRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, [id]);

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
      await updateSubject(id, formData);
      toast.success("Subject updated successfully!");
      navigate("/admin/subjects");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update subject.");
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Subject</h1>
          <p className="mt-2 text-slate-500">Update the details for this academic subject.</p>
        </div>
        <SubjectForm
          formData={formData}
          handleChange={handleChange}
          handleBlur={handleBlur}
          handleSubmit={handleSubmit}
          loading={loading}
          errors={errors}
          submitText="Update Subject"
          onCancel={() => navigate("/admin/subjects")}
          courses={courses}
          teachers={teachers}
        />
      </main>
    </div>
  );
};

export default EditSubject;
