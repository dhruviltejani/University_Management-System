import {
  Mail,
  Phone,
  Calendar,
  Building2,
  GraduationCap,
  Award,
  Signpost,
  DoorOpen,
  IdCard,
  User,
  Transgender,
  BookOpen
} from "lucide-react";

export const teacherDetailsConfig = {
  header: {
    title: (data) => data.full_name,
    subtitle: (data) => data.designation,
    badge: (data) => data.department,
    status: (data) => data.status || "Inactive",
    avatarText: (data) => data.full_name,
  },
  sections: [
    {
      title: "Personal Information",
      fields: (data) => [
        { label: "Email", value: data.email, icon: <Mail size={18} /> },
        { label: "Phone Number", value: data.contact_no, icon: <Phone size={18} /> },
        { label: "Gender", value: data.gender, icon: <Transgender size={18} /> },
        { label: "Date of Birth", value: data.dob?.slice(0, 10), icon: <Calendar size={18} /> },
      ],
    },
    {
      title: "Professional Information",
      fields: (data) => [
        { label: "Employee ID", value: data.employee_id, icon: <IdCard size={18} /> },
        { label: "Department", value: data.department, icon: <Building2 size={18} /> },
        { label: "Qualification", value: data.qualification, icon: <GraduationCap size={18} /> },
        { label: "Specialization", value: data.specialization, icon: <Award size={18} /> },
        { label: "Designation", value: data.designation, icon: <Signpost size={18} /> },
        { label: "Office Room", value: data.office_room, icon: <DoorOpen size={18} /> },
        { label: "MFT Class(es)", value: data.mft_classes || "-", icon: <BookOpen size={18} /> },
      ],
    },
  ],
};