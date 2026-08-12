import prisma from "../config/prisma.js";

export const loanTypeRepository = {
  create(data) {
    return prisma.loanType.create({
      data,
    });
  },

  findById(id) {
    return prisma.loanType.findUnique({
      where: {
        id,
      },
    });
  },

  findByCode(code) {
    return prisma.loanType.findUnique({
      where: {
        code,
      },
    });
  },

  findAll() {
    return prisma.loanType.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });
  },

  // Customer/public-facing active loan products
  findAllActive() {
    return prisma.loanType.findMany({
      where: {
        isDeleted: false,
        isActive: true,
      },
      include: {
        interestConfigurations: {
          where: {
            isActive: true,
            isDeleted: false,
          },
        },
      },
      orderBy: {
        displayOrder: "asc",
      },
    });
  },

  // Customer/public-facing single active loan product
  findActiveById(id) {
    return prisma.loanType.findFirst({
      where: {
        id,
        isDeleted: false,
        isActive: true,
      },
      include: {
        interestConfigurations: {
          where: {
            isActive: true,
            isDeleted: false,
          },
        },
      },
    });
  },

  update(id, data) {
    return prisma.loanType.update({
      where: {
        id,
      },
      data,
    });
  },

  softDelete(id) {
    return prisma.loanType.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        isActive: false,
      },
    });
  },
};
