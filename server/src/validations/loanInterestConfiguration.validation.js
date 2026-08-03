import { z } from "zod";

const loanInterestConfigurationSchema = z.object({
  loanTypeId: z.uuid(),

  minAmount: z.number().positive(),

  maxAmount: z.number().positive(),

  minTenure: z.number().int().positive(),

  maxTenure: z.number().int().positive(),

  interestRate: z.number().positive().max(100),

  processingFee: z.number().min(0),

  processingFeeType: z.enum(["FIXED", "PERCENTAGE"]),

  gstPercentage: z.number().min(0).max(100),

  latePenalty: z.number().min(0).optional(),

  foreclosureCharge: z.number().min(0).optional(),

  effectiveFrom: z.coerce.date().optional(),

  effectiveTo: z.coerce.date().optional(),
});

export const createLoanInterestConfigurationSchema =
  loanInterestConfigurationSchema
    .refine((data) => data.maxAmount >= data.minAmount, {
      message: "Maximum amount must be greater than or equal to minimum amount",
      path: ["maxAmount"],
    })
    .refine((data) => data.maxTenure >= data.minTenure, {
      message: "Maximum tenure must be greater than or equal to minimum tenure",
      path: ["maxTenure"],
    })
    .refine(
      (data) => {
        if (!data.effectiveFrom || !data.effectiveTo) return true;
        return data.effectiveTo > data.effectiveFrom;
      },
      {
        message: "Effective To must be after Effective From",
        path: ["effectiveTo"],
      },
    );

// 👇 ADD THESE TWO LINES
export const updateLoanInterestConfigurationSchema =
  loanInterestConfigurationSchema.partial();

export const updateLoanInterestConfigurationStatusSchema = z.object({
  isActive: z.boolean(),
});
