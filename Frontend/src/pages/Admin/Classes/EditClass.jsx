import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Admin/Sidebar";
import ClassForm from "../../../components/Admin/Class/ClassForm";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { getClassById, updateClass, assignStudents, removeStudent } from "../../../services/classService";
import { getActiveCourses } from "../../../services/courseService";
import { getTeachers } from "../../../services/teacherService";
import { getStudents } from "../../../services/studentService";
import { classSchema } from "../../../Validation/classSchema";
import AssignStudentsModal from "../../../components/Admin/Class/AssignStudentsModal";
import { Users, UserMinus, UserPlus } from "lucide-react";



const EditClass = () => {
  const { id } = useParams();
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
  const [initialLoading, setInitialLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setInitialLoading(true);
      const [classRes, coursesRes, teachersRes, studentsRes] = await Promise.all([
        getClassById(id),
        getActiveCourses(),
        getTeachers("", "", "", "Active", 1, 1000),
        getStudents("", "", "", "", "Active", id, 1, 1000)
      ]);
      
      const classData = classRes; // Adjust if your response structure is nested
      
      setFormData({
        class_name: classData.class_name || "",
        course_id: classData.course_id || "",
        semester: classData.semester || "",
        division: classData.division || "",
        mft_id: classData.mft_id || "",
      });

      const allTeachers = teachersRes.teachers || teachersRes.data || teachersRes;
      const availableTeachers = allTeachers.filter(t => !t.mft_classes || t.id === classData.mft_id);

      setCourses(coursesRes.courses || coursesRes.data || coursesRes);
      setTeachers(availableTeachers);
      setAssignedStudents(studentsRes.students || studentsRes.data || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load class data.");
      navigate("/admin/classes");
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchAssignedStudents = async () => {
    try {
      setStudentsLoading(true);
      const res = await getStudents("", "", "", "", "Active", id, 1, 1000);
      setAssignedStudents(res.students || res.data || []);
    } catch (error) {
      console.error("Failed to fetch assigned students:", error);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleAssignStudents = async (studentIds) => {
    try {
      await assignStudents(id, studentIds);
      toast.success("Students assigned successfully!");
      fetchAssignedStudents();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to assign students");
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to remove this student from the class?")) return;
    try {
      await removeStudent(id, studentId);
      toast.success("Student removed successfully!");
      fetchAssignedStudents();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to remove student");
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

      await updateClass(id, formData);
      toast.success("Class updated successfully!");
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
          "Failed to update class."
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
            <h1 className="text-3xl font-bold text-slate-900">Edit Class</h1>
            <p className="mt-2 text-slate-500">
              Update class details and class teacher assignment.
            </p>
          </div>

          {initialLoading ? (
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
              <p className="text-slate-500 text-lg font-medium">Loading class details...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <ClassForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleBlur={handleBlur}
                loading={loading}
                errors={errors}
                courses={courses}
                teachers={teachers}
                submitText="Update Class"
                onCancel={() => navigate("/admin/classes")}
                hideActions={true}
              />

              {/* Assigned Students Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-800">Assigned Students</h2>
                      <p className="text-sm text-slate-500">{assignedStudents.length} students currently in this class</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium rounded-xl transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Students
                  </button>
                </div>
                
                <div className="p-0">
                  {studentsLoading ? (
                    <div className="p-8 text-center text-slate-500">Loading students...</div>
                  ) : assignedStudents.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 bg-slate-50/50">
                      No students are assigned to this class yet.
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100">
                        <tr>
                          <th className="p-4 pl-6">Student</th>
                          <th className="p-4">Enrollment No</th>
                          <th className="p-4 text-right pr-6">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {assignedStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4 pl-6">
                              <div className="flex items-center gap-3">
                                {student.profile_photo ? (
                                  <img src={student.profile_photo} alt={student.full_name} className="w-9 h-9 rounded-full object-cover shadow-sm" />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm">
                                    {student.full_name?.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <span className="font-medium text-slate-800 block">{student.full_name}</span>
                                  <span className="text-xs text-slate-500 block">{student.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-slate-600 font-medium">{student.enrollment_no}</td>
                            <td className="p-4 pr-6 text-right">
                              <button
                                onClick={() => handleRemoveStudent(student.id)}
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center gap-2"
                                title="Remove Student"
                              >
                                <UserMinus className="w-4 h-4" />
                                <span className="text-sm font-medium">Remove</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate("/admin/classes")}
                  className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  form="class-form"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Saving..." : "Update Class"}
                </button>
              </div>
            </div>
          )}

          <AssignStudentsModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            classId={id}
            courseId={formData.course_id}
            semester={formData.semester}
            onAssign={handleAssignStudents}
          />
        </div>
      </main>
    </div>
  );
};

export default EditClass;
