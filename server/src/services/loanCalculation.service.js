export const loanCalculationService = {
  calculateLoan(loanAmount, tenureMonths, config) {
    const principal = Number(loanAmount);
    const annualRate = Number(config.interestRate);

    // Monthly interest rate
    const monthlyRate = annualRate / 12 / 100;

    // EMI Formula
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    const totalAmount = emi * tenureMonths;

    const totalInterest = totalAmount - principal;

    // Processing Fee
    let processingFee = 0;

    if (config.processingFeeType === "PERCENTAGE") {
      processingFee = (principal * Number(config.processingFee)) / 100;
    } else {
      processingFee = Number(config.processingFee);
    }

    // GST on Processing Fee
    const gst = (processingFee * Number(config.gstPercentage)) / 100;

    const totalProcessingFee = processingFee + gst;

    return {
      interestRate: annualRate,

      emi: Number(emi.toFixed(2)),

      totalInterest: Number(totalInterest.toFixed(2)),

      totalAmount: Number(totalAmount.toFixed(2)),

      processingFee: Number(totalProcessingFee.toFixed(2)),

      gst: Number(gst.toFixed(2)),
    };
  },
};
