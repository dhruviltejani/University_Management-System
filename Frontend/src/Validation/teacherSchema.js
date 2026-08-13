import * as yup from "yup";

const today = new Date();
today.setHours(0, 0, 0, 0);

const teacherSchema = yup.object({
  full_name: yup
    .string()
    .min(2, "Full name must be at least 2 characters")
    .required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().when("$isAddMode", ([isAddMode], schema) => {
    return isAddMode
      ? schema
          .min(6, "Password must be at least 6 characters")
          .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
          .matches(/[a-z]/, "Password must contain at least one lowercase letter")
          .matches(/[0-9]/, "Password must contain at least one digit")
          .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Password must contain at least one special character"
          )
          .required("Password is required")
      : schema.nullable().notRequired();
  }),
  contact_no: yup
    .string()
    .matches(/^[0-9]{10}$/, "Contact number must be exactly 10 digits")
    .required("Contact number is required"),
  dob: yup
    .date()
    .max(today, "Date of birth must be before today")
    .typeError("Invalid date format")
    .required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
  employee_id: yup.string().required("Employee ID is required"),
  department_id: yup.string().required("Department is required"),
  designation: yup.string().required("Designation is required"),
  qualification: yup.string().required("Qualification is required"),
  specialization: yup.string().required("Specialization is required"),
  experience_years: yup
    .number()
    .typeError("Experience must be a number")
    .min(0, "Experience cannot be negative")
    .required("Experience is required"),
  joining_date: yup.date().typeError("Invalid date format").required("Joining date is required"),
  office_room: yup.string().nullable(),
  status: yup.string().required("Status is required"),
});

export default teacherSchema;
