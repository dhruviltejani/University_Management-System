import {
  BookOpen,
  Building2,
  CalendarDays,
  Layers3,
  BadgeCheck,
  Users
} from "lucide-react";
import React from "react";

const subjectDetailsConfig = {
  header: {
    title: (data) => data?.subject_name,
    subtitle: (data) => data?.subject_code,
    badge: (data) => data?.course,
    status: (data) => data?.status || "Active",
    avatarText: (data) => {
      const name = (data?.subject_name || "").trim();
      return name
        ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "S";
    },
  },
  sections: [
    {
      title: "Subject Information",
      fields: (data) => [
        { label: "Subject Name", value: data?.subject_name, icon: <BookOpen size={18} /> },
        { label: "Subject Code", value: data?.subject_code, icon: <BadgeCheck size={18} /> },
      ],
    },
    {
      title: "Academic Information",
      fields: (data) => [
        { label: "Course", value: data?.course, icon: <Building2 size={18} /> },
        { label: "Semester", value: `Semester ${data?.semester}`, icon: <Layers3 size={18} /> },
        { label: "Credits", value: data?.credits, icon: <CalendarDays size={18} /> },
      ],
    },
    {
      title: "Assigned Teachers",
      type: "table",
      columns: [
        { label: "Employee ID", key: "employee_id" },
        { label: "Name", key: "name" },
        { label: "Department", key: "department" },
      ],
      data: (data) => data?.teachers || [],
    },
  ],
};

export default subjectDetailsConfig;
