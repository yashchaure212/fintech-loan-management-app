import { z } from "zod";

const loanRequiredDocumentSchema = z.object({
  loanTypeId: z.uuid(),

  documentType: z.enum([
    "PAN_CARD",
    "AADHAAR_CARD",
    "SALARY_SLIP",
    "BANK_STATEMENT",
    "PHOTO",
  ]),

  isMandatory: z.boolean().default(true),
});

export const createLoanRequiredDocumentSchema = loanRequiredDocumentSchema;

export const updateLoanRequiredDocumentSchema =
  loanRequiredDocumentSchema.partial();
