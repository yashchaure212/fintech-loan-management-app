import { z } from "zod";

export const createLoanApplicationSchema = z.object({
  loanTypeId: z.uuid(),

  loanAmount: z.number().positive("Loan amount must be greater than zero"),

  tenureMonths: z.number().int().positive("Tenure must be greater than zero"),
});
