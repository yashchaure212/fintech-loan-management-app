import test from "node:test";
import assert from "node:assert/strict";

import {
  CUSTOMER_DOCUMENT_STATES,
  SCHOOL_STUDENT_LOAN_CODE,
  documentLabel,
  isAllowedSchoolLoanRequirement,
  isSatisfiedCustomerDocumentState,
  isSupportedLoanTypeCode,
  toCustomerDocumentState,
} from "./loanProducts.js";

test("only School Student Loan is a supported product", () => {
  assert.equal(isSupportedLoanTypeCode(SCHOOL_STUDENT_LOAN_CODE), true);

  for (const legacy of ["STUDENT_LOAN", "EDUCATION_LOAN", "PERSONAL_LOAN"]) {
    assert.equal(isSupportedLoanTypeCode(legacy), false, legacy);
  }
});

test("student PAN is never an allowed document slot", () => {
  assert.equal(isAllowedSchoolLoanRequirement("STUDENT", "PAN_CARD"), false);
});

test("co-applicant PAN remains allowed", () => {
  for (const owner of ["FATHER", "MOTHER", "GUARDIAN"]) {
    assert.equal(isAllowedSchoolLoanRequirement(owner, "PAN_CARD"), true, owner);
  }
});

test("generic OTHER document is not part of the customer flow", () => {
  assert.equal(isAllowedSchoolLoanRequirement("STUDENT", "OTHER"), false);
  assert.equal(isAllowedSchoolLoanRequirement("FATHER", "OTHER"), false);
});

test("legacy higher-education documents are not allowed", () => {
  for (const documentType of [
    "TENTH_MARKSHEET",
    "TWELFTH_MARKSHEET",
    "ADMISSION_LETTER",
    "ENTRANCE_SCORECARD",
    "COLLEGE_ID_CARD",
    "PASSPORT",
  ]) {
    assert.equal(
      isAllowedSchoolLoanRequirement("STUDENT", documentType),
      false,
      documentType,
    );
  }
});

test("customer-facing document labels are used", () => {
  assert.equal(documentLabel("SALARY_SLIP"), "Salary Slip / Income Proof");
  assert.equal(documentLabel("BANK_STATEMENT"), "Bank Statement / Passbook");
});

test("an uploaded but unreviewed document is awaiting review, not missing", () => {
  const state = toCustomerDocumentState([{ status: "PENDING" }]);

  assert.equal(state, CUSTOMER_DOCUMENT_STATES.AWAITING_REVIEW);
  assert.equal(isSatisfiedCustomerDocumentState(state), true);
});

test("document states resolve by precedence", () => {
  assert.equal(toCustomerDocumentState([]), CUSTOMER_DOCUMENT_STATES.MISSING);

  assert.equal(
    toCustomerDocumentState([{ status: "REJECTED" }]),
    CUSTOMER_DOCUMENT_STATES.REJECTED,
  );

  assert.equal(
    toCustomerDocumentState([{ status: "REJECTED" }, { status: "PENDING" }]),
    CUSTOMER_DOCUMENT_STATES.AWAITING_REVIEW,
  );

  assert.equal(
    toCustomerDocumentState([{ status: "REJECTED" }, { status: "VERIFIED" }]),
    CUSTOMER_DOCUMENT_STATES.VERIFIED,
  );
});

test("a rejected-only slot is not satisfied", () => {
  assert.equal(
    isSatisfiedCustomerDocumentState(CUSTOMER_DOCUMENT_STATES.REJECTED),
    false,
  );
  assert.equal(
    isSatisfiedCustomerDocumentState(CUSTOMER_DOCUMENT_STATES.MISSING),
    false,
  );
});
