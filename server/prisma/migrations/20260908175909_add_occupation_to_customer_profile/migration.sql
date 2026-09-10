-- AlterTable
ALTER TABLE "customer_profiles" ADD COLUMN     "occupation" TEXT;

-- AlterTable
ALTER TABLE "student_loan_applications" RENAME CONSTRAINT "education_loan_applications_pkey" TO "student_loan_applications_pkey";

-- RenameForeignKey
ALTER TABLE "student_loan_applications" RENAME CONSTRAINT "education_loan_applications_loanApplicationId_fkey" TO "student_loan_applications_loanApplicationId_fkey";

-- RenameIndex
ALTER INDEX "education_loan_applications_loanApplicationId_key" RENAME TO "student_loan_applications_loanApplicationId_key";
