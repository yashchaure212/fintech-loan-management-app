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
    image:
      "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&fit=crop",
    className: "from-[#eef6ff] via-white to-[#dff0ff]",
    iconClass: "bg-[#dcecff] text-[#1767d5]",
    imagePosition: "object-[60%_45%]",
  },
  {
    label: "EMI planning",
    title: "See an estimated EMI before applying.",
    text: "Try different amounts, rates and tenures to understand your monthly repayment.",
    icon: Calculator,
    image:
      "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&fit=crop",
    className: "from-[#fff8eb] via-white to-[#ffefd2]",
    iconClass: "bg-[#ffe7c5] text-[#c86c08]",
    imagePosition: "object-[55%_45%]",
    href: "/emi-calculator",
    action: "Calculate EMI",
  },
  {
    label: "Digital journey",
    title: "Apply, upload and track from one account.",
    text: "Keep your application journey organized with clear steps and status visibility.",
    icon: ShieldCheck,
    image:
      "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&fit=crop",
    className: "from-[#eefaf6] via-white to-[#dff4ea]",
    iconClass: "bg-[#d8f5e8] text-[#16845a]",
    imagePosition: "object-[50%_40%]",
    href: "#how-it-works",
    action: "How it works",
  },
];

function LandingOffers() {
  return (
    <section className="border-b border-border bg-white px-3 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
                Featured
              </p>
            </div>

            <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Offers, tools and useful journeys
            </h2>

            <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground sm:text-sm">
              Helpful tools and simple ways to move ahead with your financial
              journey.
            </p>
          </div>

          <span className="hidden shrink-0 text-xs font-semibold text-primary sm:block">
            Explore more →
          </span>
        </div>

        {/* Offer cards */}
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {offers.map((offer) => {
            const Icon = offer.icon;

            const content = (
              <div
                className={`
                  group
                  relative
                  min-h-[205px]
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-gradient-to-br
                  ${offer.className}
                  shadow-[0_2px_8px_rgba(15,23,42,0.04)]
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-slate-300
                  hover:shadow-[0_8px_22px_rgba(15,23,42,0.08)]
                  sm:min-h-[220px]
                `}
              >
                {/* Decorative circles */}
                <div className="pointer-events-none absolute -bottom-16 -right-12 h-40 w-40 rounded-full border border-white/80" />

                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/35" />

                {/* Real image */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    bottom-0
                    right-0
                    h-[150px]
                    w-[145px]
                    overflow-hidden
                    opacity-95
                    transition
                    duration-500
                    group-hover:scale-[1.04]
                    sm:h-[165px]
                    sm:w-[165px]
                  "
                >
                  <img
                    src={offer.image}
                    alt=""
                    draggable="false"
                    loading="lazy"
                    className={`
                      h-full
                      w-full
                      object-cover
                      ${offer.imagePosition}
                    `}
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/80 via-white/15 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex min-h-[205px] max-w-[70%] flex-col p-4 sm:min-h-[220px] sm:p-5">
                  {/* Icon */}
                  <span
                    className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      ${offer.iconClass}
                    `}
                  >
                    <Icon
                      className="h-[18px] w-[18px]"
                      strokeWidth={1.8}
                    />
                  </span>

                  {/* Label */}
                  <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:text-[10px]">
                    {offer.label}
                  </p>

                  {/* Title */}
                  <h3 className="mt-1.5 text-base font-bold leading-[1.25] tracking-tight text-slate-900 sm:text-lg">
                    {offer.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-[10px] leading-[1.55] text-muted-foreground sm:text-xs sm:leading-5">
                    {offer.text}
                  </p>

                  {/* Action */}
                  <div className="mt-auto pt-3">
                    {offer.href ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary sm:text-xs">
                        {offer.action}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    ) : (
                      <ApplyNowButton
                        className="
                          inline-flex
                          min-h-8
                          items-center
                          gap-1.5
                          rounded-md
                          bg-primary
                          px-3
                          py-1.5
                          text-[11px]
                          font-bold
                          text-primary-foreground
                          shadow-sm
                          transition
                          hover:bg-primary-hover
                          sm:min-h-9
                          sm:text-xs
                        "
                      />
                    )}
                  </div>
                </div>
              </div>
            );

            if (offer.href) {
              return (
                <Link
                  key={offer.label}
                  to={offer.href}
                  className="block"
                >
                  {content}
                </Link>
              );
            }

            return (
              <article key={offer.label}>
                {content}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LandingOffers;