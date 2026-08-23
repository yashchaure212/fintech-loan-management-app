import { emiPaymentService } from "../services/emiPayment.service.js";

export const emiPaymentController = {
  async getConfig(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: emiPaymentService.getConfig(),
      });
    } catch (error) {
      next(error);
    }
  },

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

  async createOrder(req, res, next) {
    try {
      const result = await emiPaymentService.createOrder(req.user.id, req.body);

      res.status(201).json({
        success: true,
        message: "Payment order created",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async verify(req, res, next) {
    try {
      const result = await emiPaymentService.verifyGatewayPayment(
        req.user.id,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
