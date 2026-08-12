import {
  Calculator,
  CheckCircle2,
  FileText,
  Headphones,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import { loanCatalog, loanTone } from "./loanCatalog";

const items = [
  ...loanCatalog.slice(0, 2).map((loan) => ({
    ...loan,
    label: loan.name,
    description: loan.id === "education" ? "Higher education finance" : "International education",
  })),
  {
    id: "emi",
    label: "EMI Calculator",
    description: "Estimate repayment",
    icon: Calculator,
    href: "/emi-calculator",
    tone: "cyan",
  },
  {
    id: "eligibility",
    label: "Check Eligibility",
    description: "Prepare before applying",
    icon: CheckCircle2,
    href: "#eligibility",
    tone: "green",
  },
  {
    id: "process",
    label: "How It Works",
    description: "Understand the journey",
    icon: FileText,
    href: "#how-it-works",
    tone: "blue",
  },
  {
    id: "support",
    label: "Support",
    description: "Find answers",
    icon: Headphones,
    href: "#faq",
    tone: "orange",
  },
];

function ProductNavigationRail() {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-[1440px] px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const Icon = item.icon;
            const colors = loanTone[item.tone] || loanTone.blue;

            const content = (
              <>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.icon}`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>

                <span className="min-w-0 text-left">
                  <span className="block whitespace-nowrap text-xs font-semibold text-foreground sm:text-sm">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block whitespace-nowrap text-[11px] text-muted-foreground">
                    {item.description}
                  </span>
                </span>

                <ArrowUpRight className="ml-auto hidden h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-px group-hover:translate-x-px sm:block" />
              </>
            );

            const className =
              "group flex min-w-[190px] shrink-0 items-center gap-3 rounded-xl border border-border bg-background px-3 py-3 transition-all duration-200 hover:-translate-y-px hover:border-primary/20 hover:bg-primary-soft/35 hover:shadow-sm sm:min-w-[205px]";

            if (item.href.startsWith("/")) {
              return (
                <Link key={item.id} to={item.href} className={className}>
                  {content}
                </Link>
              );
            }

            return (
              <a key={item.id} href={item.href} className={className}>
                {content}
              </a>
            );
          })}

          <span className="hidden shrink-0 px-2 text-[11px] font-medium text-muted-foreground xl:inline">
            More products can be added as they become available
          </span>
        </div>
      </div>
    </section>
  );
}

export default ProductNavigationRail;
