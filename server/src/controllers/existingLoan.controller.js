import { existingLoanService } from "../services/existingLoan.service.js";

export const existingLoanController = {
  async list(req, res, next) {
    try {
      const result = await existingLoanService.list(
        req.user.id,
        req.params.loanApplicationId,
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const result = await existingLoanService.create(
        req.user.id,
        req.params.loanApplicationId,
        req.body,
      );

      return res.status(201).json({
        success: true,
        message: "Existing loan added successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const result = await existingLoanService.update(
        req.user.id,
        req.params.existingLoanId,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Existing loan updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await existingLoanService.delete(req.user.id, req.params.existingLoanId);

      return res.status(200).json({
        success: true,
        message: "Existing loan removed successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
