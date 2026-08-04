-- CreateEnum
CREATE TYPE "EMIStatus" AS ENUM ('PENDING', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'WAIVED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'UPI', 'BANK_TRANSFER', 'CARD', 'CHEQUE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('SUCCESS', 'FAILED', 'PENDING');

-- CreateTable
CREATE TABLE "emi_schedules" (
    "id" TEXT NOT NULL,
    "loanApplicationId" TEXT NOT NULL,
    "installmentNumber" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "openingPrincipal" DECIMAL(15,2) NOT NULL,
    "principalAmount" DECIMAL(15,2) NOT NULL,
    "interestAmount" DECIMAL(15,2) NOT NULL,
    "emiAmount" DECIMAL(15,2) NOT NULL,
    "closingPrincipal" DECIMAL(15,2) NOT NULL,
    "paidAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "paymentDate" TIMESTAMP(3),
    "latePenalty" DECIMAL(10,2),
    "status" "EMIStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emi_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emi_payments" (
    "id" TEXT NOT NULL,
    "emiScheduleId" TEXT NOT NULL,
    "paymentReference" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "transactionId" TEXT,
    "remarks" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emi_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "emi_schedules_loanApplicationId_idx" ON "emi_schedules"("loanApplicationId");

-- CreateIndex
CREATE INDEX "emi_schedules_status_idx" ON "emi_schedules"("status");

-- CreateIndex
CREATE INDEX "emi_schedules_dueDate_idx" ON "emi_schedules"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "emi_payments_paymentReference_key" ON "emi_payments"("paymentReference");

-- CreateIndex
CREATE INDEX "emi_payments_emiScheduleId_idx" ON "emi_payments"("emiScheduleId");

-- CreateIndex
CREATE INDEX "emi_payments_paymentStatus_idx" ON "emi_payments"("paymentStatus");

-- AddForeignKey
ALTER TABLE "emi_schedules" ADD CONSTRAINT "emi_schedules_loanApplicationId_fkey" FOREIGN KEY ("loanApplicationId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emi_payments" ADD CONSTRAINT "emi_payments_emiScheduleId_fkey" FOREIGN KEY ("emiScheduleId") REFERENCES "emi_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
