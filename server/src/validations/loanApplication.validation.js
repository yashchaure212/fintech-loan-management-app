import { z } from "zod";

export const createLoanApplicationSchema = z.object({
  loanTypeId: z.uuid("Invalid loan type id"),
});

export const updateLoanApplicationSchema = z.object({
  currentStep: z
    .number()
    .int()
    .min(1)
    .max(7)
    .optional(),

  loanAmount: z
    .number()
    .positive("Loan amount must be greater than zero")
    .optional(),

  tenureMonths: z
    .number()
    .int()
    .positive("Tenure must be greater than zero")
    .optional(),
});

export const submitLoanApplicationSchema = z.object({
  infoAccuracyConsent: z.boolean().optional(),
  infoVerificationConsent: z.boolean().optional(),
  documentVerificationConsent: z.boolean().optional(),
  termsAccepted: z.boolean().optional(),
  privacyPolicyAccepted: z.boolean().optional(),
});