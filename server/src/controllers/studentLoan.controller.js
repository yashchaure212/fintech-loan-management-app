import { studentLoanService } from "../services/studentLoan.service.js";

export const studentLoanController = {
  async getByApplicationId(req, res, next) {
    try {
      const result = await studentLoanService.getByApplicationId(
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
      const result = await studentLoanService.create(
        req.user.id,
        req.params.loanApplicationId,
        req.body,
      );

      return res.status(201).json({
        success: true,
        message: "Student loan details saved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const result = await studentLoanService.update(
        req.user.id,
        req.params.loanApplicationId,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Student loan details updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateParent(req, res, next) {
    try {
      const result = await studentLoanService.updateParent(
        req.user.id,
        req.params.parentId,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Parent details updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
