import { Router } from "express";

import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createEducationLoanSchema,
  updateEducationLoanSchema,
  updateParentEmploymentSchema,
} from "../validations/educationLoan.validation.js";

import { educationLoanController } from "../controllers/educationLoan.controller.js";

const router = Router();

/*
 * Customer
 */

/*
 * Get education-loan details
 * for a specific loan application
 */
router.get(
  "/application/:loanApplicationId",
  protect,
  educationLoanController.getByApplicationId,
);

/*
 * Create education-loan details
 */
router.post(
  "/application/:loanApplicationId",
  protect,
  validate(createEducationLoanSchema),
  educationLoanController.create,
);

/*
 * Update education-loan details
 */
router.patch(
  "/application/:loanApplicationId",
  protect,
  validate(updateEducationLoanSchema),
  educationLoanController.update,
);

/*
 * Update parent + employment details
 */
router.patch(
  "/parent/:parentId",
  protect,
  validate(
    updateParentEmploymentSchema,
  ),
  educationLoanController.updateParent,
);

export default router;