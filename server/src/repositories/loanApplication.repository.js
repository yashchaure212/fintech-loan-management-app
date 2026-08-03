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
        isActive: true,

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
      },
      orderBy: {
        effectiveFrom: "desc",
      },
    });
  },

  create(tx, data) {
    return tx.loanApplication.create({
      data,
      include: {
        loanType: true,
        user: true,
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
        createdAt: "desc",
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
        user: true,
      },
    });
  },
};
