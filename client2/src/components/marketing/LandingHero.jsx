import { useEffect, useState } from "react";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import ApplyNowButton from "./ApplyNowButton";

const campaigns = [
  {
    id: "education",
    eyebrow: "Featured loan",
    title: "Education Loan",
    highlight: "up to ₹20 Lakhs",
    description:
      "Plan school and education expenses with a digital application journey built around clear steps and document tracking.",
    primary: "Check Eligibility",
    secondary: "Calculate EMI",
    icon: GraduationCap,
    tone: "blue",
  },
  {
    id: "emi",
    eyebrow: "Plan before you apply",
    title: "Know your EMI",
    highlight: "before you borrow",
    description:
      "Adjust the loan amount, interest rate and tenure to understand an estimated monthly repayment in seconds.",
    primary: "Calculate EMI",
    secondary: "Explore Loans",
    icon: Calculator,
    tone: "cyan",
  },
  {
    id: "digital",
    eyebrow: "Digital loan journey",
    title: "Apply online",
    highlight: "Track every step",
    description:
      "Start your application, submit documents and follow application progress from one secure customer account.",
    primary: "Start Application",
    secondary: "How It Works",
    icon: ShieldCheck,
    tone: "navy",
  },
];

const toneStyles = {
  blue: {
    background: "from-[#092944] via-[#104b70] to-[#1b6f98]",
    glow: "bg-cyan-300/20",
    accent: "text-cyan-200",
  },

  cyan: {
    background: "from-[#0b344d] via-[#12627b] to-[#25899a]",
    glow: "bg-white/10",
    accent: "text-cyan-100",
  },

  navy: {
    background: "from-[#081f35] via-[#123b5a] to-[#1b5f83]",
    glow: "bg-blue-300/15",
    accent: "text-blue-100",
  },
};

function LandingHero() {
  const [activeIndex, setActiveIndex] = useState(0);

  const campaign = campaigns[activeIndex];

  const Icon = campaign.icon;
  const tone = toneStyles[campaign.tone];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % campaigns.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  const next = () => {
    setActiveIndex((index) => (index + 1) % campaigns.length);
  };

  const previous = () => {
    setActiveIndex(
      (index) => (index - 1 + campaigns.length) % campaigns.length,
    );
  };

  const primaryAction =
    campaign.id === "emi" ? (
      <Link
        to="/emi-calculator"
        className="
          inline-flex
          min-h-10
          items-center
          justify-center
          gap-2
          rounded-md
          bg-white
          px-4
          py-2.5
          text-sm
          font-semibold
          text-[#0a4778]
          shadow-md
          transition
          hover:bg-white/90
        "
      >
        {campaign.primary}
        <ArrowRight className="h-4 w-4" />
      </Link>
    ) : (
      <ApplyNowButton
        className="
          inline-flex
          min-h-10
          items-center
          justify-center
          gap-2
          rounded-md
          bg-white
          px-4
          py-2.5
          text-sm
          font-semibold
          text-[#0a4778]
          shadow-md
          transition
          hover:bg-white/90
        "
      />
    );

  const secondaryHref =
    campaign.id === "emi"
      ? "#loan-products"
      : campaign.id === "education"
        ? "/emi-calculator"
        : "#how-it-works";

  return (
    <section className="border-b border-border bg-[#eef3f8] px-0 py-2 sm:px-4 sm:py-3">
      <div
        className={`
          relative
          mx-auto
          min-h-[330px]
          max-w-[1440px]
          overflow-hidden
          bg-gradient-to-br
          ${tone.background}
          shadow-[var(--shadow-card)]
          sm:min-h-[390px]
          sm:rounded-lg
          lg:min-h-[410px]
        `}
      >
        <div
          className={`
            absolute
            -right-24
            -top-24
            h-80
            w-80
            rounded-full
            blur-3xl
            ${tone.glow}
          `}
        />

        <div className="absolute -bottom-36 left-[38%] h-80 w-80 rounded-full border border-white/10" />

        <div className="absolute right-[7%] top-[12%] hidden h-56 w-56 rounded-full border border-white/10 sm:block" />

        <div
          className="
            relative
            grid
            min-h-[330px]
            items-center
            sm:min-h-[390px]
            lg:grid-cols-[1.05fr_0.95fr]
            lg:min-h-[410px]
          "
        >
          <div className="z-10 px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
            <p
              className={`
                text-xs
                font-bold
                uppercase
                tracking-[0.12em]
                ${tone.accent}
              `}
            >
              {campaign.eyebrow}
            </p>

            <h1
              className="
                mt-3
                max-w-2xl
                text-[2rem]
                font-bold
                leading-[1.08]
                tracking-tight
                text-white
                sm:text-4xl
                lg:text-[3.25rem]
              "
            >
              {campaign.title}

              <span className="block text-orange-300">
                {campaign.highlight}
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
              {campaign.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/75">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                Digital application
              </span>

              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                Secure account
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {primaryAction}

              <Link
                to={secondaryHref}
                className="
                  inline-flex
                  min-h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  border
                  border-white/20
                  bg-white/10
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  backdrop-blur
                  transition
                  hover:bg-white/15
                "
              >
                {campaign.secondary}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Desktop promotional visual */}
          <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[47%] items-end justify-center lg:flex">
            <div
              className="
                relative
                mb-8
                flex
                h-64
                w-64
                items-center
                justify-center
                rounded-full
                border
                border-white/15
                bg-white/[0.06]
              "
            >
              <div className="absolute h-48 w-48 rounded-full border border-white/10" />

              <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-white text-[#0b4b80] shadow-2xl">
                <Icon className="h-14 w-14" strokeWidth={1.6} />
              </div>

              <div className="absolute -right-10 top-8 rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-md">
                <p className="text-[10px] text-white/60">LoanPro</p>
                <p className="mt-0.5 text-sm font-bold">Digital first</p>
              </div>

              <div className="absolute -left-8 bottom-8 rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-md">
                <p className="text-[10px] text-white/60">Journey</p>
                <p className="mt-0.5 text-sm font-bold">Apply → Track</p>
              </div>
            </div>
          </div>
        </div>

        {/* Slider dots */}
        <div
          className="
            absolute
            bottom-4
            left-1/2
            z-20
            flex
            -translate-x-1/2
            items-center
            gap-2
            rounded-full
            bg-black/15
            px-3
            py-2
            backdrop-blur-sm
          "
        >
          {campaigns.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show promotion ${index + 1}`}
              className={`
                h-1.5
                rounded-full
                transition-all
                ${index === activeIndex ? "w-7 bg-white" : "w-1.5 bg-white/45"}
              `}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={previous}
          aria-label="Previous promotion"
          className="
            absolute
            left-3
            top-1/2
            z-20
            hidden
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/15
            bg-black/10
            text-white
            backdrop-blur
            sm:flex
          "
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next promotion"
          className="
            absolute
            right-3
            top-1/2
            z-20
            hidden
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/15
            bg-black/10
            text-white
            backdrop-blur
            sm:flex
          "
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

export default LandingHero;
