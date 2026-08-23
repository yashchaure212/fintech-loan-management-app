import { Router } from "express";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createSchoolLoanSchema,
  updateSchoolLoanSchema,
  updateCoApplicantSchema,
} from "../validations/schoolLoan.validation.js";

import { schoolLoanController } from "../controllers/schoolLoan.controller.js";

const router = Router();

router.use(protect, authorize("CUSTOMER"));

router.get(
  "/application/:loanApplicationId",
  schoolLoanController.getByApplicationId,
);

router.post(
  "/application/:loanApplicationId",
  validate(createSchoolLoanSchema),
  schoolLoanController.create,
);

router.patch(
  "/application/:loanApplicationId",
  validate(updateSchoolLoanSchema),
  schoolLoanController.update,
);

router.patch(
  "/co-applicant/:coApplicantId",
  validate(updateCoApplicantSchema),
  schoolLoanController.updateCoApplicant,
);

export default router;
