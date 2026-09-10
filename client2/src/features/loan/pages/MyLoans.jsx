import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/shared/StatusBadge";

import { useGetMyLoanApplicationsQuery } from "../api/loanApi";
import { SCHOOL_STUDENT_LOAN_CODE } from "../constants/loanEnums";

function formatCurrency(value) {
  if (value == null) return "-";

  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function totalStepsForLoan(loan) {
  return loan?.loanType?.code === SCHOOL_STUDENT_LOAN_CODE
    ? 7
    : 5;
}

function getCompletionPercentage(currentStep, totalSteps) {
  const step = Number(currentStep || 1);

  if (step <= 1) return 0;
  if (step >= totalSteps) return 100;

  return Math.round(((step - 1) / (totalSteps - 1)) * 100);
}

function getStatusDescription(status) {
  switch (status) {
    case "DRAFT":
      return "Application is saved and waiting for you to continue.";

    case "SUBMITTED":
      return "Your application has been submitted for review.";

    case "UNDER_REVIEW":
      return "Your application is currently being reviewed.";

    case "APPROVED":
      return "Your application has been approved.";

    case "DISBURSED":
      return "Your loan has been disbursed.";

    case "CLOSED":
      return "This loan account has been closed.";

    default:
      return "View your application for the latest information.";
  }
}

function MyLoans() {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
  } = useGetMyLoanApplicationsQuery();

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-5xl">
        <div className="space-y-6">
          <div className="h-40 animate-pulse rounded-2xl border bg-card" />

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="h-24 animate-pulse rounded-2xl border bg-card" />
            <div className="h-24 animate-pulse rounded-2xl border bg-card" />
            <div className="h-24 animate-pulse rounded-2xl border bg-card" />
          </div>

          <div className="h-56 animate-pulse rounded-2xl border bg-card" />
          <div className="h-56 animate-pulse rounded-2xl border bg-card" />
        </div>
      </section>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (isError) {
    return (
      <section className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl border bg-card p-6 sm:p-8">
          <span className="section-eyebrow">
            Loan centre
          </span>

          <h1 className="page-title mt-3">
            Unable to load your loans
          </h1>

          <p className="text-helper mt-2 max-w-xl">
            We couldn't retrieve your loan applications right now.
            Please refresh the page and try again.
          </p>

          <Button
            type="button"
            className="mt-5"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </div>
      </section>
    );
  }

  const applications = data?.data || [];

  const draftCount = applications.filter(
    (loan) => loan.status === "DRAFT",
  ).length;

  const activeCount = applications.filter(
    (loan) =>
      loan.status !== "DRAFT" &&
      loan.status !== "CLOSED",
  ).length;

  const completedCount = applications.filter(
    (loan) => loan.status === "CLOSED",
  ).length;

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="space-y-6">
        {/* =====================================================
            BACK
        ===================================================== */}

        <button
          type="button"
          onClick={() => navigate("/customer/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <section className="overflow-hidden rounded-2xl border bg-card">
          <div className="bg-[linear-gradient(135deg,#07182f_0%,#0d2b52_55%,#163f6b_100%)] p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                  <WalletCards className="h-6 w-6" />
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                    Loan centre
                  </span>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                    My loans
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                    Track your loan applications, continue saved drafts,
                    and view the latest status of your loans.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={() =>
                  navigate("/customer/loans/apply")
                }
                className="min-h-11 shrink-0 bg-white text-primary hover:bg-white/90"
              >
                <Plus className="h-4 w-4" />
                Apply for a loan
              </Button>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <LoanSummary
              label="Total applications"
              value={applications.length}
              icon={FileText}
            />

            <LoanSummary
              label="Active"
              value={activeCount}
              icon={Clock3}
            />

            <LoanSummary
              label="Completed"
              value={completedCount}
              icon={CheckCircle2}
            />
          </div>
        </section>

        {/* =====================================================
            DRAFT NOTICE
        ===================================================== */}

        {draftCount > 0 && (
          <section className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Clock3 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-amber-950 sm:text-base">
                    You have {draftCount} saved{" "}
                    {draftCount === 1
                      ? "application"
                      : "applications"}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-amber-900/70">
                    Continue your saved application whenever you're ready.
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-amber-800">
                Draft applications
              </span>
            </div>
          </section>
        )}

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {applications.length === 0 ? (
          <section className="rounded-2xl border border-dashed bg-card p-8 sm:p-12">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <WalletCards className="h-6 w-6" />
              </div>

              <span className="section-eyebrow mt-5 block">
                Get started
              </span>

              <h2 className="section-title mt-2">
                No loan applications yet
              </h2>

              <p className="text-helper mt-2">
                Start a loan application and manage your journey from your
                LoanPro account.
              </p>

              <Button
                type="button"
                className="mt-5 min-h-11"
                onClick={() =>
                  navigate("/customer/loans/apply")
                }
              >
                Start an application
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        ) : (
          /* ===================================================
             APPLICATION LIST
          =================================================== */

          <section>
            <div className="mb-4 flex items-end justify-between gap-4 px-1">
              <div>
                <span className="section-eyebrow">
                  Your applications
                </span>

                <h2 className="section-title mt-2">
                  Loan applications
                </h2>

                <p className="text-helper mt-1">
                  Review your application status and loan details.
                </p>
              </div>

              <span className="hidden text-xs font-medium text-muted-foreground sm:block">
                {applications.length}{" "}
                {applications.length === 1
                  ? "application"
                  : "applications"}
              </span>
            </div>

            <div className="space-y-4">
              {applications.map((loan) => {
                const isDraft =
                  loan.status === "DRAFT";

                const isSchoolLoan =
                  loan.loanType?.code ===
                  SCHOOL_STUDENT_LOAN_CODE;

                const canContinueDraft =
                  isDraft && isSchoolLoan;

                const totalSteps =
                  totalStepsForLoan(loan);

                const completion =
                  getCompletionPercentage(
                    loan.currentStep,
                    totalSteps,
                  );

                return (
                  <article
                    key={loan.id}
                    className="overflow-hidden rounded-2xl border bg-card transition duration-200 hover:border-primary/20 hover:shadow-sm"
                  >
                    {/* TOP */}
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        {/* Identity */}
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <FileText className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-bold text-foreground sm:text-lg">
                                {loan.loanType?.name ||
                                  "Loan application"}
                              </h3>

                              <StatusBadge
                                status={loan.status}
                                type="loan"
                              />
                            </div>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {loan.applicationNumber ||
                                "Draft application"}
                            </p>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                              {getStatusDescription(
                                loan.status,
                              )}
                            </p>
                          </div>
                        </div>

                        {/* ACTION */}
                        <Button
                          type="button"
                          variant={
                            canContinueDraft
                              ? "default"
                              : "outline"
                          }
                          className="min-h-10 shrink-0"
                          onClick={() =>
                            navigate(
                              canContinueDraft
                                ? `/customer/loans/${loan.id}/edit`
                                : `/customer/loans/${loan.id}`,
                            )
                          }
                        >
                          {canContinueDraft
                            ? "Continue application"
                            : "View details"}

                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* FINANCIAL SUMMARY */}
                      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <FinancialSummary
                          label="Loan amount"
                          value={formatCurrency(
                            loan.loanAmount,
                          )}
                        />

                        <FinancialSummary
                          label="Tenure"
                          value={
                            loan.tenureMonths
                              ? `${loan.tenureMonths} months`
                              : "-"
                          }
                        />

                        <FinancialSummary
                          label="EMI"
                          value={formatCurrency(
                            loan.emi,
                          )}
                        />
                      </div>

                      {/* DRAFT PROGRESS */}
                      {isDraft && (
                        <div className="mt-5 rounded-xl border bg-muted/20 p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs font-semibold text-primary">
                                Application progress
                              </p>

                              <p className="mt-0.5 text-xs text-muted-foreground">
                                Step{" "}
                                {loan.currentStep || 1}{" "}
                                of {totalSteps}
                              </p>
                            </div>

                            <span className="text-sm font-bold tabular-nums text-primary">
                              {completion}%
                            </span>
                          </div>

                          <Progress
                            value={completion}
                            className="mt-3 h-2"
                          />

                          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>
                              Complete the remaining steps
                            </span>

                            <span>
                              Saved automatically
                            </span>
                          </div>
                        </div>
                      )}

                      {/* NON-DRAFT STATUS */}
                      {!isDraft && (
                        <div className="mt-5 flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary" />

                          <span>
                            Keep this application reference for future
                            support conversations.
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* =====================================================
            HELP
        ===================================================== */}

        <section className="rounded-2xl border bg-muted/30 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="section-eyebrow">
                Need help?
              </span>

              <h2 className="mt-2 text-lg font-semibold">
                Have a question about your loan?
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Visit the Help Centre or contact support if you need help with
                an application or loan account.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/help")}
              >
                Help Centre
              </Button>

              <Button
                type="button"
                onClick={() =>
                  navigate("/contact-support")
                }
              >
                Contact Support
              </Button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function LoanSummary({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 text-lg font-bold tabular-nums text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   FINANCIAL SUMMARY
========================================================= */

function FinancialSummary({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <p className="financial-label">
        {label}
      </p>

      <p className="mt-1 text-base font-bold tabular-nums text-foreground sm:text-lg">
        {value}
      </p>
    </div>
  );
}

export default MyLoans;