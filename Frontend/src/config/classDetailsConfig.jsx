import { School, User, BookOpen, Layers } from "lucide-react";

export const classDetailsConfig = {
  header: {
    title: (data) => data?.class_name || "Unknown Class",
    subtitle: (data) => `${data?.course_name || "No Course"} - Semester ${data?.semester}`,
    badge: (data) => data?.department_name,
    status: (data) => "Active",
    avatarText: (data) => data?.class_name,
  },
  sections: [
    {
      title: "Class Information",
      fields: (data) => [
        {
          label: "Course",
          value: data?.course_name,
          icon: <BookOpen size={18} />,
        },
        {
          label: "Department",
          value: data?.department_name,
          icon: <School size={18} />,
        },
        {
          label: "Semester",
          value: data?.semester,
          icon: <Layers size={18} />,
        },
        {
          label: "Division",
          value: data?.division,
          icon: <Layers size={18} />,
        },
      ],
    },
    {
      title: "Assigned Faculty",
      fields: (data) => [
        {
          label: "Class Teacher (MFT)",
          value: data?.mft_name || "Not Assigned",
          icon: <User size={18} />,
        },
      ],
    },
  ],
};
