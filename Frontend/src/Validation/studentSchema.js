import * as yup from "yup";

const today = new Date();
today.setHours(0, 0, 0, 0);

const studentSchema = yup.object({
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
  enrollment_no: yup.string().required("Enrollment number is required"),
  department_id: yup.string().required("Department is required"),
  course_id: yup.string().required("Course is required"),
  semester: yup
    .number()
    .typeError("Semester must be a number")
    .min(1, "Semester must be at least 1")
    .max(20, "Semester cannot exceed 20")
    .required("Semester is required"),
  admission_year: yup
    .number()
    .typeError("Admission year must be a number")
    .min(2000, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .required("Admission year is required"),


  father_name:  yup.string()
    .min(2, "Father name must be at least 2 characters")
    .required("Father name is required"),


  mother_name: yup.string()
    .min(2, "Mother name must be at least 2 characters")
    .required("Mother name is required"),

  guardian_phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Contact number must be exactly 10 digits")
    .required("Guardian phone is required"),
  address: yup.string().required("Address is required"),
  status: yup.string().required("Status is required"),
});

export default studentSchema;
