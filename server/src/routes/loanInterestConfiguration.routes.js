import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loanInterestConfigurationController } from "../controllers/loanInterestConfiguration.controller.js";
import {
  createLoanInterestConfigurationSchema,
  updateLoanInterestConfigurationSchema,
  updateLoanInterestConfigurationStatusSchema,
} from "../validations/loanInterestConfiguration.validation.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize("ADMIN"),
  validate(createLoanInterestConfigurationSchema),
  loanInterestConfigurationController.create,
);

router.get(
  "/",
  protect,
  authorize("ADMIN"),
  loanInterestConfigurationController.getAll,
);

router.get(
  "/:id",
  protect,
  authorize("ADMIN"),
  loanInterestConfigurationController.getById,
);

router.patch(
  "/:id",
  protect,
  authorize("ADMIN"),
  validate(updateLoanInterestConfigurationSchema),
  loanInterestConfigurationController.update,
);

router.patch(
  "/:id/status",
  protect,
  authorize("ADMIN"),
  validate(updateLoanInterestConfigurationStatusSchema),
  loanInterestConfigurationController.updateStatus,
);

router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  loanInterestConfigurationController.delete,
);

export default router;
