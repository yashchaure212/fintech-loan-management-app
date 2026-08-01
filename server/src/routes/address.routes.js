import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createAddressSchema } from "../validations/address.validation.js";
import { addressController } from "../controllers/address.controller.js";

const router = Router();

router.post(
  "/",
  protect,
  validate(createAddressSchema),
  addressController.create,
);

router.get("/", protect, addressController.getAll);

router.put(
  "/:id",
  protect,
  validate(createAddressSchema),
  addressController.update,
);

router.delete("/:id", protect, addressController.remove);

export default router;
