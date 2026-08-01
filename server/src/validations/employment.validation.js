import { z } from "zod";

export const employmentSchema = z.object({
  employmentType: z.enum(["SALARIED", "SELF_EMPLOYED", "BUSINESS"]),

  companyName: z.string().optional(),

  designation: z.string().optional(),

  monthlyIncome: z.number().positive(),

  experienceYears: z.number().min(0).optional(),
});
