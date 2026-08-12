import { ArrowRight, CheckCircle2, FileText, IndianRupee, SearchCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: SearchCheck,
    title: "Check your options",
    description:
      "Understand the loan product, amount, tenure, and estimated repayment before you begin.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Apply online",
    description:
      "Complete the application and submit the documents required for your selected loan.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Review and decision",
    description:
      "Your application moves through the configured verification and review process.",
  },
  {
    number: "04",
    icon: IndianRupee,
    title: "Disbursement",
    description:
      "Once approved, follow the application status through the next stage of the loan journey.",
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-y border-border bg-card px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">How it works</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            A guided loan journey from application to decision.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            The experience is designed to keep each required action clear.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative">
                <div className="rounded-xl border border-border bg-background p-5 shadow-card sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-primary">
                      {step.number}
                    </span>

                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {index !== steps.length - 1 ? (
                  <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 bg-card text-border lg:block" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
