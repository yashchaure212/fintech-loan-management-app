import { Router } from "express";

import { loanTypeController } from "../controllers/loanType.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

import {
  createLoanTypeSchema,
  updateLoanTypeSchema,
  updateLoanStatusSchema,
} from "../validations/loanType.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// Public: active loan products
router.get("/public", loanTypeController.getPublic);

// Public: single active loan product
router.get("/public/:id", loanTypeController.getPublicById);

/*
|--------------------------------------------------------------------------
| CUSTOMER ROUTES
|--------------------------------------------------------------------------
*/

// Authenticated customer: active loan products
router.get(
  "/active",
  protect,
  authorize("CUSTOMER"),
  loanTypeController.getActive,
);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

// Create loan type
router.post(
  "/",
  protect,
  authorize("ADMIN"),
  validate(createLoanTypeSchema),
  loanTypeController.create,
);

// Get all loan types
router.get("/", protect, authorize("ADMIN"), loanTypeController.getAll);

// Get single loan type
router.get("/:id", protect, authorize("ADMIN"), loanTypeController.getById);

// Update loan type
router.patch(
  "/:id",
  protect,
  authorize("ADMIN"),
  validate(updateLoanTypeSchema),
  loanTypeController.update,
);

// Activate/deactivate loan type
router.patch(
  "/:id/status",
  protect,
  authorize("ADMIN"),
  validate(updateLoanStatusSchema),
  loanTypeController.updateStatus,
);

// Soft delete loan type
router.delete("/:id", protect, authorize("ADMIN"), loanTypeController.delete);

export default router;
