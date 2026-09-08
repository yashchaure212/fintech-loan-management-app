import {
  ArrowRight,
  BriefcaseBusiness,
  CarFront,
  ChevronRight,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  Smartphone,
  Store,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useGetPublicLoanTypesQuery } from "@/features/loan/api/loanApi";

const products = [
  {
    id: "education",
    label: "Education Loan",
    short: "Higher education & studies",
    icon: GraduationCap,
    tone: "blue",
    available: true,
    amount: "Up to ₹20 Lakhs",
    image:
      "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    id: "personal",
    label: "Personal Loan",
    short: "Personal needs & expenses",
    icon: Landmark,
    tone: "violet",
    amount: "Coming soon",
    image:
      "https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    id: "two-wheeler",
    label: "Two Wheeler Loan",
    short: "Bike & scooter finance",
    icon: CarFront,
    tone: "orange",
    amount: "Coming soon",
    image:
      "https://images.pexels.com/photos/2393835/pexels-photo-2393835.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    id: "car",
    label: "Car Loan",
    short: "New & used cars",
    icon: CarFront,
    tone: "green",
    amount: "Coming soon",
    image:
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    id: "home",
    label: "Home Loan",
    short: "Home & property",
    icon: House,
    tone: "cyan",
    amount: "Coming soon",
    image:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    id: "business",
    label: "Business Loan",
    short: "Business growth",
    icon: BriefcaseBusiness,
    tone: "blue",
    amount: "Coming soon",
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    id: "medical",
    label: "Medical Finance",
    short: "Healthcare expenses",
    icon: HeartPulse,
    tone: "rose",
    amount: "Coming soon",
    image:
      "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    id: "consumer",
    label: "Consumer Finance",
    short: "Electronics & lifestyle",
    icon: Smartphone,
    tone: "violet",
    amount: "Coming soon",
    image:
      "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
  {
    id: "merchant",
    label: "Business Equipment",
    short: "Shop & equipment",
    icon: Store,
    tone: "orange",
    amount: "Coming soon",
    image:
      "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  },
];

const tones = {
  blue: {
    soft: "bg-[#eef5fb]",
    icon: "bg-[#0f3552] text-white",
    accent: "text-[#0f5d8c]",
  },
  violet: {
    soft: "bg-[#f3f1f8]",
    icon: "bg-[#493b68] text-white",
    accent: "text-[#5b4b83]",
  },
  orange: {
    soft: "bg-[#fff4e8]",
    icon: "bg-[#a45118] text-white",
    accent: "text-[#a45118]",
  },
  green: {
    soft: "bg-[#edf6f1]",
    icon: "bg-[#1f6048] text-white",
    accent: "text-[#1f6048]",
  },
  cyan: {
    soft: "bg-[#edf7f8]",
    icon: "bg-[#176273] text-white",
    accent: "text-[#176273]",
  },
  rose: {
    soft: "bg-[#f8eff2]",
    icon: "bg-[#733c4e] text-white",
    accent: "text-[#733c4e]",
  },
};

function LandingLoanShowcase() {
  const { data, isLoading } = useGetPublicLoanTypesQuery();

  const backendLoans = data?.data || [];

  const hasEducation = backendLoans.some((loan) =>
    String(loan.category || loan.name || "")
      .toUpperCase()
      .includes("EDUC"),
  );

  return (
    <section
      id="loan-products"
      className="
        scroll-mt-24
        border-b
        border-border
        bg-white
        px-3
        py-8
        sm:px-6
        sm:py-10
        lg:px-8
      "
    >
      <div className="mx-auto max-w-[1440px]">

        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
                Loan products
              </p>
            </div>

            <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
              Choose a loan for your needs
            </h2>

            <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground sm:text-sm">
              Explore financing options available through LoanPro.
            </p>
          </div>

          <a
            href="#loan-categories"
            className="
              hidden
              shrink-0
              items-center
              gap-1
              text-xs
              font-bold
              text-primary
              transition
              hover:gap-1.5
              sm:inline-flex
              sm:text-sm
            "
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        {/* Main products */}
        <div
          className="
            mt-5
            flex
            snap-x
            gap-3
            overflow-x-auto
            pb-3
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
            lg:grid
            lg:grid-cols-6
            lg:overflow-visible
          "
        >
          {products.slice(0, 6).map((product) => {
            const Icon = product.icon;
            const tone = tones[product.tone];

            const available =
              product.available && (hasEducation || !isLoading);

            return (
              <Link
                key={product.id}
                to={
                  available
                    ? "/login?redirect=/customer/loans/apply"
                    : "#loan-categories"
                }
                className="
                  group
                  min-w-[190px]
                  snap-start
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  shadow-[0_2px_10px_rgba(15,23,42,0.05)]
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-slate-300
                  hover:shadow-[0_8px_24px_rgba(15,23,42,0.09)]
                  lg:min-w-0
                "
              >
                {/* Real image */}
                <div className="relative h-[155px] overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.label}
                    loading="lazy"
                    draggable="false"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition
                      duration-500
                      group-hover:scale-105
                    "
                  />

                  {/* Dark image gradient */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/35
                      via-black/5
                      to-transparent
                    "
                  />

                  {/* Icon badge */}
                  <div className="absolute bottom-3 left-3">
                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-white/70
                        shadow-lg
                        backdrop-blur-sm
                        transition
                        duration-200
                        group-hover:scale-105
                        ${tone.icon}
                      `}
                    >
                      <Icon
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  {available ? (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[9px] font-bold text-emerald-700 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Available
                    </span>
                  ) : (
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold text-slate-600 shadow-sm">
                      Coming soon
                    </span>
                  )}
                </div>

                {/* Product information */}
                <div className="p-3.5">
                  <h3 className="truncate text-sm font-bold text-slate-900">
                    {product.label}
                  </h3>

                  <p className="mt-1 truncate text-[11px] text-muted-foreground">
                    {product.short}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span
                      className={`truncate text-[11px] font-bold ${tone.accent}`}
                    >
                      {product.amount}
                    </span>

                    {available ? (
                      <span className="flex shrink-0 items-center gap-0.5 text-[10px] font-bold text-slate-700">
                        Apply
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* More products */}
        <div id="loan-categories" className="mt-5">
          <div className="mb-2.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">
                More loan options
              </p>

              <p className="text-[10px] text-muted-foreground">
                Additional products coming to LoanPro
              </p>
            </div>
          </div>

          <div
            className="
              flex
              gap-2
              overflow-x-auto
              pb-1
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              sm:grid
              sm:grid-cols-3
              lg:grid-cols-3
            "
          >
            {products.slice(6).map((product) => {
              const Icon = product.icon;
              const tone = tones[product.tone];

              return (
                <div
                  key={product.id}
                  className="
                    flex
                    min-w-[210px]
                    overflow-hidden
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                  "
                >
                  {/* Small image */}
                  <div className="h-[60px] w-[50px] shrink-0 overflow-hidden">
                    <img
                      src={product.image}
                      alt=""
                      loading="lazy"
                      draggable="false"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5">
                    <div
                      className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        ${tone.icon}
                      `}
                    >
                      <Icon
                        className="h-4 w-4"
                        strokeWidth={1.8}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-800">
                        {product.label}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                        {product.short}
                      </p>
                    </div>

                    <span className="ml-auto shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-500">
                      Soon
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-4 text-[10px] leading-4 text-muted-foreground">
          Products and application availability depend on the products currently
          configured by LoanPro.
        </p>
      </div>
    </section>
  );
}

export default LandingLoanShowcase;