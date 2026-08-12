import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const columns = [
  {
    title: "Loan Products",
    links: [
      { label: "Loan Products", href: "/#loan-products" },
      { label: "EMI Calculator", href: "/emi-calculator" },
      { label: "How It Works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "Application", href: "/customer/loans/apply" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];

function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                L
              </span>

              <span>
                <span className="block text-[15px] font-semibold leading-none">
                  LoanPro
                </span>
                <span className="mt-1 block text-[10px] text-muted-foreground">
                  Financial services
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              A digital loan management platform designed to make applications,
              documents, status tracking, and repayments easier to follow.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold">{column.title}</h3>

              <div className="mt-4 space-y-3">
                {column.links.map((link) => {
                  const externalAnchor = link.href === "#";

                  return externalAnchor ? (
                    <a
                      key={link.label}
                      href="#"
                      className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LoanPro. All rights reserved.</p>
          <p>Loan terms and eligibility are subject to the applicable product configuration.</p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
