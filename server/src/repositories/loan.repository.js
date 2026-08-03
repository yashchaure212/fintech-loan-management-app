import prisma from "../config/prisma.js";

export const loanRepository = {
  // Loan Type
  findLoanTypeById(id) {
    return prisma.loanType.findUnique({
      where: {
        id,
      },
    });
  },

  // Current Active Interest Configuration
  findActiveInterestConfiguration(loanTypeId) {
    return prisma.loanInterestConfiguration.findFirst({
      where: {
        loanTypeId,
        isActive: true,
      },
      orderBy: {
        effectiveFrom: "desc",
      },
    });
  },

  // Eligibility Rules
  findEligibilityRule(loanTypeId) {
    return prisma.loanEligibility.findFirst({
      where: {
        loanTypeId,
      },
    });
  },

  // Required Documents
  findRequiredDocuments(loanTypeId) {
    return prisma.loanRequiredDocument.findMany({
      where: {
        loanTypeId,
      },
    });
  },

  // Customer Profile
  findCustomerProfile(userId) {
    return prisma.customerProfile.findUnique({
      where: {
        userId,
      },
    });
  },

  // Employment
  findEmployment(userId) {
    return prisma.employmentDetails.findUnique({
      where: {
        userId,
      },
    });
  },

  // Uploaded KYC Documents
  findVerifiedDocuments(userId) {
    return prisma.kycDocument.findMany({
      where: {
        userId,
        status: "VERIFIED",
      },
    });
  },

  // Create Loan Application
  createLoanApplication(data) {
    return prisma.loanApplication.create({
      data,
      include: {
        loanType: true,
        user: true,
      },
    });
  },
};
