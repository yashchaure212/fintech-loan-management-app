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

  updateStatus(tx, loanApplicationId, status) {
    return tx.loanApplication.update({
      where: {
        id: loanApplicationId,
      },
      data: {
        status,
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
