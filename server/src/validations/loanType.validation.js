import { z } from "zod";

export const createLoanTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Loan name must be at least 3 characters")
    .max(100, "Loan name cannot exceed 100 characters"),

  code: z
    .string()
    .trim()
    .min(3, "Loan code is required")
    .max(50, "Loan code cannot exceed 50 characters")
    .regex(
      /^[A-Z_]+$/,
      "Loan code must contain only uppercase letters and underscores",
    ),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  category: z.enum(["SECURED", "UNSECURED"]),

  icon: z.string().trim().optional(),

  displayOrder: z.number().int().min(0).optional(),
});

export const updateLoanTypeSchema = createLoanTypeSchema.partial();

export const updateLoanStatusSchema = z.object({
  isActive: z.boolean(),
});
