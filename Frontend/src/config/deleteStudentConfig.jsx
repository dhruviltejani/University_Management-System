export const deleteStudentConfig = {
  title: "Delete Student",
  deleteButtonText: "Delete Student",
  warningText: "Deleting this student will permanently remove all student information from the system.",
  warningList: [
    "Student profile",
    "Academic information",
    "Guardian information",
    "Login access",
  ],
  profile: {
    avatarText: (data) =>
      data.full_name
        ? data.full_name.trim().split(" ").map((name) => name[0]).join("").slice(0, 2).toUpperCase()
        : "S",
    title: (data) => data.full_name,
    subtitle: (data) => `Enrollment No: ${data.enrollment_no || "--"}`,
    badge1: (data) => data.course || "--",
    badge2: (data) => data.status || "Inactive",
  },
  infoGrid: (data) => [
    { label: "Enrollment Number", value: data.enrollment_no || "--" },
    { label: "Department", value: data.department || "--" },
    { label: "Course", value: data.course || "--" },
    { label: "Semester", value: data.semester || "--" },
  ],
};
