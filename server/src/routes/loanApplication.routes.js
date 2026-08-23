import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loanApplicationController } from "../controllers/loanApplication.controller.js";
import {
  createLoanApplicationSchema,
  updateLoanApplicationSchema,
  submitLoanApplicationSchema,
} from "../validations/loanApplication.validation.js";

const router = Router();

router.use(protect, authorize("CUSTOMER"));

router.post(
  "/",
  validate(createLoanApplicationSchema),
  loanApplicationController.create,
);

router.get("/", loanApplicationController.getMyApplications);

router.get("/:id", loanApplicationController.getById);

router.patch(
  "/:id",
  validate(updateLoanApplicationSchema),
  loanApplicationController.updateDraft,
);

router.post(
  "/:id/submit",
  validate(submitLoanApplicationSchema),
  loanApplicationController.submit,
);

export default router;