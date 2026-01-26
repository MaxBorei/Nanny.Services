import * as yup from "yup";

export const appointmentSchema = yup
  .object({
    address: yup.string().trim().required("Address is required"),
    phone: yup
      .string()
      .trim()
      .matches(/^\+380\d{9}$/, "Phone must be +380XXXXXXXXX")
      .required("Phone is required"),
    childAge: yup.string().trim().required("Child age is required"),
    time: yup
      .string()
      .matches(/^\d{2}:\d{2}$/, "Time must be HH:MM")
      .required("Time is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    parentsName: yup.string().trim().required("Parent name is required"),
    comment: yup.string().trim().max(300, "Max 300 characters").default(""),
  })
  .required();
