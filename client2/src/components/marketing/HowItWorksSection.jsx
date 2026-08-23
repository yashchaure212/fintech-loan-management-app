import {
  ArrowRight,
  CheckCircle2,
  FileText,
  IndianRupee,
  SearchCheck,
} from "lucide-react";

import ApplyNowButton from "./ApplyNowButton";

const steps = [
  {
    number: "01",
    icon: SearchCheck,
    eyebrow: "Explore",
    title: "Check your options",
    description:
      "Review the available loan product, amount, tenure, and estimated repayment before you begin.",
    tone: "blue",
  },
  {
    number: "02",
    icon: FileText,
    eyebrow: "Apply",
    title: "Complete your application",
    description:
      "Enter the required details and upload the documents requested for your selected loan.",
    tone: "violet",
  },
  {
    number: "03",
    icon: CheckCircle2,
    eyebrow: "Review",
    title: "Verification and decision",
    description:
      "Your application moves through the configured document and review process.",
    tone: "green",
  },
  {
    number: "04",
    icon: IndianRupee,
    eyebrow: "Next stage",
    title: "Follow the loan journey",
    description:
      "After approval, continue tracking the application as it moves toward the next configured stage.",
    tone: "orange",
  },
];

const toneStyles = {
  blue: {
    shell: "bg-blue-50/80",
    icon: "bg-blue-100 text-blue-700",
    number: "text-blue-700",
    line: "bg-blue-200",
  },
  violet: {
    shell: "bg-violet-50/80",
    icon: "bg-violet-100 text-violet-700",
    number: "text-violet-700",
    line: "bg-violet-200",
  },
  green: {
    shell: "bg-emerald-50/80",
    icon: "bg-emerald-100 text-emerald-700",
    number: "text-emerald-700",
    line: "bg-emerald-200",
  },
  orange: {
    shell: "bg-orange-50/80",
    icon: "bg-orange-100 text-orange-700",
    number: "text-orange-700",
    line: "bg-orange-200",
  },
};

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-border bg-surface-blue px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">How it works</p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              A guided journey, with the next step kept clear.
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              LoanPro keeps the application journey organized from product
              selection through review and the next configured loan stage.
            </p>
          </div>

          <ApplyNowButton className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-brand transition hover:-translate-y-px hover:bg-primary-hover" />
        </div>

        <div className="relative mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-12 hidden h-px bg-border xl:block" />

          {steps.map((step) => {
            const Icon = step.icon;
            const tone = toneStyles[step.tone];

            return (
              <article
                key={step.number}
                className={`relative z-10 rounded-md border border-border bg-card p-5 sm:p-6 ${tone.shell}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold tracking-[0.14em] ${tone.number}`}>
                    {step.number}
                  </span>

                  <span className={`flex h-11 w-11 items-center justify-center rounded-md ${tone.icon}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  {step.eyebrow}
                </p>

                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>

                <div className={`mt-5 h-1 w-12 rounded-full ${tone.line}`} />
              </article>
            );
          })}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground sm:text-sm">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Online application flow
          </span>
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Document status visibility
          </span>
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Application status tracking
          </span>
          <ArrowRight className="hidden h-4 w-4 text-muted-foreground sm:block" />
          <span>Final outcomes depend on the applicable product and review process.</span>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
