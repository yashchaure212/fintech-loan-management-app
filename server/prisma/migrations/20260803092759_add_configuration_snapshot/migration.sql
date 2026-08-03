/*
  Warnings:

  - Added the required column `configurationSnapshot` to the `loan_applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "loan_applications" ADD COLUMN     "configurationSnapshot" JSONB NOT NULL;
