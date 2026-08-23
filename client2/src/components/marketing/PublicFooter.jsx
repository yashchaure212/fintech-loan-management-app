import { ArrowUpRight, Headphones, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "Loan Products",
    links: [
      { label: "Loan Products", href: "/#loan-products" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Eligibility", href: "/#eligibility" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "EMI Calculator", href: "/emi-calculator" },
      { label: "Application", href: "/customer/loans/apply" },
      { label: "Sign in", href: "/login" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Register", href: "/register" },
      { label: "Security", href: "/#security" },
    ],
  },
];

function PublicFooter() {
  return (
    <footer className="bg-[hsl(var(--brand-navy))] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-base font-bold text-[hsl(var(--brand-navy))]">
                L
              </span>

              <span>
                <span className="block text-[17px] font-semibold leading-none">
                  LoanPro
                </span>
                <span className="mt-1 block text-[10px] text-white/50">
                  Financial services
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
              A digital loan-management platform designed to make applications,
              documents, status tracking, and repayment information easier to
              follow.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                <ShieldCheck className="h-3.5 w-3.5 text-sky-200" />
                Account-based journey
              </span>

              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                <Headphones className="h-3.5 w-3.5 text-sky-200" />
                Support available
              </span>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-white">
                {column.title}
              </h3>

              <div className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="group flex w-fit items-center gap-1 text-sm text-white/55 transition hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 text-xs leading-5 text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 LoanPro. All rights reserved.</p>

            <p className="max-w-2xl sm:text-right">
              Loan terms, eligibility, pricing, fees, and documentation are
              subject to the applicable product configuration and review process.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
