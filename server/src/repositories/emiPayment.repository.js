import prisma from "../config/prisma.js";

export const emiPaymentRepository = {
  findEmiById(id) {
    return prisma.emiSchedule.findUnique({
      where: {
        id,
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
          not: "PAID",
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
