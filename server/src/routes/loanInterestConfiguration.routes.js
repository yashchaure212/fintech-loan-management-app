import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loanInterestConfigurationController } from "../controllers/loanInterestConfiguration.controller.js";
import {
  createLoanInterestConfigurationVersionSchema,
  updateLoanInterestConfigurationSchema,
  updateLoanInterestConfigurationStatusSchema,
} from "../validations/loanInterestConfiguration.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| CUSTOMER ROUTE (read-only)
|--------------------------------------------------------------------------
| The wizard reads the applicable terms from here so the frontend never
| hardcodes amounts, tenures, rates or fees. Customers can read pricing;
| only ADMIN can ever write it.
*/

router.get(
  "/applicable",
  protect,
  authorize("CUSTOMER", "ADMIN"),
  loanInterestConfigurationController.getApplicableForCustomer,
);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

// Active configuration + version timeline for the supported product
router.get(
  "/current",
  protect,
  authorize("ADMIN"),
  loanInterestConfigurationController.getSupportedProductConfiguration,
);

// Create a NEW version (never an in-place pricing edit)
router.post(
  "/",
  protect,
  authorize("ADMIN"),
  validate(createLoanInterestConfigurationVersionSchema),
  loanInterestConfigurationController.create,
);

router.get(
  "/",
  protect,
  authorize("ADMIN"),
  loanInterestConfigurationController.getAll,
);

router.get(
  "/history/:loanTypeId",
  protect,
  authorize("ADMIN"),
  loanInterestConfigurationController.getHistory,
);

router.get(
  "/:id",
  protect,
  authorize("ADMIN"),
  loanInterestConfigurationController.getById,
);

// Retained so a forgotten caller fails loudly instead of repricing history
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
