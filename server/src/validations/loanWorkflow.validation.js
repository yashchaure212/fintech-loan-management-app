import { z } from "zod";

export const updateLoanStatusSchema = z.object({
  status: z.enum([
    "SUBMITTED",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "DISBURSED",
    "CLOSED",
  ]),

  remarks: z.string().trim().min(3).max(500),
});
