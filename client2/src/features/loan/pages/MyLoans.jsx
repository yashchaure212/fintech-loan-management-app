import { ArrowRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/common/StatusBadge";

import { useGetMyLoanApplicationsQuery } from "../api/loanApi";

const SCHOOL_STUDENT_LOAN_CODE = "SCHOOL_STUDENT_LOAN";

function formatCurrency(value) {
  if (value == null) return "-";

  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function totalStepsForLoan(loan) {
  return loan?.loanType?.code === SCHOOL_STUDENT_LOAN_CODE ? 7 : 5;
}

function getCompletionPercentage(currentStep, totalSteps) {
  const step = Number(currentStep || 1);

  if (step <= 1) return 0;
  if (step >= totalSteps) return 100;

  return Math.round(((step - 1) / (totalSteps - 1)) * 100);
}

function MyLoans() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetMyLoanApplicationsQuery();

  /* =======================================================
     LOADING
     ======================================================= */

  if (isLoading) {
    return (
      <div className="space-y-4 pb-24 sm:pb-0">
        <div className="page-header-card h-32 animate-pulse" />

        <div className="app-card h-28 animate-pulse" />

        <div className="app-card h-28 animate-pulse" />
      </div>
    );
  }

  /* =======================================================
     ERROR
     ======================================================= */

  if (isError) {
    return (
      <section className="page-header-card mb-24 sm:mb-0">
        <span className="section-eyebrow">My loans</span>

        <h1 className="page-title mt-4">Unable to load applications</h1>

        <p className="text-helper mt-2 max-w-xl">
          Please refresh the page and try again.
        </p>
      </section>
    );
  }

  const applications = data?.data || [];

  return (
    <div className="space-y-5 pb-24 sm:pb-0">
      {/* ===================================================
          PAGE HEADER
          =================================================== */}

      <section className="page-header-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <span className="section-eyebrow">Loan centre</span>

            <h1 className="page-title mt-3">My loans</h1>

            <p className="text-helper mt-1.5 max-w-2xl">
              Track your applications and continue saved drafts.
            </p>
          </div>

          <Button
            type="button"
            className="min-h-10 w-full shrink-0 sm:w-auto"
            onClick={() => navigate("/customer/loans/apply")}
          >
            Apply new loan
            <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      {/* ===================================================
          EMPTY STATE
          =================================================== */}

      {applications.length === 0 ? (
        <section className="app-card border-dashed p-7 sm:p-9">
          <div className="mx-auto max-w-sm text-center">
            <div
              className="
                mx-auto
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-[var(--radius-lg)]
                bg-brand-soft
                text-brand
              "
            >
              <FileText size={20} strokeWidth={1.8} />
            </div>

            <h2 className="mt-3 text-base font-bold text-primary">
              No loan applications
            </h2>

            <p className="text-helper mt-1">
              Start a School Student Loan application to get started.
            </p>

            <Button
              type="button"
              className="mt-4 min-h-10"
              onClick={() => navigate("/customer/loans/apply")}
            >
              Apply for a loan
            </Button>
          </div>
        </section>
      ) : (
        /* =================================================
           APPLICATION LIST
           ================================================= */

        <section className="space-y-3">
          {/* List heading */}

          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-sm font-semibold text-primary">
                Your applications
              </h2>

              <p className="text-caption mt-0.5">
                {applications.length}{" "}
                {applications.length === 1 ? "application" : "applications"}
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {applications.map((loan) => {
              const isDraft = loan.status === "DRAFT";

              const isSchoolLoan =
                loan.loanType?.code === SCHOOL_STUDENT_LOAN_CODE;

              const canContinueDraft = isDraft && isSchoolLoan;

              const totalSteps = totalStepsForLoan(loan);

              const completion = getCompletionPercentage(
                loan.currentStep,
                totalSteps,
              );

              return (
                <article
                  key={loan.id}
                  className="
                    app-card
                    overflow-hidden
                    transition-[border-color,box-shadow]
                    duration-200
                    hover:border-[hsl(var(--primary)/0.22)]
                    hover:shadow-sm
                  "
                >
                  <div className="px-4 py-4 sm:px-5 sm:py-4">
                    {/* =====================================
                        TOP ROW
                        ===================================== */}

                    <div
                      className="
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >
                      {/* Loan identity */}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-primary sm:text-base">
                            {loan.loanType?.name || "Loan application"}
                          </h3>

                          <StatusBadge status={loan.status} type="loan" />
                        </div>

                        <p className="text-caption mt-1 truncate">
                          {loan.applicationNumber || "Draft application"}
                        </p>
                      </div>

                      {/* Action */}

                      <div className="shrink-0">
                        <Button
                          type="button"
                          size="sm"
                          variant={canContinueDraft ? "default" : "outline"}
                          className="min-h-9 w-full sm:w-auto"
                          onClick={() =>
                            navigate(
                              canContinueDraft
                                ? `/customer/loans/${loan.id}/edit`
                                : `/customer/loans/${loan.id}`,
                            )
                          }
                        >
                          {canContinueDraft ? "Continue" : "View details"}

                          <ArrowRight size={15} />
                        </Button>
                      </div>
                    </div>

                    {/* =====================================
                        FINANCIAL SUMMARY
                        ===================================== */}

                    <div
                      className="
                        mt-3
                        grid
                        grid-cols-3
                        divide-x
                        divide-[hsl(var(--border))]
                        border-t
                        border-[hsl(var(--border))]
                        pt-3
                      "
                    >
                      <CompactValue
                        label="Amount"
                        value={formatCurrency(loan.loanAmount)}
                      />

                      <CompactValue
                        label="Tenure"
                        value={
                          loan.tenureMonths ? `${loan.tenureMonths} mo` : "-"
                        }
                      />

                      <CompactValue
                        label="EMI"
                        value={formatCurrency(loan.emi)}
                      />
                    </div>

                    {/* =====================================
                        DRAFT PROGRESS
                        Only drafts get this extra row.
                        ===================================== */}

                    {isDraft ? (
                      <div className="mt-3 border-t border-[hsl(var(--border))] pt-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="text-xs font-medium text-brand">
                              Application progress
                            </span>

                            <span className="text-[11px] text-muted-foreground">
                              · Step {loan.currentStep || 1} of {totalSteps}
                            </span>
                          </div>

                          <span className="shrink-0 text-xs font-semibold tabular-nums text-brand">
                            {completion}%
                          </span>
                        </div>

                        <Progress value={completion} className="mt-2 h-1.5" />
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

/* =========================================================
   COMPACT FINANCIAL VALUE
   ========================================================= */

function CompactValue({ label, value }) {
  return (
    <div className="min-w-0 px-3 first:pl-0 last:pr-0 sm:px-4">
      <p className="financial-label truncate">{label}</p>

      <p className="mt-0.5 truncate text-sm font-semibold tabular-nums text-primary sm:text-base">
        {value}
      </p>
    </div>
  );
}

export default MyLoans;
