import { Router } from "express";
import { loanWorkflowController } from "../controllers/loanWorkflow.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateLoanStatusSchema } from "../validations/loanWorkflow.validation.js";

const router = Router();

router.patch(
  "/:loanApplicationId/status",
  protect,
  authorize("ADMIN"),
  validate(updateLoanStatusSchema),
  loanWorkflowController.updateStatus,
);

export default router;