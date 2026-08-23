import { useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";

import {
  useGetSchoolLoanDetailsQuery,
  useUpdateSchoolLoanDetailsMutation,
} from "../api/schoolLoanApi";

import {
  useGetExistingLoansQuery,
  useAddExistingLoanMutation,
  useUpdateExistingLoanMutation,
  useDeleteExistingLoanMutation,
} from "../api/existingLoanApi";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import FormInput from "@/components/common/FormInput";
import FormField from "@/components/common/FormField";

import {
  LoanWizardShell,
  LoanWizardActions,
  selectClassName,
} from "./LoanWizardShell";

/* =========================================================
   SCHEMA
========================================================= */

const loanSchema = z.object({
  id: z.string().optional(),

  loanTypeLabel: z.string().trim().min(1, "Loan type is required"),

  lenderName: z.string().trim().min(1, "Lender name is required"),

  loanAccountNumber: z.string().trim().optional(),

  originalAmount: z.string().trim().min(1, "Original amount is required"),

  outstandingAmount: z.string().trim().min(1, "Outstanding amount is required"),

  emiAmount: z.string().trim().min(1, "EMI amount is required"),

  interestRate: z.string().trim().optional(),

  startDate: z.string().optional(),

  originalTenureMonths: z.string().trim().optional(),

  remainingTenureMonths: z.string().trim().optional(),

  missedPaymentsCount: z.string().trim().optional(),

  lastEmiPaymentDate: z.string().optional(),

  status: z.enum(["ACTIVE", "CLOSED", "DELINQUENT"]).default("ACTIVE"),
});

const formSchema = z.object({
  hasExistingLoans: z.boolean(),
  loans: z.array(loanSchema),
});

/* =========================================================
   EMPTY LOAN
========================================================= */

const createEmptyLoan = () => ({
  loanTypeLabel: "",
  lenderName: "",
  loanAccountNumber: "",
  originalAmount: "",
  outstandingAmount: "",
  emiAmount: "",
  interestRate: "",
  startDate: "",
  originalTenureMonths: "",
  remainingTenureMonths: "",
  missedPaymentsCount: "",
  lastEmiPaymentDate: "",
  status: "ACTIVE",
});

/* =========================================================
   HELPERS
========================================================= */

function numberOrUndefined(value) {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  const number = Number(value);

  return Number.isNaN(number) ? undefined : number;
}

function normalizeLoan(loan) {
  return {
    id: loan.id,

    loanTypeLabel: loan.loanTypeLabel || "",

    lenderName: loan.lenderName || "",

    loanAccountNumber: loan.loanAccountNumber || "",

    originalAmount:
      loan.originalAmount != null ? String(loan.originalAmount) : "",

    outstandingAmount:
      loan.outstandingAmount != null ? String(loan.outstandingAmount) : "",

    emiAmount: loan.emiAmount != null ? String(loan.emiAmount) : "",

    interestRate: loan.interestRate != null ? String(loan.interestRate) : "",

    startDate: loan.startDate ? String(loan.startDate).slice(0, 10) : "",

    originalTenureMonths:
      loan.originalTenureMonths != null
        ? String(loan.originalTenureMonths)
        : "",

    remainingTenureMonths:
      loan.remainingTenureMonths != null
        ? String(loan.remainingTenureMonths)
        : "",

    missedPaymentsCount:
      loan.missedPaymentsCount != null ? String(loan.missedPaymentsCount) : "",

    lastEmiPaymentDate: loan.lastEmiPaymentDate
      ? String(loan.lastEmiPaymentDate).slice(0, 10)
      : "",

    status: loan.status || "ACTIVE",
  };
}

/* =========================================================
   COMPONENT
========================================================= */

function ExistingLoansStep({ loanApplicationId, onBack, onNext }) {
  /* =======================================================
     FETCH SCHOOL LOAN
  ======================================================= */

  const {
    data: schoolLoanData,
    isLoading: isFetchingSchoolLoan,
    isError: isSchoolLoanError,
    error: schoolLoanError,
  } = useGetSchoolLoanDetailsQuery(loanApplicationId, {
    skip: !loanApplicationId,
  });

  /* =======================================================
     FETCH EXISTING LOANS
  ======================================================= */

  const {
    data: existingLoansData,
    isLoading: isFetchingLoans,
    isError: isExistingLoansError,
    error: existingLoansError,
  } = useGetExistingLoansQuery(loanApplicationId, {
    skip: !loanApplicationId,
  });

  /* =======================================================
     MUTATIONS
  ======================================================= */

  const [updateSchoolLoanDetails, { isLoading: isUpdatingGate }] =
    useUpdateSchoolLoanDetailsMutation();

  const [addExistingLoan, { isLoading: isAddingLoan }] =
    useAddExistingLoanMutation();

  const [updateExistingLoan, { isLoading: isUpdatingLoan }] =
    useUpdateExistingLoanMutation();

  const [deleteExistingLoan, { isLoading: isDeletingLoan }] =
    useDeleteExistingLoanMutation();

  /* =======================================================
     DATA
  ======================================================= */

  const schoolLoan = schoolLoanData?.data;

  const savedLoans = useMemo(() => {
    return Array.isArray(existingLoansData?.data) ? existingLoansData.data : [];
  }, [existingLoansData?.data]);

  /* =======================================================
     FORM
  ======================================================= */

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),

    defaultValues: {
      hasExistingLoans: false,
      loans: [],
    },

    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "loans",
  });

  const hasExistingLoans = watch("hasExistingLoans");

  /* =======================================================
     LOAD EXISTING DATA
  ======================================================= */

  useEffect(() => {
    if (!schoolLoan) {
      return;
    }

    const normalizedLoans =
      savedLoans.length > 0
        ? savedLoans.map(normalizeLoan)
        : schoolLoan.hasExistingLoans
          ? [createEmptyLoan()]
          : [];

    reset({
      hasExistingLoans: Boolean(schoolLoan.hasExistingLoans),
      loans: normalizedLoans,
    });
  }, [schoolLoan, savedLoans, reset]);

  /* =======================================================
     ADD LOAN
  ======================================================= */

  function handleAddLoan() {
    append(createEmptyLoan());
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function onSubmit(values) {
    if (!loanApplicationId) {
      toast.error("Loan application ID is missing.");
      return;
    }

    try {
      await updateSchoolLoanDetails({
        loanApplicationId,
        data: {
          hasExistingLoans: values.hasExistingLoans,
        },
      }).unwrap();

      if (!values.hasExistingLoans) {
        toast.success("Existing loan details saved");
        onNext();
        return;
      }

      for (const loan of values.loans) {
        const payload = {
          loanTypeLabel: loan.loanTypeLabel.trim(),

          lenderName: loan.lenderName.trim(),

          loanAccountNumber: loan.loanAccountNumber?.trim() || undefined,

          originalAmount: Number(loan.originalAmount),

          outstandingAmount: Number(loan.outstandingAmount),

          emiAmount: Number(loan.emiAmount),

          interestRate: numberOrUndefined(loan.interestRate),

          startDate: loan.startDate || undefined,

          originalTenureMonths: numberOrUndefined(loan.originalTenureMonths),

          remainingTenureMonths: numberOrUndefined(loan.remainingTenureMonths),

          missedPaymentsCount: numberOrUndefined(loan.missedPaymentsCount),

          lastEmiPaymentDate: loan.lastEmiPaymentDate || undefined,

          status: loan.status,
        };

        if (loan.id) {
          await updateExistingLoan({
            existingLoanId: loan.id,
            loanApplicationId,
            data: payload,
          }).unwrap();
        } else {
          await addExistingLoan({
            loanApplicationId,
            data: payload,
          }).unwrap();
        }
      }

      toast.success("Existing loan details saved");

      onNext();
    } catch (error) {
      console.error("STEP 4 (existing loans) SAVE ERROR:", error);

      toast.error(
        error?.data?.message ||
          error?.message ||
          "Unable to save existing loan details",
      );
    }
  }

  /* =======================================================
     DELETE LOAN
  ======================================================= */

  async function handleRemove(index) {
    const loan = fields[index];

    if (!loan) {
      return;
    }

    if (loan.id) {
      try {
        await deleteExistingLoan({
          existingLoanId: loan.id,
          loanApplicationId,
        }).unwrap();

        toast.success("Existing loan removed");
      } catch (error) {
        console.error("DELETE EXISTING LOAN ERROR:", error);

        toast.error(
          error?.data?.message ||
            error?.message ||
            "Unable to remove existing loan",
        );

        return;
      }
    }

    remove(index);
  }

  /* =======================================================
     LOADING
  ======================================================= */

  const isLoading = isFetchingSchoolLoan || isFetchingLoans;

  const isSaving =
    isUpdatingGate ||
    isAddingLoan ||
    isUpdatingLoan ||
    isDeletingLoan ||
    isSubmitting;

  /* =======================================================
     LOADING UI
  ======================================================= */

  if (isLoading) {
    return (
      <LoanWizardShell
        step={4}
        totalSteps={7}
        title="Existing Loans"
        description="Loading your existing loan information..."
      >
        <div className="space-y-5">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </LoanWizardShell>
    );
  }

  /* =======================================================
     ERROR UI
  ======================================================= */

  if (isSchoolLoanError || isExistingLoansError) {
    const message =
      schoolLoanError?.data?.message ||
      existingLoansError?.data?.message ||
      "Unable to load existing loan details.";

    return (
      <LoanWizardShell
        step={4}
        totalSteps={7}
        title="Existing Loans"
        description="We couldn't load your existing loan information."
      >
        <div className="rounded-lg border border-destructive/20 bg-destructive/[0.04] px-5 py-4">
          <p className="text-sm font-medium text-destructive">{message}</p>
        </div>

        <LoanWizardActions onBack={onBack} />
      </LoanWizardShell>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <LoanWizardShell
        step={4}
        totalSteps={7}
        title="Existing Loans"
        description="Tell us about any loans you currently have. This helps us understand your existing financial commitments."
      >
        {/* =================================================
            EXISTING LOAN QUESTION
        ================================================= */}

        <section className="border-b border-border pb-7">
          <div className="mb-4">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Do you currently have any existing loans?
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Include personal, vehicle, education, home, business or other
              active loans.
            </p>
          </div>

          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            role="radiogroup"
            aria-label="Existing loans"
          >
            <label
              className={[
                "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-4",
                "transition-colors duration-150",
                hasExistingLoans === true
                  ? "border-primary bg-primary/[0.04] ring-1 ring-primary/20"
                  : "border-border bg-background hover:border-primary/40",
              ].join(" ")}
            >
              <input
                type="radio"
                name="hasExistingLoans"
                checked={hasExistingLoans === true}
                onChange={() =>
                  setValue("hasExistingLoans", true, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                className="size-4 accent-primary"
              />

              <span>
                <span className="block text-sm font-semibold text-foreground">
                  Yes, I have existing loans
                </span>

                <span className="mt-0.5 block text-xs text-muted-foreground">
                  I currently have one or more loans.
                </span>
              </span>
            </label>

            <label
              className={[
                "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-4",
                "transition-colors duration-150",
                hasExistingLoans === false
                  ? "border-primary bg-primary/[0.04] ring-1 ring-primary/20"
                  : "border-border bg-background hover:border-primary/40",
              ].join(" ")}
            >
              <input
                type="radio"
                name="hasExistingLoans"
                checked={hasExistingLoans === false}
                onChange={() =>
                  setValue("hasExistingLoans", false, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                className="size-4 accent-primary"
              />

              <span>
                <span className="block text-sm font-semibold text-foreground">
                  No existing loans
                </span>

                <span className="mt-0.5 block text-xs text-muted-foreground">
                  I don't currently have any loans.
                </span>
              </span>
            </label>
          </div>
        </section>

        {/* =================================================
            EXISTING LOANS
        ================================================= */}

        {hasExistingLoans ? (
          <section className="space-y-6">
            {/* HEADER */}

            <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                  Financial commitments
                </p>

                <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                  Your existing loans
                </h3>

                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Add the details of each loan you currently have.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleAddLoan}
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                + Add another loan
              </Button>
            </div>

            {/* FORM ERROR */}

            {errors.loans?.message ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/[0.04] px-5 py-4">
                <p className="text-sm font-medium text-destructive">
                  {errors.loans.message}
                </p>
              </div>
            ) : null}

            {/* LOANS */}

            {fields.map((field, index) => (
              <section
                key={field.id}
                className="overflow-hidden rounded-lg border border-border bg-background"
              >
                {/* LOAN HEADER */}

                <div className="flex flex-col gap-3 border-b border-border bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                      Existing commitment
                    </p>

                    <h4 className="mt-0.5 text-base font-semibold text-foreground">
                      Loan {index + 1}
                    </h4>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isSaving}
                    onClick={() => handleRemove(index)}
                    className="w-full text-destructive hover:bg-destructive/[0.06] hover:text-destructive sm:w-auto"
                  >
                    Remove loan
                  </Button>
                </div>

                {/* LOAN DETAILS */}

                <div className="space-y-7 px-5 py-6">
                  {/* BASIC INFORMATION */}

                  <div>
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-foreground">
                        Loan information
                      </h5>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Basic details about the lender and loan account.
                      </p>
                    </div>

                    <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                      <FormInput
                        label="Loan type"
                        required
                        placeholder="e.g. Personal Loan, Car Loan"
                        error={errors.loans?.[index]?.loanTypeLabel}
                        {...register(`loans.${index}.loanTypeLabel`)}
                      />

                      <FormInput
                        label="Bank / NBFC / Lender name"
                        required
                        placeholder="e.g. HDFC Bank"
                        error={errors.loans?.[index]?.lenderName}
                        {...register(`loans.${index}.lenderName`)}
                      />

                      <FormInput
                        label="Loan account number"
                        helperText="Optional"
                        placeholder="Enter account number"
                        error={errors.loans?.[index]?.loanAccountNumber}
                        {...register(`loans.${index}.loanAccountNumber`)}
                      />

                      <FormField label="Loan status">
                        <select
                          className={selectClassName}
                          {...register(`loans.${index}.status`)}
                        >
                          <option value="ACTIVE">Active</option>

                          <option value="CLOSED">Closed</option>

                          <option value="DELINQUENT">Delinquent</option>
                        </select>
                      </FormField>
                    </div>
                  </div>

                  {/* FINANCIAL INFORMATION */}

                  <div className="border-t border-border pt-6">
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-foreground">
                        Financial details
                      </h5>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Provide the current loan balance and repayment details.
                      </p>
                    </div>

                    <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                      <FormInput
                        label="Original loan amount (₹)"
                        required
                        inputMode="numeric"
                        placeholder="e.g. 500000"
                        error={errors.loans?.[index]?.originalAmount}
                        {...register(`loans.${index}.originalAmount`)}
                      />

                      <FormInput
                        label="Current outstanding amount (₹)"
                        required
                        inputMode="numeric"
                        placeholder="e.g. 320000"
                        error={errors.loans?.[index]?.outstandingAmount}
                        {...register(`loans.${index}.outstandingAmount`)}
                      />

                      <FormInput
                        label="EMI amount (₹)"
                        required
                        inputMode="numeric"
                        placeholder="e.g. 12500"
                        error={errors.loans?.[index]?.emiAmount}
                        {...register(`loans.${index}.emiAmount`)}
                      />

                      <FormInput
                        label="Interest rate (%)"
                        helperText="Optional"
                        inputMode="decimal"
                        placeholder="e.g. 10.5"
                        error={errors.loans?.[index]?.interestRate}
                        {...register(`loans.${index}.interestRate`)}
                      />
                    </div>
                  </div>

                  {/* TENURE & PAYMENT HISTORY */}

                  <div className="border-t border-border pt-6">
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-foreground">
                        Tenure & repayment history
                      </h5>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Optional details that help us assess your existing
                        repayment commitments.
                      </p>
                    </div>

                    <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                      <FormInput
                        label="Loan start date"
                        type="date"
                        helperText="Optional"
                        error={errors.loans?.[index]?.startDate}
                        {...register(`loans.${index}.startDate`)}
                      />

                      <FormInput
                        label="Original tenure (months)"
                        helperText="Optional"
                        inputMode="numeric"
                        placeholder="e.g. 60"
                        error={errors.loans?.[index]?.originalTenureMonths}
                        {...register(`loans.${index}.originalTenureMonths`)}
                      />

                      <FormInput
                        label="Remaining tenure (months)"
                        helperText="Optional"
                        inputMode="numeric"
                        placeholder="e.g. 36"
                        error={errors.loans?.[index]?.remainingTenureMonths}
                        {...register(`loans.${index}.remainingTenureMonths`)}
                      />

                      <FormInput
                        label="Missed payments"
                        helperText="Optional"
                        inputMode="numeric"
                        placeholder="e.g. 0"
                        error={errors.loans?.[index]?.missedPaymentsCount}
                        {...register(`loans.${index}.missedPaymentsCount`)}
                      />

                      <FormInput
                        label="Last EMI payment date"
                        type="date"
                        helperText="Optional"
                        error={errors.loans?.[index]?.lastEmiPaymentDate}
                        {...register(`loans.${index}.lastEmiPaymentDate`)}
                      />
                    </div>
                  </div>
                </div>
              </section>
            ))}

            {/* NO LOANS ADDED */}

            {fields.length === 0 ? (
              <div className="border border-dashed border-border bg-muted/[0.12] px-6 py-10 text-center">
                <div className="mx-auto max-w-md">
                  <h4 className="text-sm font-semibold text-foreground">
                    No existing loan added yet
                  </h4>

                  <p className="mt-1 text-sm text-muted-foreground">
                    You selected “Yes”. Add at least one existing loan before
                    continuing.
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-5"
                    onClick={handleAddLoan}
                    disabled={isSaving}
                  >
                    + Add existing loan
                  </Button>
                </div>
              </div>
            ) : null}
          </section>
        ) : (
          /* =================================================
             NO EXISTING LOANS STATE
          ================================================= */

          <section className="border border-border bg-muted/[0.12] px-5 py-7 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-foreground">
                No existing loan details required
              </p>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Since you don't have any current loans, you can continue to the
                next step.
              </p>
            </div>
          </section>
        )}

        {/* =================================================
            ACTIONS
        ================================================= */}

        <LoanWizardActions onBack={onBack} backDisabled={isSaving}>
          <Button
            type="submit"
            size="lg"
            disabled={isSaving}
            loading={isSaving}
            className="w-full min-w-36 sm:w-auto"
          >
            {isSaving ? "Saving..." : "Continue →"}
          </Button>
        </LoanWizardActions>
      </LoanWizardShell>
    </form>
  );
}

export default ExistingLoansStep;
