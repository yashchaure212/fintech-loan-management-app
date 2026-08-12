-- CreateEnum
CREATE TYPE "EducationDocumentType" AS ENUM ('TENTH_MARKSHEET', 'TWELFTH_MARKSHEET', 'ADMISSION_LETTER', 'FEE_STRUCTURE', 'ENTRANCE_SCORECARD', 'COLLEGE_ID_CARD', 'PREVIOUS_DEGREE_CERTIFICATE', 'OTHER');

-- CreateTable
CREATE TABLE "education_documents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentType" "EducationDocumentType" NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "publicId" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "education_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "education_documents_userId_idx" ON "education_documents"("userId");

-- AddForeignKey
ALTER TABLE "education_documents" ADD CONSTRAINT "education_documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
