import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  FileText,
  Info,
  Landmark,
  Percent,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  {
    id: "loan-amount",
    number: "01",
    title: "Loan Amount",
    text: "The loan amount available to an applicant depends on the applicable product, eligibility assessment, supporting information, and other conditions. The amount requested in an application may differ from the amount ultimately approved.",
  },
  {
    id: "interest",
    number: "02",
    title: "Interest Rate",
    text: "The applicable interest rate may depend on the selected loan product, applicant profile, approved terms, and other applicable conditions. The final rate and related terms should be reviewed in the relevant offer or loan documentation.",
  },
  {
    id: "tenure",
    number: "03",
    title: "Loan Tenure",
    text: "Loan tenure refers to the period over which the approved loan is scheduled to be repaid. Available tenure options may vary by product and approved loan terms.",
  },
  {
    id: "emi",
    number: "04",
    title: "EMI and Repayment",
    text: "Where applicable, repayment may be structured through equated monthly instalments or another agreed repayment schedule. The amount and frequency of repayment will be specified in the applicable loan documentation.",
  },
  {
    id: "fees",
    number: "05",
    title: "Fees and Charges",
    text: "Applicable fees or charges may include processing fees, taxes, documentation charges, late payment charges, or other charges permitted under the relevant product terms. Any applicable charges should be reviewed before accepting the loan.",
  },
  {
    id: "eligibility",
    number: "06",
    title: "Eligibility",
    text: "Eligibility criteria vary by loan product. Meeting general eligibility requirements does not guarantee approval. Additional verification, documentation, or assessment may be required.",
  },
  {
    id: "documents",
    number: "07",
    title: "Documents and Verification",
    text: "Applicants may be required to provide identity, address, income, education, employment, banking, or other supporting documents depending on the selected product and applicable verification requirements.",
  },
  {
    id: "approval",
    number: "08",
    title: "Approval",
    text: "Submission of an application does not constitute approval. Loan approval is subject to assessment, verification, internal policies, applicable eligibility requirements, and the terms applicable to the relevant financial product.",
  },
  {
    id: "disbursement",
    number: "09",
    title: "Disbursement",
    text: "Approved loan amounts may be disbursed only after completion of applicable conditions, documentation, verification, and other required formalities. Disbursement timing may vary depending on the transaction and product.",
  },
  {
    id: "prepayment",
    number: "10",
    title: "Prepayment and Foreclosure",
    text: "Prepayment or foreclosure may be available subject to the applicable product terms, documentation, and permitted charges. Users should review the relevant loan agreement before making an early repayment decision.",
  },
  {
    id: "late-payment",
    number: "11",
    title: "Late Payment or Default",
    text: "Failure to make repayments when due may result in applicable charges, collection activity, impact on the loan account, or other consequences permitted under the relevant agreement and applicable law.",
  },
  {
    id: "credit-information",
    number: "12",
    title: "Credit Information",
    text: "Where permitted and required for the relevant service, information related to an application or loan account may be used for verification, assessment, servicing, reporting, fraud prevention, or other lawful purposes.",
  },
  {
    id: "loan-agreement",
    number: "13",
    title: "Loan Agreement Prevails",
    text: "These general loan terms provide a high-level overview. The final sanctioned terms, loan agreement, repayment schedule, disclosures, and other transaction-specific documents will govern the relevant loan relationship.",
  },
];

const keyTerms = [
  {
    title: "Loan Amount",
    description: "Amount approved under the applicable product",
    icon: WalletCards,
  },
  {
    title: "Interest",
    description: "Applicable cost of borrowing",
    icon: Percent,
  },
  {
    title: "Tenure",
    description: "Scheduled repayment period",
    icon: Calculator,
  },
  {
    title: "Repayment",
    description: "Agreed payment schedule and obligations",
    icon: Landmark,
  },
];

const quickLinks = [
  {
    title: "Terms & Conditions",
    description: "General platform terms",
    href: "/terms",
    icon: FileText,
  },
  {
    title: "Privacy Policy",
    description: "Information and data practices",
    href: "/privacy",
    icon: ShieldCheck,
  },
  {
    title: "Loan Guide",
    description: "Learn how the loan journey works",
    href: "/loan-guide",
    icon: FileCheck2,
  },
  {
    title: "EMI Calculator",
    description: "Explore an estimated repayment amount",
    href: "/emi-calculator",
    icon: Calculator,
  },
];

function LoanTerms() {
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
              <Landmark className="h-3.5 w-3.5" />
              Loan information
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Loan Terms
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Understand the main terms that may apply to a LoanPro loan
              application, including amount, interest, tenure, repayment,
              charges, approval, and disbursement.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  Document
                </p>
                <p className="mt-1 text-sm font-semibold">Loan Terms</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  Applies to
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Loan application journey
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  Version
                </p>
                <p className="mt-1 text-sm font-semibold">UI mockup</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important notice */}
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
                This page is a production-style UI mockup and provides general
                information only. The final loan agreement, sanction terms,
                repayment schedule, disclosures, and other applicable documents
                should be reviewed before a loan is accepted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key terms */}
      <section className="page-container py-10 pb-4 lg:py-12 lg:pb-6">
        <div className="mb-6">
          <p className="section-eyebrow">At a glance</p>
          <h2 className="section-title mt-2">
            Understand the key loan terms
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keyTerms.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border bg-card p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 font-semibold">{item.title}</h3>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
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

          {/* Terms */}
          <div className="min-w-0">
            <div className="mb-8 max-w-3xl">
              <p className="section-eyebrow">Before you apply</p>

              <h2 className="section-title mt-2">
                What you should understand about a loan
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                A loan creates a financial obligation that continues according
                to the agreed repayment schedule. Review the applicable
                commercial terms carefully before accepting any offer or
                completing a loan agreement.
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

            {/* Checklist */}
            <section className="mt-8 rounded-2xl border bg-muted/30 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">
                    Before accepting a loan
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Make sure you understand the final terms presented to you
                    before completing the loan journey.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "Review the approved loan amount",
                  "Check the applicable interest rate",
                  "Understand the repayment schedule",
                  "Review all applicable fees and charges",
                  "Check important documentation and conditions",
                  "Keep a copy of the final loan documents",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 rounded-xl border bg-background px-4 py-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                    <span className="text-sm leading-5 text-muted-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="mt-8 overflow-hidden rounded-2xl bg-primary text-primary-foreground">
              <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/60">
                    Plan your repayment
                  </p>

                  <h3 className="mt-2 text-2xl font-bold tracking-tight">
                    Explore your estimated EMI
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-primary-foreground/75">
                    Use the EMI calculator to understand an estimated monthly
                    repayment based on the amount, rate, and tenure you enter.
                  </p>
                </div>

                <Link
                  to="/emi-calculator"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:opacity-90"
                >
                  Open EMI Calculator
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* Related pages */}
      <section className="border-t bg-muted/20">
        <div className="page-container py-10">
          <div className="mb-6">
            <p className="section-eyebrow">Explore more</p>

            <h2 className="section-title mt-2">
              Related loan information
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

      {/* Final note */}
      <section className="page-container py-10">
        <div className="rounded-2xl border bg-card p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                The final loan documents are important
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                General information on this page should not be treated as a
                substitute for the final loan agreement, sanction letter,
                repayment schedule, disclosure, or other applicable
                transaction-specific documentation.
              </p>

              <Link
                to="/terms"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                View general Terms & Conditions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoanTerms;