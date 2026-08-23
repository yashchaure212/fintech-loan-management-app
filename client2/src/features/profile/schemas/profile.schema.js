import { z } from "zod";

/* ===========================
   PERSONAL DETAILS
=========================== */

export const personalDetailsSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  dateOfBirth: z.string().min(1, "Date of birth is required"),

  gender: z.string().min(1, "Please select gender"),

  panNumber: z
    .string()
    .trim()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number"),

  aadhaarNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{12}$/, "Aadhaar number must be 12 digits"),
});

/* ===========================
   ADDRESS
=========================== */

export const addressSchema = z.object({
  type: z.string().min(1, "Address type is required"),

  line1: z.string().trim().min(3, "Address Line 1 is required"),

  line2: z.string().trim().optional(),

  city: z.string().trim().min(2, "City is required"),

  state: z.string().trim().min(2, "State is required"),

  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),
});
