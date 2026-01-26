import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup.string().min(2, "Name is too short").required("Name is required"),

  email: yup.string().email("Invalid email").required("Email is required"),

  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});
