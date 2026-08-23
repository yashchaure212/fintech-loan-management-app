import { ArrowRight, FileText } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGetMyLoanApplicationsQuery } from "@/features/loan/api/loanApi";

const SCHOOL_STUDENT_LOAN_CODE = "SCHOOL_STUDENT_LOAN";
const TOTAL_STEPS = 7;

function getCompletionPercentage(currentStep) {
  const step = Number(currentStep || 1);

  if (step <= 1) return 0;
  if (step >= TOTAL_STEPS) return 100;

  return Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);
}

function normalizeStep(value) {
  const step = Number(value);

  if (!Number.isInteger(step)) {
    return 1;
  }

  return Math.min(Math.max(step, 1), TOTAL_STEPS);
}

function LoanDraftResumeCard() {
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const user = useSelector((state) => state.auth.user);

  const role =
    typeof user?.role === "string" ? user.role : (user?.role?.name ?? null);

  const shouldFetch = isAuthenticated && role === "CUSTOMER";

  const { data, isLoading } = useGetMyLoanApplicationsQuery(undefined, {
    skip: !shouldFetch,
  });

  /*
   * Do not show anything for:
   * - logged-out users
   * - non-customers
   * - while applications are loading
   */
  if (!shouldFetch || isLoading) {
    return null;
  }

  const applications = Array.isArray(data?.data) ? data.data : [];

  /*
   * Find the latest School Student Loan draft.
   *
   * If the customer somehow has multiple drafts,
   * the most recently updated one is shown.
   */
  const draft = applications
    .filter(
      (loan) =>
        loan?.status === "DRAFT" &&
        loan?.loanType?.code === SCHOOL_STUDENT_LOAN_CODE,
    )
    .sort((a, b) => {
      const aDate = new Date(a?.updatedAt || a?.createdAt || 0).getTime();

      const bDate = new Date(b?.updatedAt || b?.createdAt || 0).getTime();

      return bDate - aDate;
    })[0];

  /*
   * No draft = don't show the card.
   */
  if (!draft?.id) {
    return null;
  }

  const currentStep = normalizeStep(draft.currentStep);

  const completion = getCompletionPercentage(currentStep);

  const stepLabels = [
    "Student Information",
    "Parent / Co-Applicant",
    "Employment & Income",
    "Existing Loans",
    "Loan Requirement",
    "Documents",
    "Review & Declaration",
  ];

  const currentStepLabel = stepLabels[currentStep - 1] || "Application";

  return (
    <section className="border-b border-border bg-[#eef6ff] px-3 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="overflow-hidden rounded-xl border border-primary/15 bg-card shadow-sm">
          <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            {/* ==========================================
                TEXT
            ========================================== */}

            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText size={19} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
                  Application in progress
                </p>

                <h2 className="mt-1 text-base font-bold text-foreground sm:text-lg">
                  Complete your loan application
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your School Student Loan application is saved as a draft.
                  Continue where you left off.
                </p>
              </div>
            </div>

            {/* ==========================================
                CONTINUE BUTTON
            ========================================== */}

            <Button
              type="button"
              className="w-full shrink-0 sm:w-auto"
              onClick={() => navigate(`/customer/loans/${draft.id}/edit`)}
            >
              Continue application
              <ArrowRight size={16} />
            </Button>
          </div>

          {/* ============================================
              PROGRESS
          ============================================ */}

          <div className="border-t border-border/70 px-4 py-3 sm:px-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  Step {currentStep} of {TOTAL_STEPS}: {currentStepLabel}
                </p>
              </div>

              <p className="text-xs font-semibold text-muted-foreground">
                {completion}% complete
              </p>
            </div>

            <Progress value={completion} className="mt-2 h-2" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoanDraftResumeCard;
