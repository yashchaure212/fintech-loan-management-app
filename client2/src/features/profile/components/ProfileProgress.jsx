import { CheckCircle2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

function ProfileProgress({ profile, address }) {
  const personalCompleted =
    !!profile?.firstName &&
    !!profile?.dateOfBirth &&
    !!profile?.gender &&
    !!profile?.occupation;

  const addressCompleted =
    !!address?.line1 &&
    !!address?.city &&
    !!address?.state &&
    !!address?.pincode;

  const completed = Number(personalCompleted) + Number(addressCompleted);
  const percentage = completed * 50;

  const steps = [
    {
      title: "Personal Details",
      description: "Basic personal information and occupation.",
      completed: personalCompleted,
    },
    {
      title: "Address",
      description: "Current residential address information.",
      completed: addressCompleted,
    },
  ];

  return (
    <section className="app-card overflow-hidden">
      {/* HEADER */}
      <div className="border-b border-subtle px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <span className="section-eyebrow">
              Profile setup
            </span>

            <h2 className="section-title mt-3">
              Complete your profile
            </h2>

            <p className="text-helper mt-1">
              Add your basic personal and address information.
            </p>
          </div>

          <div className="shrink-0 sm:text-right">
            <p className="financial-value-lg text-2xl sm:text-3xl">
              {percentage}%
            </p>

            <p className="text-caption mt-0.5">
              Completed
            </p>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="financial-label">
              Profile progress
            </span>

            <span className="text-caption">
              {completed} of {steps.length} sections
            </span>
          </div>

          <Progress
            value={percentage}
            className="h-2"
          />
        </div>
      </div>

      {/* STEPS */}
      <div className="divide-y divide-[hsl(var(--border-subtle))]">
        {steps.map((step) => (
          <div
            key={step.title}
            className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
          >
            <div className="flex min-w-0 items-center gap-3.5">
              <div
                className={
                  step.completed
                    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--success-soft))]"
                    : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--surface-tertiary))]"
                }
              >
                {step.completed ? (
                  <CheckCircle2
                    size={19}
                    strokeWidth={2}
                    className="text-green"
                  />
                ) : (
                  <Circle
                    size={19}
                    strokeWidth={1.8}
                    className="text-subtle"
                  />
                )}
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-primary">
                  {step.title}
                </h3>

                <p className="text-helper mt-0.5">
                  {step.completed
                    ? "This section is complete."
                    : step.description}
                </p>
              </div>
            </div>

            <span
              className={
                step.completed
                  ? "status-badge shrink-0 bg-[hsl(var(--success-soft))] text-green"
                  : "status-badge shrink-0 bg-[hsl(var(--surface-tertiary))] text-secondary"
              }
            >
              {step.completed ? "Done" : "Incomplete"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProfileProgress;