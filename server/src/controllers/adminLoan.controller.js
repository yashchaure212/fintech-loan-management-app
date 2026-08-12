import { adminLoanService } from "../services/adminLoan.service.js";

export const adminLoanController = {
  async getApplications(req, res, next) {
    try {
      const result = await adminLoanService.getApplications();

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
