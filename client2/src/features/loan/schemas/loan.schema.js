import { z } from "zod";

const optionalPositiveNumber = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }

  return value;
}, z.coerce.number().positive("Enter valid amount").optional());

const optionalPositiveInt = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }

  return value;
}, z.coerce.number().int().positive("Enter valid tenure").optional());

export const loanSchema = z.object({
  loanTypeId: z.string().min(1, "Select loan type"),

  loanAmount: optionalPositiveNumber,

  tenureMonths: optionalPositiveInt,
});
