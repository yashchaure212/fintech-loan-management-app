import prisma from "../config/prisma.js";

export const loanEligibilityRepository = {
  create(data) {
    return prisma.loanEligibility.create({
      data,
      include: {
        loanType: true,
      },
    });
  },

  findById(id) {
    return prisma.loanEligibility.findUnique({
      where: {
        id,
      },
      include: {
        loanType: true,
      },
    });
  },

  findAll() {
    return prisma.loanEligibility.findMany({
      include: {
        loanType: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findByLoanTypeId(loanTypeId) {
    return prisma.loanEligibility.findFirst({
      where: {
        loanTypeId,
      },
    });
  },

  findLoanType(id) {
    return prisma.loanType.findFirst({
      where: {
        id,
        isActive: true,
        isDeleted: false,
      },
    });
  },

  update(id, data) {
    return prisma.loanEligibility.update({
      where: {
        id,
      },
      data,
      include: {
        loanType: true,
      },
    });
  },

  delete(id) {
    return prisma.loanEligibility.delete({
      where: {
        id,
      },
    });
  },
};
