import * as yup from "yup";

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default forgotPasswordSchema;
