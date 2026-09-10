import test from "node:test";
import assert from "node:assert/strict";

import {
  createSchoolLoanSchema,
  updateSchoolLoanSchema,
  updateCoApplicantSchema,
} from "./schoolLoan.validation.js";

const validStudent = {
  studentName: "Aarav Sharma",
  dateOfBirth: "2015-04-02",
  gender: "MALE",
  currentSchoolName: "St. Mary's High School",
  currentClass: "CLASS_5",
  academicYear: "2026-27",
};

const validCoApplicant = {
  relation: "FATHER",
  fullName: "Ravi Sharma",
  mobile: "9876543210",
};

test("a valid school student payload is accepted", () => {
  assert.equal(createSchoolLoanSchema.safeParse(validStudent).success, true);
});

test("student PAN is rejected, not silently ignored", () => {
  const result = createSchoolLoanSchema.safeParse({
    ...validStudent,
    panNumber: "ABCDE1234F",
  });

  assert.equal(result.success, false);
});

test("customer-supplied school type is rejected", () => {
  const result = createSchoolLoanSchema.safeParse({
    ...validStudent,
    schoolType: "PRIVATE",
  });

  assert.equal(result.success, false);
});

test("expected disbursement date is rejected", () => {
  const result = updateSchoolLoanSchema.safeParse({
    expectedDisbursementDate: "2026-10-01",
  });

  assert.equal(result.success, false);
});

test("home ownership accepts OWNED and RENTED", () => {
  for (const value of ["OWNED", "RENTED"]) {
    const result = updateCoApplicantSchema.safeParse({
      ...validCoApplicant,
      homeOwnership: value,
    });

    assert.equal(result.success, true, value);
  }
});

test("home ownership rejects land-tenure values", () => {
  for (const value of ["LEASED", "PARTIALLY_OWNED_LEASED", "MORTGAGED"]) {
    const result = updateCoApplicantSchema.safeParse({
      ...validCoApplicant,
      homeOwnership: value,
    });

    assert.equal(result.success, false, value);
  }
});

test("salary frequency accepts the controlled vocabulary", () => {
  for (const value of [
    "MONTHLY",
    "WEEKLY",
    "FORTNIGHTLY",
    "QUARTERLY",
    "ANNUALLY",
  ]) {
    const result = updateCoApplicantSchema.safeParse({
      ...validCoApplicant,
      employment: {
        employmentType: "SALARIED",
        salaryFrequency: value,
        salaryAccountBank: "HDFC Bank",
      },
    });

    assert.equal(result.success, true, value);
  }
});

test("invalid salary frequency is rejected", () => {
  const result = updateCoApplicantSchema.safeParse({
    ...validCoApplicant,
    employment: {
      employmentType: "SALARIED",
      salaryFrequency: "DAILY",
    },
  });

  assert.equal(result.success, false);
});

test("salaried employment requires a salary frequency", () => {
  const result = updateCoApplicantSchema.safeParse({
    ...validCoApplicant,
    employment: { employmentType: "SALARIED" },
  });

  assert.equal(result.success, false);
  assert.match(
    result.error.issues.map((issue) => issue.message).join(" "),
    /Salary frequency is required/i,
  );
});

test("non-salaried employment does not require a salary frequency", () => {
  const result = updateCoApplicantSchema.safeParse({
    ...validCoApplicant,
    employment: { employmentType: "FARMER", landOwnership: "LEASED" },
  });

  assert.equal(result.success, true);
});

test("salary account bank is stored separately from the bank account number", () => {
  const result = updateCoApplicantSchema.safeParse({
    ...validCoApplicant,
    bankAccountNumber: "12345678901",
    ifscCode: "HDFC0001234",
    employment: {
      employmentType: "SALARIED",
      salaryFrequency: "MONTHLY",
      salaryAccountBank: "ICICI Bank",
    },
  });

  assert.equal(result.success, true);
  assert.equal(result.data.employment.salaryAccountBank, "ICICI Bank");
  assert.equal(result.data.bankAccountNumber, "12345678901");
});
