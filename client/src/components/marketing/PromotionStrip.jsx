import { ArrowRight, Sparkles, X } from "lucide-react";
import { useState } from "react";

function PromotionStrip() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <section
      aria-label="Latest announcement"
      className="border-b border-primary/10 bg-gradient-to-r from-primary via-brand-blue to-accent-blue text-white"
    >
      <div className="mx-auto flex min-h-11 max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Sparkles className="hidden h-4 w-4 shrink-0 sm:block" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm">
            <span className="font-semibold">
              Education loan applications are now digital.
            </span>

            <span className="hidden text-white/70 md:inline">
              Apply online, submit documents, and track your application.
            </span>
          </div>
        </div>

        <a
          href="#how-it-works"
          className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-white sm:inline-flex"
        >
          Learn how it works
          <ArrowRight className="h-3.5 w-3.5" />
        </a>

        <button
          type="button"
          onClick={() => setVisible(false)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/75 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

export default PromotionStrip;
