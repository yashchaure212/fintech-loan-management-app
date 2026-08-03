import { loanEligibilityService } from "../services/loanEligibility.service.js";

export const loanEligibilityController = {
  async create(req, res, next) {
    try {
      const result = await loanEligibilityService.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Loan eligibility created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const result = await loanEligibilityService.getAll();

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
      const result = await loanEligibilityService.getById(req.params.id);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const result = await loanEligibilityService.update(
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Loan eligibility updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await loanEligibilityService.delete(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Loan eligibility deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
