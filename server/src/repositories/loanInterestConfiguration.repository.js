import prisma from "../config/prisma.js";

export const loanInterestConfigurationRepository = {
  create(data) {
    return prisma.loanInterestConfiguration.create({
      data,
      include: {
        loanType: true,
      },
    });
  },

  findById(id) {
    return prisma.loanInterestConfiguration.findUnique({
      where: {
        id,
      },
      include: {
        loanType: true,
      },
    });
  },

  findAll() {
    return prisma.loanInterestConfiguration.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        loanType: true,
      },
      orderBy: [
        {
          loanType: {
            name: "asc",
          },
        },
        {
          minAmount: "asc",
        },
      ],
    });
  },

  update(id, data) {
    return prisma.loanInterestConfiguration.update({
      where: {
        id,
      },
      data,
      include: {
        loanType: true,
      },
    });
  },

  updateStatus(id, isActive) {
    return prisma.loanInterestConfiguration.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
    });
  },

  softDelete(id) {
    return prisma.loanInterestConfiguration.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        isActive: false,
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

  findOverlappingConfiguration(data) {
    return prisma.loanInterestConfiguration.findFirst({
      where: {
        loanTypeId: data.loanTypeId,
        isActive: true,
        isDeleted: false,

        AND: [
          {
            minAmount: {
              lte: data.maxAmount,
            },
          },
          {
            maxAmount: {
              gte: data.minAmount,
            },
          },
          {
            minTenure: {
              lte: data.maxTenure,
            },
          },
          {
            maxTenure: {
              gte: data.minTenure,
            },
          },
        ],
      },
    });
  },
};
