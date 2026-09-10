import {
  ArrowRight,
  CheckCircle2,
  FileText,
} from "lucide-react";
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

  if (!shouldFetch || isLoading) {
    return null;
  }

  const applications = Array.isArray(data?.data) ? data.data : [];

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
    <section className="border-b border-border bg-[#eef6ff] px-2 py-2 sm:px-4 sm:py-2.5">
      <div className="mx-auto max-w-[1280px]">
        <div
          className="
            overflow-hidden
            rounded-md
            border border-primary/15
            bg-card
            shadow-sm
          "
        >
          {/* =====================================================
              MAIN ROW
          ===================================================== */}
          <div
            className="
              flex
              items-center
              gap-2.5
              px-3
              py-2.5
              sm:gap-3
              sm:px-4
              sm:py-3
              lg:px-5
              lg:py-3.5
            "
          >
            {/* Icon */}
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-md
                bg-primary/10
                text-primary
                sm:h-9
                sm:w-9
              "
            >
              <FileText
                className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                strokeWidth={1.8}
              />
            </div>

            {/* =================================================
                TEXT
            ================================================= */}
            <div className="min-w-0 flex-1">
              {/* Desktop */}
              <p className="hidden text-[10px] font-bold uppercase tracking-[0.08em] text-primary sm:block">
                Application in progress
              </p>

              <h2 className="truncate text-xs font-bold text-foreground sm:mt-0.5 sm:text-sm">
                <span className="sm:hidden">Application pending</span>

                <span className="hidden sm:inline">
                  Complete your loan application
                </span>
              </h2>

              <p className="mt-0.5 truncate text-[10px] text-muted-foreground sm:text-xs">
                <span className="sm:hidden">
                  Step {currentStep} of {TOTAL_STEPS} · {completion}% complete
                </span>

                <span className="hidden sm:inline">
                  {currentStepLabel} · Step {currentStep} of {TOTAL_STEPS}
                </span>
              </p>
            </div>

            {/* =================================================
                CONTINUE BUTTON
            ================================================= */}
            <Button
              type="button"
              size="sm"
              className="
                h-8
                shrink-0
                gap-1
                px-2.5
                text-[10px]
                font-bold
                sm:h-9
                sm:px-3.5
                sm:text-xs
              "
              onClick={() => navigate(`/customer/loans/${draft.id}/edit`)}
            >
              <span className="sm:hidden">Continue</span>

              <span className="hidden sm:inline">Continue application</span>

              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* =====================================================
    PROGRESS
===================================================== */}
          <div className="border-t border-border/60 px-3 py-3 sm:px-4 sm:py-3.5 lg:px-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-semibold text-muted-foreground sm:text-xs">
                Application progress
              </p>

              <p className="text-[10px] font-bold text-primary sm:text-xs">
                {completion}% complete
              </p>
            </div>

            {/* STEP TIMELINE */}
            <div className="hide-scrollbar overflow-x-auto pb-1">
              <div className="flex min-w-[620px] items-start">
                {stepLabels.map((label, index) => {
                  const stepNumber = index + 1;
                  const completed = stepNumber < currentStep;
                  const current = stepNumber === currentStep;
                  const upcoming = stepNumber > currentStep;

                  return (
                    <div key={label} className="flex flex-1 items-start">
                      {/* STEP */}
                      <div className="flex min-w-0 flex-col items-center">
                        {/* Circle */}
                        <div
                          className={`
                  flex h-7 w-7 shrink-0 items-center justify-center
                  rounded-full border text-[10px] font-bold
                  transition-all duration-300
                  ${
                    completed
                      ? "border-primary bg-primary text-primary-foreground"
                      : current
                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                        : "border-border bg-muted text-muted-foreground"
                  }
                `}
                        >
                          {completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            stepNumber
                          )}
                        </div>

                        {/* LABEL */}
                        <p
                          className={`
                  mt-2 max-w-[85px] text-center text-[9px] leading-3
                  transition-all duration-300 sm:max-w-[110px] sm:text-[10px]
                  ${
                    completed || current
                      ? "font-bold text-foreground"
                      : "font-medium text-muted-foreground/50"
                  }
                `}
                        >
                          {label}
                        </p>
                      </div>

                      {/* CONNECTING LINE */}
                      {stepNumber < TOTAL_STEPS && (
                        <div
                          className={`
                  mt-3.5 h-0.5 flex-1 transition-all duration-500
                  ${stepNumber < currentStep ? "bg-primary" : "bg-border"}
                `}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CURRENT STEP */}
            <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
              <p className="truncate text-[10px] font-semibold text-foreground sm:text-xs">
                {currentStepLabel}
              </p>

              <p className="shrink-0 text-[10px] font-semibold text-muted-foreground sm:text-xs">
                Step {currentStep} of {TOTAL_STEPS}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoanDraftResumeCard;
