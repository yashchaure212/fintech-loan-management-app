import assert from "node:assert/strict";
import test from "node:test";
import { generateEmiSchedule } from "./generateEmiSchedule.js";

test("last installment closes remaining principal", () => {
  const schedule = generateEmiSchedule({
    principal: 12000,
    annualInterestRate: 12,
    tenureMonths: 3,
    disbursedAt: new Date("2026-01-01"),
  });

  assert.equal(schedule.length, 3);
  assert.equal(schedule.at(-1).closingPrincipal, 0);
  assert.equal(
    schedule.reduce((sum, row) => sum + row.principalAmount, 0).toFixed(2),
    "12000.00",
  );
});
