import { CheckCircle2, FileCheck2, ShieldCheck } from "lucide-react";

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
      <div className="page-header-card">
        <span className="section-eyebrow">Loan application</span>
        <p className="mt-3 text-xs font-semibold text-primary">
          Step {step} of {totalSteps}
        </p>

        <h2 className="mt-2 text-xl font-bold sm:text-2xl">{title}</h2>

        {description ? (
          <p className="mt-2 max-w-2xl text-helper">{description}</p>
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
    <div className="flex flex-col-reverse gap-3 rounded-2xl border bg-card p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
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
    <div className="space-y-4 rounded-2xl border bg-card p-4 shadow-card sm:p-5">
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
                    "touch-target flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold transition",
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


function ApplicationContextPanel({
  currentStep,
  totalSteps = 5,
  title = "Your application journey",
  description = "Keep the next step simple. You can continue a saved draft when you return.",
}) {
  const stepLabels = ["Loan details", "Student details", "Parent", "Documents", "Review"];

  return (
    <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="bg-brand-gradient p-5 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-white/60">
            Application workspace
          </p>
          <h3 className="mt-1.5 text-lg font-semibold text-white">{title}</h3>
          <p className="mt-2 text-xs leading-5 text-white/70">{description}</p>
        </div>

        <div className="p-5">
          <div className="space-y-4">
            {stepLabels.slice(0, totalSteps).map((label, index) => {
              const number = index + 1;
              const complete = number < currentStep;
              const active = number === currentStep;

              return (
                <div key={label} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      complete
                        ? "bg-success-soft text-success"
                        : active
                          ? "bg-primary-soft text-primary"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {complete ? <CheckCircle2 className="h-4 w-4" /> : number}
                  </span>

                  <div className="min-w-0">
                    <p className={cn("text-sm font-semibold", active ? "text-foreground" : "text-muted-foreground")}>
                      {label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {complete ? "Completed" : active ? "Current step" : "Upcoming"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-semibold">Keep your documents ready</p>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                  Required documents can vary by product and applicant details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

const selectClassName =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

export {
  LoanWizardShell,
  LoanWizardActions,
  LoanWizardStepper,
  ApplicationContextPanel,
  selectClassName,
};
