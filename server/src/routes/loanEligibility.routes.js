import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loanEligibilityController } from "../controllers/loanEligibility.controller.js";
import {
  createLoanEligibilitySchema,
  updateLoanEligibilitySchema,
} from "../validations/loanEligibility.validation.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize("ADMIN"),
  validate(createLoanEligibilitySchema),
  loanEligibilityController.create,
);

router.get("/", protect, authorize("ADMIN"), loanEligibilityController.getAll);

router.get(
  "/:id",
  protect,
  authorize("ADMIN"),
  loanEligibilityController.getById,
);

router.patch(
  "/:id",
  protect,
  authorize("ADMIN"),
  validate(updateLoanEligibilitySchema),
  loanEligibilityController.update,
);

router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  loanEligibilityController.delete,
);

export default router;
