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
  upload.single("file"),
  validate(createLoanDocumentSchema),
  loanDocumentController.upload,
);

// Get documents for my loan application
router.get(
  "/application/:loanApplicationId/requirements",
  protect,
  loanDocumentController.getRequiredDocuments,
);

router.get(
  "/application/:loanApplicationId",
  protect,
  loanDocumentController.getMyDocuments,
);

// Get my document
router.get("/:id", protect, loanDocumentController.getById);

// Delete my document
router.delete("/:id", protect, loanDocumentController.delete);

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
