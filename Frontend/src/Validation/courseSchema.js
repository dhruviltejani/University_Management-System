import * as yup from "yup";

const courseSchema = yup.object({
  course_code: yup.string().required("Course code is required"),
  course_name: yup.string().required("Course name is required"),
  department_id: yup.string().required("Department is required"),
  duration: yup
    .number()
    .typeError("Duration must be a number")
    .min(1, "Minimum duration is 1 year")
    .max(6, "Maximum duration is 6 years")
    .required("Duration is required"),
  total_semesters: yup
    .number()
    .typeError("Total semesters must be a number")
    .min(1, "Minimum is 1 semester")
    .max(10, "Maximum is 10 semesters")
    .required("Total semesters is required"),
  description: yup.string().max(500, "Description cannot exceed 500 characters").nullable(),
  status: yup.string().required("Status is required"),
});

export default courseSchema;
