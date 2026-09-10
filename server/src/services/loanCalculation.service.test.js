import test from "node:test";
import assert from "node:assert/strict";

import { loanCalculationService } from "./loanCalculation.service.js";

const baseConfig = {
  interestRate: 10.5,
  processingFee: 1,
  processingFeeType: "PERCENTAGE",
  gstPercentage: 18,
};

test("calculates EMI with normal interest", () => {
  const result = loanCalculationService.calculateLoan(100000, 12, baseConfig);

  assert.ok(Math.abs(result.emi - 8814.85) < 0.02, `emi was ${result.emi}`);
  assert.equal(result.totalAmount, loanCalculationService.round2(result.emi * 12));
  assert.equal(
    result.totalInterest,
    loanCalculationService.round2(result.totalAmount - 100000),
  );
  assert.equal(result.interestRate, 10.5);
});

test("zero interest does not produce NaN", () => {
  const result = loanCalculationService.calculateLoan(60000, 12, {
    ...baseConfig,
    interestRate: 0,
  });

  assert.equal(result.emi, 5000);
  assert.equal(result.totalInterest, 0);
  assert.equal(result.totalAmount, 60000);
  assert.ok(Number.isFinite(result.emi));
});

test("percentage processing fee adds GST", () => {
  const result = loanCalculationService.calculateLoan(200000, 24, baseConfig);

  assert.equal(result.processingFeeBase, 2000);
  assert.equal(result.gst, 360);
  assert.equal(result.processingFee, 2360);
});

test("fixed processing fee ignores loan amount", () => {
  const result = loanCalculationService.calculateLoan(200000, 24, {
    ...baseConfig,
    processingFee: 1500,
    processingFeeType: "FIXED",
  });

  assert.equal(result.processingFeeBase, 1500);
  assert.equal(result.gst, 270);
  assert.equal(result.processingFee, 1770);
});

test("zero GST yields no tax on the processing fee", () => {
  const result = loanCalculationService.calculateLoan(100000, 12, {
    ...baseConfig,
    gstPercentage: 0,
  });

  assert.equal(result.gst, 0);
  assert.equal(result.processingFee, result.processingFeeBase);
});

test("monetary values are rounded to two decimals", () => {
  const result = loanCalculationService.calculateLoan(133337, 17, baseConfig);

  for (const value of [
    result.emi,
    result.totalAmount,
    result.totalInterest,
    result.processingFee,
    result.gst,
  ]) {
    assert.equal(value, Math.round(value * 100) / 100);
  }
});

test("rejects invalid amounts and tenures", () => {
  const invalid = [
    [0, 12],
    [-5000, 12],
    [100000, 0],
    [100000, -6],
    [100000, 6.5],
    ["abc", 12],
  ];

  for (const [amount, tenure] of invalid) {
    assert.throws(
      () => loanCalculationService.calculateLoan(amount, tenure, baseConfig),
      { statusCode: 400 },
      `expected ${amount}/${tenure} to be rejected`,
    );
  }
});

test("rejects negative interest rate and negative fees", () => {
  assert.throws(
    () =>
      loanCalculationService.calculateLoan(100000, 12, {
        ...baseConfig,
        interestRate: -1,
      }),
    { statusCode: 400 },
  );

  assert.throws(
    () =>
      loanCalculationService.calculateLoan(100000, 12, {
        ...baseConfig,
        processingFee: -100,
      }),
    { statusCode: 400 },
  );
});
