import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  Headphones,
  Landmark,
  LockKeyhole,
  SearchCheck,
  ShieldCheck,
  Smartphone,
  Target,
  WalletCards,
} from "lucide-react";

const principles = [
  {
    icon: ShieldCheck,
    title: "Security first",
    description:
      "Account access and important actions should be designed with security in mind.",
  },
  {
    icon: FileCheck2,
    title: "Clear information",
    description:
      "Loan journeys should make important requirements, documents and next steps easier to understand.",
  },
  {
    icon: Gauge,
    title: "Simple digital journey",
    description:
      "Reduce unnecessary friction across discovery, application and account management.",
  },
  {
    icon: Headphones,
    title: "Support when needed",
    description:
      "Customers should have clear ways to find answers and get assistance.",
  },
];

const journey = [
  {
    number: "01",
    icon: SearchCheck,
    title: "Explore",
    text: "Browse available products and understand the options that may fit your goal.",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Apply",
    text: "Complete the application and provide the information requested for your selected product.",
  },
  {
    number: "03",
    icon: FileCheck2,
    title: "Track",
    text: "Follow application progress and view available document or status information.",
  },
  {
    number: "04",
    icon: WalletCards,
    title: "Manage",
    text: "Access repayment information and other account services from one place.",
  },
];

function AboutLoanPro() {
  return (
    <div className="min-h-screen bg-[#f6f9fb] pb-10">
      <main>
        {/* ==========================================================
            HERO
        ========================================================== */}

        <section className="relative overflow-hidden bg-[hsl(var(--brand-navy))] px-4 py-10 text-white sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-blue-200">
                <Landmark className="h-4 w-4" />

                <span className="text-[10px] font-bold uppercase tracking-[0.12em] sm:text-xs">
                  About LoanPro
                </span>
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                A simpler digital way to explore and manage loans.
              </h1>

              <p className="mt-4 max-w-xl text-xs leading-6 text-white/70 sm:text-sm">
                LoanPro is designed as a digital lending experience where
                customers can explore financing options, understand the
                application journey and manage available loan services from
                one place.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2.5 text-[10px] font-bold text-[hsl(var(--brand-navy))] sm:text-xs"
                >
                  Explore loan products
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  to="/help"
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-4 py-2.5 text-[10px] font-bold text-white sm:text-xs"
                >
                  Visit Help Centre
                </Link>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm sm:p-5">
                <div className="rounded-xl bg-white p-4 text-slate-900 shadow-[0_15px_40px_rgba(0,0,0,0.15)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Smartphone className="h-4 w-4" />
                      </span>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-primary">
                          LoanPro
                        </p>

                        <p className="text-xs font-bold text-slate-900">
                          Digital loan journey
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
                      Online
                    </span>
                  </div>

                  <div className="mt-5 space-y-2">
                    {[
                      {
                        label: "Explore products",
                        icon: SearchCheck,
                      },
                      {
                        label: "Complete application",
                        icon: ClipboardCheck,
                      },
                      {
                        label: "Track your progress",
                        icon: FileCheck2,
                      },
                      {
                        label: "Manage repayments",
                        icon: WalletCards,
                      },
                    ].map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.label}
                          className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5"
                        >
                          <span className="grid h-7 w-7 place-items-center rounded-md bg-white text-primary shadow-sm">
                            <Icon className="h-3.5 w-3.5" />
                          </span>

                          <span className="flex-1 text-[10px] font-semibold text-slate-700">
                            {item.label}
                          </span>

                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================
            WHAT IS LOANPRO
        ========================================================== */}

        <section className="border-b border-border bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-[1100px]">
            <div className="max-w-3xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
                What is LoanPro?
              </p>

              <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                One place to discover, apply and manage your lending journey.
              </h2>

              <p className="mt-3 text-xs leading-6 text-muted-foreground sm:text-sm">
                LoanPro is designed to bring the important parts of a digital
                lending journey together. Instead of moving between different
                experiences, customers can explore products, estimate
                repayments, complete applications and access account
                information from a connected platform.
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Landmark,
                  title: "Discover",
                  text: "Explore available loan products.",
                },
                {
                  icon: CalculatorIcon,
                  title: "Plan",
                  text: "Estimate repayments before applying.",
                },
                {
                  icon: ClipboardCheck,
                  title: "Apply",
                  text: "Follow a guided application journey.",
                },
                {
                  icon: WalletCards,
                  title: "Manage",
                  text: "Access payments and account services.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-slate-200 bg-[#f8fbfd] p-4"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary shadow-sm ring-1 ring-slate-200">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>

                    <h3 className="mt-3 text-xs font-bold text-slate-900 sm:text-sm">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-[10px] leading-4 text-muted-foreground sm:text-xs">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==========================================================
            DIGITAL JOURNEY
        ========================================================== */}

        <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-[1100px]">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
                The LoanPro journey
              </p>

              <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Built around the way customers actually move through a loan.
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">
                Each stage is designed to keep the next action clear and make
                important information easier to access.
              </p>
            </div>

            <div className="mt-6 grid gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
              {journey.map((item, index) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.number}
                    className={`relative p-4 sm:p-5 ${
                      index !== journey.length - 1
                        ? "border-b border-slate-100 sm:border-r lg:border-b-0"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-[0.15em] text-primary">
                        {item.number}
                      </span>

                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-1.5 text-[10px] leading-5 text-muted-foreground sm:text-xs">
                      {item.text}
                    </p>

                    {index !== journey.length - 1 && (
                      <ArrowRight className="absolute bottom-5 right-3 hidden h-3.5 w-3.5 text-slate-300 lg:block" />
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==========================================================
            PRINCIPLES
        ========================================================== */}

        <section className="border-y border-border bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-[1100px]">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
                Our principles
              </p>

              <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                What we want the experience to feel like.
              </h2>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {principles.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-xl border border-slate-200 bg-[#f8fbfd] p-4"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm ring-1 ring-slate-200">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>

                    <h3 className="mt-3 text-sm font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-1.5 text-[10px] leading-5 text-muted-foreground sm:text-xs">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==========================================================
            SECURITY / TRANSPARENCY
        ========================================================== */}

        <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto max-w-[1100px]">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-blue-100 bg-[#edf7fc] p-5 sm:p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                  <LockKeyhole className="h-5 w-5" />
                </span>

                <h2 className="mt-4 text-lg font-bold text-slate-900">
                  Security should be part of the experience.
                </h2>

                <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm">
                  LoanPro's interface is designed around protected account
                  access, clear actions and responsible handling of customer
                  information.
                </p>

                <div className="mt-4 space-y-2">
                  {[
                    "Protected account access",
                    "Clear application actions",
                    "Visible document and status information",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-[10px] font-medium text-slate-700 sm:text-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-[#fff9ed] p-5 sm:p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-amber-600 shadow-sm">
                  <Target className="h-5 w-5" />
                </span>

                <h2 className="mt-4 text-lg font-bold text-slate-900">
                  Clear expectations matter.
                </h2>

                <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm">
                  Product availability, eligibility, pricing, fees and final
                  decisions can depend on the applicable product configuration
                  and review process.
                </p>

                <Link
                  to="/faq"
                  className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-primary sm:text-xs"
                >
                  Read frequently asked questions
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================
            CTA
        ========================================================== */}

        <section className="px-4 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1100px]">
            <div className="relative overflow-hidden rounded-2xl bg-[hsl(var(--brand-navy))] p-5 text-white sm:p-7">
              <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full border border-white/10" />

              <div className="relative max-w-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200">
                  Start exploring
                </p>

                <h2 className="mt-1.5 text-xl font-bold tracking-tight sm:text-2xl">
                  See what the LoanPro experience looks like.
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-white/65 sm:text-sm">
                  Explore the available products, use the EMI calculator or
                  visit the Help Centre to learn more.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2.5 text-[10px] font-bold text-[hsl(var(--brand-navy))] sm:text-xs"
                  >
                    Explore services
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    to="/emi-calculator"
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-4 py-2.5 text-[10px] font-bold text-white sm:text-xs"
                  >
                    EMI Calculator
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* Small local icon wrapper so the main import list stays readable. */
function CalculatorIcon(props) {
  return <Gauge {...props} />;
}

export default AboutLoanPro;