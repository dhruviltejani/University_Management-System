export const deleteTeacherConfig = {
  title: "Delete Teacher",
  deleteButtonText: "Delete Teacher",
  warningText: "Deleting this teacher will permanently remove all associated professional information from the system.",
  warningList: [
    "Teacher profile",
    "Professional information",
    "Login access",
    "Assigned records (if any)",
  ],
  profile: {
    avatarText: (data) => {
      const name = (data.full_name || data.name || "").trim();
      return name
        ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "T";
    },
    title: (data) => (data.full_name || data.name || "").trim() || "Unknown Teacher",
    subtitle: (data) => (data.designation || "").trim(),
    badge1: (data) => (data.department || "").trim(),
    badge2: (data) => (data.status || "").trim() || "Unknown",
  },
  infoGrid: (data) => [
    { label: "Employee ID", value: (data.employee_id || data.teacher_id || data.id || "").toString().trim() || "--" },
    { label: "Department", value: (data.department || "").trim() },
    { label: "Designation", value: (data.designation || "").trim() },
    { label: "Status", value: (data.status || "").trim() },
  ],
};
