import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

function LoanWizardShell({
  step,
  totalSteps = 5,
  title,
  description,
  children,
  className,
}) {
  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <p className="text-caption font-medium text-primary">
          Step {step} of {totalSteps}
        </p>

        <h2 className="section-title mt-1">{title}</h2>

        {description ? (
          <p className="text-helper mt-1 max-w-2xl">{description}</p>
        ) : null}
      </div>

      {children}
    </div>
  );
}

function LoanWizardActions({
  onBack,
  backDisabled = false,
  backLabel = "Back",
  children,
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
      {onBack ? (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={backDisabled}
          className="w-full sm:w-auto"
        >
          ← {backLabel}
        </Button>
      ) : (
        <div className="hidden sm:block" aria-hidden="true" />
      )}

      <div className="flex w-full flex-col gap-2 sm:ml-auto sm:w-auto sm:items-end">
        {children}
      </div>
    </div>
  );
}

function LoanWizardStepper({
  steps,
  currentStep,
  onStepClick,
  completionPercentage,
  showProgress = false,
}) {
  const currentStepConfig = steps.find((item) => item.number === currentStep);

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4 sm:p-5">
      {showProgress ? (
        <>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-label">Application progress</p>
              <p className="text-caption text-muted-foreground">
                Step {currentStep} of {steps.length}
              </p>
            </div>

            <span className="financial-value text-base">
              {completionPercentage}%
            </span>
          </div>

          <Progress value={completionPercentage} />
        </>
      ) : null}

      <div className="sm:hidden">
        <p className="text-caption text-muted-foreground">
          {currentStepConfig?.label}
        </p>
      </div>

      <div className="hidden items-start sm:flex" role="list" aria-label="Application steps">
        {steps.map((item, index) => {
          const isActive = item.number === currentStep;
          const isCompleted = item.number < currentStep;
          const isAccessible = item.number <= currentStep;

          return (
            <div
              key={item.number}
              className="flex min-w-0 flex-1 items-start"
              role="listitem"
            >
              <div className="flex min-w-0 flex-col items-center">
                <button
                  type="button"
                  disabled={!isAccessible}
                  onClick={() => {
                    if (isAccessible) {
                      onStepClick(item.number);
                    }
                  }}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "touch-target flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground",
                    isAccessible
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-70",
                  )}
                >
                  {isCompleted ? "✓" : item.number}
                </button>

                <span
                  className={cn(
                    "mt-2 max-w-24 text-center text-xs",
                    isActive
                      ? "font-medium text-foreground"
                      : isCompleted
                        ? "text-primary"
                        : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </div>

              {index < steps.length - 1 ? (
                <div
                  className={cn(
                    "mx-2 mt-4 h-px min-w-4 flex-1 transition-colors sm:mx-3",
                    item.number < currentStep ? "bg-primary" : "bg-border",
                  )}
                  aria-hidden="true"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const selectClassName =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

export { LoanWizardShell, LoanWizardActions, LoanWizardStepper, selectClassName };
