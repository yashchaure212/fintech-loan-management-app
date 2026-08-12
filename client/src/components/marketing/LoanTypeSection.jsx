import {
  ArrowRight,
  BriefcaseBusiness,
  CarFront,
  CreditCard,
  GraduationCap,
  House,
  Landmark,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import ApplyNowButton from "./ApplyNowButton";
import { useGetPublicLoanTypesQuery } from "@/features/loan/api/loanApi";

const toneByCategory = {
  EDUCATION: {
    shell: "bg-gradient-to-br from-[#eaf4ff] via-[#f4f9ff] to-white",
    icon: "bg-[#dcecff] text-[#1767d5]",
    accent: "text-[#1767d5]",
    border: "group-hover:border-[#b9d7ff]",
    badge: "bg-[#e8f2ff] text-[#1767d5] border-[#cfe4ff]",
  },
  PERSONAL: {
    shell: "bg-gradient-to-br from-[#f4efff] via-[#faf8ff] to-white",
    icon: "bg-[#e9ddff] text-[#7652c9]",
    accent: "text-[#7652c9]",
    border: "group-hover:border-[#d7c5ff]",
    badge: "bg-[#f0e8ff] text-[#7652c9] border-[#ddcfff]",
  },
  BUSINESS: {
    shell: "bg-gradient-to-br from-[#eafbf6] via-[#f5fffb] to-white",
    icon: "bg-[#d8f5e8] text-[#16845a]",
    accent: "text-[#16845a]",
    border: "group-hover:border-[#bde9d3]",
    badge: "bg-[#e8f8f0] text-[#16845a] border-[#cdeedc]",
  },
  VEHICLE: {
    shell: "bg-gradient-to-br from-[#fff5e8] via-[#fffaf3] to-white",
    icon: "bg-[#ffe7c5] text-[#c86c08]",
    accent: "text-[#c86c08]",
    border: "group-hover:border-[#f4d5a7]",
    badge: "bg-[#fff1dd] text-[#c86c08] border-[#f4d8ad]",
  },
  HOME: {
    shell: "bg-gradient-to-br from-[#edf9fb] via-[#f7fdfe] to-white",
    icon: "bg-[#d9f1f4] text-[#16839a]",
    accent: "text-[#16839a]",
    border: "group-hover:border-[#bde3e9]",
    badge: "bg-[#e8f7f9] text-[#16839a] border-[#cbe9ed]",
  },
  DEFAULT: {
    shell: "bg-gradient-to-br from-[#eef5ff] via-[#f7faff] to-white",
    icon: "bg-[#dfeaff] text-[#265fb4]",
    accent: "text-[#265fb4]",
    border: "group-hover:border-[#c8dcfb]",
    badge: "bg-[#edf4ff] text-[#265fb4] border-[#d7e5fb]",
  },
};

function getTone(category = "") {
  return toneByCategory[String(category).toUpperCase()] || toneByCategory.DEFAULT;
}

function getIcon(category = "") {
  const normalized = String(category).toUpperCase();

  switch (normalized) {
    case "EDUCATION":
      return GraduationCap;
    case "PERSONAL":
      return CreditCard;
    case "BUSINESS":
      return BriefcaseBusiness;
    case "VEHICLE":
      return CarFront;
    case "HOME":
      return House;
    default:
      return Landmark;
  }
}

function LoanTypeSection() {
  const { data, isLoading, isError } = useGetPublicLoanTypesQuery();

  const loans = data?.data || [];

  return (
    <section
      id="loan-products"
      className="scroll-mt-24 border-y border-border bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Loan products
            </div>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Choose the financing that fits your goal.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Explore the loan products currently available through the
              platform and choose the journey that matches your needs.
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            Product availability depends on the lending configuration.
          </div>
        </div>

        {isLoading ? (
          <LoanProductSkeleton />
        ) : null}

        {isError ? (
          <div className="mt-8 rounded-2xl border border-danger-border bg-danger-soft p-6">
            <p className="font-semibold text-foreground">
              We couldn't load the available loan products.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please try again later.
            </p>
          </div>
        ) : null}

        {!isLoading && !isError && loans.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
            <p className="font-semibold text-foreground">
              No loan products are currently available.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please check back later.
            </p>
          </div>
        ) : null}

        {!isLoading && !isError && loans.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {loans.map((loan) => (
              <LoanProductCard key={loan.id} loan={loan} />
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Final eligibility, pricing, tenure, and documentation depend on the
          selected product and application review.
        </div>
      </div>
    </section>
  );
}

function LoanProductCard({ loan }) {
  const tone = getTone(loan.category);
  const Icon = getIcon(loan.category);

  return (
    <Card
      interactive
      className={[
        "group overflow-hidden rounded-2xl border-border bg-card shadow-card",
        "transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
        tone.border,
      ].join(" ")}
    >
      <div className={`min-h-[205px] p-5 sm:p-6 ${tone.shell}`}>
        <div className="flex items-start justify-between gap-4">
          <span
            className={[
              "flex h-12 w-12 items-center justify-center rounded-xl",
              tone.icon,
            ].join(" ")}
          >
            <Icon className="h-6 w-6" />
          </span>

          {loan.category ? (
            <Badge
              variant="outline"
              className={`rounded-md ${tone.badge}`}
            >
              {loan.category}
            </Badge>
          ) : null}
        </div>

        <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
          {loan.name}
        </h3>

        <p className="mt-2 line-clamp-3 max-w-xl text-sm leading-6 text-muted-foreground">
          {loan.description ||
            "Explore the available loan details and start your application journey."}
        </p>
      </div>

      <CardContent className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <span className={`text-sm font-semibold ${tone.accent}`}>
          Explore product
        </span>

        <ApplyNowButton
          className={[
            "inline-flex min-h-10 items-center justify-center gap-2 rounded-md",
            "bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground",
            "transition-all duration-200 hover:-translate-y-px hover:bg-primary-hover",
          ].join(" ")}
        />
      </CardContent>
    </Card>
  );
}

function LoanProductSkeleton() {
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-[310px] animate-pulse rounded-2xl border border-border bg-muted/30"
        />
      ))}
    </div>
  );
}

export default LoanTypeSection;
