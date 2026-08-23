import { Router } from "express";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createBusinessRegistrationSchema,
  updateBusinessRegistrationSchema,
} from "../validations/businessRegistration.validation.js";

import { businessRegistrationController } from "../controllers/businessRegistration.controller.js";

const router = Router();

router.use(protect, authorize("CUSTOMER"));

router.get(
  "/employment/:parentEmploymentId/registrations",
  businessRegistrationController.list,
);

router.post(
  "/employment/:parentEmploymentId/registrations",
  validate(createBusinessRegistrationSchema),
  businessRegistrationController.create,
);

router.patch(
  "/registrations/:registrationId",
  validate(updateBusinessRegistrationSchema),
  businessRegistrationController.update,
);

router.delete(
  "/registrations/:registrationId",
  businessRegistrationController.remove,
);

export default router;
