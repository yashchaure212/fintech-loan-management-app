-- CreateEnum
CREATE TYPE "LoanCategory" AS ENUM ('SECURED', 'UNSECURED');

-- CreateTable
CREATE TABLE "loan_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "category" "LoanCategory" NOT NULL,
    "icon" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "loan_types_code_key" ON "loan_types"("code");

-- CreateIndex
CREATE INDEX "loan_types_code_idx" ON "loan_types"("code");

-- CreateIndex
CREATE INDEX "loan_types_isActive_idx" ON "loan_types"("isActive");

-- CreateIndex
CREATE INDEX "loan_types_displayOrder_idx" ON "loan_types"("displayOrder");
