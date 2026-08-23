import prisma from "../config/prisma.js";

export const existingLoanRepository = {
  findLoanApplicationById(loanApplicationId) {
    return prisma.loanApplication.findUnique({
      where: {
        id: loanApplicationId,
      },
    });
  },

  findByApplication(loanApplicationId) {
    return prisma.existingLoan.findMany({
      where: {
        loanApplicationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  findById(id) {
    return prisma.existingLoan.findUnique({
      where: { id },
      include: {
        loanApplication: true,
      },
    });
  },

  create(data) {
    return prisma.existingLoan.create({
      data,
    });
  },

  update(id, data) {
    return prisma.existingLoan.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.existingLoan.delete({
      where: { id },
    });
  },
};
