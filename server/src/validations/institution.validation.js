import { z } from "zod";

export const searchInstitutionSchema = z.object({
  q: z.string().trim().min(2, "Search query must be at least 2 characters"),
  city: z.string().trim().optional(),
});

export const createInstitutionSchema = z.object({
  name: z.string().trim().min(2).max(200),
  schoolId: z.string().trim().optional(),
  schoolType: z.enum(["GOVERNMENT", "PRIVATE", "OTHER"]),
  city: z.string().trim().min(2),
  taluka: z.string().trim().optional(),
  district: z.string().trim().optional(),
  state: z.string().trim().min(2),
});

export const updateInstitutionSchema = createInstitutionSchema
  .partial()
  .extend({
    isActive: z.boolean().optional(),
  });
