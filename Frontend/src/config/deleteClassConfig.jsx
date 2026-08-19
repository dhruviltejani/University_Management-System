export const deleteClassConfig = {
  title: "Delete Class",
  deleteButtonText: "Delete Class",
  warningText: "Deleting this class will permanently remove the class and its configuration.",
  warningList: [
    "Class details and division mapping",
    "Class Teacher (MFT) assignments",
    "Student class enrollments will become orphaned",
  ],
  profile: {
    avatarText: (data) => data?.class_name || "C",
    title: (data) => data?.class_name || "Unknown Class",
    subtitle: (data) => `${data?.course_name || "No Course"} - Semester ${data?.semester}`,
    badge1: (data) => data?.department_name,
    badge2: () => "Active",
  },
  infoGrid: (data) => [
    { label: "Course", value: data?.course_name || "--" },
    { label: "Department", value: data?.department_name || "--" },
    { label: "Semester", value: data?.semester || "--" },
    { label: "Division", value: data?.division || "--" },
  ],
};
