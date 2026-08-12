import { ArrowRight, Sparkles, X } from "lucide-react";
import { useState } from "react";

function PromotionStrip() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <section className="border-b border-blue-900/10 bg-gradient-to-r from-[#0754b8] via-[#126ad2] to-[#188fe1] text-white">
      <div className="mx-auto flex min-h-12 max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Sparkles className="h-4 w-4 shrink-0 text-yellow-300" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 text-xs sm:text-sm">
            <span className="font-semibold">Featured this month</span>
            <span className="hidden text-white/75 md:inline">
              Explore our education-loan journey and repayment tools.
            </span>
          </div>
        </div>

        <a
          href="#featured-services"
          className="hidden shrink-0 items-center gap-1 text-xs font-semibold sm:inline-flex"
        >
          Explore now
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
