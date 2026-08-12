import prisma from "../config/prisma.js";

export const loanDocumentRepository = {
  create(data) {
    return prisma.loanDocument.create({
      data,
    });
  },

  findById(id) {
    return prisma.loanDocument.findUnique({
      where: {
        id,
      },
      include: {
        loanApplication: {
          select: {
            id: true,
            userId: true,
            status: true,
          },
        },
      },
    });
  },

  findByIdForApplication(id, loanApplicationId) {
    return prisma.loanDocument.findFirst({
      where: {
        id,
        loanApplicationId,
      },
    });
  },

  findByApplicationId(loanApplicationId) {
    return prisma.loanDocument.findMany({
      where: {
        loanApplicationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findByRequirement({ loanApplicationId, ownerType, documentType }) {
    return prisma.loanDocument.findMany({
      where: {
        loanApplicationId,
        ownerType,
        documentType,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  update(id, data) {
    return prisma.loanDocument.update({
      where: {
        id,
      },
      data,
    });
  },

  delete(id) {
    return prisma.loanDocument.delete({
      where: {
        id,
      },
    });
  },
};
