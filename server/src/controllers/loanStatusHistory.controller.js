import { loanStatusHistoryService } from "../services/loanStatusHistory.service.js";

export const loanStatusHistoryController = {
  async create(req, res, next) {
    try {
      const result = await loanStatusHistoryService.create({
        ...req.body,
        changedById: req.user.id,
      });

      return res.status(201).json({
        success: true,
        message: "Loan status history created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getTimeline(req, res, next) {
    try {
      const result = await loanStatusHistoryService.getTimeline(
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
};
