import { z } from "zod";

export const documentSchema = z.object({
  documentType: z.enum([
    "PAN_CARD",

    "AADHAAR_CARD",

    "SALARY_SLIP",

    "BANK_STATEMENT",

    "PHOTO",
  ]),
});
