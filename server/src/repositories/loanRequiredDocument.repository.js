import prisma from "../config/prisma.js";

export const loanRequiredDocumentRepository = {
  create(data) {
    return prisma.loanRequiredDocument.create({
      data,
      include: {
        loanType: true,
      },
    });
  },

  findAll() {
    return prisma.loanRequiredDocument.findMany({
      include: {
        loanType: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id) {
    return prisma.loanRequiredDocument.findUnique({
      where: {
        id,
      },
      include: {
        loanType: true,
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

  findByLoanTypeAndDocumentType(loanTypeId, documentType) {
    return prisma.loanRequiredDocument.findFirst({
      where: {
        loanTypeId,
        documentType,
      },
    });
  },

  update(id, data) {
    return prisma.loanRequiredDocument.update({
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
    return prisma.loanRequiredDocument.delete({
      where: {
        id,
      },
    });
  },
};
