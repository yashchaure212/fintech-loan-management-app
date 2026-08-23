import { z } from "zod";

export const createLoanDocumentSchema = z.object({
  loanApplicationId: z.string().uuid("Invalid loan application ID"),

  ownerType: z.enum([
    "APPLICANT",
    "STUDENT",
    "FATHER",
    "MOTHER",
    "CO_APPLICANT",
    "GUARDIAN",
  ]),

  documentType: z.enum([
    "AADHAAR_CARD",
    "PAN_CARD",
    "PHOTO",
    "BANK_STATEMENT",
    "SALARY_SLIP",
    "ADMISSION_LETTER",
    "FEE_STRUCTURE",
    "BUSINESS_PROOF",
    "BUSINESS_REGISTRATION",
    "GST_CERTIFICATE",
    "LAND_RECORD",
    "INCOME_PROOF",
    "CONTRACT_LETTER",
    "TENTH_MARKSHEET",
    "TWELFTH_MARKSHEET",
    "ENTRANCE_SCORECARD",
    "COLLEGE_ID_CARD",
    "PREVIOUS_DEGREE_CERTIFICATE",
    "PASSPORT",
    "OTHER",
    "BIRTH_CERTIFICATE",
    "ADDRESS_PROOF",
    "SCHOOL_ADMISSION_PROOF",
    "PREVIOUS_CLASS_RESULT",
    "UDYAM_CERTIFICATE",
    "LAND_LEASE_PROOF",
    "EXISTING_LOAN_STATEMENT",
    "FINANCIAL_STATEMENT",
  ]),
});

export const verifyLoanDocumentSchema = z.object({
  status: z.literal("VERIFIED"),
});

export const rejectLoanDocumentSchema = z.object({
  status: z.literal("REJECTED"),

  rejectionReason: z
    .string()
    .trim()
    .min(3, "Rejection reason is required")
    .max(500, "Rejection reason cannot exceed 500 characters"),
});
