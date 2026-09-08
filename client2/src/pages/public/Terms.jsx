import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileText,
  Info,
  LockKeyhole,
  Scale,
  ShieldCheck,
  User,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  {
    id: "acceptance",
    number: "01",
    title: "Acceptance of Terms",
    text: "By accessing or using LoanPro, you agree to comply with these Terms & Conditions and any applicable policies referenced on this website.",
  },
  {
    id: "eligibility",
    number: "02",
    title: "Eligibility",
    text: "You must provide accurate information and meet the applicable eligibility requirements for any product or service you choose to access through LoanPro.",
  },
  {
    id: "account",
    number: "03",
    title: "Your Account",
    text: "You are responsible for keeping your account credentials secure and for providing complete and accurate information during registration, application, and subsequent updates.",
  },
  {
    id: "application",
    number: "04",
    title: "Loan Applications",
    text: "Submitting an application does not automatically guarantee approval, disbursement, or any particular loan amount, interest rate, tenure, or other commercial term.",
  },
  {
    id: "information",
    number: "05",
    title: "Information You Provide",
    text: "You agree that information and documents submitted by you must be genuine, accurate, current, and legally obtained. You should update information when it changes.",
  },
  {
    id: "payments",
    number: "06",
    title: "Payments and Repayment",
    text: "Where applicable, repayment obligations, schedules, charges, and other financial terms will be governed by the relevant loan agreement, sanction terms, or applicable service documents.",
  },
  {
    id: "acceptable-use",
    number: "07",
    title: "Acceptable Use",
    text: "You must not misuse the platform, attempt unauthorized access, interfere with its operation, submit fraudulent information, or use the service for unlawful purposes.",
  },
  {
    id: "content",
    number: "08",
    title: "Website Content",
    text: "Information presented on the website is intended for general informational purposes. Product availability, eligibility, and other details may change without prior notice.",
  },
  {
    id: "third-party",
    number: "09",
    title: "Third-Party Services",
    text: "LoanPro may provide links or access to third-party services, payment systems, communication services, or external resources. Their use may be subject to separate terms and policies.",
  },
  {
    id: "suspension",
    number: "10",
    title: "Suspension or Termination",
    text: "Access to certain services may be suspended, restricted, or terminated where permitted by applicable law or where there is suspected misuse, fraud, security risk, or violation of these terms.",
  },
  {
    id: "liability",
    number: "11",
    title: "Limitation of Liability",
    text: "To the extent permitted by applicable law, LoanPro will not be responsible for losses arising from unauthorized use of an account, inaccurate information supplied by a user, or circumstances outside reasonable control.",
  },
  {
    id: "changes",
    number: "12",
    title: "Changes to These Terms",
    text: "These terms may be updated from time to time. Updated terms will be published on this page, and continued use of the platform after an update may constitute acceptance of the revised terms.",
  },
  {
    id: "governing-law",
    number: "13",
    title: "Governing Law",
    text: "These terms are intended to be interpreted in accordance with the laws applicable to the services and jurisdiction in which the relevant transaction or relationship is governed.",
  },
];

const quickLinks = [
  {
    title: "Privacy Policy",
    description: "How information is handled",
    href: "/privacy",
    icon: LockKeyhole,
  },
  {
    title: "Security",
    description: "Account and platform safety",
    href: "/security",
    icon: ShieldCheck,
  },
  {
    title: "Loan Guide",
    description: "Understand the application journey",
    href: "/loan-guide",
    icon: FileText,
  },
  {
    title: "Help Centre",
    description: "Get help with common questions",
    href: "/help",
    icon: Info,
  },
];

function Terms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-[linear-gradient(135deg,#07182f_0%,#0d2b52_55%,#163f6b_100%)] text-white">
        <div className="page-container py-10 sm:py-14 lg:py-16">
          <Link
            to="/more"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to More
          </Link>

          <div className="max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
              <Scale className="h-3.5 w-3.5" />
              Legal information
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Terms & Conditions
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              These terms describe the rules, responsibilities, and conditions
              that apply when you use the LoanPro website, account, application
              journey, and related digital services.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  Document
                </p>
                <p className="mt-1 text-sm font-semibold">Terms & Conditions</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  Status
                </p>
                <p className="mt-1 text-sm font-semibold">General website terms</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  Last updated
                </p>
                <p className="mt-1 text-sm font-semibold">UI mockup version</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro notice */}
      <section className="border-b bg-muted/30">
        <div className="page-container py-6">
          <div className="flex flex-col gap-4 rounded-2xl border bg-background p-5 sm:flex-row sm:items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Info className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-foreground">
                Important information
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                This page is a production-style UI mockup for LoanPro. The final
                legal terms should be reviewed and approved by the appropriate
                legal and compliance teams before the application is used in
                production.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="page-container py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Table of contents */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="rounded-2xl border bg-card p-4">
              <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                On this page
              </p>

              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <span className="w-6 text-[10px] font-bold text-muted-foreground/60">
                      {section.number}
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      {section.title}
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Legal content */}
          <div className="min-w-0">
            <div className="mb-8 max-w-3xl">
              <p className="section-eyebrow">Please read carefully</p>

              <h2 className="section-title mt-2">
                Using LoanPro responsibly
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                LoanPro is designed to help users explore financial products,
                understand loan journeys, submit information, and manage
                supported services digitally. These terms explain the basic
                conditions under which the platform may be used.
              </p>
            </div>

            <div className="space-y-5">
              {sections.map((section) => (
                <article
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 rounded-2xl border bg-card p-5 sm:p-6"
                >
                  <div className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {section.number}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-foreground sm:text-lg">
                        {section.title}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {section.text}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* User responsibilities */}
            <section className="mt-8 rounded-2xl border bg-muted/30 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">
                    Your responsibilities
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Keeping your information accurate and protecting your
                    account helps maintain a secure and reliable digital
                    experience.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "Use accurate and up-to-date information",
                  "Protect your login credentials",
                  "Review important application information",
                  "Use the platform only for lawful purposes",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 rounded-xl border bg-background px-4 py-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Financial document note */}
            <section className="mt-6 rounded-2xl border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <WalletCards className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">
                    Product-specific terms may also apply
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    A specific loan, payment service, or other financial
                    product may have additional agreements, disclosures,
                    schedules, eligibility conditions, and terms. Those
                    product-specific documents should always be reviewed before
                    you proceed.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact CTA */}
            <section className="mt-8 overflow-hidden rounded-2xl bg-primary text-primary-foreground">
              <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/60">
                    Questions about these terms?
                  </p>

                  <h3 className="mt-2 text-2xl font-bold tracking-tight">
                    Need help understanding something?
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-primary-foreground/75">
                    Visit the Help Centre or contact support for assistance with
                    the LoanPro platform and application journey.
                  </p>
                </div>

                <Link
                  to="/contact-support"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:opacity-90"
                >
                  Contact Support
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* Related links */}
      <section className="border-t bg-muted/20">
        <div className="page-container py-10">
          <div className="mb-6">
            <p className="section-eyebrow">Legal & support</p>
            <h2 className="section-title mt-2">
              Related information
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className="group rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
                      <Icon className="h-5 w-5" />
                    </div>

                    <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>

                  <h3 className="mt-5 font-semibold">{item.title}</h3>

                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Terms;