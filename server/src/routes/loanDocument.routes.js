import { Router } from "express";

import { loanDocumentController } from "../controllers/loanDocument.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createLoanDocumentSchema,
  verifyLoanDocumentSchema,
  rejectLoanDocumentSchema,
} from "../validations/loanDocument.validation.js";

import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

/*

* Customer
  */

// Upload document
router.post(
  "/",
  protect,
  authorize("CUSTOMER"),
  upload.single("file"),
  validate(createLoanDocumentSchema),
  loanDocumentController.upload,
);

router.get(
  "/application/:loanApplicationId/requirements",
  protect,
  authorize("CUSTOMER"),
  loanDocumentController.getRequiredDocuments,
);

router.get(
  "/application/:loanApplicationId",
  protect,
  authorize("CUSTOMER"),
  loanDocumentController.getMyDocuments,
);

router.get("/:id", protect, authorize("CUSTOMER"), loanDocumentController.getById);

router.delete(
  "/:id",
  protect,
  authorize("CUSTOMER"),
  loanDocumentController.delete,
);

/*

* Admin
  */

// Verify document
router.patch(
  "/:id/verify",
  protect,
  authorize("ADMIN"),
  validate(verifyLoanDocumentSchema),
  loanDocumentController.verify,
);

// Reject document
router.patch(
  "/:id/reject",
  protect,
  authorize("ADMIN"),
  validate(rejectLoanDocumentSchema),
  loanDocumentController.reject,
);

export default router;
