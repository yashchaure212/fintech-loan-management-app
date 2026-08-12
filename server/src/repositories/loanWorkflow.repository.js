import prisma from "../config/prisma.js";

export const loanWorkflowRepository = {
  findById(id) {
    return prisma.loanApplication.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          include: {
            customerProfile: true,
          },
        },
        loanType: true,
      },
    });
  },

  updateStatus(tx, loanApplicationId, updateData) {
    return tx.loanApplication.update({
      where: {
        id: loanApplicationId,
      },

      data: updateData,

      select: {
        id: true,
        loanAmount: true,
        interestRate: true,
        tenureMonths: true,
        emi: true,
        disbursedAt: true,
        status: true,
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
};

