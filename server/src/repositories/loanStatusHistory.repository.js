import prisma from "../config/prisma.js";

export const loanStatusHistoryRepository = {
  create(data) {
    return prisma.loanApplicationStatusHistory.create({
      data,
      include: {
        changedBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  },

  findByLoanApplicationId(loanApplicationId) {
    return prisma.loanApplicationStatusHistory.findMany({
      where: {
        loanApplicationId,
      },

      orderBy: {
        createdAt: "asc",
      },
    });
  },

  findLoanApplicationForAccess(id) {
    return prisma.loanApplication.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        userId: true,
        status: true,
      },
    });
  },
};
