import { z } from "zod";

const parentEmploymentSchema = z.object({
  employmentType: z.enum([
    "SALARIED",
    "SELF_EMPLOYED",
    "BUSINESS",
    "FARMER",
    "CONTRACT",
    "RETIRED",
    "OTHER",
  ]),
  companyName: z.string().trim().min(1).optional(),
  designation: z.string().trim().min(1).optional(),
  monthlyIncome: z.number().nonnegative().optional(),
  experienceYears: z.number().int().nonnegative().optional(),
  businessName: z.string().trim().min(1).optional(),
  businessType: z.string().trim().min(1).optional(),
  annualTurnover: z.number().nonnegative().optional(),
  annualIncome: z.number().nonnegative().optional(),
  landHoldingAcres: z.number().nonnegative().optional(),
  cropType: z.string().trim().min(1).optional(),
  agriculturalIncome: z.number().nonnegative().optional(),
  employerName: z.string().trim().min(1).optional(),
  contractDurationMonths: z.number().int().positive().optional(),
  occupation: z.string().trim().min(1).optional(),
});

const parentSchema = z.object({
  relation: z.enum(["FATHER", "MOTHER"]),
  fullName: z.string().trim().min(2).max(100),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  aadhaarNumber: z
    .string()
    .regex(/^\d{12}$/, "Aadhaar number must contain 12 digits")
    .optional(),
  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN number")
    .optional(),
  isCoApplicant: z.boolean().default(false),
  employment: parentEmploymentSchema.optional(),
});

export const createStudentLoanSchema = z.object({
  studentName: z.string().trim().min(2).max(100),
  dateOfBirth: z.coerce.date(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  email: z.email(),
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
  parents: z.array(parentSchema).max(2).optional(),
});

export const updateStudentLoanSchema = createStudentLoanSchema.partial();

export const updateParentEmploymentSchema = parentEmploymentSchema;
