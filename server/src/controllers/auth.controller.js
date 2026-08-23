import { authService } from "../services/auth.service.js";
import {
  clearRefreshCookie,
  readRefreshToken,
  setRefreshCookie,
} from "../utils/cookies.js";

function sessionResponse(result) {
  const { refreshToken, ...publicData } = result;
  void refreshToken;
  return publicData;
}

export const authController = {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      setRefreshCookie(res, result.refreshToken);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: sessionResponse(result),
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      setRefreshCookie(res, result.refreshToken);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: sessionResponse(result),
      });
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req, res, next) {
    try {
      const result = await authService.refreshToken(readRefreshToken(req));
      setRefreshCookie(res, result.refreshToken);

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      if (error?.clearRefreshCookie) {
        clearRefreshCookie(res);
      }

      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      await authService.logout(readRefreshToken(req));
      clearRefreshCookie(res);

      return res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);

      return res.status(200).json({
        success: true,
        message: "Current user fetched successfully",
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req, res, next) {
    try {
      await authService.changePassword(req.user.id, req.body);
      clearRefreshCookie(res);

      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      const result = await authService.forgotPassword(req.body.phone);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req, res, next) {
    try {
      await authService.resetPassword(req.body);
      clearRefreshCookie(res);

      res.status(200).json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      next(error);
    }
  },
};
