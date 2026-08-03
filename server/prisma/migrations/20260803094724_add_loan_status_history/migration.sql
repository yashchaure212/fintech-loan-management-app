-- CreateTable
CREATE TABLE "loan_application_status_history" (
    "id" TEXT NOT NULL,
    "loanApplicationId" TEXT NOT NULL,
    "status" "LoanApplicationStatus" NOT NULL,
    "remarks" TEXT,
    "changedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loan_application_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "loan_application_status_history_loanApplicationId_idx" ON "loan_application_status_history"("loanApplicationId");

-- AddForeignKey
ALTER TABLE "loan_application_status_history" ADD CONSTRAINT "loan_application_status_history_loanApplicationId_fkey" FOREIGN KEY ("loanApplicationId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
