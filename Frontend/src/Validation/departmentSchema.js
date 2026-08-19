import * as yup from "yup";

const departmentSchema = yup.object({
  department_name: yup.string().required("Department name is required"),
  department_code: yup.string().required("Department code is required"),
  hod_name: yup.string().required("HOD name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Contact number must be exactly 10 digits")
    .required("Contact number is required"),
  office_location: yup.string().required("Office location is required"),
  description: yup.string().max(500, "Description cannot exceed 500 characters").nullable(),
  status: yup.string().required("Status is required"),
});

export default departmentSchema;
