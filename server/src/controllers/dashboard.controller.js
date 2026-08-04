import { dashboardService } from "../services/dashboard.service.js";

export const dashboardController = {
  // ==========================
  // CUSTOMER DASHBOARD
  // ==========================

  async customer(req, res, next) {
    try {
      const result = await dashboardService.getCustomerDashboard(req.user.id);

      return res.status(200).json({
        success: true,
        message: "Customer dashboard fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // ==========================
  // ADMIN DASHBOARD
  // ==========================

  async admin(req, res, next) {
    try {
      const result = await dashboardService.getAdminDashboard();

      return res.status(200).json({
        success: true,
        message: "Admin dashboard fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
