import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import ApplyNowButton from "./ApplyNowButton";
import PromoSlider from "./PromoSlider";

function HeroSection() {
  return (
    <section className="overflow-hidden border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
            Digital education finance
          </span>

          <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
            Finance your education with a clearer loan journey.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Apply online, submit documents digitally, understand your estimated
            EMI, and track your application from one secure account.
          </p>

          <div className="mt-6 space-y-3">
            {[
              "Simple digital application",
              "Clear document requirements",
              "Application tracking from your account",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-success" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ApplyNowButton
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            />

            <Link
              to="/emi-calculator"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Calculate EMI
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span>No paper-first application</span>
            <span className="hidden h-3 w-px bg-border sm:block" />
            <span>Track application status</span>
          </div>
        </div>

        <PromoSlider />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <Link
          to="/emi-calculator"
          className="group inline-flex items-center gap-1 text-sm font-medium text-primary"
        >
          Explore your repayment options
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;
