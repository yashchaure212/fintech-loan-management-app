import { z } from "zod";

const loanEligibilitySchema = z.object({
  loanTypeId: z.uuid(),

  minimumAge: z
    .number()
    .int()
    .min(18, "Minimum age must be at least 18")
    .max(100),

  maximumAge: z.number().int().min(18).max(100),

  minimumIncome: z.number().min(0, "Minimum income cannot be negative"),

  minimumExperience: z.number().int().min(0).optional(),

  minimumCreditScore: z.number().int().min(300).max(900).optional(),
});

export const createLoanEligibilitySchema = loanEligibilitySchema.refine(
  (data) => data.maximumAge >= data.minimumAge,
  {
    message: "Maximum age must be greater than or equal to minimum age",
    path: ["maximumAge"],
  },
);

export const updateLoanEligibilitySchema = loanEligibilitySchema.partial();
