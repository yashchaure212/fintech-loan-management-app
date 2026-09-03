/*
 * The one customer-facing loan product. The backend is the authority
 * (it rejects any other product on create); this constant keeps the UI
 * consistent with that rule.
 */
export const SCHOOL_STUDENT_LOAN_CODE = "SCHOOL_STUDENT_LOAN";

/*
 * Controlled vocabularies shared by the wizard, the admin screens and
 * the API contract. These mirror the backend enums exactly - if a value
 * is added here it must also exist in Prisma and in the server-side
 * Zod schema, otherwise submission will (correctly) reject it.
 */

export const SALARY_FREQUENCIES = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "FORTNIGHTLY", label: "Fortnightly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "ANNUALLY", label: "Annually" },
];

export const SALARY_FREQUENCY_VALUES = SALARY_FREQUENCIES.map(
  (option) => option.value,
);

export const SALARY_FREQUENCY_LABELS = Object.fromEntries(
  SALARY_FREQUENCIES.map((option) => [option.value, option.label]),
);

/*
 * Residential ownership of the co-applicant's home.
 * Deliberately distinct from agricultural land ownership.
 */
export const HOME_OWNERSHIP_OPTIONS = [
  { value: "OWNED", label: "Own" },
  { value: "RENTED", label: "Rented" },
];

export const HOME_OWNERSHIP_VALUES = HOME_OWNERSHIP_OPTIONS.map(
  (option) => option.value,
);

export const HOME_OWNERSHIP_LABELS = Object.fromEntries(
  HOME_OWNERSHIP_OPTIONS.map((option) => [option.value, option.label]),
);

/*
 * Customer-facing document states. The backend sends the state and its
 * label with every checklist item; these are the fallbacks and the
 * styling hooks.
 */
export const CUSTOMER_DOCUMENT_STATE_LABELS = {
  MISSING: "Not uploaded",
  AWAITING_REVIEW: "Awaiting review",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
};
