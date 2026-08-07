import {
  Mail,
  IdCard,
  Trophy,
  Phone,
  DoorOpen,
  ScrollText,
} from "lucide-react";

export const departmentDetailsConfig = {
  header: {
    title: (data) => data.department_name,
    subtitle: (data) => data.department_code,
    badge: (data) => data.hod_name || "No HOD Assigned",
    status: (data) => data.status || "Inactive",
    avatarText: (data) => data.department_name,
  },
  sections: [
    {
      title: "Department Information",
      fields: (data) => [
        { label: "Department Code", value: data.department_code, icon: <IdCard size={18} /> },
        { label: "Head of Department", value: data.hod_name || "Not Assigned", icon: <Trophy size={18} /> },
        { label: "Email", value: data.email, icon: <Mail size={18} /> },
        { label: "Phone", value: data.phone, icon: <Phone size={18} /> },
        { label: "Office Location", value: data.office_location, icon: <DoorOpen size={18} /> },
        { label: "Description", value: data.description || "No description available", icon: <ScrollText size={18} /> },
      ],
    },
  ],
};
