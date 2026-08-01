import { z } from "zod";

export const createAddressSchema = z.object({
  type: z.enum(["CURRENT", "PERMANENT", "OFFICE"]),

  line1: z.string().min(3),

  line2: z.string().optional(),

  city: z.string().min(2),

  state: z.string().min(2),

  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),
});
