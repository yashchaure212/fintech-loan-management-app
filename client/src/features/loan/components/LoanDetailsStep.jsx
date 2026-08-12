import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loanSchema } from "../schemas/loan.schema";
import { useGetActiveLoanTypesQuery } from "../api/loanApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import FormField from "@/components/common/FormField";
import {
  LoanWizardShell,
  LoanWizardActions,
  selectClassName,
} from "./LoanWizardShell";
import { formatCurrency, formatCurrencyRange } from "../utils/loanFormatters";

function LoanDetailsStep({
  onNext,
  isSubmitting,
  initialData,
  isEditMode = false,
}) {
  const { data, isLoading, isError, refetch } = useGetActiveLoanTypesQuery();

  const loanTypes = data?.data || [];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loanSchema),

    defaultValues: {
      loanTypeId: initialData?.loanTypeId || "",
      loanAmount:
        initialData?.loanAmount !== null &&
        initialData?.loanAmount !== undefined
          ? String(initialData.loanAmount)
          : "",
      tenureMonths:
        initialData?.tenureMonths !== null &&
        initialData?.tenureMonths !== undefined
          ? String(initialData.tenureMonths)
          : "",
    },
  });

  const loanTypeId = watch("loanTypeId");
  const loanAmount = watch("loanAmount");
  const tenureMonths = watch("tenureMonths");

  // --------------------------------------------------
  // Restore form values when editing
  // --------------------------------------------------

  useEffect(() => {
    if (!initialData) {
      return;
    }

    reset({
      loanTypeId: initialData.loanTypeId || "",
      loanAmount:
        initialData.loanAmount !== null && initialData.loanAmount !== undefined
          ? String(initialData.loanAmount)
          : "",
      tenureMonths:
        initialData.tenureMonths !== null &&
        initialData.tenureMonths !== undefined
          ? String(initialData.tenureMonths)
          : "",
    });
  }, [initialData, reset]);

  // --------------------------------------------------
  // Selected loan
  // --------------------------------------------------

  const selectedLoan = useMemo(() => {
    if (!loanTypeId) {
      return null;
    }

    return loanTypes.find((loan) => loan.id === loanTypeId) || null;
  }, [loanTypeId, loanTypes]);

  // --------------------------------------------------
  // Active interest configuration
  //
  // Backend currently returns:
  //
  // interestConfigurations: [
  //   {
  //     minAmount,
  //     maxAmount,
  //     minTenure,
  //     maxTenure,
  //     interestRate,
  //     processingFee,
  //     ...
  //   }
  // ]
  //
  // Use the active configuration only.
  // --------------------------------------------------

  const loanConfiguration = useMemo(() => {
    if (!selectedLoan?.interestConfigurations?.length) {
      return null;
    }

    const activeConfigurations = selectedLoan.interestConfigurations.filter(
      (configuration) =>
        configuration?.isActive !== false && configuration?.isDeleted !== true,
    );

    if (activeConfigurations.length === 0) {
      return null;
    }

    // If multiple active configurations exist, prefer the one
    // with the latest effectiveFrom date.
    return [...activeConfigurations].sort((a, b) => {
      const dateA = a?.effectiveFrom ? new Date(a.effectiveFrom).getTime() : 0;

      const dateB = b?.effectiveFrom ? new Date(b.effectiveFrom).getTime() : 0;

      return dateB - dateA;
    })[0];
  }, [selectedLoan]);

  // --------------------------------------------------
  // Configuration values
  // --------------------------------------------------

  const minAmount = useMemo(() => {
    if (!loanConfiguration?.minAmount) {
      return null;
    }

    const value = Number(loanConfiguration.minAmount);

    return Number.isFinite(value) ? value : null;
  }, [loanConfiguration]);

  const maxAmount = useMemo(() => {
    if (!loanConfiguration?.maxAmount) {
      return null;
    }

    const value = Number(loanConfiguration.maxAmount);

    return Number.isFinite(value) ? value : null;
  }, [loanConfiguration]);

  const minTenure = useMemo(() => {
    if (
      loanConfiguration?.minTenure === null ||
      loanConfiguration?.minTenure === undefined
    ) {
      return null;
    }

    const value = Number(loanConfiguration.minTenure);

    return Number.isFinite(value) ? value : null;
  }, [loanConfiguration]);

  const maxTenure = useMemo(() => {
    if (
      loanConfiguration?.maxTenure === null ||
      loanConfiguration?.maxTenure === undefined
    ) {
      return null;
    }

    const value = Number(loanConfiguration.maxTenure);

    return Number.isFinite(value) ? value : null;
  }, [loanConfiguration]);

  // --------------------------------------------------
  // Amount preview
  // --------------------------------------------------

  const amountPreview = useMemo(() => {
    if (!loanAmount) {
      return null;
    }

    const amount = Number(loanAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return null;
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }, [loanAmount]);

  // --------------------------------------------------
  // Tenure preview
  // --------------------------------------------------

  const tenurePreview = useMemo(() => {
    if (!tenureMonths) {
      return null;
    }

    const months = Number(tenureMonths);

    if (!Number.isFinite(months) || months <= 0) {
      return null;
    }

    return `${months} ${months === 1 ? "month" : "months"}`;
  }, [tenureMonths]);

  // --------------------------------------------------
  // Configuration validation preview
  //
  // This gives the user immediate feedback instead of
  // waiting for the backend request.
  // --------------------------------------------------

  const amountRangeError = useMemo(() => {
    if (!loanAmount || !loanConfiguration) {
      return null;
    }

    const amount = Number(loanAmount);

    if (!Number.isFinite(amount)) {
      return null;
    }

    if (minAmount !== null && amount < minAmount) {
      return `Minimum loan amount is ${new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(minAmount)}.`;
    }

    if (maxAmount !== null && amount > maxAmount) {
      return `Maximum loan amount is ${new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(maxAmount)}.`;
    }

    return null;
  }, [loanAmount, loanConfiguration, minAmount, maxAmount]);

  const tenureRangeError = useMemo(() => {
    if (!tenureMonths || !loanConfiguration) {
      return null;
    }

    const months = Number(tenureMonths);

    if (!Number.isFinite(months)) {
      return null;
    }

    if (minTenure !== null && months < minTenure) {
      return `Minimum tenure is ${minTenure} months.`;
    }

    if (maxTenure !== null && months > maxTenure) {
      return `Maximum tenure is ${maxTenure} months.`;
    }

    return null;
  }, [tenureMonths, loanConfiguration, minTenure, maxTenure]);

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  function submit(values) {
    onNext({
      loanTypeId: values.loanTypeId,
      loanAmount: Number(values.loanAmount),
      tenureMonths: Number(values.tenureMonths),
    });
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (isLoading) {
    return (
      <LoanWizardShell step={1} title="Loan Details" description="Loading loan products...">
        <div className="space-y-4">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </LoanWizardShell>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (isError) {
    return (
      <LoanWizardShell
        step={1}
        title="Loan Details"
        description="We couldn't load the available loan products."
      >
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <Button type="button" variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </LoanWizardShell>
    );
  }

  if (loanTypes.length === 0) {
    return (
      <LoanWizardShell
        step={1}
        title="Loan Details"
        description="There are currently no active loan products available."
      />
    );
  }

  // --------------------------------------------------
  // Form
  // --------------------------------------------------

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <LoanWizardShell
        step={1}
        title="Loan Details"
        description={
          isEditMode
            ? "Update your loan amount and repayment tenure."
            : "Choose a loan product and tell us how much you need."
        }
      >
        <FormField
          label="Loan type"
          htmlFor="loanTypeId"
          error={errors.loanTypeId?.message}
          required
          helperText={selectedLoan?.description}
        >
          <select
            id="loanTypeId"
            disabled={isEditMode || isSubmitting}
            aria-invalid={Boolean(errors.loanTypeId)}
            className={selectClassName}
            {...register("loanTypeId")}
          >
            <option value="">Select loan type</option>

            {loanTypes.map((loan) => (
              <option key={loan.id} value={loan.id}>
                {loan.name}
              </option>
            ))}
          </select>
        </FormField>

        {selectedLoan && (
          <section className="space-y-4 rounded-xl border bg-muted/20 p-4 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="financial-label">Selected loan</p>
                <p className="subsection-title mt-1">{selectedLoan.name}</p>
              </div>

              {selectedLoan.category ? (
                <Badge variant="info">{selectedLoan.category}</Badge>
              ) : null}
            </div>

            {loanConfiguration ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="financial-label">Loan amount</p>
                  <p className="financial-value mt-1 text-base">
                    {formatCurrencyRange(minAmount, maxAmount)}
                  </p>
                </div>

                <div>
                  <p className="financial-label">Tenure</p>
                  <p className="mt-1 text-sm font-medium">
                    {minTenure !== null && maxTenure !== null
                      ? `${minTenure} – ${maxTenure} months`
                      : minTenure !== null
                        ? `From ${minTenure} months`
                        : maxTenure !== null
                          ? `Up to ${maxTenure} months`
                          : "Flexible"}
                  </p>
                </div>

                <div>
                  <p className="financial-label">Interest rate</p>
                  <p className="mt-1 text-sm font-medium">
                    {loanConfiguration.interestRate !== null &&
                    loanConfiguration.interestRate !== undefined
                      ? `${Number(loanConfiguration.interestRate)}% p.a.`
                      : "Calculated later"}
                  </p>
                </div>

                <div>
                  <p className="financial-label">Processing fee</p>
                  <p className="mt-1 text-sm font-medium">
                    {loanConfiguration.processingFee !== null &&
                    loanConfiguration.processingFee !== undefined
                      ? `${Number(loanConfiguration.processingFee)}${
                          loanConfiguration.processingFeeType === "PERCENTAGE"
                            ? "%"
                            : ""
                        }`
                      : "Calculated later"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-helper">
                Loan configuration is currently unavailable. Please try again
                later.
              </p>
            )}
          </section>
        )}

        <FormField
          label="Loan amount"
          htmlFor="loanAmount"
          error={errors.loanAmount?.message || amountRangeError}
          required
          helperText={
            minAmount !== null || maxAmount !== null
              ? minAmount !== null && maxAmount !== null
                ? `Available: ${formatCurrency(minAmount)} to ${formatCurrency(maxAmount)}`
                : minAmount !== null
                  ? `Minimum: ${formatCurrency(minAmount)}`
                  : `Maximum: ${formatCurrency(maxAmount)}`
              : amountPreview && !errors.loanAmount && !amountRangeError
                ? `Requested: ${amountPreview}`
                : undefined
          }
        >
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ₹
            </span>

            <Input
              id="loanAmount"
              type="number"
              inputMode="numeric"
              min={minAmount ?? 0}
              max={maxAmount ?? undefined}
              step="1000"
              placeholder="Enter loan amount"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.loanAmount || amountRangeError)}
              className="h-11 pl-8"
              {...register("loanAmount")}
            />
          </div>
        </FormField>

        <FormField
          label="Tenure"
          htmlFor="tenureMonths"
          error={errors.tenureMonths?.message || tenureRangeError}
          required
          helperText={
            minTenure !== null || maxTenure !== null
              ? minTenure !== null && maxTenure !== null
                ? `${minTenure} to ${maxTenure} months`
                : minTenure !== null
                  ? `Minimum ${minTenure} months`
                  : `Maximum ${maxTenure} months`
              : tenurePreview && !errors.tenureMonths && !tenureRangeError
                ? `Repayment period: ${tenurePreview}`
                : undefined
          }
        >
          <div className="relative">
            <Input
              id="tenureMonths"
              type="number"
              inputMode="numeric"
              min={minTenure ?? 1}
              max={maxTenure ?? undefined}
              step="1"
              placeholder="Enter tenure"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.tenureMonths || tenureRangeError)}
              className="h-11 pr-24"
              {...register("tenureMonths")}
            />

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              months
            </span>
          </div>
        </FormField>

        {selectedLoan && loanConfiguration ? (
          <p className="text-helper rounded-lg border border-primary/20 bg-primary/5 p-4">
            Your loan terms will be calculated automatically when your
            application is processed.
          </p>
        ) : null}

        <LoanWizardActions>
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto"
            disabled={
              isSubmitting ||
              !selectedLoan ||
              !loanConfiguration ||
              Boolean(amountRangeError) ||
              Boolean(tenureRangeError)
            }
            loading={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Continue →"}
          </Button>
        </LoanWizardActions>
      </LoanWizardShell>
    </form>
  );
}

export default LoanDetailsStep;
