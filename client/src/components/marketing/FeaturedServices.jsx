import {
  Calculator,
  CheckCircle2,
  FileText,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "EMI Calculator",
    description: "Estimate your monthly repayment before you apply.",
    action: "Calculate EMI",
    href: "/emi-calculator",
    icon: Calculator,
    tone: "blue",
  },
  {
    title: "Loan Eligibility",
    description: "Review the information needed before starting your application.",
    action: "Check eligibility",
    href: "#eligibility",
    icon: CheckCircle2,
    tone: "green",
  },
  {
    title: "Track Application",
    description: "Sign in to continue a draft or view your application status.",
    action: "Track status",
    href: "/login",
    icon: FileText,
    tone: "violet",
  },
  {
    title: "Customer Support",
    description: "Get help with your application and account journey.",
    action: "Get support",
    href: "#faq",
    icon: Headphones,
    tone: "orange",
  },
];

const toneClasses = {
  blue: {
    section: "bg-[#eef6ff]",
    icon: "bg-[#d9ebff] text-[#1767d5]",
    arrow: "text-[#1767d5]",
  },
  green: {
    section: "bg-[#ecfbf5]",
    icon: "bg-[#d6f5e6] text-[#12845a]",
    arrow: "text-[#12845a]",
  },
  violet: {
    section: "bg-[#f4f0ff]",
    icon: "bg-[#e7ddff] text-[#7350ca]",
    arrow: "text-[#7350ca]",
  },
  orange: {
    section: "bg-[#fff5e8]",
    icon: "bg-[#ffe7c6] text-[#c56d08]",
    arrow: "text-[#c56d08]",
  },
};

function FeaturedServices() {
  return (
    <section
      id="featured-services"
      className="scroll-mt-24 border-y border-border bg-background px-4 py-14 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">
            Featured services
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Useful tools for every stage of your loan journey.
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Plan your repayment, understand the application journey, and
            access support without digging through the website.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            const tone = toneClasses[service.tone];

            return (
              <div
                key={service.title}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`p-5 sm:p-6 ${tone.section}`}>
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone.icon}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <h3 className="mt-5 text-base font-semibold text-foreground">
                    {service.title}
                  </h3>

                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-muted-foreground">
                    {service.description}
                  </p>
                </div>

                <div className="border-t border-border bg-card px-5 py-4 sm:px-6">
                  <Link
                    to={service.href}
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold ${tone.arrow}`}
                  >
                    {service.action}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturedServices;
