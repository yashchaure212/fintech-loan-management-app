import { adminLoanService } from "../services/adminLoan.service.js";

export const adminLoanController = {
  async getApplications(req, res, next) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
      const result = await adminLoanService.getApplications({ page, limit });

      res.json({
        success: true,

        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const result = await adminLoanService.getApplication(req.params.id);

      res.json({
        success: true,

        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async dashboard(req, res, next) {
    try {
      const result = await adminLoanService.dashboard();

      res.json({
        success: true,

        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
