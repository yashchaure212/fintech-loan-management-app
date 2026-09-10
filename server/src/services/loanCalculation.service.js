import AppError from "../utils/AppError.js";

/*
 * ============================================================
 * LOAN CALCULATION
 * ============================================================
 *
 * The backend is the only place loan pricing is computed. Values
 * arriving from a client are never used.
 *
 * Contract note: `processingFee` is the total processing charge
 * INCLUDING GST, which is what is persisted on the application and
 * shown to admins. The breakdown is returned alongside it as
 * `processingFeeBase` and `gst`.
 */

function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function toFiniteNumber(value, label) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new AppError(`${label} must be a valid number`, 400);
  }

  return parsed;
}

export const loanCalculationService = {
  round2,

  calculateEmi(principal, annualRate, tenureMonths) {
    const monthlyRate = annualRate / 12 / 100;

    /*
     * Zero-interest products divide by zero in the standard EMI
     * formula, so they are handled explicitly instead of producing NaN.
     */
    if (monthlyRate === 0) {
      return principal / tenureMonths;
    }

    const growth = Math.pow(1 + monthlyRate, tenureMonths);

    return (principal * monthlyRate * growth) / (growth - 1);
  },

  calculateProcessingFee(config, principal) {
    const configuredFee = toFiniteNumber(
      config.processingFee,
      "Processing fee",
    );

    if (configuredFee < 0) {
      throw new AppError("Processing fee cannot be negative", 400);
    }

    if (config.processingFeeType === "PERCENTAGE") {
      return (principal * configuredFee) / 100;
    }

    return configuredFee;
  },

  calculateLoan(loanAmount, tenureMonths, config) {
    const principal = toFiniteNumber(loanAmount, "Loan amount");
    const tenure = toFiniteNumber(tenureMonths, "Tenure");
    const annualRate = toFiniteNumber(config.interestRate, "Interest rate");

    if (principal <= 0) {
      throw new AppError("Loan amount must be greater than 0", 400);
    }

    if (!Number.isInteger(tenure) || tenure <= 0) {
      throw new AppError("Tenure must be a whole number of months above 0", 400);
    }

    if (annualRate < 0) {
      throw new AppError("Interest rate cannot be negative", 400);
    }

    const emi = this.calculateEmi(principal, annualRate, tenure);

    if (!Number.isFinite(emi)) {
      throw new AppError("Unable to calculate EMI for the supplied terms", 400);
    }

    const roundedEmi = round2(emi);
    const totalAmount = round2(roundedEmi * tenure);
    const totalInterest = round2(totalAmount - principal);

    const processingFeeBase = this.calculateProcessingFee(config, principal);

    const gstPercentage = toFiniteNumber(config.gstPercentage ?? 0, "GST");

    if (gstPercentage < 0) {
      throw new AppError("GST percentage cannot be negative", 400);
    }

    const gst = (processingFeeBase * gstPercentage) / 100;

    return {
      interestRate: annualRate,
      emi: roundedEmi,
      totalInterest,
      totalAmount,
      processingFeeBase: round2(processingFeeBase),
      gst: round2(gst),
      processingFee: round2(processingFeeBase + gst),
    };
  },
};
