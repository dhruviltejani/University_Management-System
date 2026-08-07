export const deleteDepartmentConfig = {
  title: "Delete Department",
  deleteButtonText: "Delete Department",
  warningText: "Deleting this department will permanently remove all department information from the system.",
  warningList: [
    "Department profile",
    "Associated courses",
    "HOD assignment",
    "Department records",
  ],
  profile: {
    avatarText: (data) =>
      data.department_name
        ? data.department_name.trim().split(" ").map((name) => name[0]).join("").slice(0, 2).toUpperCase()
        : "D",
    title: (data) => data.department_name,
    subtitle: (data) => `Code: ${data.department_code || "--"}`,
    badge1: (data) => data.hod_name || "No HOD",
    badge2: (data) => data.status || "Inactive",
  },
  infoGrid: (data) => [
    { label: "Department Code", value: data.department_code || "--" },
    { label: "Head of Department", value: data.hod_name || "Not Assigned" },
    { label: "Email", value: data.email || "--" },
    { label: "Phone", value: data.phone || "--" },
  ],
};
