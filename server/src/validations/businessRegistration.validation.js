import { z } from "zod";

const businessRegistrationSchema = z.object({
  registrationType: z.enum([
    "GST",
    "UDYAM",
    "SHOP_ESTABLISHMENT",
    "TRADE_LICENSE",
    "OTHER",
  ]),
  registrationNumber: z.string().trim().min(1).max(100),
  issueDate: z.coerce.date().optional(),
  expiryDate: z.coerce.date().optional(),
});

export const createBusinessRegistrationSchema = businessRegistrationSchema;

export const updateBusinessRegistrationSchema =
  businessRegistrationSchema.partial();
