import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import ApplyNowButton from "./ApplyNowButton";

const slides = [
  {
    id: "education",
    eyebrow: "Education Loans",
    title: "Finance your education dreams with a clearer loan journey.",
    description:
      "Apply online, submit documents digitally, and keep track of your application from one secure account.",
    image: "/assets/education-loan-banner.jpg",
    tone: "blue",
  },
  {
    id: "abroad",
    eyebrow: "Study Abroad",
    title: "Plan your international education with a structured application journey.",
    description:
      "Understand the process, prepare your documents, and move through your application step by step.",
    image: "/assets/study-abroad-banner.jpg",
    tone: "violet",
  },
  {
    id: "planning",
    eyebrow: "Repayment Planning",
    title: "Understand your estimated EMI before you apply.",
    description:
      "Compare loan amount, interest rate, and tenure to understand an estimated monthly repayment.",
    image: "/assets/emi-banner.jpg",
    tone: "cyan",
  },
];

const toneStyles = {
  blue: {
    background: "from-[#04265a] via-[#0a52a5] to-[#187fda]",
    accent: "bg-sky-300",
  },
  violet: {
    background: "from-[#152351] via-[#38499a] to-[#7260d7]",
    accent: "bg-violet-300",
  },
  cyan: {
    background: "from-[#053a60] via-[#0875a2] to-[#19a7d5]",
    accent: "bg-cyan-300",
  },
};

function PromoSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const current = slides[activeIndex];
  const colors = toneStyles[current.tone];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  const previous = () => {
    setActiveIndex(
      (index) => (index - 1 + slides.length) % slides.length,
    );
  };

  const next = () => {
    setActiveIndex((index) => (index + 1) % slides.length);
  };

  return (
    <div className="relative min-h-[500px] overflow-hidden rounded-[1.5rem] shadow-floating sm:min-h-[540px]">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.background}`}
      />

      {current.image ? (
        <img
          src={current.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-r from-[#031c42]/98 via-[#063c7c]/82 to-[#063c7c]/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#021b3b]/75 via-transparent to-transparent" />

      <div className="pointer-events-none absolute right-[-80px] top-[-100px] h-80 w-80 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute right-[-20px] bottom-[-140px] h-96 w-96 rounded-full border border-white/10" />

      <div className="relative z-10 flex min-h-[500px] flex-col justify-between p-6 text-white motion-safe:animate-[loanpro-fade-up_500ms_ease-out] sm:min-h-[540px] sm:p-9 lg:p-12">
        <div className="max-w-[58%] min-w-[300px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur">
            <span className={`h-1.5 w-1.5 rounded-full ${colors.accent}`} />
            {current.eyebrow}
          </span>

          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[3.75rem]">
            {current.title}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-white/78 sm:text-base sm:leading-7">
            {current.description}
          </p>

          <div className="mt-6 grid max-w-xl grid-cols-1 gap-2.5 sm:grid-cols-3">
            <HeroFeature title="Online" text="Apply digitally" />
            <HeroFeature title="Documents" text="Upload online" />
            <HeroFeature title="Track status" text="Follow your journey" />
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ApplyNowButton
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-[#08356b] shadow-lg transition hover:-translate-y-px hover:bg-white/90"
            />

            <Link
              to="/emi-calculator"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              Calculate EMI
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/68">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
            Digital application
          </span>

          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
            Online document submission
          </span>

          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-200" />
            Secure account access
          </span>
        </div>
      </div>

      <div className="absolute right-5 top-5 z-20 flex gap-1.5 sm:right-7 sm:top-7">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={previous}
          aria-label="Previous promotion"
          className="h-10 w-10 rounded-full border border-white/15 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={next}
          aria-label="Next promotion"
          className="h-10 w-10 rounded-full border border-white/15 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute bottom-7 right-7 z-20 hidden rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-md sm:block">
        <p className="text-[11px] font-medium text-white/60">
          Loan journey
        </p>

        <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-white">
          Application
          <span className="text-white/40">→</span>
          Documents
          <span className="text-white/40">→</span>
          Review
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/15 px-3 py-2 backdrop-blur-sm">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show promotion ${index + 1}`}
            className={[
              "h-1.5 rounded-full transition-all duration-200",
              index === activeIndex
                ? "w-8 bg-white"
                : "w-1.5 bg-white/50",
            ].join(" ")}
          />
        ))}
      </div>

      <div className="absolute bottom-7 right-7 z-20 hidden lg:block">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
          <ShieldCheck className="h-4 w-4 text-emerald-300" />
          <span className="text-xs font-semibold text-white/90">
            Digital loan experience
          </span>
        </div>
      </div>
    </div>
  );
}

function HeroFeature({ title, text }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 px-3.5 py-3 backdrop-blur-sm">
      <p className="text-xs font-semibold text-white">{title}</p>
      <p className="mt-0.5 text-[11px] text-white/60">{text}</p>
    </div>
  );
}

export default PromoSlider;
