import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { ArrowLeft, Save, UserCircle2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/Admin/sidebar";
import StudentForm from "../../../components/Admin/Student/StudentForm";
import {
  getStudentById,
  updateStudent,
} from "../../../services/studentService";
import { getActiveDepartments } from "../../../services/departmentService";
import { getActiveCourses } from "../../../services/courseService";
import studentSchema from "../../../Validation/studentSchema";

const EditStudent = () => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    contact_no: "",
    dob: "",
    enrollment_no: "",
    department_id: "",
    department: "",
    course_id: "",
    course: "",
    semester: "",
    admission_year: "",
    father_name: "",
    mother_name: "",
    guardian_phone: "",
    address: "",
    status: "",
  });

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, courseRes] = await Promise.all([
          getActiveDepartments(),
          getActiveCourses(),
        ]);
        setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
        setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department_id" ? { course_id: "" } : {}),
    }));

    if (value === "") {
      setErrors((prev) => ({ ...prev, [name]: '' }));
      return;
    }

    if (errors[name]) {
      try {
        const newFormData = { ...formData, [name]: value };
        await studentSchema.validateAt(name, newFormData, { context: { isAddMode: false } });
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
      await studentSchema.validateAt(name, formData, { context: { isAddMode: false } });
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
      await studentSchema.validate(formData, { abortEarly: false, context: { isAddMode: false } });
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

      const response = await updateStudent(id, formData);

      toast.success(response.message || "Student updated successfully");

      navigate("/admin/students");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update student.");
    } finally {
      setLoading(false);
    }
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchStudent = async () => {
    try {
      setLoading(true);

      const response = await getStudentById(id);
      
      setFormData({
        full_name: response.data.full_name || "",
        email: response.data.email || "",
        contact_no: response.data.contact_no || "",
        dob: response.data.dob ? response.data.dob.split("T")[0] : "",
        enrollment_no: response.data.enrollment_no || "",
        department_id: response.data.department_id || "",
        department: response.data.department || "",
        course_id: response.data.course_id || "",
        course: response.data.course || "",
        semester: response.data.semester || "",
        admission_year: response.data.admission_year || "",
        father_name: response.data.father_name || "",
        mother_name: response.data.mother_name || "",
        guardian_phone: response.data.guardian_phone || "",
        address: response.data.address || "",
        status: response.data.status || "",
      });
    } catch (error) {
      console.error("Update Student Error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch student details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex text-slate-700">
      <Sidebar />

      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/admin/students"
              className="inline-flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:underline"
            >
              <ArrowLeft size={16} />
              Back to Students
            </Link>

            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Edit Student
            </h1>

            <p className="text-slate-400 mt-1">
              Update student profile and academic information.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm transition"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Side */}
          <div className="col-span-8">
            <StudentForm
              handleBlur={handleBlur}
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
              showPassword={false}
              submitText="Save Changes"
              onCancel={() => navigate("/admin/students")}
              errors={errors}
              departments={departments}
              courses={courses}
            />
          </div>

          {/* Right Side */}
          <div className="col-span-4 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 rounded-full bg-indigo-50 flex items-center justify-center">
                  <UserCircle2 size={90} className="text-indigo-500" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  {formData.full_name || "Student Name"}
                </h2>

                <p className="text-slate-500 mt-1">
                  {formData.enrollment_no || "Enrollment No"}
                </p>

                <span className="mt-4 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold">
                  {departments.find(d => String(d.id) === String(formData.department_id))?.department_name || formData.department || "Department"}
                </span>
              </div>
            </div>

            {/* Information Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-5">
                Student Information
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400">Enrollment No</p>
                  <p className="font-semibold text-slate-700">
                    {formData.enrollment_no || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="font-semibold text-slate-700 break-all">
                    {formData.email || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Contact</p>
                  <p className="font-semibold text-slate-700">
                    {formData.contact_no || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Course</p>
                  <p className="font-semibold text-slate-700">
                    {courses.find(c => String(c.id) === String(formData.course_id))?.course_name || formData.course || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Semester</p>
                  <p className="font-semibold text-slate-700">
                    {formData.semester || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Status</p>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold">
                    {formData.status || "Not Assigned"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditStudent;
