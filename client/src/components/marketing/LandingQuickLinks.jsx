import {
  Calculator,
  CheckCircle2,
  FileText,
  Headphones,
  RefreshCw,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";

const items = [
  {
    label: "EMI Calculator",
    sub: "Calculate your EMI",
    icon: Calculator,
    href: "/emi-calculator",
  },
  {
    label: "Check Eligibility",
    sub: "Know what you need",
    icon: CheckCircle2,
    href: "#eligibility",
  },
  {
    label: "Track Application",
    sub: "View loan status",
    icon: RefreshCw,
    href: "/login",
  },
  {
    label: "Pay EMI",
    sub: "Secure online payments",
    icon: WalletCards,
    href: "/login",
  },
  {
    label: "Documents",
    sub: "Application checklist",
    icon: FileText,
    href: "#faq",
  },
  {
    label: "Support",
    sub: "We're here to help",
    icon: Headphones,
    href: "#faq",
  },
];

function LandingQuickLinks() {
  return (
    <section className="border-b border-border bg-white">
      <div className="mx-auto max-w-[1440px] overflow-x-auto px-3 py-2.5 sm:px-6 lg:px-8">
        <div className="flex min-w-max gap-1.5 lg:grid lg:min-w-0 lg:grid-cols-6 lg:gap-0 lg:divide-x lg:divide-border">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.href}
                className="
                  group
                  flex
                  min-w-[150px]
                  items-center
                  gap-3
                  px-3
                  py-3
                  transition
                  hover:bg-slate-50
                  lg:min-w-0
                  lg:justify-center
                "
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Icon className="h-4 w-4" />
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-xs font-bold">
                    {item.label}
                  </span>

                  <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
                    {item.sub}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LandingQuickLinks;
