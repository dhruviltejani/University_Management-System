import * as yup from "yup";

const subjectSchema = yup.object({
  subject_code: yup.string().required("Subject code is required"),
  subject_name: yup.string().required("Subject name is required"),
  course_id: yup.string().required("Course is required"),
  semester: yup
    .number()
    .typeError("Semester must be a number")
    .min(1, "Minimum semester is 1")
    .max(10, "Maximum semester is 10")
    .required("Semester is required"),
  credits: yup
    .number()
    .typeError("Credits must be a number")
    .min(0, "Minimum credits is 0")
    .max(10, "Maximum credits is 10")
    .required("Credits is required"),
  teacher_ids: yup.array().of(yup.string()).nullable(),
  status: yup.string().required("Status is required"),
});

export default subjectSchema;
