import test from "node:test";
import assert from "node:assert/strict";

import { loanRequiredDocumentService } from "./loanRequiredDocument.service.js";

/*
 * These cover the rule that caused submissions to fail: what counts as
 * "supplied" when the reviewer has not looked at a document yet.
 */

const requirements = [
  {
    ownerType: "STUDENT",
    documentType: "AADHAAR_CARD",
    isMandatory: true,
    label: "Aadhaar Card",
    ownerLabel: "Student",
  },
  {
    ownerType: "STUDENT",
    documentType: "FEE_STRUCTURE",
    isMandatory: true,
    label: "Fee Structure",
    ownerLabel: "Student",
  },
  {
    ownerType: "STUDENT",
    documentType: "PREVIOUS_CLASS_RESULT",
    isMandatory: false,
    label: "Previous Class Result",
    ownerLabel: "Student",
  },
];

test("all required documents uploaded -> nothing missing", () => {
  const uploaded = [
    { ownerType: "STUDENT", documentType: "AADHAAR_CARD", status: "PENDING" },
    { ownerType: "STUDENT", documentType: "FEE_STRUCTURE", status: "VERIFIED" },
  ];

  assert.deepEqual(
    loanRequiredDocumentService.findMissingMandatoryDocuments(
      requirements,
      uploaded,
    ),
    [],
  );
});

test("a document awaiting review counts as uploaded", () => {
  const uploaded = [
    { ownerType: "STUDENT", documentType: "AADHAAR_CARD", status: "PENDING" },
    { ownerType: "STUDENT", documentType: "FEE_STRUCTURE", status: "PENDING" },
  ];

  assert.deepEqual(
    loanRequiredDocumentService.findMissingMandatoryDocuments(
      requirements,
      uploaded,
    ),
    [],
  );
});

test("a missing required document is reported", () => {
  const uploaded = [
    { ownerType: "STUDENT", documentType: "AADHAAR_CARD", status: "PENDING" },
  ];

  assert.deepEqual(
    loanRequiredDocumentService.findMissingMandatoryDocuments(
      requirements,
      uploaded,
    ),
    ["STUDENT:FEE_STRUCTURE"],
  );
});

test("a rejected document leaves its slot open", () => {
  const uploaded = [
    { ownerType: "STUDENT", documentType: "AADHAAR_CARD", status: "PENDING" },
    { ownerType: "STUDENT", documentType: "FEE_STRUCTURE", status: "REJECTED" },
  ];

  assert.deepEqual(
    loanRequiredDocumentService.findMissingMandatoryDocuments(
      requirements,
      uploaded,
    ),
    ["STUDENT:FEE_STRUCTURE"],
  );
});

test("optional documents never block submission", () => {
  const uploaded = [
    { ownerType: "STUDENT", documentType: "AADHAAR_CARD", status: "PENDING" },
    { ownerType: "STUDENT", documentType: "FEE_STRUCTURE", status: "PENDING" },
  ];

  const missing = loanRequiredDocumentService.findMissingMandatoryDocuments(
    requirements,
    uploaded,
  );

  assert.equal(missing.includes("STUDENT:PREVIOUS_CLASS_RESULT"), false);
});

test("a requirement outside the resolved list cannot block submission", () => {
  /*
   * A legacy row such as STUDENT:PAN_CARD is filtered out during
   * resolution, so it never reaches this validator and therefore can
   * never be an invisible blocker.
   */
  const uploaded = [
    { ownerType: "STUDENT", documentType: "AADHAAR_CARD", status: "PENDING" },
    { ownerType: "STUDENT", documentType: "FEE_STRUCTURE", status: "PENDING" },
  ];

  assert.deepEqual(
    loanRequiredDocumentService.findMissingMandatoryDocuments(
      requirements,
      uploaded,
    ),
    [],
  );
});

test("missing documents are described in customer language", () => {
  const described =
    loanRequiredDocumentService.describeMissingMandatoryDocuments(
      requirements,
      [],
    );

  assert.deepEqual(described, [
    "Aadhaar Card for the student",
    "Fee Structure for the student",
  ]);
});
