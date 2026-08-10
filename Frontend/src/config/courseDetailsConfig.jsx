import {
  BookOpen,
  Building2,
  CalendarDays,
  Layers3,
  FileText,
  BadgeCheck,
} from "lucide-react";
import React from "react";

const courseDetailsConfig = {
  header: {
    title: (data) => data.course_name,
    subtitle: (data) => data.course_code,
    badge: (data) => data.department,
    status: (data) => data.status || "Active",
    avatarText: (data) => {
      const name = (data.course_name || "").trim();
      return name
        ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "C";
    },
  },
  sections: [
    {
      title: "Course Information",
      fields: (data) => [
        { label: "Course Name", value: data.course_name, icon: <BookOpen size={18} /> },
        { label: "Course Code", value: data.course_code, icon: <BadgeCheck size={18} /> },
      ],
    },
    {
      title: "Academic Information",
      fields: (data) => [
        { label: "Department", value: data.department, icon: <Building2 size={18} /> },
        { label: "Duration", value: `${data.duration} Years`, icon: <CalendarDays size={18} /> },
        { label: "Total Semesters", value: data.total_semesters, icon: <Layers3 size={18} /> },
      ],
    },
    {
      title: "Description",
      fields: (data) => [
        { label: "Course Description", value: data.description, icon: <FileText size={18} /> },
      ],
    },
  ],
};

export default courseDetailsConfig;