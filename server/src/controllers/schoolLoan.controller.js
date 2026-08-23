import { schoolLoanService } from "../services/schoolLoan.service.js";

export const schoolLoanController = {
  async getByApplicationId(req, res, next) {
    try {
      const result = await schoolLoanService.getByApplicationId(
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
      const result = await schoolLoanService.create(
        req.user.id,
        req.params.loanApplicationId,
        req.body,
      );

      return res.status(201).json({
        success: true,
        message: "Student details saved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const result = await schoolLoanService.update(
        req.user.id,
        req.params.loanApplicationId,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "School loan details updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateCoApplicant(req, res, next) {
    try {
      const result = await schoolLoanService.updateCoApplicant(
        req.user.id,
        req.params.coApplicantId,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Co-applicant details updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
