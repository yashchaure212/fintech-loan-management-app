import {
  Calculator,
  CheckCircle2,
  FileText,
  GraduationCap,
  MapPinned,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const items = [
  {
    label: "Education Loan",
    description: "Finance higher education",
    icon: GraduationCap,
    tone: "education",
    href: "#loan-products",
  },
  {
    label: "Study Abroad",
    description: "Plan international education",
    icon: MapPinned,
    tone: "abroad",
    href: "#loan-products",
  },
  {
    label: "EMI Calculator",
    description: "Estimate your repayment",
    icon: Calculator,
    tone: "calculator",
    href: "/emi-calculator",
  },
  {
    label: "Check Eligibility",
    description: "Review before applying",
    icon: CheckCircle2,
    tone: "eligibility",
    href: "#eligibility",
  },
  {
    label: "How It Works",
    description: "Understand the process",
    icon: FileText,
    tone: "process",
    href: "#how-it-works",
  },
  {
    label: "What's New",
    description: "Latest platform updates",
    icon: Sparkles,
    tone: "offers",
    href: "#featured-services",
  },
];

const toneClasses = {
  education: {
    icon: "bg-blue-100 text-blue-700",
    hover: "hover:border-blue-200 hover:bg-blue-50",
  },
  abroad: {
    icon: "bg-violet-100 text-violet-700",
    hover: "hover:border-violet-200 hover:bg-violet-50",
  },
  calculator: {
    icon: "bg-cyan-100 text-cyan-700",
    hover: "hover:border-cyan-200 hover:bg-cyan-50",
  },
  eligibility: {
    icon: "bg-emerald-100 text-emerald-700",
    hover: "hover:border-emerald-200 hover:bg-emerald-50",
  },
  process: {
    icon: "bg-amber-100 text-amber-700",
    hover: "hover:border-amber-200 hover:bg-amber-50",
  },
  offers: {
    icon: "bg-orange-100 text-orange-700",
    hover: "hover:border-orange-200 hover:bg-orange-50",
  },
};

function ProductNavigationRail() {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-[1440px] px-4 py-3 sm:px-6 lg:px-8">
        <div
          className="
            flex gap-3 overflow-x-auto
            pb-1
            scrollbar-none
          "
        >
          {items.map((item) => {
            const Icon = item.icon;
            const tone = toneClasses[item.tone];

            const content = (
              <>
                <span
                  className={[
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    tone.icon,
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <span className="min-w-0 text-left">
                  <span className="block whitespace-nowrap text-sm font-semibold text-foreground">
                    {item.label}
                  </span>

                  <span className="mt-0.5 block whitespace-nowrap text-[11px] text-muted-foreground">
                    {item.description}
                  </span>
                </span>
              </>
            );

            if (item.href.startsWith("#")) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={[
                    "flex min-w-[205px] shrink-0 items-center gap-3",
                    "rounded-xl border border-border bg-background px-3 py-3",
                    "transition-all duration-200",
                    tone.hover,
                  ].join(" ")}
                >
                  {content}
                </a>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.href}
                className={[
                  "flex min-w-[205px] shrink-0 items-center gap-3",
                  "rounded-xl border border-border bg-background px-3 py-3",
                  "transition-all duration-200",
                  tone.hover,
                ].join(" ")}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProductNavigationRail;
