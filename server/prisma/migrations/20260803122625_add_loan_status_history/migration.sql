/*
  Warnings:

  - You are about to drop the column `changedBy` on the `loan_application_status_history` table. All the data in the column will be lost.
  - Added the required column `changedById` to the `loan_application_status_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "loan_application_status_history" DROP COLUMN "changedBy",
ADD COLUMN     "changedById" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "loan_application_status_history_changedById_idx" ON "loan_application_status_history"("changedById");

-- AddForeignKey
ALTER TABLE "loan_application_status_history" ADD CONSTRAINT "loan_application_status_history_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
