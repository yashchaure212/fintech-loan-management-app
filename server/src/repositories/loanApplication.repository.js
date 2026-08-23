import prisma from "../config/prisma.js";

export const loanApplicationRepository = {
  findLoanType(id) {
    return prisma.loanType.findFirst({
      where: {
        id,
        isActive: true,
        isDeleted: false,
      },
    });
  },

  findInterestConfiguration(loanTypeId, amount, tenure) {
    return prisma.loanInterestConfiguration.findFirst({
      where: {
        loanTypeId,
        minAmount: {
          lte: amount,
        },
        maxAmount: {
          gte: amount,
        },
        minTenure: {
          lte: tenure,
        },
        maxTenure: {
          gte: tenure,
        },
        isActive: true,
        isDeleted: false,
        effectiveFrom: {
          lte: new Date(),
        },
        OR: [
          {
            effectiveTo: null,
          },
          {
            effectiveTo: {
              gte: new Date(),
            },
          },
        ],
      },
      orderBy: {
        effectiveFrom: "desc",
      },
    });
  },

  findEligibilityRule(loanTypeId) {
    return prisma.loanEligibility.findFirst({
      where: {
        loanTypeId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findRequiredDocuments(loanTypeId) {
    return prisma.loanRequiredDocument.findMany({
      where: {
        loanTypeId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  findCustomerProfile(userId) {
    return prisma.customerProfile.findUnique({
      where: {
        userId,
      },
    });
  },

  create(tx, data) {
    return tx.loanApplication.create({
      data,
      include: {
        loanType: true,
      },
    });
  },

  update(tx, id, data) {
    return tx.loanApplication.update({
      where: {
        id,
      },
      data,
      include: {
        loanType: true,
      },
    });
  },

  createStatusHistory(tx, data) {
    return tx.loanApplicationStatusHistory.create({
      data,
    });
  },

  transaction(callback) {
    return prisma.$transaction(callback);
  },

  findByUser(userId) {
    return prisma.loanApplication.findMany({
      where: {
        userId,
      },
      include: {
        loanType: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  },

  findById(id) {
    return prisma.loanApplication.findUnique({
      where: {
        id,
      },
      include: {
        loanType: true,
        studentLoan: {
          include: {
            parents: {
              include: {
                employment: true,
              },
            },
          },
        },
        personalLoan: {
          include: {
            employment: true,
          },
        },
        schoolLoan: {
          include: {
            institution: true,
            coApplicants: {
              include: {
                currentAddress: true,
                permanentAddress: true,
                employment: {
                  include: {
                    employerAddress: true,
                    businessAddress: true,
                    landAddress: true,
                    registrations: true,
                  },
                },
              },
            },
          },
        },
        existingLoans: true,
        documents: true,
        statusHistory: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  },
};