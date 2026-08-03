-- CreateEnum
CREATE TYPE "ProcessingFeeType" AS ENUM ('FIXED', 'PERCENTAGE');

-- CreateTable
CREATE TABLE "loan_interest_configurations" (
    "id" TEXT NOT NULL,
    "loanTypeId" TEXT NOT NULL,
    "minAmount" DECIMAL(15,2) NOT NULL,
    "maxAmount" DECIMAL(15,2) NOT NULL,
    "minTenure" INTEGER NOT NULL,
    "maxTenure" INTEGER NOT NULL,
    "interestRate" DECIMAL(5,2) NOT NULL,
    "processingFee" DECIMAL(10,2) NOT NULL,
    "processingFeeType" "ProcessingFeeType" NOT NULL,
    "gstPercentage" DECIMAL(5,2) NOT NULL,
    "latePenalty" DECIMAL(10,2),
    "foreclosureCharge" DECIMAL(10,2),
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_interest_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_eligibilities" (
    "id" TEXT NOT NULL,
    "loanTypeId" TEXT NOT NULL,
    "minimumAge" INTEGER NOT NULL,
    "maximumAge" INTEGER NOT NULL,
    "minimumIncome" DECIMAL(12,2) NOT NULL,
    "minimumExperience" INTEGER,
    "minimumCreditScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_eligibilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_required_documents" (
    "id" TEXT NOT NULL,
    "loanTypeId" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loan_required_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "loan_interest_configurations_loanTypeId_idx" ON "loan_interest_configurations"("loanTypeId");

-- CreateIndex
CREATE INDEX "loan_eligibilities_loanTypeId_idx" ON "loan_eligibilities"("loanTypeId");

-- CreateIndex
CREATE INDEX "loan_required_documents_loanTypeId_idx" ON "loan_required_documents"("loanTypeId");

-- AddForeignKey
ALTER TABLE "loan_interest_configurations" ADD CONSTRAINT "loan_interest_configurations_loanTypeId_fkey" FOREIGN KEY ("loanTypeId") REFERENCES "loan_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_eligibilities" ADD CONSTRAINT "loan_eligibilities_loanTypeId_fkey" FOREIGN KEY ("loanTypeId") REFERENCES "loan_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_required_documents" ADD CONSTRAINT "loan_required_documents_loanTypeId_fkey" FOREIGN KEY ("loanTypeId") REFERENCES "loan_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
