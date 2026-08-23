import AppError from "../utils/AppError.js";
import { emiPaymentRepository } from "../repositories/emiPayment.repository.js";
import { env, isPaymentsDemo } from "../config/env.js";
import { randomUUID, createHmac, timingSafeEqual } from "crypto";

async function applySuccessfulPayment(emi, paymentAmount, extras = {}) {
  const paidAmount = Number(emi.paidAmount);
  const emiAmount = Number(emi.emiAmount);
  const totalPaid = Number((paidAmount + paymentAmount).toFixed(2));
  const remainingAmount = Number((emiAmount - totalPaid).toFixed(2));

  let emiStatus = "PARTIALLY_PAID";
  let paymentDate = null;

  if (totalPaid >= emiAmount - 0.01) {
    emiStatus = "PAID";
    paymentDate = new Date();
  }

  return emiPaymentRepository.transaction(async (tx) => {
    const payment = extras.existingPaymentId
      ? await emiPaymentRepository.updatePayment(tx, extras.existingPaymentId, {
          paymentStatus: "SUCCESS",
          transactionId: extras.transactionId,
          remarks: extras.remarks,
          paidAt: new Date(),
        })
      : await emiPaymentRepository.createPayment(tx, {
          emiScheduleId: emi.id,
          paymentReference: extras.paymentReference,
          amount: paymentAmount,
          paymentMethod: extras.paymentMethod,
          paymentStatus: "SUCCESS",
          transactionId: extras.transactionId,
          remarks: extras.remarks,
        });

    await emiPaymentRepository.updateEmi(tx, emi.id, {
      paidAmount: totalPaid,
      paymentDate,
      status: emiStatus,
    });

    const pendingCount = await emiPaymentRepository.countPendingEmisForLoan(
      tx,
      emi.loanApplicationId,
    );

    if (pendingCount === 0) {
      await emiPaymentRepository.closeLoanApplication(tx, emi.loanApplicationId);
    }

    return {
      payment,
      emiStatus,
      remainingAmount,
    };
  });
}

function remainingFor(emi) {
  return Number((Number(emi.emiAmount) - Number(emi.paidAmount)).toFixed(2));
}

function assertPaymentAmount(emi, paymentAmount) {
  const remainingBeforePayment = remainingFor(emi);

  if (paymentAmount > remainingBeforePayment) {
    throw new AppError(
      `Payment exceeds remaining amount ₹${remainingBeforePayment}`,
      400,
    );
  }
}

async function createRazorpayOrder({ amountPaise, receipt }) {
  const credentials = Buffer.from(
    `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`,
  ).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new AppError(payload?.error?.description || "Unable to create payment order", 502);
  }

  return payload;
}

function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const expected = createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  return (
    expectedBuffer.length === signatureBuffer.length &&
    timingSafeEqual(expectedBuffer, signatureBuffer)
  );
}

export const emiPaymentService = {
  getConfig() {
    return {
      mode: isPaymentsDemo() ? "demo" : "live",
      razorpayKeyId: isPaymentsDemo() ? null : env.RAZORPAY_KEY_ID || null,
    };
  },

  async create(userId, data) {
    if (!isPaymentsDemo()) {
      throw new AppError(
        "Self-reported payments are disabled. Complete checkout through the payment gateway.",
        400,
      );
    }

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

    const paymentAmount = Number(data.amount);
    assertPaymentAmount(emi, paymentAmount);

    const paymentReference = `PAY-${randomUUID().slice(0, 12).toUpperCase()}`;

    return applySuccessfulPayment(emi, paymentAmount, {
      paymentReference,
      paymentMethod: data.paymentMethod,
      transactionId: data.transactionId,
      remarks: data.remarks,
    });
  },

  async createOrder(userId, data) {
    if (isPaymentsDemo()) {
      throw new AppError("Gateway checkout is not used in demo payment mode", 400);
    }

    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      throw new AppError("Payment gateway is not configured", 503);
    }

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

    const paymentAmount = Number(data.amount);
    assertPaymentAmount(emi, paymentAmount);

    const paymentReference = `PAY-${randomUUID().slice(0, 12).toUpperCase()}`;
    const order = await createRazorpayOrder({
      amountPaise: Math.round(paymentAmount * 100),
      receipt: paymentReference.slice(0, 40),
    });

    const payment = await emiPaymentRepository.transaction(async (tx) => {
      return emiPaymentRepository.createPayment(tx, {
        emiScheduleId: emi.id,
        paymentReference,
        amount: paymentAmount,
        paymentMethod: data.paymentMethod || "UPI",
        paymentStatus: "PENDING",
        transactionId: order.id,
        remarks: data.remarks,
      });
    });

    return {
      orderId: order.id,
      amount: paymentAmount,
      currency: "INR",
      keyId: env.RAZORPAY_KEY_ID,
      paymentId: payment.id,
    };
  },

  async verifyGatewayPayment(userId, data) {
    if (isPaymentsDemo()) {
      throw new AppError("Gateway verification is not used in demo payment mode", 400);
    }

    const valid = verifyRazorpaySignature({
      orderId: data.razorpayOrderId,
      paymentId: data.razorpayPaymentId,
      signature: data.razorpaySignature,
    });

    if (!valid) {
      throw new AppError("Payment signature could not be verified", 400);
    }

    const pendingPayment = await emiPaymentRepository.findPaymentByTransactionId(
      data.razorpayOrderId,
      userId,
    );

    if (!pendingPayment || pendingPayment.paymentStatus !== "PENDING") {
      throw new AppError("Payment order not found", 404);
    }

    const emi = pendingPayment.emiSchedule;

    if (emi.status === "PAID") {
      throw new AppError("This EMI has already been paid", 400);
    }

    return applySuccessfulPayment(emi, Number(pendingPayment.amount), {
      existingPaymentId: pendingPayment.id,
      transactionId: data.razorpayPaymentId,
      remarks: pendingPayment.remarks,
    });
  },
};
