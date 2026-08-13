import * as yup from "yup";

const today = new Date();

// Remove time part so comparison is only by date
today.setHours(0, 0, 0, 0);

const signupSchema = yup.object({
  full_name: yup
    .string()
    .min(2, "Full name must be at least 2 characters")
    .required("Full name is required"),

  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),

  dob: yup
    .date()
    .max(today, "Date of birth must be before today")
    .required("Date of birth is required"),

  contact_no: yup
    .string()
    .matches(/^[0-9]{10}$/, "Contact number must be exactly 10 digits")
    .required("Contact number is required"),

  password: yup
  .string()
  .min(6, "Password must be at least 6 characters")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[0-9]/, "Password must contain at least one digit")
  .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
  )
  .required("Password is required"),
});

export default signupSchema;