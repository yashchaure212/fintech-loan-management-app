-- School Student Loan refactor
--
-- Additive + non-destructive by design:
--   * adds HomeOwnership (residential) and SalaryFrequency (controlled vocabulary) enums
--   * adds parent_details."homeOwnership"
--   * converts parent_employment."salaryFrequency" from free text to the SalaryFrequency enum
--   * adds a lookup index for effective-dated loan interest configurations
--
-- Deliberately NOT dropped (historical integrity, see refactor report):
--   * school_student_loan_applications."panNumber"                (student PAN, no longer collected)
--   * school_student_loan_applications."schoolType"               (customer-entered, superseded by institution metadata)
--   * school_student_loan_applications."expectedDisbursementDate" (no longer collected)
-- These columns are retained for existing records and are never written by new applications.

-- CreateEnum
CREATE TYPE "HomeOwnership" AS ENUM ('OWNED', 'RENTED');

-- CreateEnum
CREATE TYPE "SalaryFrequency" AS ENUM ('MONTHLY', 'WEEKLY', 'FORTNIGHTLY', 'QUARTERLY', 'ANNUALLY');

-- AlterTable
ALTER TABLE "parent_details" ADD COLUMN "homeOwnership" "HomeOwnership";

-- AlterTable
-- Free-text salary frequency is mapped onto the controlled vocabulary.
-- Unrecognised legacy values become NULL rather than blocking the migration.
ALTER TABLE "parent_employment"
  ALTER COLUMN "salaryFrequency" TYPE "SalaryFrequency"
  USING (
    CASE upper(btrim("salaryFrequency"))
      WHEN 'MONTHLY'      THEN 'MONTHLY'::"SalaryFrequency"
      WHEN 'WEEKLY'       THEN 'WEEKLY'::"SalaryFrequency"
      WHEN 'FORTNIGHTLY'  THEN 'FORTNIGHTLY'::"SalaryFrequency"
      WHEN 'BI_WEEKLY'    THEN 'FORTNIGHTLY'::"SalaryFrequency"
      WHEN 'BIWEEKLY'     THEN 'FORTNIGHTLY'::"SalaryFrequency"
      WHEN 'QUARTERLY'    THEN 'QUARTERLY'::"SalaryFrequency"
      WHEN 'ANNUALLY'     THEN 'ANNUALLY'::"SalaryFrequency"
      WHEN 'ANNUAL'       THEN 'ANNUALLY'::"SalaryFrequency"
      WHEN 'YEARLY'       THEN 'ANNUALLY'::"SalaryFrequency"
      ELSE NULL
    END
  );

-- CreateIndex
CREATE INDEX "loan_interest_config_lookup_idx"
  ON "loan_interest_configurations" ("loanTypeId", "isActive", "isDeleted", "effectiveFrom");
