import {
  ArrowRight,
  Calculator,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import ApplyNowButton from "./ApplyNowButton";

const offers = [
  {
    label: "Education finance",
    title: "Build your education loan plan online.",
    text: "Review the loan journey, estimate repayment and start when you are ready.",
    icon: GraduationCap,
    className: "from-[#eef6ff] via-white to-[#dff0ff]",
    iconClass: "bg-[#dcecff] text-[#1767d5]",
    action: "Apply now",
  },

  {
    label: "EMI planning",
    title: "See an estimated EMI before applying.",
    text: "Try different amounts, rates and tenures to understand your monthly repayment.",
    icon: Calculator,
    className: "from-[#fff8eb] via-white to-[#ffefd2]",
    iconClass: "bg-[#ffe7c5] text-[#c86c08]",
    action: "Calculate EMI",
    href: "/emi-calculator",
  },

  {
    label: "Digital journey",
    title: "Apply, upload and track from one account.",
    text: "Keep your application journey organized with clear steps and status visibility.",
    icon: ShieldCheck,
    className: "from-[#eefaf6] via-white to-[#dff4ea]",
    iconClass: "bg-[#d8f5e8] text-[#16845a]",
    action: "How it works",
    href: "#how-it-works",
  },
];

function LandingOffers() {
  return (
    <section className="border-b border-border bg-white px-3 py-7 sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-end justify-between gap-4 px-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-primary">
              Featured
            </p>

            <h2 className="mt-1 text-xl font-bold sm:text-2xl">
              Offers, tools and useful journeys
            </h2>
          </div>

          <span className="hidden text-xs text-muted-foreground sm:block">
            Explore what fits your next financial step
          </span>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {offers.map((offer) => {
            const Icon = offer.icon;

            const content = (
              <div
                className={`
                  relative
                  min-h-[190px]
                  overflow-hidden
                  rounded-md
                  border
                  border-[#dbe4ec]
                  bg-gradient-to-br
                  ${offer.className}
                  p-5
                `}
              >
                <div className="absolute -bottom-12 -right-10 h-32 w-32 rounded-full border border-white/80" />

                <span
                  className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-md
                    ${offer.iconClass}
                  `}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                  {offer.label}
                </p>

                <h3 className="mt-1.5 max-w-[320px] text-lg font-bold tracking-tight">
                  {offer.title}
                </h3>

                <p className="mt-2 max-w-[360px] text-xs leading-5 text-muted-foreground">
                  {offer.text}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                  {offer.action}

                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            );

            if (offer.href) {
              return (
                <Link key={offer.label} to={offer.href}>
                  {content}
                </Link>
              );
            }

            return (
              <article key={offer.label} className="relative">
                {content}

                <div className="absolute bottom-5 left-5">
                  <ApplyNowButton
                    className="
                      inline-flex
                      min-h-9
                      items-center
                      gap-1.5
                      rounded-md
                      bg-primary
                      px-3
                      py-2
                      text-xs
                      font-bold
                      text-primary-foreground
                      hover:bg-primary-hover
                    "
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LandingOffers;
