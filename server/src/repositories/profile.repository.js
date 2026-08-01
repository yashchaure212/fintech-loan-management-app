import prisma from "../config/prisma.js";

export const profileRepository = {
  createProfile(data) {
    return prisma.customerProfile.create({
      data,
      include: {
        user: true,
      },
    });
  },

  findProfileByUserId(userId) {
    return prisma.customerProfile.findUnique({
      where: {
        userId,
      },

      include: {
        user: true,
      },
    });
  },

  updateProfile(userId, data) {
    return prisma.customerProfile.update({
      where: {
        userId,
      },

      data,

      include: {
        user: true,
      },
    });
  },
};
