import { Router } from "express";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createExistingLoanSchema,
  updateExistingLoanSchema,
} from "../validations/existingLoan.validation.js";

import { existingLoanController } from "../controllers/existingLoan.controller.js";

const router = Router();

router.use(protect, authorize("CUSTOMER"));

router.get(
  "/:loanApplicationId/existing-loans",
  existingLoanController.list,
);

router.post(
  "/:loanApplicationId/existing-loans",
  validate(createExistingLoanSchema),
  existingLoanController.create,
);

router.patch(
  "/existing-loans/:existingLoanId",
  validate(updateExistingLoanSchema),
  existingLoanController.update,
);

router.delete(
  "/existing-loans/:existingLoanId",
  existingLoanController.remove,
);

export default router;
