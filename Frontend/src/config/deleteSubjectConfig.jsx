const deleteSubjectConfig = {
  title: "Delete Subject",
  deleteButtonText: "Delete Subject",
  warningText: "Deleting this subject will permanently remove all associated information from the system.",
  warningList: [
    "Subject details",
    "Assigned teachers",
  ],
  profile: {
    avatarText: (data) => {
      const name = (data?.subject_name || "").trim();
      return name
        ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "S";
    },
    title: (data) => (data?.subject_name || "").trim() || "Unknown Subject",
    subtitle: (data) => (data?.subject_code || "").trim(),
    badge1: (data) => (data?.course || "").trim(),
    badge2: (data) => (data?.status || "").trim() || "Unknown",
  },
  infoGrid: (data) => [
    { label: "Subject Code", value: (data?.subject_code || "").trim() },
    { label: "Course", value: (data?.course || "").trim() },
    { label: "Semester", value: data?.semester || "--" },
    { label: "Status", value: (data?.status || "").trim() },
  ],
};

export default deleteSubjectConfig;
