import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  UserRoundCheck,
} from "lucide-react";

import ApplyNowButton from "./ApplyNowButton";

const points = [
  {
    icon: ClipboardCheck,
    title: "Choose the right product",
    text: "Review the available loan product and its configured requirements.",
  },
  {
    icon: UserRoundCheck,
    title: "Prepare applicant information",
    text: "Keep the personal, address, education, and other required details ready.",
  },
  {
    icon: FileCheck2,
    title: "Keep documents available",
    text: "The application identifies the documents required for the selected journey.",
  },
];

function EligibilitySection() {
  return (
    <section
      id="eligibility"
      className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="overflow-hidden rounded-lg bg-[hsl(var(--brand-navy))] shadow-floating">
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-44 left-[42%] h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative grid gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-12 lg:py-14">
              <div className="text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-200">
                  Before you apply
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Get application-ready before you begin.
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72 sm:text-base">
                  The application flow is designed to collect the information
                  and documents needed for the selected loan product. Review the
                  journey first, then start when you are ready.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <ApplyNowButton className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-[hsl(var(--brand-navy))] shadow-lg transition hover:-translate-y-px hover:bg-white/90" />

                  <a
                    href="#how-it-works"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    See the process
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                <p className="mt-5 text-xs leading-5 text-white/50">
                  Eligibility, pricing, documentation, and final terms depend on
                  the applicable loan configuration and review process.
                </p>
              </div>

              <div className="rounded-md border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sky-200">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Application readiness
                    </p>
                    <p className="text-xs text-white/50">
                      A simple pre-application checklist
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {points.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="flex gap-3 rounded-xl border border-white/10 bg-white/10 p-4"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sky-200">
                          <Icon className="h-4.5 w-4.5" />
                        </span>

                        <div>
                          <p className="text-sm font-semibold text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-white/55">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EligibilitySection;
