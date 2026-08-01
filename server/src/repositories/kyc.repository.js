import prisma from "../config/prisma.js";

export const kycRepository = {
  create(data) {
    return prisma.kycDocument.create({
      data,
    });
  },

  findByUser(userId) {
    return prisma.kycDocument.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id, userId) {
    return prisma.kycDocument.findFirst({
      where: {
        id,
        userId,
      },
    });
  },

  findDocumentByType(userId, documentType) {
    return prisma.kycDocument.findFirst({
      where: {
        userId,
        documentType,
      },
    });
  },

  update(id, data) {
    return prisma.kycDocument.update({
      where: {
        id,
      },
      data,
    });
  },
};
