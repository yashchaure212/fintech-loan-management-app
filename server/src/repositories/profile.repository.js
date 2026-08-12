import prisma from "../config/prisma.js";

export const profileRepository = {
  createProfile(data) {
    return prisma.customerProfile.create({
      data,
    });
  },

  findProfileByUserId(userId) {
    return prisma.customerProfile.findUnique({
      where: {
        userId,
      },
    });
  },

  updateProfile(userId, data) {
    return prisma.customerProfile.update({
      where: {
        userId,
      },

      data,
    });
  },
};
