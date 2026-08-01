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
import crypto from "crypto";

export const authService = {
  async register(data) {
    const { email, phone, password } = data;

    // Check email
    const existingEmail = await authRepository.findUserByEmail(email);

    if (existingEmail) {
      throw new AppError("Email already exists", 409);
    }

    // Check phone
    const existingPhone = await authRepository.findUserByPhone(phone);

    if (existingPhone) {
      throw new AppError("Phone number already exists", 409);
    }

    // Find CUSTOMER role
    const customerRole = await authRepository.findRoleByName("CUSTOMER");

    if (!customerRole) {
      throw new AppError("Customer role not found", 500);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await authRepository.createUser({
      email,
      phone,
      password: hashedPassword,
      roleId: customerRole.id,
    });

    // JWT Payload
    const payload = {
      id: user.id,
      phone: user.phone,
      email: user.email,
      role: user.role.name,
    };

    // Generate Tokens
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save Refresh Token
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
  },

  async login(data) {
    const { phone, password } = data;

    const user = await authRepository.findUserByPhone(phone);

    if (!user) {
      throw new AppError("Invalid phone or password", 401);
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid phone or password", 401);
    }

    const payload = {
      id: user.id,
      phone: user.phone,
      email: user.email,
      role: user.role.name,
    };

    // Generate Tokens
    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    // Save Refresh Token
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
  },

  async refreshToken(token) {
    const storedToken = await authRepository.findRefreshToken(token);

    if (!storedToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    if (new Date() > storedToken.expiresAt) {
      throw new AppError("Refresh token expired", 401);
    }

    const decoded = verifyRefreshToken(token);

    const payload = {
      id: decoded.id,
      phone: decoded.phone,
      email: decoded.email,
      role: decoded.role,
    };

    const accessToken = generateAccessToken(payload);

    return {
      accessToken,
    };
  },

  async logout(token) {
    await authRepository.deleteRefreshToken(token);

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

    // Find user
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Verify current password
    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new AppError("Current password is incorrect", 401);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await authRepository.updatePassword(userId, hashedPassword);

    // Logout all existing sessions
    await authRepository.deleteAllRefreshTokens(userId);

    return true;
  },

  async forgotPassword(phone) {
    const user = await authRepository.findUserByPhone(phone);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const token = crypto.randomBytes(32).toString("hex");

    await authRepository.createPasswordResetToken({
      userId: user.id,

      token,

      expiresAt: addDays(1),
    });

    return {
      token,
    };
  },

  async resetPassword(data) {
    const { token, newPassword } = data;

    const resetToken = await authRepository.findPasswordResetToken(token);

    if (!resetToken) {
      throw new AppError("Invalid token", 400);
    }

    if (new Date() > resetToken.expiresAt) {
      throw new AppError("Token expired", 400);
    }

    const hashedPassword = await hashPassword(newPassword);

    await authRepository.updatePassword(resetToken.userId, hashedPassword);

    await authRepository.deleteAllRefreshTokens(resetToken.userId);

    await authRepository.deletePasswordResetToken(token);

    return true;
  },
};
