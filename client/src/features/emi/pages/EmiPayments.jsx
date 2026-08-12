import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StatusBadge from "@/components/common/StatusBadge";
import { formatCurrency } from "@/features/loan/utils/loanFormatters";

import {
  useCreateEmiPaymentMutation,
  useGetPendingEmisQuery,
} from "../api/emiApi";

const PAYMENT_METHODS = [
  { value: "UPI", label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank transfer" },
  { value: "CARD", label: "Card" },
  { value: "CASH", label: "Cash" },
  { value: "CHEQUE", label: "Cheque" },
];

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
    (Number(emi.emiAmount) - Number(emi.paidAmount || 0)).toFixed(2),
  );
}

function EmiPayments() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetPendingEmisQuery();
  const [createPayment, { isLoading: isPaying }] = useCreateEmiPaymentMutation();

  const [selectedEmi, setSelectedEmi] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [remarks, setRemarks] = useState("");

  const pendingEmis = data?.data || [];

  const totalDue = useMemo(
    () =>
      pendingEmis.reduce((sum, emi) => sum + getRemainingAmount(emi), 0),
    [pendingEmis],
  );

  function openPaymentDialog(emi) {
    setSelectedEmi(emi);
    setAmount(String(getRemainingAmount(emi)));
    setPaymentMethod("UPI");
    setRemarks("");
  }

  function closePaymentDialog() {
    setSelectedEmi(null);
    setAmount("");
    setRemarks("");
  }

  async function handlePay() {
    if (!selectedEmi) return;

    const paymentAmount = Number(amount);
    const remaining = getRemainingAmount(selectedEmi);

    if (!paymentAmount || paymentAmount <= 0) {
      toast.error("Enter a valid payment amount");
      return;
    }

    if (paymentAmount > remaining) {
      toast.error(`Payment cannot exceed ${formatCurrency(remaining)}`);
      return;
    }

    try {
      const response = await createPayment({
        emiScheduleId: selectedEmi.id,
        amount: paymentAmount,
        paymentMethod,
        remarks: remarks.trim() || undefined,
      }).unwrap();

      toast.success(
        response?.message || "Payment recorded successfully",
      );
      closePaymentDialog();
    } catch (error) {
      toast.error(error?.data?.message || "Unable to record payment");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-32 animate-pulse rounded-xl border bg-card" />
        <div className="h-40 animate-pulse rounded-xl border bg-card" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h1 className="page-title">Unable to load payments</h1>
        <p className="mt-2 text-helper">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">EMI payments</h1>
        <p className="mt-1 text-helper">
          View due installments and record payments against your active loans.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="financial-label">Total due now</p>
              <p className="financial-value mt-1">{formatCurrency(totalDue)}</p>
            </div>
            <p className="text-caption">
              {pendingEmis.length}{" "}
              {pendingEmis.length === 1 ? "installment" : "installments"} due
            </p>
          </div>
        </CardContent>
      </Card>

      {pendingEmis.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-8 text-center">
          <p className="text-sm font-medium">No EMI payments due</p>
          <p className="mt-1 text-helper">
            Installments will appear here after your loan is disbursed.
          </p>
          <Button
            className="mt-6"
            variant="outline"
            onClick={() => navigate("/customer/loans")}
          >
            View my loans
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingEmis.map((emi) => {
            const remaining = getRemainingAmount(emi);
            const loan = emi.loanApplication;

            return (
              <div
                key={emi.id}
                className="rounded-xl border bg-card p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">
                        {loan?.loanType?.name || "Loan"} · Installment{" "}
                        {emi.installmentNumber}
                      </p>
                      <StatusBadge status={emi.status} type="emi" />
                    </div>

                    {loan?.applicationNumber ? (
                      <p className="text-caption">{loan.applicationNumber}</p>
                    ) : null}

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="financial-label">Due date</p>
                        <p className="mt-1 text-sm font-medium">
                          {formatDate(emi.dueDate)}
                        </p>
                      </div>
                      <div>
                        <p className="financial-label">EMI amount</p>
                        <p className="mt-1 text-sm font-medium tabular-nums">
                          {formatCurrency(emi.emiAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="financial-label">Remaining</p>
                        <p className="mt-1 text-sm font-semibold tabular-nums">
                          {formatCurrency(remaining)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:items-end">
                    <Button
                      className="w-full sm:w-auto"
                      onClick={() => openPaymentDialog(emi)}
                    >
                      Pay EMI
                    </Button>
                    {loan?.id ? (
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => navigate(`/customer/loans/${loan.id}`)}
                      >
                        Loan details
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog
        open={Boolean(selectedEmi)}
        onOpenChange={(open) => {
          if (!open) closePaymentDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record EMI payment</DialogTitle>
            <DialogDescription>
              This records a manual payment in the system. No external payment
              gateway is used.
            </DialogDescription>
          </DialogHeader>

          {selectedEmi ? (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                <p>
                  Installment {selectedEmi.installmentNumber} · Due{" "}
                  {formatDate(selectedEmi.dueDate)}
                </p>
                <p className="mt-1 font-medium">
                  Remaining: {formatCurrency(getRemainingAmount(selectedEmi))}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="emi-amount">
                  Amount
                </label>
                <input
                  id="emi-amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="payment-method">
                  Payment method
                </label>
                <select
                  id="payment-method"
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="payment-remarks">
                  Remarks (optional)
                </label>
                <textarea
                  id="payment-remarks"
                  rows={3}
                  value={remarks}
                  onChange={(event) => setRemarks(event.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                />
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={closePaymentDialog}>
              Cancel
            </Button>
            <Button onClick={handlePay} disabled={isPaying}>
              {isPaying ? "Recording..." : "Record payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmiPayments;
