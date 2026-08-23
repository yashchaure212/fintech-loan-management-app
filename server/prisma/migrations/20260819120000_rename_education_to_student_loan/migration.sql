-- Rename the higher-education product (Education Loan) to Student Loan.
-- Kept idempotent because Neon may already contain a separate SCHOOL_STUDENT_LOAN product.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'education_loan_applications'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'student_loan_applications'
  ) THEN
    ALTER TABLE "education_loan_applications" RENAME TO "student_loan_applications";
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'parent_details'
      AND column_name = 'educationLoanApplicationId'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'parent_details'
      AND column_name = 'studentLoanApplicationId'
  ) THEN
    ALTER TABLE "parent_details" RENAME COLUMN "educationLoanApplicationId" TO "studentLoanApplicationId";
  END IF;
END $$;

ALTER INDEX IF EXISTS "parent_details_educationLoanApplicationId_idx"
  RENAME TO "parent_details_studentLoanApplicationId_idx";

ALTER INDEX IF EXISTS "parent_details_educationLoanApplicationId_relation_key"
  RENAME TO "parent_details_studentLoanApplicationId_relation_key";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'parent_details_educationLoanApplicationId_fkey'
  ) THEN
    ALTER TABLE "parent_details"
      RENAME CONSTRAINT "parent_details_educationLoanApplicationId_fkey"
      TO "parent_details_studentLoanApplicationId_fkey";
  END IF;
END $$;

ALTER TABLE "loan_documents"
  ADD COLUMN IF NOT EXISTS "resourceType" TEXT NOT NULL DEFAULT 'image';

UPDATE "loan_types"
SET
  "code" = 'STUDENT_LOAN',
  "name" = 'Student Loan',
  "description" = 'Finance tuition and other costs for higher education.'
WHERE "code" = 'EDUCATION_LOAN';
