-- Additive School Student Loan schema.
-- Keeps StudentLoanApplication / studentLoanApplicationId.
-- Idempotent so a DB that already received tables from a parallel branch does not fail.

-- ------------------------------------------------------------
-- AlterEnum: existing enums, additive values only
-- ------------------------------------------------------------
ALTER TYPE "ParentRelation" ADD VALUE IF NOT EXISTS 'GUARDIAN';
ALTER TYPE "ParentRelation" ADD VALUE IF NOT EXISTS 'OTHER';

ALTER TYPE "DocumentOwnerType" ADD VALUE IF NOT EXISTS 'GUARDIAN';

ALTER TYPE "DocumentType" ADD VALUE IF NOT EXISTS 'BIRTH_CERTIFICATE';
ALTER TYPE "DocumentType" ADD VALUE IF NOT EXISTS 'ADDRESS_PROOF';
ALTER TYPE "DocumentType" ADD VALUE IF NOT EXISTS 'SCHOOL_ADMISSION_PROOF';
ALTER TYPE "DocumentType" ADD VALUE IF NOT EXISTS 'PREVIOUS_CLASS_RESULT';
ALTER TYPE "DocumentType" ADD VALUE IF NOT EXISTS 'UDYAM_CERTIFICATE';
ALTER TYPE "DocumentType" ADD VALUE IF NOT EXISTS 'LAND_LEASE_PROOF';
ALTER TYPE "DocumentType" ADD VALUE IF NOT EXISTS 'EXISTING_LOAN_STATEMENT';
ALTER TYPE "DocumentType" ADD VALUE IF NOT EXISTS 'FINANCIAL_STATEMENT';

-- ------------------------------------------------------------
-- CreateEnum: new enums
-- ------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "LandOwnership" AS ENUM ('OWNED', 'LEASED', 'PARTIALLY_OWNED_LEASED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "SchoolType" AS ENUM ('GOVERNMENT', 'PRIVATE', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "SchoolClass" AS ENUM (
    'CLASS_1', 'CLASS_2', 'CLASS_3', 'CLASS_4', 'CLASS_5', 'CLASS_6',
    'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10', 'CLASS_11', 'CLASS_12'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BusinessRegistrationType" AS ENUM ('GST', 'UDYAM', 'SHOP_ESTABLISHMENT', 'TRADE_LICENSE', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ExistingLoanStatus" AS ENUM ('ACTIVE', 'CLOSED', 'DELINQUENT');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------
-- AlterTable: addresses
-- ------------------------------------------------------------
ALTER TABLE "addresses" ADD COLUMN IF NOT EXISTS "taluka" TEXT;
ALTER TABLE "addresses" ADD COLUMN IF NOT EXISTS "district" TEXT;

-- ------------------------------------------------------------
-- CreateTable: institutions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "institutions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "schoolId" TEXT,
    "schoolType" "SchoolType" NOT NULL,
    "city" TEXT NOT NULL,
    "taluka" TEXT,
    "district" TEXT,
    "state" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "institutions_schoolId_key" ON "institutions"("schoolId");
CREATE INDEX IF NOT EXISTS "institutions_name_idx" ON "institutions"("name");
CREATE INDEX IF NOT EXISTS "institutions_city_idx" ON "institutions"("city");

-- ------------------------------------------------------------
-- CreateTable: school_student_loan_applications
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "school_student_loan_applications" (
    "id" TEXT NOT NULL,
    "loanApplicationId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "mobile" TEXT,
    "email" TEXT,
    "aadhaarNumber" TEXT,
    "panNumber" TEXT,
    "currentSchoolName" TEXT NOT NULL,
    "institutionId" TEXT,
    "schoolType" "SchoolType",
    "currentClass" "SchoolClass" NOT NULL,
    "academicYear" TEXT NOT NULL,
    "continuingSameSchool" BOOLEAN NOT NULL DEFAULT true,
    "previousSchoolName" TEXT,
    "newSchoolName" TEXT,
    "newInstitutionId" TEXT,
    "expectedJoiningDate" TIMESTAMP(3),
    "previousClass" "SchoolClass",
    "previousAcademicYear" TEXT,
    "previousClassPercentage" DECIMAL(5,2),
    "loanPurpose" TEXT,
    "expectedDisbursementDate" TIMESTAMP(3),
    "tuitionFees" DECIMAL(12,2),
    "admissionFees" DECIMAL(12,2),
    "examinationFees" DECIMAL(12,2),
    "booksAmount" DECIMAL(12,2),
    "uniformAmount" DECIMAL(12,2),
    "equipmentAmount" DECIMAL(12,2),
    "transportAmount" DECIMAL(12,2),
    "hostelAmount" DECIMAL(12,2),
    "otherExpensesAmount" DECIMAL(12,2),
    "familyContribution" DECIMAL(12,2),
    "scholarshipAmount" DECIMAL(12,2),
    "otherFundingAmount" DECIMAL(12,2),
    "hasExistingLoans" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_student_loan_applications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "school_student_loan_applications_loanApplicationId_key" ON "school_student_loan_applications"("loanApplicationId");
CREATE INDEX IF NOT EXISTS "school_student_loan_applications_institutionId_idx" ON "school_student_loan_applications"("institutionId");

DO $$ BEGIN
  ALTER TABLE "school_student_loan_applications"
    ADD CONSTRAINT "school_student_loan_applications_loanApplicationId_fkey"
    FOREIGN KEY ("loanApplicationId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "school_student_loan_applications"
    ADD CONSTRAINT "school_student_loan_applications_institutionId_fkey"
    FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------
-- CreateTable: business_registrations
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "business_registrations" (
    "id" TEXT NOT NULL,
    "parentEmploymentId" TEXT NOT NULL,
    "registrationType" "BusinessRegistrationType" NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_registrations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "business_registrations_parentEmploymentId_idx" ON "business_registrations"("parentEmploymentId");

DO $$ BEGIN
  ALTER TABLE "business_registrations"
    ADD CONSTRAINT "business_registrations_parentEmploymentId_fkey"
    FOREIGN KEY ("parentEmploymentId") REFERENCES "parent_employment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------
-- CreateTable: existing_loans
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "existing_loans" (
    "id" TEXT NOT NULL,
    "loanApplicationId" TEXT NOT NULL,
    "loanTypeLabel" TEXT NOT NULL,
    "lenderName" TEXT NOT NULL,
    "loanAccountNumber" TEXT,
    "originalAmount" DECIMAL(15,2) NOT NULL,
    "outstandingAmount" DECIMAL(15,2) NOT NULL,
    "emiAmount" DECIMAL(12,2) NOT NULL,
    "interestRate" DECIMAL(5,2),
    "startDate" TIMESTAMP(3),
    "originalTenureMonths" INTEGER,
    "remainingTenureMonths" INTEGER,
    "missedPaymentsCount" INTEGER DEFAULT 0,
    "lastEmiPaymentDate" TIMESTAMP(3),
    "status" "ExistingLoanStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "existing_loans_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "existing_loans_loanApplicationId_idx" ON "existing_loans"("loanApplicationId");

DO $$ BEGIN
  ALTER TABLE "existing_loans"
    ADD CONSTRAINT "existing_loans_loanApplicationId_fkey"
    FOREIGN KEY ("loanApplicationId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------
-- AlterTable: parent_details
-- Keep studentLoanApplicationId. Make it nullable (school co-applicants).
-- ------------------------------------------------------------
ALTER TABLE "parent_details" ALTER COLUMN "studentLoanApplicationId" DROP NOT NULL;

ALTER TABLE "parent_details" ADD COLUMN IF NOT EXISTS "schoolLoanApplicationId" TEXT;
ALTER TABLE "parent_details" ADD COLUMN IF NOT EXISTS "gender" "Gender";
ALTER TABLE "parent_details" ADD COLUMN IF NOT EXISTS "dateOfBirth" TIMESTAMP(3);
ALTER TABLE "parent_details" ADD COLUMN IF NOT EXISTS "maritalStatus" "MaritalStatus";
ALTER TABLE "parent_details" ADD COLUMN IF NOT EXISTS "numberOfDependents" INTEGER;
ALTER TABLE "parent_details" ADD COLUMN IF NOT EXISTS "numberOfEarningMembers" INTEGER;
ALTER TABLE "parent_details" ADD COLUMN IF NOT EXISTS "familyMonthlyIncome" DECIMAL(12,2);
ALTER TABLE "parent_details" ADD COLUMN IF NOT EXISTS "currentAddressId" TEXT;
ALTER TABLE "parent_details" ADD COLUMN IF NOT EXISTS "permanentAddressId" TEXT;
ALTER TABLE "parent_details" ADD COLUMN IF NOT EXISTS "sameAsCurrentAddress" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "parent_details" ADD COLUMN IF NOT EXISTS "yearsAtCurrentAddress" INTEGER;

CREATE INDEX IF NOT EXISTS "parent_details_schoolLoanApplicationId_idx" ON "parent_details"("schoolLoanApplicationId");
CREATE UNIQUE INDEX IF NOT EXISTS "parent_details_schoolLoanApplicationId_relation_key" ON "parent_details"("schoolLoanApplicationId", "relation");

DO $$ BEGIN
  ALTER TABLE "parent_details"
    ADD CONSTRAINT "parent_details_schoolLoanApplicationId_fkey"
    FOREIGN KEY ("schoolLoanApplicationId") REFERENCES "school_student_loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "parent_details"
    ADD CONSTRAINT "parent_details_currentAddressId_fkey"
    FOREIGN KEY ("currentAddressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "parent_details"
    ADD CONSTRAINT "parent_details_permanentAddressId_fkey"
    FOREIGN KEY ("permanentAddressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------
-- AlterTable: parent_employment
-- ------------------------------------------------------------
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "industryType" TEXT;
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "dateOfJoining" TIMESTAMP(3);
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "salaryFrequency" TEXT;
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "previousYearIncome" DECIMAL(12,2);
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "salaryAccountBank" TEXT;
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "employerAddressId" TEXT;
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "businessCategory" TEXT;
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "businessStartDate" TIMESTAMP(3);
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "numberOfEmployees" INTEGER;
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "numberOfBranches" INTEGER;
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "yearsAtBusinessLocation" INTEGER;
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "currentYearEstimatedIncome" DECIMAL(12,2);
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "businessAddressId" TEXT;
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "landArea" DECIMAL(10,2);
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "landUnit" TEXT;
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "landOwnership" "LandOwnership";
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "cultivatedArea" DECIMAL(10,2);
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "otherCropTypes" TEXT;
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "irrigationType" TEXT;
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "landLocationVillage" TEXT;
ALTER TABLE "parent_employment" ADD COLUMN IF NOT EXISTS "landAddressId" TEXT;

DO $$ BEGIN
  ALTER TABLE "parent_employment"
    ADD CONSTRAINT "parent_employment_employerAddressId_fkey"
    FOREIGN KEY ("employerAddressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "parent_employment"
    ADD CONSTRAINT "parent_employment_businessAddressId_fkey"
    FOREIGN KEY ("businessAddressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "parent_employment"
    ADD CONSTRAINT "parent_employment_landAddressId_fkey"
    FOREIGN KEY ("landAddressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------
-- AlterTable: loan_applications (declaration / consent)
-- ------------------------------------------------------------
ALTER TABLE "loan_applications" ADD COLUMN IF NOT EXISTS "infoAccuracyConsent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "loan_applications" ADD COLUMN IF NOT EXISTS "infoVerificationConsent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "loan_applications" ADD COLUMN IF NOT EXISTS "documentVerificationConsent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "loan_applications" ADD COLUMN IF NOT EXISTS "termsAccepted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "loan_applications" ADD COLUMN IF NOT EXISTS "privacyPolicyAccepted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "loan_applications" ADD COLUMN IF NOT EXISTS "consentedAt" TIMESTAMP(3);
