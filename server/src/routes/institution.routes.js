import { Router } from "express";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createInstitutionSchema,
  updateInstitutionSchema,
} from "../validations/institution.validation.js";

import { institutionController } from "../controllers/institution.controller.js";

const router = Router();

/*
 * Public: school search, used by the school-loan wizard's
 * institution lookup. No auth required -- this is reference
 * data, not customer data.
 */
router.get("/search", institutionController.search);

/*
 * Admin: manage the institution directory.
 */
router.get("/", protect, authorize("ADMIN"), institutionController.list);

router.post(
  "/",
  protect,
  authorize("ADMIN"),
  validate(createInstitutionSchema),
  institutionController.create,
);

router.patch(
  "/:id",
  protect,
  authorize("ADMIN"),
  validate(updateInstitutionSchema),
  institutionController.update,
);

export default router;
