import { emiService } from "../services/emi.service.js";

export const emiController = {
  async getLoanSchedule(req, res, next) {
    try {
      const result = await emiService.getLoanSchedule(
        req.params.loanId,
        req.user.id,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const result = await emiService.getById(req.params.id, req.user.id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getPending(req, res, next) {
    try {
      const result = await emiService.getPendingEmis(req.user.id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
