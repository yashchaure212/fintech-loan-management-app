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
    return prisma.refreshToken.findFirst({
      where: {
        token,
        revokedAt: null,
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

  revokeRefreshToken(token) {
    return prisma.refreshToken.updateMany({
      where: {
        token,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },

  revokeAllRefreshTokens(userId) {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },
  deleteStaleRefreshTokens(userId) {
    return prisma.refreshToken.deleteMany({
      where: {
        userId,
        OR: [
          {
            expiresAt: {
              lt: new Date(),
            },
          },
          {
            revokedAt: {
              not: null,
            },
          },
        ],
      },
    });
  },
  rotateRefreshToken(oldToken, newTokenData) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.refreshToken.findFirst({
        where: {
          token: oldToken,
          revokedAt: null,
        },
      });

      if (!existing) {
        return null;
      }

      await tx.refreshToken.update({
        where: {
          id: existing.id,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      return tx.refreshToken.create({
        data: newTokenData,
      });
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

  deletePasswordResetTokensByUserId(userId) {
    return prisma.passwordResetToken.deleteMany({
      where: {
        userId,
      },
    });
  },
};
