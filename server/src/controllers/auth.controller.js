import { authService } from "../services/auth.service.js";

export const authController = {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req, res, next) {
    try {
      const result = await authService.refreshToken(req.body.refreshToken);

      return res.status(200).json({
        success: true,

        message: "Token refreshed successfully",

        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      await authService.logout(req.body.refreshToken);

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

        message: "Reset token generated",

        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req, res, next) {
    try {
      await authService.resetPassword(req.body);

      res.status(200).json({
        success: true,

        message: "Password reset successful",
      });
    } catch (error) {
      next(error);
    }
  },
};
