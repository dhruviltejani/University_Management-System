const deleteCourseConfig = {
  title: "Delete Course",
  deleteButtonText: "Delete Course",
  warningText: "Deleting this course will permanently remove all associated information from the system.",
  warningList: [
    "Course details",
    "Academic information",
  ],
  profile: {
    avatarText: (data) => {
      const name = (data.course_name || "").trim();
      return name
        ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "C";
    },
    title: (data) => (data.course_name || "").trim() || "Unknown Course",
    subtitle: (data) => (data.course_code || "").trim(),
    badge1: (data) => (data.department || "").trim(),
    badge2: (data) => (data.status || "").trim() || "Unknown",
  },
  infoGrid: (data) => [
    { label: "Course Code", value: (data.course_code || "").trim() },
    { label: "Department", value: (data.department || "").trim() },
    { label: "Duration", value: `${data.duration} Years` || "--" },
    { label: "Status", value: (data.status || "").trim() },
  ],
};

export default deleteCourseConfig;