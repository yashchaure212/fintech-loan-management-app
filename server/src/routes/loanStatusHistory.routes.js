import { Router } from "express";
import { loanStatusHistoryController } from "../controllers/loanStatusHistory.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { createLoanStatusHistorySchema } from "../validations/loanStatusHistory.validation.js";

const router = Router();

router.post(
  "/",
  protect,
  validate(createLoanStatusHistorySchema),
  loanStatusHistoryController.create,
);

router.get(
  "/:loanApplicationId",
  protect,
  loanStatusHistoryController.getTimeline,
);

export default router;
