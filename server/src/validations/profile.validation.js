import { z } from "zod";

export const createProfileSchema = z.object({
  firstName: z.string().min(2).max(50),

  lastName: z.string().max(50).optional(),

  dateOfBirth: z.string().optional(),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),

  panNumber: z.string().length(10).optional(),

  aadhaarNumber: z.string().length(12).optional(),
});
