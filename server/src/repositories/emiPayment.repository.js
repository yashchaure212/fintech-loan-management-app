import prisma from "../config/prisma.js";

export const emiPaymentRepository = {
  findEmiById(id, userId) {
    return prisma.emiSchedule.findFirst({
      where: {
        id,
        loanApplication: {
          userId,
        },
      },
      include: {
        payments: true,
        loanApplication: true,
      },
    });
  },

  createPayment(tx, data) {
    return tx.emiPayment.create({
      data,
    });
  },

  updateEmi(tx, id, data) {
    return tx.emiSchedule.update({
      where: {
        id,
      },
      data,
    });
  },

  countPendingEmisForLoan(tx, loanApplicationId) {
    return tx.emiSchedule.count({
      where: {
        loanApplicationId,
        status: {
          in: ["PENDING", "PARTIALLY_PAID", "OVERDUE"],
        },
      },
    });
  },

  closeLoanApplication(tx, loanApplicationId) {
    return tx.loanApplication.update({
      where: {
        id: loanApplicationId,
      },
      data: {
        status: "CLOSED",
      },
    });
  },

  transaction(callback) {
    return prisma.$transaction(callback);
  },
};
