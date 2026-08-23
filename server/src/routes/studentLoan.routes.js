import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createStudentLoanSchema,
  updateStudentLoanSchema,
  updateParentEmploymentSchema,
} from "../validations/studentLoan.validation.js";
import { studentLoanController } from "../controllers/studentLoan.controller.js";

const router = Router();

router.use(protect, authorize("CUSTOMER"));

router.get(
  "/application/:loanApplicationId",
  studentLoanController.getByApplicationId,
);

router.post(
  "/application/:loanApplicationId",
  validate(createStudentLoanSchema),
  studentLoanController.create,
);

router.patch(
  "/application/:loanApplicationId",
  validate(updateStudentLoanSchema),
  studentLoanController.update,
);

router.patch(
  "/parent/:parentId",
  validate(updateParentEmploymentSchema),
  studentLoanController.updateParent,
);

export default router;
