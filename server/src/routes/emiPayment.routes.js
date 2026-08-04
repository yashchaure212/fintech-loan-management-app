import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { emiPaymentController } from "../controllers/emiPayment.controller.js";
import { createPaymentSchema } from "../validations/emiPayment.validation.js";

const router = Router();

router.post(
  "/",
  protect,
  validate(createPaymentSchema),
  emiPaymentController.create,
);

export default router;
