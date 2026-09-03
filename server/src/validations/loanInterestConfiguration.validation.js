import { z } from "zod";

/*
 * Pricing input is validated strictly: every financial value must be
 * present, non-negative and within a sane bound before it can become
 * a new configuration version.
 */

const versionShape = z.object({
  loanTypeId: z.uuid(),

  minAmount: z.number().positive("Minimum loan amount must be greater than 0"),

  maxAmount: z.number().positive("Maximum loan amount must be greater than 0"),

  minTenure: z
    .number()
    .int()
    .positive("Minimum tenure must be at least 1 month"),

  maxTenure: z
    .number()
    .int()
    .positive("Maximum tenure must be at least 1 month"),

  interestRate: z
    .number()
    .min(0, "Interest rate cannot be negative")
    .max(100, "Interest rate cannot exceed 100%"),

  processingFee: z.number().min(0, "Processing fee cannot be negative"),

  processingFeeType: z.enum(["FIXED", "PERCENTAGE"]),

  gstPercentage: z
    .number()
    .min(0, "GST cannot be negative")
    .max(100, "GST cannot exceed 100%"),

  latePenalty: z
    .number()
    .min(0, "Late payment penalty cannot be negative")
    .nullish(),

  foreclosureCharge: z
    .number()
    .min(0, "Foreclosure charge cannot be negative")
    .nullish(),

  effectiveFrom: z.coerce.date().optional(),

  effectiveTo: z.coerce.date().nullish(),
});

function withRangeRules(schema) {
  return schema
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
        if (!data.effectiveFrom || !data.effectiveTo) {
          return true;
        }

        return data.effectiveTo > data.effectiveFrom;
      },
      {
        message: "Effective To must be after Effective From",
        path: ["effectiveTo"],
      },
    )
    .refine(
      (data) => {
        if (data.processingFeeType !== "PERCENTAGE") {
          return true;
        }

        return data.processingFee <= 100;
      },
      {
        message: "A percentage processing fee cannot exceed 100%",
        path: ["processingFee"],
      },
    );
}

export const createLoanInterestConfigurationSchema = withRangeRules(versionShape);

/*
 * Same contract as create: a "change" is always a new version.
 */
export const createLoanInterestConfigurationVersionSchema =
  createLoanInterestConfigurationSchema;

export const updateLoanInterestConfigurationSchema = versionShape.partial();

export const updateLoanInterestConfigurationStatusSchema = z.object({
  isActive: z.boolean(),
});
