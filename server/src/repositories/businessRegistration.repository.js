import prisma from "../config/prisma.js";

export const businessRegistrationRepository = {
  findParentEmploymentById(parentEmploymentId) {
    return prisma.parentEmployment.findUnique({
      where: { id: parentEmploymentId },
      include: {
        parent: {
          include: {
            schoolLoanApplication: {
              include: { loanApplication: true },
            },
            studentLoanApplication: {
              include: { loanApplication: true },
            },
          },
        },
      },
    });
  },

  findByEmployment(parentEmploymentId) {
    return prisma.businessRegistration.findMany({
      where: { parentEmploymentId },
      orderBy: { createdAt: "asc" },
    });
  },

  findById(id) {
    return prisma.businessRegistration.findUnique({
      where: { id },
      include: {
        parentEmployment: {
          include: {
            parent: {
              include: {
                schoolLoanApplication: {
                  include: { loanApplication: true },
                },
                studentLoanApplication: {
                  include: { loanApplication: true },
                },
              },
            },
          },
        },
      },
    });
  },

  create(data) {
    return prisma.businessRegistration.create({ data });
  },

  update(id, data) {
    return prisma.businessRegistration.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.businessRegistration.delete({
      where: { id },
    });
  },
};
