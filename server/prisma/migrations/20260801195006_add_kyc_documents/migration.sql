/*
  Warnings:

  - You are about to drop the column `isVerified` on the `kyc_documents` table. All the data in the column will be lost.
  - You are about to drop the column `verifiedAt` on the `kyc_documents` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `kyc_documents` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- AlterEnum
ALTER TYPE "DocumentType" ADD VALUE 'PHOTO';

-- AlterTable
ALTER TABLE "kyc_documents" DROP COLUMN "isVerified",
DROP COLUMN "verifiedAt",
ADD COLUMN     "publicId" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
