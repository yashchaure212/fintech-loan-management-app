import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";

import {
  useGetActiveLoanTypesQuery,
  useUpdateLoanApplicationMutation,
} from "../api/loanApi";

import {
  useGetSchoolLoanDetailsQuery,
  useUpdateSchoolLoanDetailsMutation,
} from "../api/schoolLoanApi";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import FormInput from "@/components/common/FormInput";

import { LoanWizardShell, LoanWizardActions } from "./LoanWizardShell";

import { formatCurrency } from "../utils/loanFormatters";

/* =========================================================
   SCHEMA
========================================================= */

const numberField = (message) =>
  z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || (!Number.isNaN(Number(v)) && Number(v) >= 0),
      message || "Enter a valid amount",
    );

const requirementSchema = z.object({
  loanAmount: z.string().trim().min(1, "Loan amount is required"),
  tenureMonths: z.string().trim().min(1, "Tenure is required"),
  loanPurpose: z.string().trim().optional(),
  expectedDisbursementDate: z.string().optional(),
  tuitionFees: numberField(),
  admissionFees: numberField(),
  examinationFees: numberField(),
  booksAmount: numberField(),
  uniformAmount: numberField(),
  equipmentAmount: numberField(),
  transportAmount: numberField(),
  hostelAmount: numberField(),
  otherExpensesAmount: numberField(),
  familyContribution: numberField(),
  scholarshipAmount: numberField(),
  otherFundingAmount: numberField(),
});

const emptyValues = {
  loanAmount: "",
  tenureMonths: "",
  loanPurpose: "",
  expectedDisbursementDate: "",
  tuitionFees: "",
  admissionFees: "",
  examinationFees: "",
  booksAmount: "",
  uniformAmount: "",
  equipmentAmount: "",
  transportAmount: "",
  hostelAmount: "",
  otherExpensesAmount: "",
  familyContribution: "",
  scholarshipAmount: "",
  otherFundingAmount: "",
};

/* =========================================================
   HELPERS
========================================================= */

function toDateInputValue(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

/* =========================================================
   COMPONENT
========================================================= */

function LoanRequirementStep({
  loanApplicationId,
  loanApplication,
  onBack,
  onNext,
}) {
  const { data: loanTypesData } = useGetActiveLoanTypesQuery();

  const { data: schoolLoanData, isLoading: isFetching } =
    useGetSchoolLoanDetailsQuery(loanApplicationId, {
      skip: !loanApplicationId,
    });

  const [updateLoanApplication, { isLoading: isUpdatingLoan }] =
    useUpdateLoanApplicationMutation();

  const [updateSchoolLoanDetails, { isLoading: isUpdatingDetails }] =
    useUpdateSchoolLoanDetailsMutation();

  const isSaving = isUpdatingLoan || isUpdatingDetails;

  const schoolLoan = schoolLoanData?.data;

  const loanTypes = loanTypesData?.data || [];

  const selectedLoan = useMemo(
    () =>
      loanTypes.find((loan) => loan.id === loanApplication?.loanTypeId) || null,
    [loanTypes, loanApplication],
  );

  const loanConfiguration = useMemo(() => {
    if (!selectedLoan?.interestConfigurations?.length) {
      return null;
    }

    const active = selectedLoan.interestConfigurations.filter(
      (c) => c?.isActive !== false && c?.isDeleted !== true,
    );

    if (!active.length) {
      return null;
    }

    return [...active].sort((a, b) => {
      const dateA = a?.effectiveFrom ? new Date(a.effectiveFrom).getTime() : 0;

      const dateB = b?.effectiveFrom ? new Date(b.effectiveFrom).getTime() : 0;

      return dateB - dateA;
    })[0];
  }, [selectedLoan]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(requirementSchema),
    defaultValues: emptyValues,
  });

  /* =======================================================
     LOAD EXISTING DATA
  ======================================================= */

  useEffect(() => {
    if (!schoolLoan) return;

    reset({
      loanAmount:
        loanApplication?.loanAmount != null
          ? String(loanApplication.loanAmount)
          : "",

      tenureMonths:
        loanApplication?.tenureMonths != null
          ? String(loanApplication.tenureMonths)
          : "",

      loanPurpose: schoolLoan.loanPurpose || "",

      expectedDisbursementDate: toDateInputValue(
        schoolLoan.expectedDisbursementDate,
      ),

      tuitionFees:
        schoolLoan.tuitionFees != null ? String(schoolLoan.tuitionFees) : "",

      admissionFees:
        schoolLoan.admissionFees != null
          ? String(schoolLoan.admissionFees)
          : "",

      examinationFees:
        schoolLoan.examinationFees != null
          ? String(schoolLoan.examinationFees)
          : "",

      booksAmount:
        schoolLoan.booksAmount != null ? String(schoolLoan.booksAmount) : "",

      uniformAmount:
        schoolLoan.uniformAmount != null
          ? String(schoolLoan.uniformAmount)
          : "",

      equipmentAmount:
        schoolLoan.equipmentAmount != null
          ? String(schoolLoan.equipmentAmount)
          : "",

      transportAmount:
        schoolLoan.transportAmount != null
          ? String(schoolLoan.transportAmount)
          : "",

      hostelAmount:
        schoolLoan.hostelAmount != null ? String(schoolLoan.hostelAmount) : "",

      otherExpensesAmount:
        schoolLoan.otherExpensesAmount != null
          ? String(schoolLoan.otherExpensesAmount)
          : "",

      familyContribution:
        schoolLoan.familyContribution != null
          ? String(schoolLoan.familyContribution)
          : "",

      scholarshipAmount:
        schoolLoan.scholarshipAmount != null
          ? String(schoolLoan.scholarshipAmount)
          : "",

      otherFundingAmount:
        schoolLoan.otherFundingAmount != null
          ? String(schoolLoan.otherFundingAmount)
          : "",
    });
  }, [schoolLoan, loanApplication, reset]);

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const values = watch();

  const totalEducationCost = useMemo(() => {
    const fields = [
      "tuitionFees",
      "admissionFees",
      "examinationFees",
      "booksAmount",
      "uniformAmount",
      "equipmentAmount",
      "transportAmount",
      "hostelAmount",
      "otherExpensesAmount",
    ];

    return fields.reduce((sum, field) => sum + (Number(values[field]) || 0), 0);
  }, [values]);

  const loanAmountRequired = useMemo(() => {
    const funding =
      (Number(values.familyContribution) || 0) +
      (Number(values.scholarshipAmount) || 0) +
      (Number(values.otherFundingAmount) || 0);

    return Math.max(totalEducationCost - funding, 0);
  }, [totalEducationCost, values]);

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function onSubmit(formValues) {
    const numberOr = (v) => (v === "" || v == null ? undefined : Number(v));

    try {
      await updateLoanApplication({
        loanApplicationId,
        data: {
          loanAmount: Number(formValues.loanAmount),
          tenureMonths: Number(formValues.tenureMonths),
        },
      }).unwrap();

      await updateSchoolLoanDetails({
        loanApplicationId,
        data: {
          loanPurpose: formValues.loanPurpose || undefined,
          expectedDisbursementDate:
            formValues.expectedDisbursementDate || undefined,

          tuitionFees: numberOr(formValues.tuitionFees),
          admissionFees: numberOr(formValues.admissionFees),
          examinationFees: numberOr(formValues.examinationFees),
          booksAmount: numberOr(formValues.booksAmount),
          uniformAmount: numberOr(formValues.uniformAmount),
          equipmentAmount: numberOr(formValues.equipmentAmount),
          transportAmount: numberOr(formValues.transportAmount),
          hostelAmount: numberOr(formValues.hostelAmount),
          otherExpensesAmount: numberOr(formValues.otherExpensesAmount),

          familyContribution: numberOr(formValues.familyContribution),

          scholarshipAmount: numberOr(formValues.scholarshipAmount),

          otherFundingAmount: numberOr(formValues.otherFundingAmount),
        },
      }).unwrap();

      toast.success("Loan requirement saved");
      onNext();
    } catch (error) {
      console.error("STEP 5 (loan requirement) SAVE ERROR:", error);

      toast.error(
        error?.data?.message ||
          error?.message ||
          "Unable to save loan requirement",
      );
    }
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (isFetching) {
    return (
      <LoanWizardShell
        step={5}
        totalSteps={7}
        title="Loan Requirement"
        description="Loading your loan details..."
      >
        <div className="space-y-6">
          <Skeleton className="h-24 w-full rounded-lg" />

          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>

          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </LoanWizardShell>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <LoanWizardShell
        step={5}
        totalSteps={7}
        title="Loan Requirement"
        description="Tell us how much you need and how the funds will be used."
      >
        {/* =================================================
            LOAN CONFIGURATION
        ================================================= */}

        {loanConfiguration ? (
          <section className="rounded-lg border border-primary/15 bg-primary/[0.04] px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Available loan range
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Based on the selected loan product and current configuration.
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-sm font-semibold text-primary">
                  {formatCurrency(loanConfiguration.minAmount)} –{" "}
                  {formatCurrency(loanConfiguration.maxAmount)}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {loanConfiguration.minTenure}–{loanConfiguration.maxTenure}{" "}
                  months
                  {" · "}
                  {Number(loanConfiguration.interestRate)}% p.a.
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {/* =================================================
            LOAN REQUEST
        ================================================= */}

        <section className="space-y-5">
          <div className="border-b pb-4">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Loan request
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Enter the amount you want to borrow and your preferred repayment
              period.
            </p>
          </div>

          <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
            <FormInput
              label="Loan amount requested (₹)"
              required
              inputMode="numeric"
              placeholder="Enter amount"
              error={errors.loanAmount}
              {...register("loanAmount")}
            />

            <FormInput
              label="Requested tenure (months)"
              required
              inputMode="numeric"
              placeholder="e.g. 48"
              error={errors.tenureMonths}
              {...register("tenureMonths")}
            />

            <FormInput
              label="Expected disbursement date"
              type="date"
              helperText="Optional"
              error={errors.expectedDisbursementDate}
              {...register("expectedDisbursementDate")}
            />

            <FormInput
              label="Loan purpose"
              helperText="Optional"
              placeholder="e.g. Tuition and hostel expenses"
              error={errors.loanPurpose}
              {...register("loanPurpose")}
            />
          </div>
        </section>

        {/*
          Education expenses and other funding are intentionally hidden from
          the frontend. Keep the existing fields in the source/API contract
          for now, but do not render them in the school-loan form.


        <section className="space-y-5 border-t pt-7">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Education expenses
            </h3>

            <p className="text-sm text-muted-foreground">
              Provide an estimate of the education-related costs the loan will
              cover.
            </p>
          </div>

          <div className="grid gap-x-5 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
            <FormInput
              label="Tuition fees"
              inputMode="numeric"
              placeholder="₹ 0"
              error={errors.tuitionFees}
              {...register("tuitionFees")}
            />

            <FormInput
              label="Admission fees"
              inputMode="numeric"
              placeholder="₹ 0"
              error={errors.admissionFees}
              {...register("admissionFees")}
            />

            <FormInput
              label="Examination fees"
              inputMode="numeric"
              placeholder="₹ 0"
              error={errors.examinationFees}
              {...register("examinationFees")}
            />

            <FormInput
              label="Books"
              inputMode="numeric"
              placeholder="₹ 0"
              error={errors.booksAmount}
              {...register("booksAmount")}
            />

            <FormInput
              label="Uniform"
              inputMode="numeric"
              placeholder="₹ 0"
              error={errors.uniformAmount}
              {...register("uniformAmount")}
            />

            <FormInput
              label="School equipment"
              inputMode="numeric"
              placeholder="₹ 0"
              error={errors.equipmentAmount}
              {...register("equipmentAmount")}
            />

            <FormInput
              label="Transportation"
              inputMode="numeric"
              placeholder="₹ 0"
              error={errors.transportAmount}
              {...register("transportAmount")}
            />

            <FormInput
              label="Hostel / boarding"
              inputMode="numeric"
              helperText="If applicable"
              placeholder="₹ 0"
              error={errors.hostelAmount}
              {...register("hostelAmount")}
            />

            <FormInput
              label="Other education expenses"
              inputMode="numeric"
              placeholder="₹ 0"
              error={errors.otherExpensesAmount}
              {...register("otherExpensesAmount")}
            />
          </div>

          <div className="flex flex-col gap-1 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-muted-foreground">
              Total estimated education cost
            </span>

            <span className="text-lg font-semibold tracking-tight text-foreground">
              {formatCurrency(totalEducationCost)}
            </span>
          </div>
        </section>


        <section className="space-y-5 border-t pt-7">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Other funding
            </h3>

            <p className="text-sm text-muted-foreground">
              Include any amount that will be covered from sources other than
              this loan.
            </p>
          </div>

          <div className="grid gap-x-5 gap-y-5 md:grid-cols-3">
            <FormInput
              label="Family contribution"
              inputMode="numeric"
              placeholder="₹ 0"
              error={errors.familyContribution}
              {...register("familyContribution")}
            />

            <FormInput
              label="Scholarship / financial aid"
              inputMode="numeric"
              placeholder="₹ 0"
              error={errors.scholarshipAmount}
              {...register("scholarshipAmount")}
            />

            <FormInput
              label="Other funding"
              inputMode="numeric"
              placeholder="₹ 0"
              error={errors.otherFundingAmount}
              {...register("otherFundingAmount")}
            />
          </div>

          <div className="rounded-lg border border-primary/15 bg-primary/[0.04] px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Estimated loan requirement
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Education cost minus your other funding sources.
                </p>
              </div>

              <p className="text-2xl font-semibold tracking-tight text-primary">
                {formatCurrency(loanAmountRequired)}
              </p>
            </div>
          </div>
        </section>
        */}

        {/* =================================================
            ACTIONS
        ================================================= */}

        <LoanWizardActions onBack={onBack} backDisabled={isSaving}>
          <Button
            type="submit"
            size="lg"
            disabled={isSaving}
            loading={isSaving}
            className="w-full sm:w-auto sm:min-w-[140px]"
          >
            {isSaving ? "Saving..." : "Continue →"}
          </Button>
        </LoanWizardActions>
      </LoanWizardShell>
    </form>
  );
}

export default LoanRequirementStep;
