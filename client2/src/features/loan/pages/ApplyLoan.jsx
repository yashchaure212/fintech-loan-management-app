import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowLeft, CheckCircle2, FileCheck2, ShieldCheck } from "lucide-react";

import LoanDetailsStep from "../components/LoanDetailsStep";
import DocumentsStep from "../components/DocumentsStep";
import StudentInformationStep from "../components/StudentInformationStep";
import CoApplicantStep from "../components/CoApplicantStep";
import EmploymentIncomeStep from "../components/EmploymentIncomeStep";
import ExistingLoansStep from "../components/ExistingLoansStep";
import LoanRequirementStep from "../components/LoanRequirementStep";
import SchoolReviewSubmitStep from "../components/SchoolReviewSubmitStep";

import {
  useCreateLoanApplicationMutation,
  useUpdateLoanApplicationMutation,
  useGetLoanApplicationQuery,
} from "../api/loanApi";

import {
  ApplicationContextPanel,
  LoanWizardStepper,
} from "../components/LoanWizardShell";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const SCHOOL_STUDENT_LOAN_CODE = "SCHOOL_STUDENT_LOAN";

const SCHOOL_LOAN_STEPS = [
  {
    number: 1,
    label: "Student Information",
  },
  {
    number: 2,
    label: "Parent / Co-Applicant",
  },
  {
    number: 3,
    label: "Employment & Income",
  },
  {
    number: 4,
    label: "Existing Loans",
  },
  {
    number: 5,
    label: "Loan Requirement",
  },
  {
    number: 6,
    label: "Documents",
  },
  {
    number: 7,
    label: "Review & Declaration",
  },
];

function getErrorMessage(error, fallback = "Something went wrong.") {
  return error?.data?.message || error?.error || error?.message || fallback;
}

function normalizeStep(value, totalSteps) {
  const step = Number(value);

  if (!Number.isInteger(step)) {
    return 1;
  }

  return Math.min(Math.max(step, 1), totalSteps);
}

function ApplyLoan() {
  const navigate = useNavigate();
  const { id: applicationId } = useParams();

  const isEditMode = Boolean(applicationId);

  const [step, setStep] = useState(1);
  const [loanApplication, setLoanApplication] = useState(null);

  const [createLoanApplication, { isLoading: isCreating }] =
    useCreateLoanApplicationMutation();

  const [updateLoanApplication, { isLoading: isUpdating }] =
    useUpdateLoanApplicationMutation();

  const {
    data: existingApplicationResponse,
    isLoading: isLoadingApplication,
    isError: isApplicationError,
    error: applicationError,
  } = useGetLoanApplicationQuery(applicationId, {
    skip: !isEditMode,
  });

  const isSaving = isCreating || isUpdating;

  const isSchoolLoan =
    !loanApplication ||
    loanApplication.loanType?.code === SCHOOL_STUDENT_LOAN_CODE;

  const STEPS = SCHOOL_LOAN_STEPS;
  const TOTAL_STEPS = STEPS.length;

  const showLoanTypeStep = !loanApplication?.id;

  const currentStep = useMemo(() => {
    return normalizeStep(step, TOTAL_STEPS);
  }, [step, TOTAL_STEPS]);

  /*
   * Keep the browser at the beginning whenever the wizard changes steps.
   * This prevents the next step from opening at the same scroll position
   * where the customer clicked Continue.
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const completionPercentage = useMemo(() => {
    if (!loanApplication) {
      return 0;
    }

    if (TOTAL_STEPS <= 1) {
      return 100;
    }

    return Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);
  }, [currentStep, loanApplication, TOTAL_STEPS]);

  const currentStepLabel = useMemo(() => {
    return (
      STEPS.find((item) => item.number === currentStep)?.label || "Application"
    );
  }, [STEPS, currentStep]);

  /*
   * ============================================================
   * LOAD EXISTING APPLICATION
   * ============================================================
   */

  useEffect(() => {
    if (!isEditMode) {
      setLoanApplication(null);
      setStep(1);
      return;
    }

    const application = existingApplicationResponse?.data;

    if (!application) {
      return;
    }

    if (application.loanType?.code !== SCHOOL_STUDENT_LOAN_CODE) {
      toast.error("This loan product is no longer available to continue.");

      navigate("/customer/loans", {
        replace: true,
      });

      return;
    }

    setLoanApplication(application);

    setStep(normalizeStep(application.currentStep, SCHOOL_LOAN_STEPS.length));
  }, [isEditMode, existingApplicationResponse, navigate]);

  /*
   * ============================================================
   * STEP NAVIGATION
   * ============================================================
   */

  const goToStep = useCallback(
    (targetStep) => {
      const nextStep = normalizeStep(targetStep, TOTAL_STEPS);

      setStep((current) => {
        /*
         * Do not allow skipping ahead.
         * Users can only revisit completed/current steps.
         */
        if (nextStep > current) {
          return current;
        }

        return nextStep;
      });
    },
    [TOTAL_STEPS],
  );

  const goToPreviousStep = useCallback(() => {
    setStep((current) => Math.max(current - 1, 1));
  }, []);

  /*
   * ============================================================
   * CREATE APPLICATION
   * ============================================================
   */

  const handleLoanDetails = useCallback(
    async (data) => {
      if (isSaving) {
        return;
      }

      try {
        if (!data.loanTypeId) {
          throw new Error("Please select a loan type.");
        }

        const createResponse = await createLoanApplication({
          loanTypeId: data.loanTypeId,
        }).unwrap();

        const createdApplication = createResponse?.data;

        if (!createdApplication?.id) {
          throw new Error("Loan application ID was not returned.");
        }

        if (createdApplication.loanType?.code !== SCHOOL_STUDENT_LOAN_CODE) {
          throw new Error(
            "Only School Student Loan applications can be started.",
          );
        }

        toast.success("Loan application started.");

        navigate(`/customer/loans/${createdApplication.id}/edit`, {
          replace: true,
        });
      } catch (error) {
        console.error("Create/update loan application error:", error);

        toast.error(getErrorMessage(error, "Unable to save loan details."));
      }
    },
    [createLoanApplication, isSaving, navigate],
  );

  /*
   * ============================================================
   * PERSIST STEP PROGRESS
   * ============================================================
   */

  const advanceSchoolStep = useCallback(
    async (nextStep) => {
      if (!loanApplication?.id) {
        setStep(nextStep);
        return;
      }

      try {
        const response = await updateLoanApplication({
          loanApplicationId: loanApplication.id,
          data: {
            currentStep: nextStep,
          },
        }).unwrap();

        if (response?.data) {
          setLoanApplication(response.data);
        }
      } catch (error) {
        console.error("Unable to persist step progress:", error);
      }

      setStep(nextStep);
    },
    [loanApplication?.id, updateLoanApplication],
  );

  /*
   * Persist the step as soon as it becomes active.
   *
   * This is important for drafts: if a customer opens Step 4 and then
   * closes the browser before clicking Continue, the landing page can
   * still resume the application at Step 4.
   */
  useEffect(() => {
    if (!loanApplication?.id || !isEditMode || !isSchoolLoan) {
      return;
    }

    const savedStep = normalizeStep(loanApplication.currentStep, TOTAL_STEPS);

    if (savedStep === currentStep) {
      return;
    }

    updateLoanApplication({
      loanApplicationId: loanApplication.id,
      data: {
        currentStep,
      },
    })
      .unwrap()
      .then((response) => {
        if (response?.data) {
          setLoanApplication(response.data);
        }
      })
      .catch((error) => {
        console.error("Unable to save current draft step:", error);
      });
  }, [
    currentStep,
    isEditMode,
    isSchoolLoan,
    loanApplication?.id,
    loanApplication?.currentStep,
    TOTAL_STEPS,
    updateLoanApplication,
  ]);

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (isEditMode && isLoadingApplication) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>

        <Skeleton className="h-24 w-full rounded-xl" />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Skeleton className="h-[520px] w-full rounded-xl" />
          <Skeleton className="hidden h-[420px] w-full rounded-xl lg:block" />
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * APPLICATION ERROR
   * ============================================================
   */

  if (isEditMode && isApplicationError) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-xl border bg-card p-6 sm:p-8">
          <div className="space-y-2">
            <p className="text-caption font-medium text-primary">
              Loan Application
            </p>

            <h2 className="subsection-title">Unable to load application</h2>

            <p className="text-helper">
              {getErrorMessage(
                applicationError,
                "The loan application could not be loaded.",
              )}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-6"
            onClick={() => navigate("/customer/loans")}
          >
            <ArrowLeft />
            Back to My Loans
          </Button>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * APPLICATION NOT FOUND
   * ============================================================
   */

  if (isEditMode && !loanApplication) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-xl border bg-card p-6 sm:p-8">
          <div className="space-y-2">
            <p className="text-caption font-medium text-primary">
              Loan Application
            </p>

            <h2 className="subsection-title">Application not found</h2>

            <p className="text-helper">
              We could not find the loan application you are trying to edit.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-6"
            onClick={() => navigate("/customer/loans")}
          >
            <ArrowLeft />
            Back to My Loans
          </Button>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* ========================================================
          PAGE HEADER
      ======================================================== */}

      <header className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-caption font-semibold text-primary">
              {isEditMode ? "Continue your application" : "School Student Loan"}
            </p>

            <h1 className="page-title mt-1">
              {isEditMode ? "Edit Loan Application" : "Apply for a Loan"}
            </h1>

            <p className="text-helper mt-2 max-w-2xl">
              {isEditMode
                ? "Continue completing your saved draft. Your progress is saved automatically."
                : "Complete your application step by step. Your progress will be saved as you continue."}
            </p>
          </div>

          {!showLoanTypeStep && loanApplication?.applicationNumber ? (
            <div className="shrink-0">
              <p className="financial-label">Application number</p>

              <p className="mt-1 text-sm font-semibold text-foreground">
                {loanApplication.applicationNumber}
              </p>
            </div>
          ) : null}
        </div>

        {/* ======================================================
            CURRENT STEP SUMMARY
        ====================================================== */}

        {!showLoanTypeStep ? (
          <div className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileCheck2 className="size-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Step {currentStep} of {TOTAL_STEPS}
                </p>

                <p className="truncate text-sm font-semibold text-foreground">
                  {currentStepLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-muted sm:block">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />
              </div>

              <span className="text-xs font-semibold text-muted-foreground">
                {completionPercentage}%
              </span>
            </div>
          </div>
        ) : null}
      </header>

      {/* ========================================================
          STEP NAVIGATION
      ======================================================== */}

      {!showLoanTypeStep ? (
        <LoanWizardStepper
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={goToStep}
          showProgress={Boolean(loanApplication)}
          completionPercentage={completionPercentage}
        />
      ) : null}

      {/* ========================================================
          APPLICATION CONTENT
      ======================================================== */}

      <div
        className={
          !showLoanTypeStep
            ? "grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start"
            : "mx-auto w-full max-w-4xl"
        }
      >
        {/* ======================================================
            MAIN FORM
        ====================================================== */}

        <main className="min-w-0">
          {showLoanTypeStep && (
            <LoanDetailsStep
              onNext={handleLoanDetails}
              isSubmitting={isSaving}
              initialData={loanApplication}
              isEditMode={isEditMode}
            />
          )}

          {!showLoanTypeStep && isSchoolLoan && loanApplication?.id && (
            <>
              {currentStep === 1 && (
                <StudentInformationStep
                  loanApplicationId={loanApplication.id}
                  onBack={goToPreviousStep}
                  onNext={() => advanceSchoolStep(2)}
                />
              )}

              {currentStep === 2 && (
                <CoApplicantStep
                  loanApplicationId={loanApplication.id}
                  onBack={goToPreviousStep}
                  onNext={() => advanceSchoolStep(3)}
                />
              )}

              {currentStep === 3 && (
                <EmploymentIncomeStep
                  loanApplicationId={loanApplication.id}
                  onBack={goToPreviousStep}
                  onNext={() => advanceSchoolStep(4)}
                />
              )}

              {currentStep === 4 && (
                <ExistingLoansStep
                  loanApplicationId={loanApplication.id}
                  onBack={goToPreviousStep}
                  onNext={() => advanceSchoolStep(5)}
                />
              )}

              {currentStep === 5 && (
                <LoanRequirementStep
                  loanApplicationId={loanApplication.id}
                  loanApplication={loanApplication}
                  onBack={goToPreviousStep}
                  onNext={() => advanceSchoolStep(6)}
                />
              )}

              {currentStep === 6 && (
                <DocumentsStep
                  loanApplicationId={loanApplication.id}
                  onBack={goToPreviousStep}
                  onNext={() => advanceSchoolStep(7)}
                  step={6}
                  totalSteps={7}
                />
              )}

              {currentStep === 7 && (
                <SchoolReviewSubmitStep
                  loanApplication={loanApplication}
                  loanApplicationId={loanApplication.id}
                  onBack={goToPreviousStep}
                />
              )}
            </>
          )}
        </main>

        {/* ======================================================
            APPLICATION CONTEXT
        ====================================================== */}

        {!showLoanTypeStep ? (
          <aside className="lg:sticky lg:top-24">
            <ApplicationContextPanel
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
              stepLabels={STEPS.map((item) => item.label)}
            />

            <div className="mt-4 hidden rounded-xl border bg-card p-4 lg:block">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Your application is secure
                  </p>

                  <p className="text-xs leading-5 text-muted-foreground">
                    Your progress is saved as you complete each step. You can
                    return to your draft later.
                  </p>
                </div>
              </div>
            </div>

            {currentStep > 1 ? (
              <div className="mt-4 hidden items-center gap-2 rounded-xl border bg-card px-4 py-3 text-xs text-muted-foreground lg:flex">
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                <span>Previous steps completed</span>
              </div>
            ) : null}
          </aside>
        ) : null}
      </div>
    </div>
  );
}

export default ApplyLoan;
