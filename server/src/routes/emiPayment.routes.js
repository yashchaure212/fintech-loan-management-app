import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { emiPaymentController } from "../controllers/emiPayment.controller.js";
import {
  createPaymentSchema,
  createPaymentOrderSchema,
  verifyPaymentSchema,
} from "../validations/emiPayment.validation.js";

const router = Router();

router.use(protect, authorize("CUSTOMER"));

router.get("/config", emiPaymentController.getConfig);

router.post(
  "/",
  validate(createPaymentSchema),
  emiPaymentController.create,
);

router.post(
  "/orders",
  validate(createPaymentOrderSchema),
  emiPaymentController.createOrder,
);

router.post(
  "/verify",
  validate(verifyPaymentSchema),
  emiPaymentController.verify,
);

export default router;
