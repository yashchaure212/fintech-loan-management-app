import prisma from "../config/prisma.js";

export const authRepository = {
  // methods go here
  findRoleByName(name) {
    return prisma.role.findUnique({
      where: {
        name,
      },
    });
  },
  findUserByEmail(email) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        role: true,
      },
    });
  },
  findUserByPhone(phone) {
    return prisma.user.findUnique({
      where: {
        phone,
      },
      include: {
        role: true,
      },
    });
  },
  findUserById(id) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        role: true,
      },
    });
  },
  updatePassword(id, hashedPassword) {
    return prisma.user.update({
      where: {
        id,
      },

      data: {
        password: hashedPassword,
      },
    });
  },
  createUser(data) {
    return prisma.user.create({
      data,
      include: {
        role: true,
      },
    });
  },
  createRefreshToken(data) {
    return prisma.refreshToken.create({
      data,
    });
  },
  findRefreshToken(token) {
    return prisma.refreshToken.findUnique({
      where: {
        token,
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
  },
  deleteRefreshToken(token) {
    return prisma.refreshToken.deleteMany({
      where: {
        token,
      },
    });
  },
  deleteAllRefreshTokens(userId) {
    return prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  },
  createPasswordResetToken(data) {
    return prisma.passwordResetToken.create({
      data,
    });
  },

  findPasswordResetToken(token) {
    return prisma.passwordResetToken.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });
  },

  deletePasswordResetToken(token) {
    return prisma.passwordResetToken.delete({
      where: {
        token,
      },
    });
  },
};
