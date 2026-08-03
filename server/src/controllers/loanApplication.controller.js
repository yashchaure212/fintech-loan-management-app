import { loanApplicationService } from "../services/loanApplication.service.js";

export const loanApplicationController = {
  async create(req, res, next) {
    try {
      const result = await loanApplicationService.create(req.user.id, req.body);

      return res.status(201).json({
        success: true,
        message: "Loan application created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMyApplications(req, res, next) {
    try {
      const result = await loanApplicationService.getMyApplications(
        req.user.id,
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const result = await loanApplicationService.getById(req.params.id);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
