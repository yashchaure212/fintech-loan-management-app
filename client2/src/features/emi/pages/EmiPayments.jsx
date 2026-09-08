import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CreditCard,
  IndianRupee,
  Landmark,
  LockKeyhole,
  Smartphone,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/features/loan/utils/loanFormatters";

import {
  useCreateEmiPaymentMutation,
  useCreateEmiPaymentOrderMutation,
  useGetLoanEmiScheduleQuery,
  useGetPaymentConfigQuery,
  useGetPendingEmisQuery,
  useVerifyEmiPaymentMutation,
} from "../api/emiApi";

/* ============================================================
   PAYMENT METHODS
============================================================ */

const PAYMENT_METHODS = [
  {
    value: "UPI",
    label: "UPI",
    description: "Pay using UPI",
    icon: Smartphone,
  },
  {
    value: "BANK_TRANSFER",
    label: "Bank transfer",
    description: "Pay through your bank",
    icon: Landmark,
  },
  {
    value: "CARD",
    label: "Card",
    description: "Debit or credit card",
    icon: CreditCard,
  },
  {
    value: "CASH",
    label: "Cash",
    description: "Record a cash payment",
    icon: Wallet,
  },
  {
    value: "CHEQUE",
    label: "Cheque",
    description: "Record a cheque payment",
    icon: Landmark,
  },
];

/* ============================================================
   HELPERS
============================================================ */

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getRemainingAmount(emi) {
  return Number(
    (
      Number(emi.emiAmount || 0) -
      Number(emi.paidAmount || 0)
    ).toFixed(2),
  );
}

function getLoanName(loan) {
  return loan?.loanType?.name || "Loan";
}

function getStatusLabel(status) {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "PARTIALLY_PAID":
      return "Partially paid";
    case "OVERDUE":
      return "Overdue";
    case "PAID":
      return "Paid";
    default:
      return status || "-";
  }
}

/* ============================================================
   RAZORPAY
============================================================ */

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () =>
      reject(new Error("Unable to load Razorpay"));

    document.body.appendChild(script);
  });
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

function EmiPayments() {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
  } = useGetPendingEmisQuery();

  const { data: configResponse } =
    useGetPaymentConfigQuery();

  const [createPayment, { isLoading: isPaying }] =
    useCreateEmiPaymentMutation();

  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateEmiPaymentOrderMutation();

  const [verifyPayment, { isLoading: isVerifying }] =
    useVerifyEmiPaymentMutation();

  const [selectedEmi, setSelectedEmi] =
    useState(null);

  const [selectedLoanId, setSelectedLoanId] =
    useState(null);

  const [amount, setAmount] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  const [remarks, setRemarks] = useState("");

  /* ==========================================================
     PENDING EMIS
  ========================================================== */

  const pendingEmis = useMemo(() => {
    const emis = data?.data || [];

    return [...emis].sort((a, b) => {
      const installmentA = Number(
        a.installmentNumber || 0,
      );

      const installmentB = Number(
        b.installmentNumber || 0,
      );

      return installmentA - installmentB;
    });
  }, [data]);

  /* ==========================================================
     FIRST PAYABLE EMI
  ========================================================== */

  const payableEmiId = useMemo(() => {
    const firstUnpaidEmi = pendingEmis.find(
      (emi) => getRemainingAmount(emi) > 0,
    );

    return firstUnpaidEmi?.id || null;
  }, [pendingEmis]);

  /* ==========================================================
     TOTAL DUE
  ========================================================== */

  const totalDue = useMemo(
    () =>
      pendingEmis.reduce(
        (sum, emi) =>
          sum + getRemainingAmount(emi),
        0,
      ),
    [pendingEmis],
  );

  /* ==========================================================
     SCHEDULE
  ========================================================== */

  const {
    data: scheduleResponse,
    isLoading: isScheduleLoading,
    isError: isScheduleError,
  } = useGetLoanEmiScheduleQuery(
    selectedLoanId,
    {
      skip: !selectedLoanId,
    },
  );

  const repaymentSchedule =
    scheduleResponse?.data || [];

  /* ==========================================================
     UNIQUE LOANS
  ========================================================== */

  const loans = useMemo(() => {
    const map = new Map();

    pendingEmis.forEach((emi) => {
      const loan = emi.loanApplication;

      if (loan?.id && !map.has(loan.id)) {
        map.set(loan.id, loan);
      }
    });

    return Array.from(map.values());
  }, [pendingEmis]);

  /* ==========================================================
     PAYABLE CHECK
  ========================================================== */

  function isEmiPayable(emi) {
    return emi.id === payableEmiId;
  }

  /* ==========================================================
     OPEN PAYMENT
  ========================================================== */

  function openPaymentDialog(emi) {
    if (!isEmiPayable(emi)) {
      toast.info(
        "Please complete the earlier EMI first.",
      );
      return;
    }

    setSelectedEmi(emi);

    setAmount(
      String(getRemainingAmount(emi)),
    );

    setPaymentMethod("UPI");

    setRemarks("");
  }

  /* ==========================================================
     CLOSE PAYMENT
  ========================================================== */

  function closePaymentDialog() {
    setSelectedEmi(null);
    setAmount("");
    setRemarks("");
  }

  /* ==========================================================
     PAYMENT
  ========================================================== */

  async function handlePay() {
    if (!selectedEmi) return;

    if (!isEmiPayable(selectedEmi)) {
      toast.error(
        "This EMI is not currently payable.",
      );
      return;
    }

    const paymentAmount = Number(amount);

    const remaining =
      getRemainingAmount(selectedEmi);

    if (!paymentAmount || paymentAmount <= 0) {
      toast.error(
        "Enter a valid payment amount",
      );
      return;
    }

    if (paymentAmount > remaining) {
      toast.error(
        `Payment cannot exceed ${formatCurrency(
          remaining,
        )}`,
      );
      return;
    }

    try {
      const paymentMode =
        configResponse?.data?.mode || "demo";

      /* ======================================================
         LIVE RAZORPAY
      ====================================================== */

      if (paymentMode === "live") {
        await loadRazorpay();

        const orderResponse =
          await createOrder({
            emiScheduleId: selectedEmi.id,
            amount: paymentAmount,
            paymentMethod,
            remarks:
              remarks.trim() || undefined,
          }).unwrap();

        const options = {
          key: orderResponse.data.keyId,

          amount: Math.round(
            paymentAmount * 100,
          ),

          currency: "INR",

          name: "LoanPro",

          description: `EMI ${selectedEmi.installmentNumber}`,

          order_id:
            orderResponse.data.orderId,

          handler: async (response) => {
            try {
              await verifyPayment({
                razorpayOrderId:
                  response.razorpay_order_id,

                razorpayPaymentId:
                  response.razorpay_payment_id,

                razorpaySignature:
                  response.razorpay_signature,
              }).unwrap();

              toast.success(
                "Payment verified successfully",
              );

              closePaymentDialog();
            } catch (error) {
              toast.error(
                error?.data?.message ||
                  "Unable to verify payment",
              );
            }
          },
        };

        const checkout =
          new window.Razorpay(options);

        checkout.open();

        return;
      }

      /* ======================================================
         DEMO / MANUAL PAYMENT
      ====================================================== */

      const response =
        await createPayment({
          emiScheduleId: selectedEmi.id,
          amount: paymentAmount,
          paymentMethod,
          remarks:
            remarks.trim() || undefined,
        }).unwrap();

      toast.success(
        response?.message ||
          "Payment recorded successfully",
      );

      closePaymentDialog();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          "Unable to record payment",
      );
    }
  }

  /* ==========================================================
     LOADING
  ========================================================== */

  if (isLoading) {
    return <PaymentSkeleton />;
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (isError) {
    return (
      <div className="space-y-8">
        <section className="border-b border-border pb-8">
          <span className="section-eyebrow">
            Payments
          </span>

          <h1 className="page-title mt-3">
            Unable to load payments
          </h1>

          <p className="mt-2 max-w-xl text-helper">
            Something went wrong while loading
            your EMI information. Please refresh
            the page and try again.
          </p>

          <Button
            className="mt-6"
            onClick={() =>
              window.location.reload()
            }
          >
            Refresh page
          </Button>
        </section>
      </div>
    );
  }

  const paymentMode =
    configResponse?.data?.mode || "demo";

  return (
    <div className="space-y-7">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-border pb-5">
        <span className="section-eyebrow">
          Payments
        </span>

        <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="page-title">
              EMI payments
            </h1>

            <p className="mt-1 max-w-2xl text-helper">
              View your upcoming installments
              and make payments against your
              active loans.
            </p>
          </div>

          <div className="shrink-0 sm:border-l-2 sm:border-primary sm:pl-4">
            <p className="financial-label">
              Total due now
            </p>

            <p className="financial-value mt-0.5 text-xl">
              {formatCurrency(totalDue)}
            </p>

            <p className="mt-0.5 text-caption">
              {pendingEmis.length}{" "}
              {pendingEmis.length === 1
                ? "installment"
                : "installments"}{" "}
              pending
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          PAYMENT STATUS
      ====================================================== */}

      <section className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary-soft text-primary">
            <LockKeyhole className="size-4" />
          </span>

          <div className="min-w-0">
            <p className="text-sm font-semibold">
              {paymentMode === "live"
                ? "Secure online payments"
                : "Demo payment mode"}
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              {paymentMode === "live"
                ? "Payments are securely processed through Razorpay."
                : "Payments are recorded directly in the system."}
            </p>
          </div>
        </div>

        {paymentMode === "live" && (
          <span className="hidden shrink-0 text-xs font-medium text-primary sm:block">
            Razorpay secured
          </span>
        )}
      </section>

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      {pendingEmis.length === 0 ? (
        <section className="border-y border-dashed border-border py-12 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary">
            <IndianRupee className="size-5" />
          </div>

          <h2 className="mt-3 text-sm font-semibold">
            No EMI payments due
          </h2>

          <p className="mx-auto mt-1 max-w-md text-helper">
            Your pending installments will
            appear here after your loan is
            disbursed.
          </p>

          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() =>
              navigate("/customer/loans")
            }
          >
            View my loans
            <ArrowRight />
          </Button>
        </section>
      ) : (
        <>
          {/* ==================================================
              UPCOMING PAYMENTS
          ================================================== */}

          <section>
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="section-title">
                  Upcoming payments
                </p>

                <p className="mt-0.5 text-caption">
                  Complete your installments in
                  order.
                </p>
              </div>

              <p className="hidden text-xs text-muted-foreground sm:block">
                {pendingEmis.length}{" "}
                {pendingEmis.length === 1
                  ? "payment"
                  : "payments"}
              </p>
            </div>

            <div className="divide-y border-y border-border">
              {pendingEmis.map((emi) => {
                const remaining =
                  getRemainingAmount(emi);

                const loan =
                  emi.loanApplication;

                const payable =
                  isEmiPayable(emi);

                return (
                  <EmiRow
                    key={emi.id}
                    emi={emi}
                    loan={loan}
                    remaining={remaining}
                    payable={payable}
                    onPay={() =>
                      openPaymentDialog(emi)
                    }
                    onDetails={() => {
                      if (loan?.id) {
                        navigate(
                          `/customer/loans/${loan.id}`,
                        );
                      }
                    }}
                  />
                );
              })}
            </div>
          </section>

          {/* ==================================================
              REPAYMENT SCHEDULE
          ================================================== */}

          <section className="border-t border-border pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-title">
                  Repayment schedule
                </p>

                <p className="mt-0.5 text-caption">
                  View the complete EMI schedule
                  for your loan.
                </p>
              </div>

              {loans.length > 0 && (
                <div className="relative w-full sm:w-72">
                  <select
                    value={
                      selectedLoanId ||
                      loans[0]?.id ||
                      ""
                    }
                    onChange={(event) =>
                      setSelectedLoanId(
                        event.target.value,
                      )
                    }
                    className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm font-medium outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    {loans.map((loan) => (
                      <option
                        key={loan.id}
                        value={loan.id}
                      >
                        {getLoanName(loan)}
                        {loan.applicationNumber
                          ? ` · ${loan.applicationNumber}`
                          : ""}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              )}
            </div>

            <RepaymentSchedule
              schedule={repaymentSchedule}
              isLoading={isScheduleLoading}
              isError={isScheduleError}
            />
          </section>
        </>
      )}

      {/* ======================================================
          PAYMENT DIALOG
      ====================================================== */}

      <Dialog
        open={Boolean(selectedEmi)}
        onOpenChange={(open) => {
          if (!open) {
            closePaymentDialog();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Make EMI payment
            </DialogTitle>

            <DialogDescription>
              Enter the amount you would like to
              pay toward this installment.
            </DialogDescription>
          </DialogHeader>

          {selectedEmi ? (
            <div className="space-y-4">
              {/* SUMMARY */}

              <div className="border-y border-border py-3.5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Installment{" "}
                      {selectedEmi.installmentNumber}
                    </p>

                    <p className="mt-0.5 text-caption">
                      Due{" "}
                      {formatDate(
                        selectedEmi.dueDate,
                      )}
                    </p>
                  </div>

                  <StatusBadge
                    status={selectedEmi.status}
                    type="emi"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="financial-label">
                    Remaining
                  </span>

                  <span className="text-base font-bold tabular-nums">
                    {formatCurrency(
                      getRemainingAmount(
                        selectedEmi,
                      ),
                    )}
                  </span>
                </div>
              </div>

              {/* AMOUNT */}

              <div className="space-y-1.5">
                <label
                  className="text-sm font-medium"
                  htmlFor="emi-amount"
                >
                  Payment amount
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ₹
                  </span>

                  <input
                    id="emi-amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(event) =>
                      setAmount(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-8 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Maximum:{" "}
                  {formatCurrency(
                    getRemainingAmount(
                      selectedEmi,
                    ),
                  )}
                </p>
              </div>

              {/* PAYMENT METHODS */}

              <div>
                <p className="text-sm font-medium">
                  Payment method
                </p>

                <div className="mt-2 space-y-2">
                  {PAYMENT_METHODS.map(
                    (method) => {
                      const Icon = method.icon;

                      const selected =
                        paymentMethod ===
                        method.value;

                      return (
                        <button
                          key={method.value}
                          type="button"
                          onClick={() =>
                            setPaymentMethod(
                              method.value,
                            )
                          }
                          className={[
                            "grid w-full grid-cols-[20px_38px_minmax(0,1fr)] items-center gap-2.5 rounded-lg border px-2.5 py-2.5 text-left transition-colors",
                            selected
                              ? "border-primary bg-primary-soft"
                              : "border-border bg-card hover:bg-muted/50",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "size-4 rounded-full border",
                              "relative",
                              selected
                                ? "border-primary"
                                : "border-muted-foreground/40",
                            ].join(" ")}
                          >
                            {selected && (
                              <span className="absolute inset-1 rounded-full bg-primary" />
                            )}
                          </span>

                          <span className="grid size-9 place-items-center rounded-md bg-muted text-primary">
                            <Icon className="size-[18px]" />
                          </span>

                          <span>
                            <span className="block text-[13px] font-semibold">
                              {method.label}
                            </span>

                            <span className="block text-[11px] text-muted-foreground">
                              {method.description}
                            </span>
                          </span>
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              {/* REMARKS */}

              <div className="space-y-1.5">
                <label
                  className="text-sm font-medium"
                  htmlFor="payment-remarks"
                >
                  Remarks{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>

                <textarea
                  id="payment-remarks"
                  rows={2}
                  value={remarks}
                  onChange={(event) =>
                    setRemarks(
                      event.target.value,
                    )
                  }
                  placeholder="Add a note if needed..."
                  className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={closePaymentDialog}
              disabled={
                isPaying ||
                isCreatingOrder ||
                isVerifying
              }
            >
              Cancel
            </Button>

            <Button
              size="sm"
              onClick={handlePay}
              disabled={
                isPaying ||
                isCreatingOrder ||
                isVerifying
              }
            >
              {isPaying ||
              isCreatingOrder ||
              isVerifying
                ? "Processing..."
                : "Pay now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============================================================
   EMI ROW
============================================================ */

function EmiRow({
  emi,
  loan,
  remaining,
  payable,
  onPay,
  onDetails,
}) {
  const isPaid = remaining <= 0;

  return (
    <article className="group py-4 sm:py-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        {/* INFORMATION */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <h2 className="text-sm font-semibold">
              {getLoanName(loan)}
            </h2>

            <span className="text-xs text-muted-foreground">
              ·
            </span>

            <span className="text-xs text-muted-foreground">
              Installment{" "}
              {emi.installmentNumber}
            </span>

            <StatusBadge
              status={emi.status}
              type="emi"
            />
          </div>

          {loan?.applicationNumber ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {loan.applicationNumber}
            </p>
          ) : null}

          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 sm:gap-x-10">
            <PaymentDetail
              label="Due date"
              value={formatDate(emi.dueDate)}
            />

            <PaymentDetail
              label="EMI amount"
              value={formatCurrency(
                emi.emiAmount,
              )}
            />

            <PaymentDetail
              label="Remaining"
              value={formatCurrency(
                remaining,
              )}
              emphasize
            />
          </div>
        </div>

        {/* ACTIONS */}

        <div className="flex shrink-0 items-center gap-2 border-t border-border pt-3 lg:border-t-0 lg:pt-0">
          {isPaid ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <CircleCheck className="size-4" />
              Paid
            </span>
          ) : payable ? (
            <Button
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={onPay}
            >
              Pay EMI
              <ArrowRight />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="flex-1 sm:flex-none"
            >
              <LockKeyhole />
              Upcoming
            </Button>
          )}

          {loan?.id ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDetails}
            >
              Details
              <ChevronRight className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   REPAYMENT SCHEDULE
============================================================ */

function RepaymentSchedule({
  schedule,
  isLoading,
  isError,
}) {
  if (isLoading) {
    return (
      <div className="mt-4 divide-y border-y border-border">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="grid grid-cols-4 gap-4 px-3 py-4"
          >
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-4 border-y border-dashed border-border py-8 text-center">
        <p className="text-sm font-semibold">
          Unable to load repayment schedule
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  if (!schedule.length) {
    return (
      <div className="mt-4 border-y border-dashed border-border py-8 text-center">
        <p className="text-sm font-semibold">
          No repayment schedule available
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          The schedule will appear here once
          your loan is disbursed.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card">
      {/* DESKTOP HEADER */}

      <div className="hidden grid-cols-[70px_1fr_120px_120px_120px] gap-4 border-b border-border bg-muted/30 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground md:grid">
        <span>EMI</span>
        <span>Due date</span>
        <span>Amount</span>
        <span>Paid</span>
        <span>Status</span>
      </div>

      {/* ROWS */}

      <div className="divide-y divide-border">
        {schedule.map((emi) => {
          const remaining =
            getRemainingAmount(emi);

          const isPaid = remaining <= 0;

          return (
            <div
              key={emi.id}
              className="px-3 py-3.5 transition-colors hover:bg-muted/20"
            >
              {/* MOBILE */}

              <div className="grid grid-cols-2 gap-x-5 gap-y-3 md:hidden">
                <ScheduleDetail
                  label="Installment"
                  value={`#${emi.installmentNumber}`}
                />

                <ScheduleDetail
                  label="Due date"
                  value={formatDate(
                    emi.dueDate,
                  )}
                />

                <ScheduleDetail
                  label="EMI amount"
                  value={formatCurrency(
                    emi.emiAmount,
                  )}
                />

                <ScheduleDetail
                  label="Paid"
                  value={formatCurrency(
                    emi.paidAmount || 0,
                  )}
                />

                <div>
                  <p className="financial-label">
                    Remaining
                  </p>

                  <p className="mt-1 text-sm font-semibold tabular-nums">
                    {formatCurrency(
                      remaining,
                    )}
                  </p>
                </div>

                <div>
                  <p className="financial-label">
                    Status
                  </p>

                  <div className="mt-1">
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        <CircleCheck className="size-3.5" />
                        Paid
                      </span>
                    ) : (
                      <StatusBadge
                        status={emi.status}
                        type="emi"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* DESKTOP */}

              <div className="hidden grid-cols-[70px_1fr_120px_120px_120px] items-center gap-4 md:grid">
                <span className="text-sm font-semibold tabular-nums">
                  #{emi.installmentNumber}
                </span>

                <span className="text-sm text-foreground">
                  {formatDate(emi.dueDate)}
                </span>

                <span className="text-sm font-semibold tabular-nums">
                  {formatCurrency(
                    emi.emiAmount,
                  )}
                </span>

                <span className="text-sm tabular-nums text-muted-foreground">
                  {formatCurrency(
                    emi.paidAmount || 0,
                  )}
                </span>

                <div>
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      <CircleCheck className="size-3.5" />
                      Paid
                    </span>
                  ) : (
                    <StatusBadge
                      status={emi.status}
                      type="emi"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   PAYMENT DETAIL
============================================================ */

function PaymentDetail({
  label,
  value,
  emphasize = false,
}) {
  return (
    <div className="min-w-0">
      <p className="financial-label">
        {label}
      </p>

      <p
        className={[
          "mt-1 truncate tabular-nums",
          emphasize
            ? "text-sm font-bold text-foreground"
            : "text-sm font-medium text-foreground",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   SCHEDULE DETAIL
============================================================ */

function ScheduleDetail({
  label,
  value,
}) {
  return (
    <div>
      <p className="financial-label">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium tabular-nums">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   LOADING SKELETON
============================================================ */

function PaymentSkeleton() {
  return (
    <div className="space-y-7">
      <section className="border-b border-border pb-5">
        <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />

        <div className="mt-3 h-8 w-48 animate-pulse rounded bg-muted" />

        <div className="mt-2 h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
      </section>

      <section className="border-b border-border pb-4">
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />

        <div className="mt-2 h-3.5 w-full max-w-lg animate-pulse rounded bg-muted/70" />
      </section>

      <section>
        <div className="mb-3">
          <div className="h-5 w-36 animate-pulse rounded bg-muted" />

          <div className="mt-1.5 h-3 w-56 animate-pulse rounded bg-muted/70" />
        </div>

        <div className="divide-y border-y border-border">
          <div className="h-36 animate-pulse bg-muted/20" />
          <div className="h-36 animate-pulse bg-muted/10" />
          <div className="h-36 animate-pulse bg-muted/20" />
        </div>
      </section>

      <section>
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />

        <div className="mt-3 h-56 animate-pulse rounded-lg bg-muted/20" />
      </section>
    </div>
  );
}

export default EmiPayments;
