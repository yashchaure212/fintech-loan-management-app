import prisma from "../config/prisma.js";

export const educationLoanRepository = {
  findLoanApplicationById(loanApplicationId) {
    return prisma.loanApplication.findUnique({
      where: {
        id: loanApplicationId,
      },
      include: {
        loanType: true,
        educationLoan: {
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

  createEducationLoan(tx, data) {
    return tx.educationLoanApplication.create({
      data,
      include: {
        parents: {
          include: {
            employment: true,
          },
        },
      },
    });
  },

  updateEducationLoan(tx, id, data) {
    return tx.educationLoanApplication.update({
      where: {
        id,
      },
      data,
      include: {
        parents: {
          include: {
            employment: true,
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
        educationLoanApplication: {
          include: {
            loanApplication: true,
          },
        },
      },
    });
  },

  createParent(tx, data) {
    return tx.parentDetails.create({
      data,
      include: {
        employment: true,
      },
    });
  },

  updateParent(tx, id, data) {
    return tx.parentDetails.update({
      where: {
        id,
      },
      data,
      include: {
        employment: true,
      },
    });
  },

  deleteParent(tx, id) {
    return tx.parentDetails.delete({
      where: {
        id,
      },
    });
  },

  createEmployment(tx, data) {
    return tx.parentEmployment.create({
      data,
    });
  },

  updateEmployment(tx, id, data) {
    return tx.parentEmployment.update({
      where: {
        id,
      },
      data,
    });
  },

  findEmploymentByParentId(parentId) {
    return prisma.parentEmployment.findUnique({
      where: {
        parentId,
      },
    });
  },

  transaction(callback) {
    return prisma.$transaction(callback);
  },
};