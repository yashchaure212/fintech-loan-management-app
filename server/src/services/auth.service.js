import { authRepository } from "../repositories/auth.repository.js";
import { hashPassword, comparePassword } from "./password.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "./jwt.service.js";
import { emailService } from "./email.service.js";
import AppError from "../utils/AppError.js";
import { addDays, addDuration } from "../utils/date.util.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { toAuthAppError } from "../utils/jwtError.util.js";
import { env } from "../config/env.js";
import crypto from "crypto";

const GENERIC_RESET_MESSAGE =
  "If an account exists for this phone number, a password reset link has been sent.";

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
    expiresAt: addDuration(env.JWT_REFRESH_EXPIRES_IN),
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
    const existingPhone = await authRepository.findUserByPhone(phone);

    if (existingEmail || existingPhone) {
      throw new AppError("Unable to create an account with these details", 409);
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
    if (!token) {
      throw new AppError("Invalid refresh token", 401);
    }

    const storedToken = await authRepository.findRefreshToken(token);

    if (!storedToken) {
      // Missing or already rotated (another tab may have just set a new cookie).
      throw new AppError("Invalid refresh token", 401);
    }

    if (!storedToken.user.isActive || storedToken.user.isDeleted) {
      await authRepository.revokeRefreshToken(token);
      const error = new AppError("Your account has been disabled", 403);
      error.clearRefreshCookie = true;
      throw error;
    }

    if (new Date() > storedToken.expiresAt) {
      await authRepository.revokeRefreshToken(token);
      const error = new AppError("Refresh token expired", 401);
      error.clearRefreshCookie = true;
      throw error;
    }

    try {
      verifyRefreshToken(token);
    } catch (error) {
      await authRepository.revokeRefreshToken(token);
      const mapped = toAuthAppError(
        error,
        "Refresh token expired",
        "Invalid refresh token",
      );
      mapped.clearRefreshCookie = true;
      throw mapped;
    }

    const payload = buildTokenPayload(storedToken.user);
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const rotated = await authRepository.rotateRefreshToken(token, {
      userId: storedToken.userId,
      token: refreshToken,
      expiresAt: addDuration(env.JWT_REFRESH_EXPIRES_IN),
    });

    if (!rotated) {
      // Concurrent rotation already consumed this token. Do not clear the
      // cookie — a sibling request may have just written the new value.
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
      throw new AppError("Current password is incorrect", 400);
    }

    const hashedPassword = await hashPassword(newPassword);

    await authRepository.updatePassword(userId, hashedPassword);
    await authRepository.revokeAllRefreshTokens(userId);

    return true;
  },

  async forgotPassword(phone) {
    const user = await authRepository.findUserByPhone(phone);

    if (!user || !user.isActive || user.isDeleted) {
      return { message: GENERIC_RESET_MESSAGE };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await authRepository.deletePasswordResetTokensByUserId(user.id);

    await authRepository.createPasswordResetToken({
      userId: user.id,
      token: hashedToken,
      expiresAt: addDays(1),
    });

    const resetUrl = `${env.CLIENT_URL.replace(/\/$/, "")}/reset-password?token=${token}`;

    try {
      const sent = await emailService.sendPasswordReset({
        to: user.email,
        resetUrl,
      });

      if (!sent) {
        try {
          await authRepository.deletePasswordResetToken(hashedToken);
        } catch {
          // The reset row may already have been removed.
        }
      }
    } catch (error) {
      console.error("Failed to send password reset email");
      console.error(error);

      try {
        await authRepository.deletePasswordResetToken(hashedToken);
      } catch {
        // Token cleanup should not mask the original mail failure.
      }
    }

    return { message: GENERIC_RESET_MESSAGE };
  },

  async resetPassword(data) {
    const { token, newPassword } = data;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const resetToken = await authRepository.findPasswordResetToken(hashedToken);

    if (!resetToken) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    if (new Date() > resetToken.expiresAt) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    const hashedPassword = await hashPassword(newPassword);

    await authRepository.updatePassword(resetToken.userId, hashedPassword);
    await authRepository.revokeAllRefreshTokens(resetToken.userId);
    await authRepository.deletePasswordResetToken(hashedToken);

    return true;
  },
};
