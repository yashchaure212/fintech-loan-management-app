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
    <div
      className="
        rounded-2xl
        border
        bg-card
        p-6
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Complete Your Profile</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Complete your profile before applying for a loan.
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold">{percentage}%</p>

          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
      </div>

      <Progress value={percentage} className="mt-6 h-2" />

      <div className="mt-6 space-y-4">
        {steps.map((step) => (
          <div
            key={step.title}
            className="
              flex
              items-center
              justify-between
              rounded-xl
              border
              p-4
            "
          >
            <div className="flex items-center gap-3">
              {step.completed ? (
                <CheckCircle2 size={22} className="text-green-600" />
              ) : (
                <Circle size={22} className="text-muted-foreground" />
              )}

              <div>
                <h3 className="font-medium">{step.title}</h3>

                <p className="text-sm text-muted-foreground">
                  {step.completed ? "Completed" : "Pending"}
                </p>
              </div>
            </div>

            <span
              className={
                step.completed
                  ? "text-sm font-medium text-green-600"
                  : "text-sm text-muted-foreground"
              }
            >
              {step.completed ? "Done" : "Incomplete"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileProgress;
