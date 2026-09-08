import { z } from "zod";

//PERSONAL DETAILS

export const personalDetailsSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long"),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required"),

  gender: z
    .string()
    .min(1, "Please select your gender"),

  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(100, "Occupation is too long"),
});

//ADDRESS

export const addressSchema = z.object({
  type: z.string().min(1, "Address type is required"),
  line1: z.string().trim().min(3, "Address Line 1 is required"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),
});
