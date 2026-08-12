import { authRepository } from "../repositories/auth.repository.js";
import { hashPassword, comparePassword } from "./password.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "./jwt.service.js";
import AppError from "../utils/AppError.js";
import { addDays } from "../utils/date.util.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { toAuthAppError } from "../utils/jwtError.util.js";
import crypto from "crypto";

function buildTokenPayload(user) {
  return {
    id: user.id,
    phone: user.phone,
    email: user.email,
    role: user.role.name,
  };
}

function assertActiveUser(user, message = "Your account has been disabled") {
  if (!user.isActive || user.isDeleted) {
    throw new AppError(message, 403);
  }
}

async function issueSession(user) {
  const payload = buildTokenPayload(user);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await authRepository.deleteStaleRefreshTokens(user.id);

  await authRepository.createRefreshToken({
    userId: user.id,
    token: refreshToken,
    expiresAt: addDays(7),
  });

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

export const authService = {
  async register(data) {
    const { email, phone, password } = data;

    const existingEmail = await authRepository.findUserByEmail(email);

    if (existingEmail) {
      throw new AppError("Email already exists", 409);
    }

    const existingPhone = await authRepository.findUserByPhone(phone);

    if (existingPhone) {
      throw new AppError("Phone number already exists", 409);
    }

    const customerRole = await authRepository.findRoleByName("CUSTOMER");

    if (!customerRole) {
      throw new AppError("Customer role not found", 500);
    }

    const hashedPassword = await hashPassword(password);

    const user = await authRepository.createUser({
      email,
      phone,
      password: hashedPassword,
      roleId: customerRole.id,
    });

    return issueSession(user);
  },

  async login(data) {
    const { phone, password } = data;

    const user = await authRepository.findUserByPhone(phone);

    if (!user) {
      throw new AppError("Invalid phone or password", 401);
    }

    assertActiveUser(user);

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid phone or password", 401);
    }

    return issueSession(user);
  },

  async refreshToken(token) {
    const storedToken = await authRepository.findRefreshToken(token);

    if (!storedToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    assertActiveUser(storedToken.user);

    if (new Date() > storedToken.expiresAt) {
      await authRepository.revokeRefreshToken(token);
      throw new AppError("Refresh token expired", 401);
    }

    try {
      verifyRefreshToken(token);
    } catch (error) {
      await authRepository.revokeRefreshToken(token);
      throw toAuthAppError(
        error,
        "Refresh token expired",
        "Invalid refresh token",
      );
    }

    const payload = buildTokenPayload(storedToken.user);
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const rotated = await authRepository.rotateRefreshToken(token, {
      userId: storedToken.userId,
      token: refreshToken,
      expiresAt: addDays(7),
    });

    if (!rotated) {
      throw new AppError("Invalid refresh token", 401);
    }

    return {
      accessToken,
      refreshToken,
    };
  },

  async logout(token) {
    if (token) {
      await authRepository.revokeRefreshToken(token);
    }

    return true;
  },

  async getCurrentUser(userId) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return sanitizeUser(user);
  },

  async changePassword(userId, data) {
    const { currentPassword, newPassword } = data;

    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new AppError("Current password is incorrect", 401);
    }

    const hashedPassword = await hashPassword(newPassword);

    await authRepository.updatePassword(userId, hashedPassword);
    await authRepository.revokeAllRefreshTokens(userId);

    return true;
  },

  async forgotPassword(phone) {
    const user = await authRepository.findUserByPhone(phone);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await authRepository.createPasswordResetToken({
      userId: user.id,
      token: hashedToken,
      expiresAt: addDays(1),
    });

    return {
      token,
    };
  },

  async resetPassword(data) {
    const { token, newPassword } = data;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const resetToken = await authRepository.findPasswordResetToken(hashedToken);

    if (!resetToken) {
      throw new AppError("Invalid token", 400);
    }

    if (new Date() > resetToken.expiresAt) {
      throw new AppError("Token expired", 400);
    }

    const hashedPassword = await hashPassword(newPassword);

    await authRepository.updatePassword(resetToken.userId, hashedPassword);
    await authRepository.revokeAllRefreshTokens(resetToken.userId);
    await authRepository.deletePasswordResetToken(hashedToken);

    return true;
  },
};
