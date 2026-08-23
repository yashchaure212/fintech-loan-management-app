import { z } from "zod";

export const educationStudentDetailsSchema = z.object({
  studentName: z.string().trim().min(2).max(100),

  dateOfBirth: z.coerce.date(),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]),

  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

  email: z.string().email(),

  aadhaarNumber: z
    .string()
    .regex(/^\d{12}$/, "Aadhaar number must contain 12 digits")
    .optional()
    .or(z.literal("")),

  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN number")
    .optional()
    .or(z.literal("")),

  courseName: z.string().trim().min(1).max(200),

  collegeName: z.string().trim().min(1).max(200),

  universityName: z.string().trim().min(1).max(200),

  studyCountry: z.string().trim().min(1).max(100),

  courseDurationMonths: z.coerce.number().int().positive(),

  admissionStatus: z.enum(["APPLIED", "CONFIRMED"]),

  estimatedCourseFee: z.coerce.number().positive(),
});
