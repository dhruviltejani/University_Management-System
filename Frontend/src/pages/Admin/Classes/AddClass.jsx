import { useState, useEffect } from "react";
import Sidebar from "../../../components/Admin/Sidebar";
import ClassForm from "../../../components/Admin/Class/ClassForm";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { createClass } from "../../../services/classService";
import { getActiveCourses } from "../../../services/courseService";
import { getTeachers } from "../../../services/teacherService";
import { classSchema } from "../../../Validation/classSchema";



const AddClass = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    class_name: "",
    course_id: "",
    semester: "",
    division: "",
    mft_id: "",
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [coursesRes, teachersRes] = await Promise.all([
        getActiveCourses(),
        getTeachers("", "", "", "Active", 1, 1000)
      ]);
      const allTeachers = teachersRes.teachers || teachersRes.data || teachersRes;
      const availableTeachers = allTeachers.filter(t => !t.mft_classes);
      
      setCourses(coursesRes.courses || coursesRes.data || coursesRes);
      setTeachers(availableTeachers);
    } catch (error) {
      console.error("Failed to load dropdown data:", error);
      toast.error("Failed to load courses or teachers.");
    }
  };

  const validateField = async (name, value) => {
    if (value === "" || value === null || value === undefined) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    try {
      await Yup.reach(classSchema, name).validate(value);
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.message }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await classSchema.validate(formData, { abortEarly: false });
      setErrors({});
      setLoading(true);

      await createClass(formData);
      toast.success("Class added successfully!");
      navigate("/admin/classes");
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error(
          error.response?.data?.error || 
          error.response?.data?.message || 
          "Failed to add class."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex">
      <Sidebar />
      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Add New Class</h1>
            <p className="mt-2 text-slate-500">
              Create a new class and assign a class teacher.
            </p>
          </div>

          <ClassForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleBlur={handleBlur}
            loading={loading}
            errors={errors}
            courses={courses}
            teachers={teachers}
            onCancel={() => navigate("/admin/classes")}
          />
        </div>
      </main>
    </div>
  );
};

export default AddClass;
