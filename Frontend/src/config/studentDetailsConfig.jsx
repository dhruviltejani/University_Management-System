import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Building2,
  BookOpen,
  Users,
} from "lucide-react";

export const studentDetailsConfig = {
  header: {
    title: (data) => data.full_name,
    subtitle: (data) => data.enrollment_no,
    badge: (data) => data.department,
    status: (data) => data.status || "Inactive",
    avatarText: (data) => data.full_name,
  },
  sections: [
    {
      title: "Personal Information",
      fields: (data) => [
        { label: "Email", value: data.email, icon: <Mail size={18} /> },
        { label: "Contact", value: data.contact_no, icon: <Phone size={18} /> },
        { label: "Date of Birth", value: data.dob, icon: <Calendar size={18} /> },
        { label: "Address", value: data.address, icon: <MapPin size={18} /> },
      ],
    },
    {
      title: "Academic Information",
      fields: (data) => [
        { label: "Course", value: data.course, icon: <GraduationCap size={18} /> },
        { label: "Department", value: data.department, icon: <Building2 size={18} /> },
        { label: "Semester", value: `Semester ${data.semester}`, icon: <BookOpen size={18} /> },
        { label: "Admission Year", value: data.admission_year, icon: <Calendar size={18} /> },
      ],
    },
    {
      title: "Guardian Information",
      fullWidth: true,
      fields: (data) => [
        { label: "Father", value: data.father_name, icon: <Users size={18} /> },
        { label: "Mother", value: data.mother_name, icon: <Users size={18} /> },
        { label: "Guardian Contact", value: data.guardian_phone, icon: <Phone size={18} /> },
      ],
    },
  ],
};
