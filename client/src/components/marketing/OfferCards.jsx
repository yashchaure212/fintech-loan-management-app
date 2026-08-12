import {
  ArrowRight,
  BadgePercent,
  Calculator,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";

import ApplyNowButton from "./ApplyNowButton";

const offers = [
  {
    label: "Education finance",
    title: "Start your education loan journey online.",
    description:
      "Review the available loan product, understand the application steps, and begin when you are ready.",
    icon: GraduationCap,
    tone: "navy",
    action: "Apply for loan",
  },
  {
    label: "Plan your repayment",
    title: "Understand your estimated EMI first.",
    description:
      "Compare loan amount, interest rate, and tenure to see an estimated monthly repayment.",
    icon: Calculator,
    tone: "cyan",
    action: "Calculate EMI",
    href: "/emi-calculator",
  },
  {
    label: "Application support",
    title: "Know what happens after you apply.",
    description:
      "Follow a guided process with clear application steps, documents, and status tracking.",
    icon: BadgePercent,
    tone: "orange",
    action: "How it works",
    href: "#how-it-works",
  },
];

const toneClasses = {
  navy: {
    shell: "bg-gradient-to-br from-[#072d5d] via-[#0d4d97] to-[#1680d8]",
    icon: "bg-white/12 text-white",
    text: "text-white",
    muted: "text-white/75",
    button: "bg-white text-[#0b3b78] hover:bg-white/90",
  },
  cyan: {
    shell: "bg-gradient-to-br from-[#e8f9ff] via-[#d9f4ff] to-[#eefcff]",
    icon: "bg-white text-[#1182ad]",
    text: "text-[#08345e]",
    muted: "text-[#51687d]",
    button: "bg-[#0c83b5] text-white hover:bg-[#0b759f]",
  },
  orange: {
    shell: "bg-gradient-to-br from-[#fff7ec] via-[#fff0dc] to-[#fff9f1]",
    icon: "bg-white text-[#c56d08]",
    text: "text-[#684112]",
    muted: "text-[#7d6a52]",
    button: "bg-[#d97706] text-white hover:bg-[#c56805]",
  },
};

function OfferCards() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Explore LoanPro</p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Helpful options, without the clutter.
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Move from discovery to application with clear next steps and useful
            tools at the right time.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.925fr_0.925fr]">
          {offers.map((offer) => {
            const Icon = offer.icon;
            const tone = toneClasses[offer.tone];

            return (
              <article
                key={offer.title}
                className={`relative overflow-hidden rounded-2xl border border-border shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${tone.shell}`}
              >
                <div className="relative flex min-h-[290px] flex-col justify-between p-6 sm:p-7">
                  <div>
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone.icon}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <p
                      className={`mt-6 text-xs font-semibold uppercase tracking-[0.08em] ${tone.muted}`}
                    >
                      {offer.label}
                    </p>

                    <h3
                      className={`mt-2 max-w-md text-xl font-semibold tracking-tight ${tone.text}`}
                    >
                      {offer.title}
                    </h3>

                    <p className={`mt-3 max-w-md text-sm leading-6 ${tone.muted}`}>
                      {offer.description}
                    </p>
                  </div>

                  <div className="mt-7">
                    {offer.href ? (
                      <Link
                        to={offer.href}
                        className={`inline-flex min-h-10 items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition ${tone.button}`}
                      >
                        {offer.action}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <ApplyNowButton
                        className={`inline-flex min-h-10 items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition ${tone.button}`}
                      />
                    )}
                  </div>

                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border border-white/10" />
                  <div className="pointer-events-none absolute -bottom-20 -right-8 h-44 w-44 rounded-full border border-white/10" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default OfferCards;
