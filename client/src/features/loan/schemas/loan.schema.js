import { z } from "zod";

export const loanSchema = z.object({
  loanTypeId: z.string().min(1, "Select loan type"),

  loanAmount: z.coerce.number().positive("Enter valid amount"),

  tenureMonths: z.coerce.number().int().positive("Enter valid tenure"),
});
