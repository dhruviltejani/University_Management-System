import { useState , useEffect } from "react";
import { ArrowLeft, Save, UserCircle2 } from "lucide-react";
import { Link , useNavigate , useParams } from "react-router-dom";
import Sidebar from "../../../components/Admin/sidebar";
import TeacherForm from "../../../components/Admin/Teacher/TeacherForm";
import {
  getTeacherById,
  updateTeacher,
} from "../../../services/teacherService";
import teacherSchema from "../../../Validation/teacherSchema";
import { getActiveDepartments } from "../../../services/departmentService";

const EditTeacher = () => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    contact_no: "",
    dob: "",
    employee_id: "",
    department_id: "",
    department: "",
    designation: "",
    qualification: "",
    specialization: "",
    gender:"",
    experience_years: "",
    joining_date: "",
    office_room: "",
    status: "",
  });

  const [departments, setDepartments] = useState([]);

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await teacherSchema.validate(formData, { abortEarly: false, context: { isAddMode: false } });
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

    const response = await updateTeacher(id, formData);

    alert(response.message);

    navigate("/admin/teachers");

  } catch (error) {
    console.error(error);

    alert("Failed to update teacher.");
  } finally {
    setLoading(false);
  }
};

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchTeacher = async () => {
  try {
    setLoading(true);

    const response = await getTeacherById(id);
    console.log(response.data); //delete this after testing

    setFormData({
      full_name: response.data.full_name || "",
      email: response.data.email || "",
      contact_no: response.data.contact_no || "",
      dob: response.data.dob
        ? response.data.dob.split("T")[0]
        : "",

      employee_id: response.data.employee_id || "",
      department_id: response.data.department_id || "",
      department: response.data.department || "",
      designation: response.data.designation || "",
      qualification: response.data.qualification || "",
      specialization: response.data.specialization || "",
      gender: response.data.gender || "",
      experience_years:
        response.data.experience_years || "",
      joining_date: response.data.joining_date
        ? response.data.joining_date.split("T")[0]
        : "",
      office_room: response.data.office_room || "",
      status: response.data.status || "",
    });
  } catch (error) {
  console.error("Update Teacher Error:", error);

  console.log("Response:", error.response);
  console.log("Data:", error.response?.data);

  alert(error.response?.data?.message || "Failed to update teacher.");
}
  finally {
    setLoading(false);
  }
};



useEffect(() => {
  fetchTeacher();
}, [id]);

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex text-slate-700">

      <Sidebar />

      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8 space-y-6">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <Link
              to="/admin/teachers"
              className="inline-flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:underline"
            >
              <ArrowLeft size={16} />
              Back to Teachers
            </Link>

            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Edit Teacher
            </h1>

            <p className="text-slate-400 mt-1">
              Update teacher profile and professional information.
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

            <TeacherForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
              showPassword={false}
              submitText="save Changes"
              onCancel={() => navigate("/admin/teachers")}
              errors={errors}
              departments={departments}
            />

          </div>

          {/* Right Side */}

          <div className="col-span-4 space-y-6">

            {/* Profile Card */}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

              <div className="flex flex-col items-center">

                <div className="w-28 h-28 rounded-full bg-indigo-50 flex items-center justify-center">

                  <UserCircle2
                    size={90}
                    className="text-indigo-500"
                  />

                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  {formData.full_name || "Teacher Name"}
                </h2>

                <p className="text-slate-500 mt-1">
                  {formData.designation || "Designation"}
                </p>

                <span className="mt-4 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold">
                  {departments.find(d => String(d.id) === String(formData.department_id))?.department_name || formData.department || "Department"}
                </span>

              </div>

            </div>

            {/* Information Card */}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

              <h3 className="text-sm font-bold text-slate-900 mb-5">
                Teacher Information
              </h3>

              <div className="space-y-4">

                <div>
                  <p className="text-xs text-slate-400">
                    Employee ID
                  </p>

                  <p className="font-semibold text-slate-700">
                    {formData.employee_id || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Email
                  </p>

                  <p className="font-semibold text-slate-700 break-all">
                    {formData.email || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Contact
                  </p>

                  <p className="font-semibold text-slate-700">
                    {formData.contact_no || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Experience
                  </p>

                  <p className="font-semibold text-slate-700">
                    {formData.experience_years
                      ? `${formData.experience_years} Years`
                      : "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Office Room
                  </p>

                  <p className="font-semibold text-slate-700">
                    {formData.office_room || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Status
                  </p>

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

export default EditTeacher;