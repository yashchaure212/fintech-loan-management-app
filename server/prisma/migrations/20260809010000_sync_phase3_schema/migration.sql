-- Phase 3 additive schema sync (non-destructive; no DROP TABLE/COLUMN)

-- CreateEnum
CREATE TYPE "DocumentOwnerType" AS ENUM ('APPLICANT', 'STUDENT', 'FATHER', 'MOTHER', 'CO_APPLICANT');

-- CreateEnum
CREATE TYPE "AdmissionStatus" AS ENUM ('APPLIED', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "ParentRelation" AS ENUM ('FATHER', 'MOTHER');

-- CreateEnum
CREATE TYPE "PersonalLoanPurpose" AS ENUM ('MEDICAL', 'MARRIAGE', 'TRAVEL', 'HOME_RENOVATION', 'BUSINESS', 'EDUCATION', 'DEBT_CONSOLIDATION', 'OTHER');

-- AlterEnum DocumentType
ALTER TYPE "DocumentType" ADD VALUE 'ADMISSION_LETTER';
ALTER TYPE "DocumentType" ADD VALUE 'FEE_STRUCTURE';
ALTER TYPE "DocumentType" ADD VALUE 'BUSINESS_PROOF';
ALTER TYPE "DocumentType" ADD VALUE 'BUSINESS_REGISTRATION';
ALTER TYPE "DocumentType" ADD VALUE 'GST_CERTIFICATE';
ALTER TYPE "DocumentType" ADD VALUE 'LAND_RECORD';
ALTER TYPE "DocumentType" ADD VALUE 'INCOME_PROOF';
ALTER TYPE "DocumentType" ADD VALUE 'CONTRACT_LETTER';
ALTER TYPE "DocumentType" ADD VALUE 'TENTH_MARKSHEET';
ALTER TYPE "DocumentType" ADD VALUE 'TWELFTH_MARKSHEET';
ALTER TYPE "DocumentType" ADD VALUE 'ENTRANCE_SCORECARD';
ALTER TYPE "DocumentType" ADD VALUE 'COLLEGE_ID_CARD';
ALTER TYPE "DocumentType" ADD VALUE 'PREVIOUS_DEGREE_CERTIFICATE';
ALTER TYPE "DocumentType" ADD VALUE 'PASSPORT';
ALTER TYPE "DocumentType" ADD VALUE 'OTHER';

-- AlterEnum EmploymentType
ALTER TYPE "EmploymentType" ADD VALUE 'FARMER';
ALTER TYPE "EmploymentType" ADD VALUE 'CONTRACT';
ALTER TYPE "EmploymentType" ADD VALUE 'RETIRED';
ALTER TYPE "EmploymentType" ADD VALUE 'OTHER';

-- Loan applications: draft-friendly columns
ALTER TABLE "loan_applications" ADD COLUMN "currentStep" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "loan_applications" ALTER COLUMN "loanAmount" DROP NOT NULL;
ALTER TABLE "loan_applications" ALTER COLUMN "tenureMonths" DROP NOT NULL;
ALTER TABLE "loan_applications" ALTER COLUMN "interestRate" DROP NOT NULL;
ALTER TABLE "loan_applications" ALTER COLUMN "processingFee" DROP NOT NULL;
ALTER TABLE "loan_applications" ALTER COLUMN "emi" DROP NOT NULL;
ALTER TABLE "loan_applications" ALTER COLUMN "totalInterest" DROP NOT NULL;
ALTER TABLE "loan_applications" ALTER COLUMN "totalAmount" DROP NOT NULL;
ALTER TABLE "loan_applications" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
ALTER TABLE "loan_applications" ALTER COLUMN "submittedAt" DROP NOT NULL;
ALTER TABLE "loan_applications" ALTER COLUMN "submittedAt" DROP DEFAULT;
ALTER TABLE "loan_applications" ALTER COLUMN "configurationSnapshot" DROP NOT NULL;

-- LoanRequiredDocument: ownerType + employmentType
ALTER TABLE "loan_required_documents" ADD COLUMN "employmentType" "EmploymentType";
ALTER TABLE "loan_required_documents" ADD COLUMN "ownerType" "DocumentOwnerType";
UPDATE "loan_required_documents" SET "ownerType" = 'APPLICANT' WHERE "ownerType" IS NULL;
ALTER TABLE "loan_required_documents" ALTER COLUMN "ownerType" SET NOT NULL;
CREATE INDEX "loan_required_documents_documentType_idx" ON "loan_required_documents"("documentType");

-- LoanDocument table
CREATE TABLE "loan_documents" (
    "id" TEXT NOT NULL,
    "loanApplicationId" TEXT NOT NULL,
    "ownerType" "DocumentOwnerType" NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "publicId" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_documents_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "loan_documents_loanApplicationId_idx" ON "loan_documents"("loanApplicationId");
CREATE INDEX "loan_documents_documentType_idx" ON "loan_documents"("documentType");
CREATE INDEX "loan_documents_status_idx" ON "loan_documents"("status");

ALTER TABLE "loan_documents" ADD CONSTRAINT "loan_documents_loanApplicationId_fkey" FOREIGN KEY ("loanApplicationId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Education loan application tables (additive; required by nested Prisma includes)
CREATE TABLE "education_loan_applications" (
    "id" TEXT NOT NULL,
    "loanApplicationId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "aadhaarNumber" TEXT,
    "panNumber" TEXT,
    "courseName" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "studyCountry" TEXT NOT NULL,
    "courseDurationMonths" INTEGER NOT NULL,
    "admissionStatus" "AdmissionStatus" NOT NULL,
    "estimatedCourseFee" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "education_loan_applications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "education_loan_applications_loanApplicationId_key" ON "education_loan_applications"("loanApplicationId");

ALTER TABLE "education_loan_applications" ADD CONSTRAINT "education_loan_applications_loanApplicationId_fkey" FOREIGN KEY ("loanApplicationId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "parent_details" (
    "id" TEXT NOT NULL,
    "educationLoanApplicationId" TEXT NOT NULL,
    "relation" "ParentRelation" NOT NULL,
    "fullName" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "aadhaarNumber" TEXT,
    "panNumber" TEXT,
    "isCoApplicant" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parent_details_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "parent_details_educationLoanApplicationId_idx" ON "parent_details"("educationLoanApplicationId");
CREATE UNIQUE INDEX "parent_details_educationLoanApplicationId_relation_key" ON "parent_details"("educationLoanApplicationId", "relation");

ALTER TABLE "parent_details" ADD CONSTRAINT "parent_details_educationLoanApplicationId_fkey" FOREIGN KEY ("educationLoanApplicationId") REFERENCES "education_loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "parent_employment" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "employmentType" "EmploymentType" NOT NULL,
    "companyName" TEXT,
    "designation" TEXT,
    "monthlyIncome" DECIMAL(12,2),
    "experienceYears" INTEGER,
    "businessName" TEXT,
    "businessType" TEXT,
    "annualTurnover" DECIMAL(15,2),
    "annualIncome" DECIMAL(12,2),
    "landHoldingAcres" DECIMAL(10,2),
    "cropType" TEXT,
    "agriculturalIncome" DECIMAL(12,2),
    "employerName" TEXT,
    "contractDurationMonths" INTEGER,
    "occupation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parent_employment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "parent_employment_parentId_key" ON "parent_employment"("parentId");

ALTER TABLE "parent_employment" ADD CONSTRAINT "parent_employment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parent_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Personal loan application tables (additive)
CREATE TABLE "personal_loan_applications" (
    "id" TEXT NOT NULL,
    "loanApplicationId" TEXT NOT NULL,
    "purpose" "PersonalLoanPurpose" NOT NULL,
    "purposeDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_loan_applications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "personal_loan_applications_loanApplicationId_key" ON "personal_loan_applications"("loanApplicationId");

ALTER TABLE "personal_loan_applications" ADD CONSTRAINT "personal_loan_applications_loanApplicationId_fkey" FOREIGN KEY ("loanApplicationId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "applicant_employment" (
    "id" TEXT NOT NULL,
    "personalLoanApplicationId" TEXT NOT NULL,
    "employmentType" "EmploymentType" NOT NULL,
    "companyName" TEXT,
    "designation" TEXT,
    "monthlyIncome" DECIMAL(12,2),
    "experienceYears" INTEGER,
    "profession" TEXT,
    "businessName" TEXT,
    "businessType" TEXT,
    "annualTurnover" DECIMAL(15,2),
    "annualIncome" DECIMAL(12,2),
    "employerName" TEXT,
    "contractDurationMonths" INTEGER,
    "occupation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicant_employment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "applicant_employment_personalLoanApplicationId_key" ON "applicant_employment"("personalLoanApplicationId");

ALTER TABLE "applicant_employment" ADD CONSTRAINT "applicant_employment_personalLoanApplicationId_fkey" FOREIGN KEY ("personalLoanApplicationId") REFERENCES "personal_loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
