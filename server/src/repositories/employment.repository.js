import prisma from "../config/prisma.js";

export const employmentRepository = {
  createEmployment(data) {
    return prisma.employmentDetails.create({
      data,
    });
  },

  findByUserId(userId) {
    return prisma.employmentDetails.findUnique({
      where: {
        userId,
      },
    });
  },

  updateEmployment(userId, data) {
    return prisma.employmentDetails.update({
      where: {
        userId,
      },

      data,
    });
  },
};
