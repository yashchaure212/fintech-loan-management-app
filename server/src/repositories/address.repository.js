import prisma from "../config/prisma.js";

export const addressRepository = {
  createAddress(data) {
    return prisma.address.create({
      data,
    });
  },

  getAddressesByUserId(userId) {
    return prisma.address.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getAddressById(id, userId) {
    return prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });
  },

  updateAddress(id, userId, data) {
    return prisma.address.update({
      where: {
        id,
      },

      data,
    });
  },

  deleteAddress(id, userId) {
    return prisma.address.delete({
      where: {
        id,
      },
    });
  },
};
