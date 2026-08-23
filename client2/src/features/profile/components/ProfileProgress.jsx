import { CheckCircle2, Circle } from "lucide-react";

import { Progress } from "@/components/ui/progress";

function ProfileProgress({ profile, address }) {
  const personalCompleted =
    !!profile?.firstName &&
    !!profile?.dateOfBirth &&
    !!profile?.gender &&
    !!profile?.panNumber &&
    !!profile?.aadhaarNumber;

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
      completed: personalCompleted,
    },
    {
      title: "Address",
      completed: addressCompleted,
    },
  ];

  return (
    <section className="app-card overflow-hidden">
      {/* Header */}
      <div className="border-b border-subtle px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="section-eyebrow mb-3">Profile setup</div>

            <h2 className="section-title text-base sm:text-lg">
              Complete Your Profile
            </h2>

            <p className="text-helper mt-1.5 max-w-xl">
              Complete your profile before applying for a loan.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:block sm:min-w-20 sm:text-right">
            <p className="financial-value-lg text-2xl sm:text-3xl">
              {percentage}%
            </p>

            <p className="text-caption">Completed</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="financial-label">Profile progress</span>

            <span className="text-caption">
              {completed} of {steps.length} sections
            </span>
          </div>

          <Progress value={percentage} className="h-2" />
        </div>
      </div>

      {/* Completion Steps */}
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
                  <Circle size={19} strokeWidth={1.8} className="text-subtle" />
                )}
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-primary">
                  {step.title}
                </h3>

                <p className="text-helper mt-0.5">
                  {step.completed
                    ? "This section is complete."
                    : "This section still needs your information."}
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
