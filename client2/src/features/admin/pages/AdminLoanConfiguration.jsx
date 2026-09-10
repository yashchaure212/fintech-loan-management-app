import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import {
  CalendarDays,
  History,
  Info,
  Loader2,
  Plus,
  ShieldCheck,
} from "lucide-react";

import {
  useCreateLoanConfigurationVersionMutation,
  useGetLoanConfigurationOverviewQuery,
} from "@/features/loan/api/loanConfigurationApi";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FormInput from "@/components/shared/FormInput";
import FormField from "@/components/shared/FormField";
import { selectClassName } from "@/features/loan/components/LoanWizardShell";

/* =========================================================
   HELPERS
========================================================= */

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatAmount(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return currency.format(Number(value));
}

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatFee(version) {
  if (version.processingFeeType === "PERCENTAGE") {
    return `${Number(version.processingFee)}%`;
  }

  return formatAmount(version.processingFee);
}

function toDateInputValue(date) {
  const value = date instanceof Date ? date : new Date(date);

  const offset = value.getTimezoneOffset();

  return new Date(value.getTime() - offset * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

/*
 * Returns the next valid effective date.
 *
 * If there are no versions:
 *   tomorrow
 *
 * If versions exist:
 *   one day after the latest version
 *
 * This is only the default date.
 * Backend validation remains the final authority.
 */
function getNextEffectiveDate(versions) {
  const tomorrow = new Date();

  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (!versions?.length) {
    return tomorrow;
  }

  const latestEffectiveFrom = versions.reduce(
    (latest, version) => {
      if (!version.effectiveFrom) {
        return latest;
      }

      const date = new Date(version.effectiveFrom);

      if (Number.isNaN(date.getTime())) {
        return latest;
      }

      return date > latest ? date : latest;
    },
    new Date(0),
  );

  if (latestEffectiveFrom.getTime() === 0) {
    return tomorrow;
  }

  latestEffectiveFrom.setHours(0, 0, 0, 0);
  latestEffectiveFrom.setDate(
    latestEffectiveFrom.getDate() + 1,
  );

  return latestEffectiveFrom > tomorrow
    ? latestEffectiveFrom
    : tomorrow;
}

/* =========================================================
   SCHEMA
========================================================= */

const numeric = (message) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine(
      (value) => !Number.isNaN(Number(value)),
      message,
    );

const versionSchema = z
  .object({
    minAmount: numeric("Minimum amount is required"),
    maxAmount: numeric("Maximum amount is required"),
    minTenure: numeric("Minimum tenure is required"),
    maxTenure: numeric("Maximum tenure is required"),
    interestRate: numeric("Interest rate is required"),
    processingFee: numeric("Processing fee is required"),
    processingFeeType: z.enum([
      "PERCENTAGE",
      "FIXED",
    ]),
    gstPercentage: numeric("GST is required"),
    latePenalty: z.string().trim().optional(),
    foreclosureCharge: z.string().trim().optional(),
    effectiveFrom: z
      .string()
      .trim()
      .min(1, "Effective from is required"),
  })
  .superRefine((values, ctx) => {
    const numbers = {
      minAmount: Number(values.minAmount),
      maxAmount: Number(values.maxAmount),
      minTenure: Number(values.minTenure),
      maxTenure: Number(values.maxTenure),
      interestRate: Number(values.interestRate),
      processingFee: Number(values.processingFee),
      gstPercentage: Number(values.gstPercentage),
    };

    for (const [key, value] of Object.entries(numbers)) {
      if (value < 0) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: "Value cannot be negative",
        });
      }
    }

    if (numbers.minAmount <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["minAmount"],
        message: "Minimum amount must be greater than 0",
      });
    }

    if (numbers.maxAmount < numbers.minAmount) {
      ctx.addIssue({
        code: "custom",
        path: ["maxAmount"],
        message:
          "Maximum amount must be at least the minimum amount",
      });
    }

    if (numbers.minTenure <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["minTenure"],
        message:
          "Minimum tenure must be at least 1 month",
      });
    }

    if (numbers.maxTenure < numbers.minTenure) {
      ctx.addIssue({
        code: "custom",
        path: ["maxTenure"],
        message:
          "Maximum tenure must be at least the minimum tenure",
      });
    }

    if (numbers.interestRate > 100) {
      ctx.addIssue({
        code: "custom",
        path: ["interestRate"],
        message:
          "Interest rate cannot exceed 100%",
      });
    }

    if (numbers.gstPercentage > 100) {
      ctx.addIssue({
        code: "custom",
        path: ["gstPercentage"],
        message:
          "GST cannot exceed 100%",
      });
    }

    if (
      values.processingFeeType === "PERCENTAGE" &&
      numbers.processingFee > 100
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["processingFee"],
        message:
          "A percentage processing fee cannot exceed 100%",
      });
    }
  });

/* =========================================================
   COMPONENT
========================================================= */

function AdminLoanConfiguration() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetLoanConfigurationOverviewQuery();

  const [
    createVersion,
    { isLoading: isSaving },
  ] = useCreateLoanConfigurationVersionMutation();

  const [isFormOpen, setFormOpen] = useState(false);

  const loanType = data?.data?.loanType || null;

  const versions = useMemo(
    () => data?.data?.versions || [],
    [data],
  );

  /*
   * IMPORTANT:
   * Active configuration is determined from isApplicable.
   *
   * This is what we use to prefill the new version.
   * Historical versions are NEVER used for prefilling.
   */
  const activeVersion = useMemo(
    () =>
      versions.find(
        (version) => version.isApplicable,
      ) || null,
    [versions],
  );

  const latestVersion = useMemo(() => {
    if (!versions.length) return null;

    return versions.reduce((latest, version) => {
      if (!latest) return version;

      const latestDate = new Date(
        latest.effectiveFrom,
      ).getTime();

      const versionDate = new Date(
        version.effectiveFrom,
      ).getTime();

      return versionDate > latestDate
        ? version
        : latest;
    }, null);
  }, [versions]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(versionSchema),

    defaultValues: {
      minAmount: "",
      maxAmount: "",
      minTenure: "",
      maxTenure: "",
      interestRate: "",
      processingFee: "",
      processingFeeType: "PERCENTAGE",
      gstPercentage: "",
      latePenalty: "",
      foreclosureCharge: "",
      effectiveFrom: "",
    },
  });

  /* =========================================================
     CREATE VERSION
  ========================================================= */

  function openForm() {
    const nextEffectiveDate =
      getNextEffectiveDate(versions);

    /*
     * NEW VERSION IS COPIED FROM ACTIVE CONFIGURATION.
     *
     * It does NOT copy from latest historical version.
     */
    reset({
      minAmount: activeVersion
        ? String(Number(activeVersion.minAmount))
        : "",

      maxAmount: activeVersion
        ? String(Number(activeVersion.maxAmount))
        : "",

      minTenure: activeVersion
        ? String(activeVersion.minTenure)
        : "",

      maxTenure: activeVersion
        ? String(activeVersion.maxTenure)
        : "",

      interestRate: activeVersion
        ? String(Number(activeVersion.interestRate))
        : "",

      processingFee: activeVersion
        ? String(Number(activeVersion.processingFee))
        : "",

      processingFeeType:
        activeVersion?.processingFeeType ||
        "PERCENTAGE",

      gstPercentage: activeVersion
        ? String(Number(activeVersion.gstPercentage))
        : "",

      latePenalty:
        activeVersion?.latePenalty != null
          ? String(Number(activeVersion.latePenalty))
          : "",

      foreclosureCharge:
        activeVersion?.foreclosureCharge != null
          ? String(
              Number(
                activeVersion.foreclosureCharge,
              ),
            )
          : "",

      effectiveFrom:
        toDateInputValue(nextEffectiveDate),
    });

    setFormOpen(true);
  }

  async function onSubmit(values) {
    if (!loanType?.id) {
      toast.error(
        "Loan product could not be resolved.",
      );
      return;
    }

    try {
      await createVersion({
        loanTypeId: loanType.id,

        minAmount: Number(values.minAmount),
        maxAmount: Number(values.maxAmount),

        minTenure: Number(values.minTenure),
        maxTenure: Number(values.maxTenure),

        interestRate: Number(
          values.interestRate,
        ),

        processingFee: Number(
          values.processingFee,
        ),

        processingFeeType:
          values.processingFeeType,

        gstPercentage: Number(
          values.gstPercentage,
        ),

        latePenalty: values.latePenalty
          ? Number(values.latePenalty)
          : undefined,

        foreclosureCharge:
          values.foreclosureCharge
            ? Number(
                values.foreclosureCharge,
              )
            : undefined,

        effectiveFrom: new Date(
          values.effectiveFrom,
        ).toISOString(),
      }).unwrap();

      toast.success(
        "New configuration version created.",
      );

      setFormOpen(false);
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Unable to create the configuration version.",
      );
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <div className="space-y-6 pt-6">
        <Skeleton className="h-9 w-72" />

        <Skeleton className="h-56 w-full rounded-xl" />

        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (isError) {
    return (
      <div className="pt-6">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm font-semibold text-destructive">
            Unable to load the loan configuration
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={refetch}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-8 pt-6 pb-20 lg:pb-8">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Loan Configuration
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {loanType?.name ||
              "School Student Loan"}{" "}
            — pricing and limits used to assess new
            applications.
          </p>
        </div>
      </div>

      {/* =====================================================
          ACTIVE CONFIGURATION CARD
      ===================================================== */}

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />

            <h2 className="text-base font-semibold text-foreground">
              Active configuration
            </h2>
          </div>

          {activeVersion ? (
            <Badge variant="success">
              Active
            </Badge>
          ) : null}
        </div>

        {activeVersion ? (
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            {/* CARD HEADER */}

            <div className="border-b bg-muted/20 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {loanType?.name ||
                        "School Student Loan"}
                    </h3>

                    <Badge variant="success">
                      Active
                    </Badge>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4" />

                    <span>
                      Effective from{" "}
                      <span className="font-medium text-foreground">
                        {formatDate(
                          activeVersion.effectiveFrom,
                        )}
                      </span>
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={openForm}
                  disabled={isFormOpen}
                  className="w-full sm:w-auto"
                >
                  <Plus />
                  Create New Version
                </Button>
              </div>
            </div>

            {/* HIGHLIGHTED PRICING */}

            <div className="grid border-b sm:grid-cols-2 lg:grid-cols-4">
              <div className="border-b px-5 py-5 sm:border-r lg:border-b-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Interest rate
                </p>

                <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                  {Number(
                    activeVersion.interestRate,
                  )}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    % p.a.
                  </span>
                </p>
              </div>

              <div className="border-b px-5 py-5 lg:border-b-0 lg:border-r">
                <p className="text-xs font-medium text-muted-foreground">
                  Processing fee
                </p>

                <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                  {formatFee(activeVersion)}
                </p>
              </div>

              <div className="border-b px-5 py-5 sm:border-r lg:border-b-0">
                <p className="text-xs font-medium text-muted-foreground">
                  GST
                </p>

                <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                  {Number(
                    activeVersion.gstPercentage,
                  )}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    %
                  </span>
                </p>
              </div>

              <div className="px-5 py-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Late payment penalty
                </p>

                <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                  {activeVersion.latePenalty != null
                    ? formatAmount(
                        activeVersion.latePenalty,
                      )
                    : "—"}
                </p>
              </div>
            </div>

            {/* LIMITS */}

            <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-card px-5 py-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Loan amount
                </p>

                <p className="mt-1 text-sm font-semibold text-foreground">
                  {formatAmount(
                    activeVersion.minAmount,
                  )}{" "}
                  –{" "}
                  {formatAmount(
                    activeVersion.maxAmount,
                  )}
                </p>
              </div>

              <div className="bg-card px-5 py-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Tenure
                </p>

                <p className="mt-1 text-sm font-semibold text-foreground">
                  {activeVersion.minTenure} –{" "}
                  {activeVersion.maxTenure} months
                </p>
              </div>

              <div className="bg-card px-5 py-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Foreclosure charge
                </p>

                <p className="mt-1 text-sm font-semibold text-foreground">
                  {activeVersion.foreclosureCharge !=
                  null
                    ? formatAmount(
                        activeVersion.foreclosureCharge,
                      )
                    : "—"}
                </p>
              </div>

              <div className="bg-card px-5 py-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Version
                </p>

                <p className="mt-1 text-sm font-semibold text-foreground">
                  v{activeVersion.version}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed py-12 text-center">
            <ShieldCheck className="mx-auto size-8 text-muted-foreground/50" />

            <p className="mt-3 text-sm font-semibold text-foreground">
              No active configuration
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Create a version to start accepting
              applications.
            </p>

            <Button
              type="button"
              onClick={openForm}
              className="mt-5"
            >
              <Plus />
              Create First Version
            </Button>
          </div>
        )}
      </section>

      {/* =====================================================
          VERSIONING INFORMATION
      ===================================================== */}

      <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/[0.04] px-5 py-4">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />

        <p className="text-sm text-muted-foreground">
          Changes apply to new loan applications from
          the effective date. Existing submitted loans
          retain their captured terms — historical
          pricing is never rewritten.
        </p>
      </div>

      {/* =====================================================
          NEW VERSION FORM
      ===================================================== */}

      {isFormOpen ? (
        <section className="overflow-hidden rounded-xl border bg-card">
          <div className="border-b px-5 py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Create new version
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  The form starts with the current active
                  configuration. Change only the values
                  that need to be updated.
                </p>
              </div>

              {activeVersion ? (
                <Badge variant="neutral">
                  Copying v{activeVersion.version}
                </Badge>
              ) : null}
            </div>

            {latestVersion ? (
              <p className="mt-4 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                The new version must start after{" "}
                <span className="font-medium text-foreground">
                  {formatDate(
                    latestVersion.effectiveFrom,
                  )}
                </span>
                . The previous version will be closed
                when this one takes effect.
              </p>
            ) : null}
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="p-5"
          >
            <div className="grid gap-x-5 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
              <FormInput
                label="Minimum loan amount (₹)"
                required
                inputMode="numeric"
                error={errors.minAmount}
                {...register("minAmount")}
              />

              <FormInput
                label="Maximum loan amount (₹)"
                required
                inputMode="numeric"
                error={errors.maxAmount}
                {...register("maxAmount")}
              />

              <FormInput
                label="Interest rate (% p.a.)"
                required
                inputMode="decimal"
                error={errors.interestRate}
                {...register("interestRate")}
              />

              <FormInput
                label="Minimum tenure (months)"
                required
                inputMode="numeric"
                error={errors.minTenure}
                {...register("minTenure")}
              />

              <FormInput
                label="Maximum tenure (months)"
                required
                inputMode="numeric"
                error={errors.maxTenure}
                {...register("maxTenure")}
              />

              <FormField
                label="Processing fee type"
                required
                error={
                  errors.processingFeeType?.message
                }
              >
                <select
                  className={selectClassName}
                  {...register("processingFeeType")}
                >
                  <option value="PERCENTAGE">
                    Percentage
                  </option>

                  <option value="FIXED">
                    Fixed
                  </option>
                </select>
              </FormField>

              <FormInput
                label="Processing fee"
                required
                inputMode="decimal"
                helperText="Percent of the loan amount, or a fixed rupee value"
                error={errors.processingFee}
                {...register("processingFee")}
              />

              <FormInput
                label="GST (%)"
                required
                inputMode="decimal"
                error={errors.gstPercentage}
                {...register("gstPercentage")}
              />

              <FormInput
                label="Late payment penalty (₹)"
                helperText="Optional"
                inputMode="decimal"
                error={errors.latePenalty}
                {...register("latePenalty")}
              />

              <FormInput
                label="Foreclosure charge (₹)"
                helperText="Optional"
                inputMode="decimal"
                error={errors.foreclosureCharge}
                {...register(
                  "foreclosureCharge",
                )}
              />

              <FormInput
                label="Effective from"
                required
                type="date"
                error={errors.effectiveFrom}
                {...register("effectiveFrom")}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" />
                ) : null}

                Create version
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      {/* =====================================================
          VERSION HISTORY
      ===================================================== */}

      <section>
        <div className="mb-4 flex items-center gap-2">
          <History className="size-4 text-muted-foreground" />

          <h2 className="text-base font-semibold text-foreground">
            Version history
          </h2>

          <span className="text-xs text-muted-foreground">
            (read-only)
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Effective from</TableHead>
                <TableHead>Effective to</TableHead>
                <TableHead>Interest rate</TableHead>
                <TableHead>Processing fee</TableHead>
                <TableHead>
                  Loan amount range
                </TableHead>
                <TableHead>
                  Tenure range
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {versions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No configuration versions yet.
                  </TableCell>
                </TableRow>
              ) : (
                versions.map((version) => (
                  <TableRow key={version.id}>
                    <TableCell className="font-medium">
                      v{version.version}
                    </TableCell>

                    <TableCell>
                      {formatDate(
                        version.effectiveFrom,
                      )}
                    </TableCell>

                    <TableCell>
                      {version.effectiveTo
                        ? formatDate(
                            version.effectiveTo,
                          )
                        : "—"}
                    </TableCell>

                    <TableCell>
                      {Number(
                        version.interestRate,
                      )}
                      %
                    </TableCell>

                    <TableCell>
                      {formatFee(version)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatAmount(
                        version.minAmount,
                      )}{" "}
                      –{" "}
                      {formatAmount(
                        version.maxAmount,
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {version.minTenure}–
                      {version.maxTenure} months
                    </TableCell>

                    <TableCell>
                      {version.isApplicable ? (
                        <Badge variant="success">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="neutral">
                          Historical
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

export default AdminLoanConfiguration;