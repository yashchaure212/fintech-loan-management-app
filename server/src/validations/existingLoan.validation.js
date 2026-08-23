import { z } from "zod";

const existingLoanSchema = z.object({
  loanTypeLabel: z.string().trim().min(1).max(100),
  lenderName: z.string().trim().min(1).max(150),
  loanAccountNumber: z.string().trim().optional(),
  originalAmount: z.number().positive(),
  outstandingAmount: z.number().nonnegative(),
  emiAmount: z.number().nonnegative(),
  interestRate: z.number().nonnegative().optional(),
  startDate: z.coerce.date().optional(),
  originalTenureMonths: z.number().int().positive().optional(),
  remainingTenureMonths: z.number().int().nonnegative().optional(),
  missedPaymentsCount: z.number().int().nonnegative().optional(),
  lastEmiPaymentDate: z.coerce.date().optional(),
  status: z.enum(["ACTIVE", "CLOSED", "DELINQUENT"]).optional(),
});

export const createExistingLoanSchema = existingLoanSchema;

export const updateExistingLoanSchema = existingLoanSchema.partial();
