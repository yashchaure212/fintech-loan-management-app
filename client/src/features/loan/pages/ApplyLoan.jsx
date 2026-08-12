import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import LoanDetailsStep from "../components/LoanDetailsStep";
import EducationDetailsStep from "../components/EducationDetailsStep";
import ParentDetailsStep from "../components/ParentDetailsStep";
import DocumentsStep from "../components/DocumentsStep";
import ReviewSubmitStep from "../components/ReviewSubmitStep";

import {
  useCreateLoanApplicationMutation,
  useUpdateLoanApplicationMutation,
  useGetLoanApplicationQuery,
} from "../api/loanApi";

import { LoanWizardStepper } from "../components/LoanWizardShell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const STEPS = [
  {
    number: 1,
    label: "Loan Details",
  },
  {
    number: 2,
    label: "Student Details",
  },
  {
    number: 3,
    label: "Parent",
  },
  {
    number: 4,
    label: "Documents",
  },
  {
    number: 5,
    label: "Review",
  },
];

const TOTAL_STEPS = STEPS.length;

function getErrorMessage(error, fallback = "Something went wrong.") {
  return error?.data?.message || error?.error || error?.message || fallback;
}

function normalizeStep(value) {
  const step = Number(value);

  if (!Number.isInteger(step)) {
    return 1;
  }

  return Math.min(Math.max(step, 1), TOTAL_STEPS);
}

function ApplyLoan() {
  const navigate = useNavigate();
  const { id: applicationId } = useParams();

  const isEditMode = Boolean(applicationId);

  const [step, setStep] = useState(1);
  const [loanApplication, setLoanApplication] = useState(null);

  // ==================================================
  // API
  // ==================================================

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

  // ==================================================
  // DERIVED STATE
  // ==================================================

  const isSaving = isCreating || isUpdating;

  const currentStep = useMemo(() => {
    return normalizeStep(step);
  }, [step]);

  const completionPercentage = useMemo(() => {
    if (!loanApplication) {
      return 0;
    }

    if (TOTAL_STEPS <= 1) {
      return 100;
    }

    return Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);
  }, [currentStep, loanApplication]);

  // ==================================================
  // LOAD EXISTING APPLICATION
  // ==================================================

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

    // --------------------------------------------------
    // Only DRAFT applications can be edited
    // --------------------------------------------------

    if (application.status !== "DRAFT") {
      toast.error("Only draft applications can be edited.");

      navigate("/customer/loans", {
        replace: true,
      });

      return;
    }

    setLoanApplication(application);
    setStep(normalizeStep(application.currentStep));
  }, [isEditMode, existingApplicationResponse, navigate]);

  // ==================================================
  // STEP NAVIGATION
  // ==================================================

  const goToStep = useCallback((targetStep) => {
    const nextStep = normalizeStep(targetStep);

    setStep((currentStep) => {
      if (nextStep > currentStep) {
        return currentStep;
      }

      return nextStep;
    });
  }, []);

  const goToNextStep = useCallback(() => {
    setStep((currentStep) => Math.min(currentStep + 1, TOTAL_STEPS));
  }, []);

  const goToPreviousStep = useCallback(() => {
    setStep((currentStep) => Math.max(currentStep - 1, 1));
  }, []);

  // ==================================================
  // STEP 1
  // CREATE / UPDATE LOAN APPLICATION
  // ==================================================

  const handleLoanDetails = useCallback(
    async (data) => {
      if (isSaving) {
        return;
      }

      try {
        let application;

        // ==================================================
        // EDIT EXISTING DRAFT
        // ==================================================

        if (isEditMode && loanApplication?.id) {
          const response = await updateLoanApplication({
            loanApplicationId: loanApplication.id,
            data: {
              loanAmount: Number(data.loanAmount),
              tenureMonths: Number(data.tenureMonths),
              currentStep: 2,
            },
          }).unwrap();

          application = response?.data;

          if (!application?.id) {
            throw new Error("Updated loan application was not returned.");
          }

          setLoanApplication(application);

          toast.success("Loan details updated.");

          setStep(2);

          return;
        }

        // ==================================================
        // CREATE NEW DRAFT
        // ==================================================

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

        // ==================================================
        // SAVE LOAN AMOUNT + TENURE
        // ==================================================

        const updateResponse = await updateLoanApplication({
          loanApplicationId: createdApplication.id,
          data: {
            loanAmount: Number(data.loanAmount),
            tenureMonths: Number(data.tenureMonths),
            currentStep: 2,
          },
        }).unwrap();

        application = updateResponse?.data;

        if (!application?.id) {
          throw new Error("Updated loan application was not returned.");
        }

        toast.success("Loan application started.");

        // Persist application ID in the URL so refresh keeps edit context.
        navigate(`/customer/loans/${application.id}/edit`, {
          replace: true,
        });
      } catch (error) {
        console.error("Create/update loan application error:", error);

        toast.error(getErrorMessage(error, "Unable to save loan details."));
      }
    },
    [
      createLoanApplication,
      isEditMode,
      isSaving,
      loanApplication?.id,
      navigate,
      updateLoanApplication,
    ],
  );

  // ==================================================
  // STEP CALLBACKS
  // ==================================================

  const handleEducationNext = useCallback(() => {
    goToNextStep();
  }, [goToNextStep]);

  const handleParentNext = useCallback(() => {
    goToNextStep();
  }, [goToNextStep]);

  const handleDocumentsNext = useCallback(async () => {
    if (!loanApplication?.id) {
      goToNextStep();
      return;
    }

    try {
      const response = await updateLoanApplication({
        loanApplicationId: loanApplication.id,
        data: {
          currentStep: 5,
        },
      }).unwrap();

      if (response?.data) {
        setLoanApplication(response.data);
      }

      setStep(5);
    } catch (error) {
      console.error("Unable to persist documents step:", error);
      toast.error(
        getErrorMessage(error, "Unable to continue to review step."),
      );
    }
  }, [goToNextStep, loanApplication?.id, updateLoanApplication]);

  // ==================================================
  // BACK CALLBACKS
  // ==================================================

  const handleBackToLoanDetails = useCallback(() => {
    goToPreviousStep();
  }, [goToPreviousStep]);

  const handleBackToEducation = useCallback(() => {
    goToPreviousStep();
  }, [goToPreviousStep]);

  const handleBackToParent = useCallback(() => {
    goToPreviousStep();
  }, [goToPreviousStep]);

  const handleBackToDocuments = useCallback(() => {
    goToPreviousStep();
  }, [goToPreviousStep]);

  // ==================================================
  // LOADING EXISTING APPLICATION
  // ==================================================

  if (isEditMode && isLoadingApplication) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>

        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  // ==================================================
  // EXISTING APPLICATION ERROR
  // ==================================================

  if (isEditMode && isApplicationError) {
    return (
      <div className="space-y-4 rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="subsection-title">Unable to load application</h2>

        <p className="text-helper">
          {getErrorMessage(
            applicationError,
            "The loan application could not be loaded.",
          )}
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/customer/loans")}
        >
          ← Back to My Loans
        </Button>
      </div>
    );
  }

  // ==================================================
  // SAFETY
  // ==================================================

  if (isEditMode && !loanApplication) {
    return (
      <div className="space-y-4 rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="subsection-title">Application not found</h2>

        <p className="text-helper">
          We could not find the loan application you are trying to edit.
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/customer/loans")}
        >
          ← Back to My Loans
        </Button>
      </div>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="space-y-6">
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div>
        <p className="text-caption font-medium text-primary">
          {isEditMode ? "Continue your application" : "Education Loan"}
        </p>

        <h1 className="page-title mt-1">
          {isEditMode ? "Edit Loan Application" : "Apply for a Loan"}
        </h1>

        <p className="text-helper mt-1">
          {isEditMode
            ? "Continue completing your saved draft."
            : "Complete all steps to submit your education loan application."}
        </p>
      </div>

      <LoanWizardStepper
        steps={STEPS}
        currentStep={currentStep}
        onStepClick={goToStep}
        showProgress={Boolean(loanApplication)}
        completionPercentage={completionPercentage}
      />

      {/* ==================================================
          STEP 1
      ================================================== */}

      {currentStep === 1 && (
        <LoanDetailsStep
          onNext={handleLoanDetails}
          isSubmitting={isSaving}
          initialData={loanApplication}
          isEditMode={isEditMode}
        />
      )}

      {/* ==================================================
          STEP 2
      ================================================== */}

      {currentStep === 2 && loanApplication?.id && (
        <EducationDetailsStep
          loanApplicationId={loanApplication.id}
          onBack={handleBackToLoanDetails}
          onNext={handleEducationNext}
        />
      )}

      {/* ==================================================
          STEP 3
      ================================================== */}

      {currentStep === 3 && loanApplication?.id && (
        <ParentDetailsStep
          loanApplicationId={loanApplication.id}
          onBack={handleBackToEducation}
          onNext={handleParentNext}
        />
      )}

      {/* ==================================================
          STEP 4
      ================================================== */}

      {currentStep === 4 && loanApplication?.id && (
        <DocumentsStep
          loanApplicationId={loanApplication.id}
          onBack={handleBackToParent}
          onNext={handleDocumentsNext}
        />
      )}

      {/* ==================================================
          STEP 5
      ================================================== */}

      {currentStep === 5 && loanApplication?.id && (
        <ReviewSubmitStep
          loanApplication={loanApplication}
          loanApplicationId={loanApplication.id}
          onBack={handleBackToDocuments}
        />
      )}
    </div>
  );
}

export default ApplyLoan;
