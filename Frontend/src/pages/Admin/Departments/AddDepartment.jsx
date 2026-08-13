import { useState , useEffect } from "react";
import { ArrowLeft, Save, UserCircle2 } from "lucide-react";
import { Link , useNavigate , useParams} from "react-router-dom";
import Sidebar from "../../../components/Admin/sidebar";
import DepartmentForm from "../../../components/Admin/Department/DepartmentForm";
import {
  getDepartmentById,
  updateDepartment,
} from "../../../services/departmentService";
import { createDepartment } from "../../../services/departmentService";
import departmentSchema from "../../../Validation/departmentSchema";


const AddDepartment = () => {
const { id } = useParams();

const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState({});

const [formData, setFormData] = useState({
  department_name: "",
  department_code: "",
  hod_name: "",
  email: "",
  phone: "",
  office_location: "",
  description: "",
  status: "Active",
});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await departmentSchema.validate(formData, { abortEarly: false });
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

    const response = await createDepartment(formData);

    alert(response.message);

    navigate("/admin/departments");

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to create department."
    );
  } finally {
    setLoading(false);
  }
};
  const navigate = useNavigate();

  

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FD] flex text-slate-700">

      <Sidebar />

      <main className="ml-56 flex-1 h-screen overflow-y-auto p-8 space-y-6">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <Link
              to="/admin/departments"
              className="inline-flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:underline"
            >
              <ArrowLeft size={16} />
              Back to Departments
            </Link>

            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Add Department
            </h1>

            <p className="text-slate-400 mt-1">
                Create a new department and manage its information.</p>

          </div>

          <button
            type="submit"
            form="department-form"
            disabled={loading}
            className="
                    flex items-center gap-2
                    bg-[#4F46E5]
                    hover:bg-indigo-700
                    disabled:bg-indigo-400
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                    text-white
                    px-6 py-3
                    rounded-xl
                    font-semibold
                    shadow-sm
                    transition
                    "
          >
            <Save size={18} />
            {loading ? "Adding..." : "Add Department"}
          </button>

        </div>

        {/* Main Grid */}

        <div className="grid grid-cols-12 gap-6">

          {/* Left Side */}

          <div className="col-span-8">

            <DepartmentForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
              submitText="Add Department"
              onCancel={() => navigate("/admin/departments")}
              errors={errors}
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
                  {formData.department_name || "Department Name"}
                </h2>

                <p className="text-slate-500 mt-1">
                  {formData.department_code || "Department Code"}
                </p>

                <span className="mt-4 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold">
                  {formData.hod_name || "Head of Department"}
                </span>

              </div>

            </div>

            {/* Information Card */}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

              <h3 className="text-sm font-bold text-slate-900 mb-5">
                 Department Information
              </h3>

              <div className="space-y-4">

                <div>
                  <p className="text-xs text-slate-400">
                    Department Code
                  </p>

                  <p className="font-semibold text-slate-700">
                    {formData.department_code || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Email Address
                  </p>

                  <p className="font-semibold text-slate-700 break-all">
                    {formData.email || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Contact Number
                  </p>

                  <p className="font-semibold text-slate-700">
                    {formData.phone || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Office Location
                  </p>

                  <p className="font-semibold text-slate-700">
                    {formData.office_location || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Status
                  </p>

                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                    formData.status === "Active"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {formData.status}
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

export default AddDepartment;