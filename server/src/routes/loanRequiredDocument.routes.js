import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loanRequiredDocumentController } from "../controllers/loanRequiredDocument.controller.js";
import {
  createLoanRequiredDocumentSchema,
  updateLoanRequiredDocumentSchema,
} from "../validations/loanRequiredDocument.validation.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize("ADMIN"),
  validate(createLoanRequiredDocumentSchema),
  loanRequiredDocumentController.create,
);

router.get(
  "/",
  protect,
  authorize("ADMIN"),
  loanRequiredDocumentController.getAll,
);

router.get(
  "/:id",
  protect,
  authorize("ADMIN"),
  loanRequiredDocumentController.getById,
);

router.patch(
  "/:id",
  protect,
  authorize("ADMIN"),
  validate(updateLoanRequiredDocumentSchema),
  loanRequiredDocumentController.update,
);

router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  loanRequiredDocumentController.delete,
);

export default router;
