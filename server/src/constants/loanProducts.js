/*
 * ============================================================
 * SUPPORTED LOAN PRODUCTS
 * ============================================================
 *
 * The customer-facing application supports exactly one product.
 * Legacy products (STUDENT_LOAN / EDUCATION_LOAN / personal loan)
 * may still exist in the database for historical integrity, but
 * they can never be selected for a new application.
 */

export const SCHOOL_STUDENT_LOAN_CODE = "SCHOOL_STUDENT_LOAN";

export const SUPPORTED_LOAN_TYPE_CODES = Object.freeze([
  SCHOOL_STUDENT_LOAN_CODE,
]);

export function isSupportedLoanTypeCode(code) {
  return SUPPORTED_LOAN_TYPE_CODES.includes(code);
}

/*
 * ============================================================
 * CONTROLLED VOCABULARIES
 * ============================================================
 *
 * These mirror the Prisma enums and are shared by validation,
 * services and the API contract so every layer agrees.
 */

export const SALARY_FREQUENCIES = Object.freeze([
  "MONTHLY",
  "WEEKLY",
  "FORTNIGHTLY",
  "QUARTERLY",
  "ANNUALLY",
]);

export const DEFAULT_SALARY_FREQUENCY = "MONTHLY";

export const HOME_OWNERSHIP_VALUES = Object.freeze(["OWNED", "RENTED"]);

/*
 * ============================================================
 * DOCUMENT VOCABULARY FOR SCHOOL STUDENT LOAN
 * ============================================================
 *
 * Only these document types may ever be configured, requested or
 * uploaded for a School Student Loan. A generic "OTHER" document
 * is deliberately excluded: the customer can only upload documents
 * the application actually defines.
 */

export const SCHOOL_LOAN_DOCUMENT_TYPES = Object.freeze([
  "AADHAAR_CARD",
  "BIRTH_CERTIFICATE",
  "SCHOOL_ADMISSION_PROOF",
  "FEE_STRUCTURE",
  "PREVIOUS_CLASS_RESULT",
  "PAN_CARD",
  "BANK_STATEMENT",
  "SALARY_SLIP",
  "INCOME_PROOF",
  "CONTRACT_LETTER",
  "BUSINESS_PROOF",
  "BUSINESS_REGISTRATION",
  "GST_CERTIFICATE",
  "UDYAM_CERTIFICATE",
  "LAND_RECORD",
  "LAND_LEASE_PROOF",
  "EXISTING_LOAN_STATEMENT",
]);

export function isAllowedSchoolLoanDocumentType(documentType) {
  return SCHOOL_LOAN_DOCUMENT_TYPES.includes(documentType);
}

/*
 * Slots that must never be requested even though the document type
 * itself is valid for some other owner.
 *
 *   STUDENT:PAN_CARD      - a school student does not have a PAN.
 *                           Parent/co-applicant PAN is still required.
 *   STUDENT:ADDRESS_PROOF - the address on file belongs to the
 *                           co-applicant, so the student cannot
 *                           supply one through this flow.
 */
export const DISALLOWED_SCHOOL_LOAN_SLOTS = Object.freeze([
  "STUDENT:PAN_CARD",
  "STUDENT:ADDRESS_PROOF",
]);

export function requirementKey(ownerType, documentType) {
  return `${ownerType}:${documentType}`;
}

/*
 * The single gate every layer uses to decide whether a document slot
 * belongs to the School Student Loan flow. Requirement resolution,
 * upload validation, seeding and submission all funnel through this,
 * which is what prevents a legacy row from becoming an invisible
 * mandatory requirement.
 */
export function isAllowedSchoolLoanRequirement(ownerType, documentType) {
  if (!isAllowedSchoolLoanDocumentType(documentType)) {
    return false;
  }

  return !DISALLOWED_SCHOOL_LOAN_SLOTS.includes(
    requirementKey(ownerType, documentType),
  );
}

/*
 * Customer-facing labels.
 *
 * The database enum values stay stable; only the presentation
 * changes. The backend ships these labels with every resolved
 * requirement so the customer UI never invents its own wording.
 */

export const DOCUMENT_LABELS = Object.freeze({
  AADHAAR_CARD: "Aadhaar Card",
  PAN_CARD: "PAN Card",
  PHOTO: "Photograph",
  BANK_STATEMENT: "Bank Statement / Passbook",
  SALARY_SLIP: "Salary Slip / Income Proof",
  INCOME_PROOF: "Income Proof",
  CONTRACT_LETTER: "Contract Letter",
  BIRTH_CERTIFICATE: "Birth Certificate",
  ADDRESS_PROOF: "Address Proof",
  SCHOOL_ADMISSION_PROOF: "School Admission Proof",
  PREVIOUS_CLASS_RESULT: "Previous Class Result",
  FEE_STRUCTURE: "Fee Structure",
  BUSINESS_PROOF: "Business Proof",
  BUSINESS_REGISTRATION: "Business Registration",
  GST_CERTIFICATE: "GST Certificate",
  UDYAM_CERTIFICATE: "Udyam Certificate",
  LAND_RECORD: "Land Record",
  LAND_LEASE_PROOF: "Land Lease Proof",
  EXISTING_LOAN_STATEMENT: "Existing Loan Statement",
});

export const DOCUMENT_OWNER_LABELS = Object.freeze({
  APPLICANT: "Applicant",
  STUDENT: "Student",
  FATHER: "Father",
  MOTHER: "Mother",
  GUARDIAN: "Guardian",
  CO_APPLICANT: "Co-applicant",
});

export function documentLabel(documentType) {
  return (
    DOCUMENT_LABELS[documentType] ||
    String(documentType || "")
      .toLowerCase()
      .split("_")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export function documentOwnerLabel(ownerType) {
  return DOCUMENT_OWNER_LABELS[ownerType] || ownerType;
}

/*
 * ============================================================
 * CUSTOMER-FACING DOCUMENT STATE
 * ============================================================
 *
 * Internally a document is PENDING / VERIFIED / REJECTED, which is
 * the reviewer's vocabulary. The customer must never be told an
 * uploaded document is "pending" as though it were still missing.
 *
 *   MISSING          -> nothing uploaded yet
 *   AWAITING_REVIEW  -> uploaded, internally PENDING
 *   VERIFIED         -> reviewed and accepted
 *   REJECTED         -> reviewed and rejected, replacement required
 */

export const CUSTOMER_DOCUMENT_STATES = Object.freeze({
  MISSING: "MISSING",
  AWAITING_REVIEW: "AWAITING_REVIEW",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
});

export const CUSTOMER_DOCUMENT_STATE_LABELS = Object.freeze({
  MISSING: "Not uploaded",
  AWAITING_REVIEW: "Awaiting review",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
});

/*
 * Reduce every document uploaded against one requirement slot to a
 * single customer-facing state. A non-rejected upload always counts
 * as uploaded, which is what keeps the customer UI and the submission
 * validator in agreement.
 */
export function toCustomerDocumentState(documentsForSlot = []) {
  if (documentsForSlot.some((document) => document.status === "VERIFIED")) {
    return CUSTOMER_DOCUMENT_STATES.VERIFIED;
  }

  if (documentsForSlot.some((document) => document.status === "PENDING")) {
    return CUSTOMER_DOCUMENT_STATES.AWAITING_REVIEW;
  }

  if (documentsForSlot.some((document) => document.status === "REJECTED")) {
    return CUSTOMER_DOCUMENT_STATES.REJECTED;
  }

  return CUSTOMER_DOCUMENT_STATES.MISSING;
}

export function isSatisfiedCustomerDocumentState(state) {
  return (
    state === CUSTOMER_DOCUMENT_STATES.VERIFIED ||
    state === CUSTOMER_DOCUMENT_STATES.AWAITING_REVIEW
  );
}
