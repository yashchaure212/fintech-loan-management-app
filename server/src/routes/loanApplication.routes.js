import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loanApplicationController } from "../controllers/loanApplication.controller.js";
import { createLoanApplicationSchema } from "../validations/loanApplication.validation.js";

const router = Router();

router.post(
  "/",
  protect,
  validate(createLoanApplicationSchema),
  loanApplicationController.create,
);

router.get("/", protect, loanApplicationController.getMyApplications);

router.get("/:id", protect, loanApplicationController.getById);

export default router;
