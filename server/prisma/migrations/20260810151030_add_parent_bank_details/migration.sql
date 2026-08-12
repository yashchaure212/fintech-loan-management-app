/*
  Warnings:

  - You are about to drop the column `documentType` on the `education_documents` table. All the data in the column will be lost.
  - You are about to drop the `employment_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kyc_documents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "employment_details" DROP CONSTRAINT "employment_details_userId_fkey";

-- DropForeignKey
ALTER TABLE "kyc_documents" DROP CONSTRAINT "kyc_documents_userId_fkey";

-- AlterTable
ALTER TABLE "education_documents" DROP COLUMN "documentType";

-- AlterTable
ALTER TABLE "parent_details" ADD COLUMN     "bankAccountNumber" TEXT,
ADD COLUMN     "ifscCode" TEXT;

-- DropTable
DROP TABLE "employment_details";

-- DropTable
DROP TABLE "kyc_documents";

-- DropEnum
DROP TYPE "EducationDocumentType";
