import assert from "node:assert/strict";
import test from "node:test";

import { loanCalculationService } from "../services/loanCalculation.service.js";

test("calculates EMI for a standard reducing-balance loan", () => {
  const result = loanCalculationService.calculateLoan(100000, 12, {
    interestRate: 12,
    processingFeeType: "FIXED",
    processingFee: 0,
    gstPercentage: 0,
  });

  assert.equal(result.emi, 8884.88);
  assert.ok(Math.abs(result.totalAmount - result.emi * 12) < 0.02);
  assert.ok(
    Math.abs(result.totalInterest - (result.totalAmount - 100000)) < 0.02,
  );
});
