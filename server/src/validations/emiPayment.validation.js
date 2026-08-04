import { z } from "zod";

export const createPaymentSchema = z.object({
  emiScheduleId: z.uuid(),

  amount: z.number().positive(),

  paymentMethod: z.enum(["CASH", "UPI", "BANK_TRANSFER", "CARD", "CHEQUE"]),

  transactionId: z.string().trim().optional(),

  remarks: z.string().trim().max(500).optional(),
});
