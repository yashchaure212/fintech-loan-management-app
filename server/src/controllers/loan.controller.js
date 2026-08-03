import { loanService } from "../services/loan.service.js";

export const loanController = {
  async create(req, res, next) {
    try {
      const result = await loanService.createApplication(req.user.id, req.body);

      return res.status(201).json({
        success: true,
        message: "Loan application submitted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
