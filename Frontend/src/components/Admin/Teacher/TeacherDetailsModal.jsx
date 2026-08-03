import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import InfoCard from "./InfoCard";

const TeacherDetailsModal = ({ teacher, onClose }) => {
  console.log("Teacher:", teacher);
  if (!teacher) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col"          initial={{ opacity: 0, scale: 0.95, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 25 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}

          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center"
          >
            <X size={18} className="text-slate-600" />
          </button>

          {/* Header */}

          <div className="p-8 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900">
              Teacher Details
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              View faculty member information.
            </p>
          </div>


          

          {/* Body */}

<div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-indigo-50 to-white">

  {/* Profile Header */}

  <div className="flex flex-col items-center text-center">

    {/* Avatar */}

    <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
      {teacher.full_name
        ?.split(" ")
        .map((name) => name[0])
        .slice(0, 2)
        .join("")}
    </div>

    {/* Name */}

    <h2 className="mt-5 text-2xl font-bold text-slate-900">
      {teacher.full_name}
    </h2>

    {/* Designation */}

    <p className="mt-1 text-slate-500">
      {teacher.designation}
    </p>

    {/* Department + Status */}

    <div className="flex items-center gap-3 mt-5">
      <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold">
        {teacher.department}
      </span>

      <span
        className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
          teacher.status === "Active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-600"
        }`}
      >
        ● {teacher.status}
      </span>
    </div>

  </div>

  {/* ---------- Personal Information ---------- */}

  <div className="mt-10">

    <h3 className="text-lg font-bold text-slate-900 mb-5">
      Personal Information
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      <InfoCard
        label="Email Address"
        value={teacher.email}
      />

      <InfoCard
        label="Phone Number"
        value={teacher.contact_no}
      />

      <InfoCard
        label="Gender"
        value={teacher.gender}
      />

      <InfoCard
        label="Date of Birth"
        value={teacher.dob.slice(0 ,10)}
      />

    </div>

  </div>

  {/* ---------- Professional Information ---------- */}

<div className="mt-10">

  <h3 className="text-lg font-bold text-slate-900 mb-5">
    Professional Information
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

    <InfoCard
      label="Employee ID"
      value={teacher.employee_id}
    />

    <InfoCard
      label="Department"
      value={teacher.department}
    />

      <InfoCard
      label="Qualification"
      value={teacher.qualification}
    />

      <InfoCard
      label="Specialization"
      value={teacher.specialization}
    />

    <InfoCard
      label="Designation"
      value={teacher.designation}
    />



      <InfoCard
      label="Office Room"
      value={teacher.office_room}
    />

  </div>

</div>

</div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TeacherDetailsModal;