import prisma from "../config/prisma.js";

export const studentLoanRepository = {
  findLoanApplicationById(loanApplicationId) {
    return prisma.loanApplication.findUnique({
      where: {
        id: loanApplicationId,
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
      },
    });
  },

  findParentById(parentId) {
    return prisma.parentDetails.findUnique({
      where: {
        id: parentId,
      },
      include: {
        employment: true,
        studentLoanApplication: {
          include: {
            loanApplication: true,
          },
        },
      },
    });
  },

  transaction(callback) {
    return prisma.$transaction(callback);
  },
};
