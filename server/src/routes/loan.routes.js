import { Router } from "express";
import { loanController } from "../controllers/loan.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { createLoanApplicationSchema } from "../validations/loan.validation.js";

const router = Router();

router.post(
  "/",
  protect,
  validate(createLoanApplicationSchema),
  loanController.create,
);

export default router;
