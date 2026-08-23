import {
  BriefcaseBusiness,
  CarFront,
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
    short: "School & education",
    icon: GraduationCap,
    tone: "blue",
    available: true,
    amount: "Up to ₹20 Lakhs",
  },
  {
    id: "personal",
    label: "Personal Loan",
    short: "Personal needs",
    icon: Landmark,
    tone: "violet",
    amount: "Coming soon",
  },
  {
    id: "two-wheeler",
    label: "Two Wheeler Loan",
    short: "Bike & scooter",
    icon: CarFront,
    tone: "orange",
    amount: "Coming soon",
  },
  {
    id: "car",
    label: "Car Loan",
    short: "New & used cars",
    icon: CarFront,
    tone: "green",
    amount: "Coming soon",
  },
  {
    id: "home",
    label: "Home Loan",
    short: "Home & property",
    icon: House,
    tone: "cyan",
    amount: "Coming soon",
  },
  {
    id: "business",
    label: "Business Loan",
    short: "Grow your business",
    icon: BriefcaseBusiness,
    tone: "blue",
    amount: "Coming soon",
  },
  {
    id: "medical",
    label: "Medical Finance",
    short: "Planned healthcare",
    icon: HeartPulse,
    tone: "rose",
    amount: "Coming soon",
  },
  {
    id: "consumer",
    label: "Consumer Finance",
    short: "Electronics & more",
    icon: Smartphone,
    tone: "violet",
    amount: "Coming soon",
  },
  {
    id: "merchant",
    label: "Business Equipment",
    short: "Shop & equipment",
    icon: Store,
    tone: "orange",
    amount: "Coming soon",
  },
];

const tones = {
  blue: {
    bg: "from-[#eef6ff] to-[#dcecff]",
    icon: "bg-white text-[#1767d5]",
    border: "hover:border-[#9fc9f3]",
  },

  violet: {
    bg: "from-[#faf4ff] to-[#eadfff]",
    icon: "bg-white text-[#7652c9]",
    border: "hover:border-[#cdb9ef]",
  },

  orange: {
    bg: "from-[#fff8ed] to-[#ffe8c5]",
    icon: "bg-white text-[#c86c08]",
    border: "hover:border-[#efc47f]",
  },

  green: {
    bg: "from-[#f0fbf5] to-[#d8f2e4]",
    icon: "bg-white text-[#16845a]",
    border: "hover:border-[#a9dfc2]",
  },

  cyan: {
    bg: "from-[#effbfe] to-[#d9f1f5]",
    icon: "bg-white text-[#16839a]",
    border: "hover:border-[#acdbe4]",
  },

  rose: {
    bg: "from-[#fff5f6] to-[#ffe2e6]",
    icon: "bg-white text-[#c84d63]",
    border: "hover:border-[#efb5bf]",
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
        bg-[#f8fafc]
        px-3
        py-7
        sm:px-6
        sm:py-9
        lg:px-8
      "
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-end justify-between gap-4 px-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-primary">
              Explore loans
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
              Popular loan categories
            </h2>
          </div>

          <a
            href="#loan-categories"
            className="hidden text-sm font-semibold text-primary sm:inline-flex"
          >
            View all →
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
            pb-2
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

            const available = product.available && (hasEducation || !isLoading);

            return (
              <Link
                key={product.id}
                to={
                  available
                    ? "/login?redirect=/customer/loans/apply"
                    : "#loan-categories"
                }
                className={`
                  group
                  min-w-[150px]
                  snap-start
                  overflow-hidden
                  rounded-lg
                  border
                  border-[#d8e1ea]
                  bg-white
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-md
                  ${tone.border}
                `}
              >
                <div
                  className={`
                    relative
                    flex
                    h-[132px]
                    items-center
                    justify-center
                    overflow-hidden
                    bg-gradient-to-br
                    ${tone.bg}
                  `}
                >
                  <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full border border-white/70" />

                  <div
                    className={`
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-2xl
                      shadow-sm
                      ${tone.icon}
                    `}
                  >
                    <Icon className="h-8 w-8" strokeWidth={1.7} />
                  </div>

                  {available ? (
                    <span className="absolute left-2 top-2 rounded-sm bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                      Available
                    </span>
                  ) : null}
                </div>

                <div className="p-3">
                  <p className="truncate text-sm font-bold">{product.label}</p>

                  <p className="mt-1 truncate text-[11px] text-muted-foreground">
                    {product.short}
                  </p>

                  <p className="mt-2 text-[11px] font-semibold text-primary">
                    {product.amount}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Additional discovery categories */}
        <div
          id="loan-categories"
          className="
            mt-5
            flex
            snap-x
            gap-3
            overflow-x-auto
            pb-1
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
            sm:grid
            sm:grid-cols-3
            lg:grid-cols-6
          "
        >
          {products.slice(6).map((product) => {
            const Icon = product.icon;
            const tone = tones[product.tone];

            return (
              <div
                key={product.id}
                className={`
                  flex
                  min-w-[170px]
                  items-center
                  gap-3
                  rounded-lg
                  border
                  border-border
                  bg-white
                  px-3
                  py-3
                  transition
                  hover:shadow-sm
                  ${tone.border}
                `}
              >
                <span
                  className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    ${tone.icon}
                  `}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-xs font-bold">
                    {product.label}
                  </span>

                  <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
                    {product.short}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-[11px] text-muted-foreground">
          Loan categories shown for discovery. Application availability depends
          on the products currently configured by LoanPro.
        </p>
      </div>
    </section>
  );
}

export default LandingLoanShowcase;
