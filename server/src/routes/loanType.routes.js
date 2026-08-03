import { Router } from "express";
import { loanTypeController } from "../controllers/loanType.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createLoanTypeSchema,
  updateLoanTypeSchema,
  updateLoanStatusSchema,
} from "../validations/loanType.validation.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize("ADMIN"),
  validate(createLoanTypeSchema),
  loanTypeController.create,
);

router.get("/", protect, authorize("ADMIN"), loanTypeController.getAll);

router.get("/:id", protect, authorize("ADMIN"), loanTypeController.getById);

router.patch(
  "/:id",
  protect,
  authorize("ADMIN"),
  validate(updateLoanTypeSchema),
  loanTypeController.update,
);

router.patch(
  "/:id/status",
  protect,
  authorize("ADMIN"),
  validate(updateLoanStatusSchema),
  loanTypeController.updateStatus,
);

router.delete("/:id", protect, authorize("ADMIN"), loanTypeController.delete);

export default router;
