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
      "Review the available loan product, amount, tenure and estimated repayment before you begin.",
  },
  {
    number: "02",
    icon: FileText,
    eyebrow: "Apply",
    title: "Complete your application",
    description:
      "Enter the required details and upload the documents requested for your selected loan.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    eyebrow: "Review",
    title: "Verification and decision",
    description:
      "Your application moves through the configured document and review process.",
  },
  {
    number: "04",
    icon: IndianRupee,
    eyebrow: "Track",
    title: "Follow the loan journey",
    description:
      "Continue tracking your application as it moves toward the next configured loan stage.",
  },
];

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-b border-border bg-white px-3 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
                How it works
              </p>
            </div>

            <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
              A guided journey, with every next step clear.
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">
              Move from choosing a loan to completing your application and
              tracking its progress through LoanPro.
            </p>
          </div>

          <ApplyNowButton
            className="
              inline-flex
              min-h-10
              w-fit
              items-center
              gap-2
              rounded-md
              bg-primary
              px-4
              py-2.5
              text-xs
              font-bold
              text-primary-foreground
              shadow-sm
              transition
              hover:bg-primary-hover
            "
          />
        </div>

        {/* Steps */}
        <div className="mt-6 grid gap-0 overflow-hidden rounded-xl border border-slate-200 bg-[#f8fbfd] sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <article
                key={step.number}
                className={`
                  relative
                  flex
                  gap-3
                  border-b
                  border-slate-200
                  p-4
                  sm:p-5
                  ${index % 2 === 0 ? "sm:border-r" : ""}
                  lg:border-b-0
                  lg:border-r
                  lg:p-5
                  ${isLast ? "border-b-0 lg:border-r-0" : ""}
                `}
              >
                {/* Number */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary shadow-sm ring-1 ring-slate-200">
                  {step.number}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        {step.eyebrow}
                      </p>

                      <h3 className="mt-1 text-sm font-bold text-slate-900 sm:text-[15px]">
                        {step.title}
                      </h3>
                    </div>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary ring-1 ring-slate-200">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                  </div>

                  <p className="mt-1.5 text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
                    {step.description}
                  </p>
                </div>

                {!isLast && (
                  <ArrowRight className="absolute bottom-4 right-3 hidden h-3.5 w-3.5 text-slate-300 lg:block" />
                )}
              </article>
            );
          })}
        </div>

        {/* Reassurance */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-muted-foreground sm:text-xs">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Online application flow
          </span>

          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Document status visibility
          </span>

          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Application status tracking
          </span>

          <span className="text-slate-400">
            Final outcomes depend on the applicable product and review process.
          </span>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;