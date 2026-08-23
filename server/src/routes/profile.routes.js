import { Router } from "express";
import { profileController } from "../controllers/profile.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createProfileSchema } from "../validations/profile.validation.js";

const router = Router();

router.use(protect, authorize("CUSTOMER"));

router.post("/", validate(createProfileSchema), profileController.create);

router.get("/", profileController.get);

router.put("/", validate(createProfileSchema), profileController.update);

export default router;
