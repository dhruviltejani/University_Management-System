import * as Yup from "yup";

export const classSchema = Yup.object().shape({
  class_name: Yup.string()
    .required("Class name is required")
    .max(50, "Class name cannot exceed 50 characters"),
  course_id: Yup.string().required("Course is required"),
  semester: Yup.number()
    .typeError("Semester is required")
    .required("Semester is required")
    .min(1, "Semester must be at least 1")
    .max(10, "Semester cannot exceed 10"),
  division: Yup.string().max(10, "Division cannot exceed 10 characters"),
  mft_id: Yup.string().nullable(),
});
