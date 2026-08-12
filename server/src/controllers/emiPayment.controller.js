import { emiPaymentService } from "../services/emiPayment.service.js";

export const emiPaymentController = {
  async create(req, res, next) {
    try {
      const result = await emiPaymentService.create(req.user.id, req.body);

      res.status(201).json({
        success: true,
        message: "Payment recorded successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
