import { z } from "zod";

const documentTypeEnum = z.enum([
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
]);

const ownerTypeEnum = z.enum([
  "APPLICANT",
  "STUDENT",
  "FATHER",
  "MOTHER",
  "CO_APPLICANT",
  "GUARDIAN",
]);

const employmentTypeEnum = z.enum([
  "SALARIED",
  "SELF_EMPLOYED",
  "BUSINESS",
  "FARMER",
  "CONTRACT",
  "RETIRED",
  "OTHER",
]);

const loanRequiredDocumentSchema = z.object({
  loanTypeId: z.uuid(),

  documentType: documentTypeEnum,

  ownerType: ownerTypeEnum,

  employmentType: employmentTypeEnum.nullable().optional(),

  isMandatory: z.boolean().default(true),
});

export const createLoanRequiredDocumentSchema = loanRequiredDocumentSchema;

export const updateLoanRequiredDocumentSchema =
  loanRequiredDocumentSchema.partial();
