import { ArrowRight, CheckCircle2 } from "lucide-react";
import ApplyNowButton from "./ApplyNowButton";

const points = [
  "Review the selected loan product before applying",
  "Understand the information and documents you may need",
  "Start online and continue your application from your account",
];

function EligibilitySection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-2xl bg-primary">
          <div className="grid gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-12 lg:py-12">
            <div className="text-primary-foreground">
              <p className="text-sm font-medium text-primary-foreground/70">
                Before you apply
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Know what you need for your loan application.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-primary-foreground/75 sm:text-base">
                Review the loan requirements and start when you are ready. The
                application flow will guide you through each required step.
              </p>

              <div className="mt-6 space-y-3">
                {points.map((point) => (
                  <div key={point} className="flex items-start gap-2.5 text-sm text-primary-foreground/90">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <ApplyNowButton
                  className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
                />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">
                Application readiness
              </p>

              <div className="mt-5 space-y-4">
                {[
                  "Loan product selected",
                  "Applicant information ready",
                  "Required documents available",
                ].map((item) => (
                  <div key={item} className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <span className="text-sm text-white/80">{item}</span>
                    <span className="text-xs font-semibold text-white">
                      Review
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 inline-flex items-center gap-1 text-xs text-white/65">
                Your final eligibility and terms depend on the configured loan rules.
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EligibilitySection;
