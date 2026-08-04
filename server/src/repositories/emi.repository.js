import prisma from "../config/prisma.js";

export const emiRepository = {
  createMany(tx, data) {
    return tx.emiSchedule.createMany({
      data,
    });
  },

  findByLoanApplication(loanApplicationId) {
    return prisma.emiSchedule.findMany({
      where: {
        loanApplicationId,
      },
      orderBy: {
        installmentNumber: "asc",
      },
    });
  },

  findById(id) {
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

  findPendingByUser(userId) {
    return prisma.emiSchedule.findMany({
      where: {
        status: "PENDING",
        loanApplication: {
          userId,
        },
      },
      include: {
        loanApplication: {
          include: {
            loanType: true,
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });
  },

  update(tx, id, data) {
    return tx.emiSchedule.update({
      where: {
        id,
      },
      data,
    });
  },

  transaction(callback) {
    return prisma.$transaction(callback);
  },
};
