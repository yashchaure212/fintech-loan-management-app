import AppError from "../utils/AppError.js";
import { emiPaymentRepository } from "../repositories/emiPayment.repository.js";
import { randomUUID } from "crypto";

export const emiPaymentService = {
  async create(userId, data) {
    const emi = await emiPaymentRepository.findEmiById(
      data.emiScheduleId,
      userId,
    );

    if (!emi) {
      throw new AppError("EMI not found", 404);
    }

    if (emi.status === "PAID") {
      throw new AppError("This EMI has already been paid", 400);
    }

    const paidAmount = Number(emi.paidAmount);

    const emiAmount = Number(emi.emiAmount);

    const paymentAmount = Number(data.amount);

    const remainingBeforePayment = Number(
      (emiAmount - paidAmount).toFixed(2),
    );

    if (paymentAmount > remainingBeforePayment) {
      throw new AppError(
        `Payment exceeds remaining amount ₹${remainingBeforePayment}`,
        400,
      );
    }

    const totalPaid = Number((paidAmount + paymentAmount).toFixed(2));

    const remainingAmount = Number((emiAmount - totalPaid).toFixed(2));

    let emiStatus = "PARTIALLY_PAID";

    let paymentDate = null;

    if (totalPaid >= emiAmount - 0.01) {
      emiStatus = "PAID";
      paymentDate = new Date();
    }

    const paymentReference = `PAY-${randomUUID().slice(0, 12).toUpperCase()}`;

    return emiPaymentRepository.transaction(async (tx) => {
      const payment = await emiPaymentRepository.createPayment(tx, {
        emiScheduleId: emi.id,

        paymentReference,

        amount: paymentAmount,

        paymentMethod: data.paymentMethod,

        paymentStatus: "SUCCESS",

        transactionId: data.transactionId,

        remarks: data.remarks,
      });

      await emiPaymentRepository.updateEmi(tx, emi.id, {
        paidAmount: totalPaid,

        paymentDate,

        status: emiStatus,
      });

      // Check if all EMIs are paid
      const pendingCount = await emiPaymentRepository.countPendingEmisForLoan(
        tx,
        emi.loanApplicationId,
      );

      if (pendingCount === 0) {
        await emiPaymentRepository.closeLoanApplication(
          tx,
          emi.loanApplicationId,
        );
      }

      return {
        payment,
        emiStatus,
        remainingAmount,
      };
    });
  },
};
