import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createAddressSchema } from "../validations/address.validation.js";
import { addressController } from "../controllers/address.controller.js";

const router = Router();

router.use(protect, authorize("CUSTOMER"));

router.post("/", validate(createAddressSchema), addressController.create);

router.get("/", addressController.getAll);

router.put("/:id", validate(createAddressSchema), addressController.update);

router.delete("/:id", addressController.remove);

export default router;
