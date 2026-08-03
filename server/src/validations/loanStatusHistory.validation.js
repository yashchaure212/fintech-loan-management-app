import { z } from "zod";

export const createLoanStatusHistorySchema = z.object({
  loanApplicationId: z.uuid(),

  status: z.enum([
    "DRAFT",
    "SUBMITTED",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "DISBURSED",
    "CLOSED",
  ]),

  remarks: z.string().trim().max(500).optional(),
});
