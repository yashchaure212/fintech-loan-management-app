import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  FileText,
  Info,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
  WalletCards,
} from "lucide-react";

const sections = [
  {
    id: "information",
    number: "01",
    title: "Information we collect",
    icon: FileText,
    content:
      "Depending on how you use LoanPro, the application may collect information such as account details, contact information, application information, documents and information related to your interactions with the platform.",
    bullets: [
      "Account and profile information",
      "Loan application information",
      "Documents submitted during an application",
      "Payment and repayment related information",
      "Technical information about your use of the platform",
    ],
  },
  {
    id: "usage",
    number: "02",
    title: "How information is used",
    icon: Info,
    content:
      "Information may be used to provide and improve the LoanPro experience, support applications and account services, communicate with users and help maintain platform security.",
    bullets: [
      "Provide requested products and services",
      "Process and manage applications",
      "Support account and customer service requests",
      "Maintain security and prevent misuse",
      "Improve the platform and user experience",
    ],
  },
  {
    id: "account",
    number: "03",
    title: "Account and application information",
    icon: User,
    content:
      "Information associated with your account and loan application may be used to maintain your account, support the application workflow and provide relevant application status information.",
  },
  {
    id: "documents",
    number: "04",
    title: "Documents and verification",
    icon: FileText,
    content:
      "Documents submitted through the application experience may be used for verification and the applicable review process. The exact documents requested can depend on the selected product and application stage.",
  },
  {
    id: "payments",
    number: "05",
    title: "Payments and financial information",
    icon: WalletCards,
    content:
      "Payment and repayment information may be processed to support loan servicing, payment records and account history. Payment processing may also involve third-party payment services where applicable.",
  },
  {
    id: "sharing",
    number: "06",
    title: "When information may be shared",
    icon: ShieldCheck,
    content:
      "Information may be shared with service providers, technology partners or other parties where reasonably necessary to operate the platform, provide requested services, maintain security or meet applicable requirements.",
  },
  {
    id: "security",
    number: "07",
    title: "How we protect information",
    icon: LockKeyhole,
    content:
      "LoanPro is designed with account security and controlled access in mind. Appropriate technical and organizational measures should be used to help protect information from unauthorized access, misuse or loss.",
  },
  {
    id: "choices",
    number: "08",
    title: "Your choices",
    icon: User,
    content:
      "Depending on the service and applicable requirements, you may have choices relating to your account information, communications and certain uses of your information.",
    bullets: [
      "Review and update available profile information",
      "Manage certain communication preferences",
      "Request support regarding your information",
      "Use available account controls and privacy options",
    ],
  },
  {
    id: "technical",
    number: "09",
    title: "Cookies and technical information",
    icon: Info,
    content:
      "The platform may use cookies or similar technologies to support essential functionality, remember preferences, understand usage and improve the experience.",
  },
  {
    id: "changes",
    number: "10",
    title: "Changes to this policy",
    icon: FileText,
    content:
      "This privacy notice may be updated from time to time. A production version should display the applicable effective date and communicate material changes through appropriate channels.",
  },
];

function Privacy() {
  return (
    <div className="min-h-screen bg-[#f6f9fb] pb-10">
      {/* ==========================================================
          HEADER
      ========================================================== */}

      <section className="border-b border-border bg-[hsl(var(--brand-navy))] px-4 py-7 text-white sm:px-6 sm:py-9 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <Link
            to="/more"
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-blue-200 transition hover:text-white sm:text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to More
          </Link>

          <div className="mt-4 flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <LockKeyhole className="h-5 w-5" />
            </span>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200 sm:text-xs">
                LoanPro Privacy
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Privacy Policy
              </h1>

              <p className="mt-2 max-w-2xl text-xs leading-6 text-white/70 sm:text-sm">
                Learn what information may be collected through the LoanPro
                experience, why it may be used and the choices available to
                customers.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-semibold text-white/75">
                  UI mockup
                </span>

                <span className="text-[9px] text-white/45">
                  Last updated: September 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[230px_1fr]">
          {/* ========================================================
              TABLE OF CONTENTS
          ======================================================== */}

          <aside className="self-start lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-3 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                  On this page
                </p>
              </div>

              <nav className="max-h-[420px] overflow-y-auto p-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left transition hover:bg-slate-50"
                  >
                    <span className="w-5 text-[9px] font-bold text-slate-400">
                      {section.number}
                    </span>

                    <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-slate-600">
                      {section.title}
                    </span>

                    <ChevronRight className="h-3 w-3 shrink-0 text-slate-300" />
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* ========================================================
              CONTENT
          ======================================================== */}

          <div className="min-w-0">
            {/* Intro */}
            <section className="rounded-2xl border border-blue-100 bg-[#edf7fc] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                  <Info className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                    Please note
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-700 sm:text-sm">
                    This page is a product UI mockup. The final production
                    privacy policy should be reviewed and approved according
                    to your actual business model, data practices, legal
                    requirements and applicable regulations.
                  </p>
                </div>
              </div>
            </section>

            {/* Sections */}
            <div className="mt-5 space-y-3">
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24 overflow-hidden rounded-xl border border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3 border-b border-slate-100 p-4 sm:p-5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon
                          className="h-4 w-4"
                          strokeWidth={1.8}
                        />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold tracking-[0.12em] text-primary">
                            {section.number}
                          </span>

                          <span className="h-1 w-1 rounded-full bg-slate-300" />

                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            Privacy
                          </p>
                        </div>

                        <h2 className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                          {section.title}
                        </h2>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">
                      <p className="text-xs leading-6 text-muted-foreground sm:text-sm">
                        {section.content}
                      </p>

                      {section.bullets && (
                        <div className="mt-4 grid gap-2">
                          {section.bullets.map((bullet) => (
                            <div
                              key={bullet}
                              className="flex items-start gap-2 rounded-lg bg-[#f8fbfd] px-3 py-2.5"
                            >
                              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />

                              <span className="text-[10px] leading-4 text-slate-700 sm:text-xs">
                                {bullet}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* ======================================================
                ACCOUNT PRIVACY
            ====================================================== */}

            <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                    Your information
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    Questions about your personal information?
                  </h2>

                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                    Use the support flow to ask questions about your account
                    information or raise a privacy-related concern.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/contact-support"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-[10px] font-bold text-primary-foreground sm:text-xs"
                >
                  Contact Support
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  to="/security"
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-700 sm:text-xs"
                >
                  Security Centre
                </Link>
              </div>
            </section>

            {/* ======================================================
                CONTACT
            ====================================================== */}

            <section className="mt-5 overflow-hidden rounded-2xl bg-[hsl(var(--brand-navy))] p-5 text-white sm:p-7">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Mail className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200">
                    Privacy support
                  </p>

                  <h2 className="mt-1 text-lg font-bold sm:text-xl">
                    Need help with a privacy question?
                  </h2>

                  <p className="mt-1.5 text-xs leading-5 text-white/65 sm:text-sm">
                    Contact the support team for questions about your account
                    information or privacy-related concerns.
                  </p>

                  <Link
                    to="/contact-support"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2.5 text-[10px] font-bold text-[hsl(var(--brand-navy))] sm:text-xs"
                  >
                    Contact Support
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </section>

            {/* Bottom links */}
            <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
              <Link
                to="/security"
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary/20 hover:shadow-sm"
              >
                <ShieldCheck className="h-4 w-4 text-primary" />

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-slate-900">
                    Security
                  </span>

                  <span className="block mt-0.5 text-[10px] text-muted-foreground">
                    Keep your account safe
                  </span>
                </span>

                <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>

              <Link
                to="/terms"
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary/20 hover:shadow-sm"
              >
                <FileText className="h-4 w-4 text-primary" />

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-slate-900">
                    Terms & Conditions
                  </span>

                  <span className="block mt-0.5 text-[10px] text-muted-foreground">
                    Review applicable terms
                  </span>
                </span>

                <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>

              <Link
                to="/more"
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary/20 hover:shadow-sm"
              >
                <ArrowRight className="h-4 w-4 text-primary" />

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-slate-900">
                    More
                  </span>

                  <span className="block mt-0.5 text-[10px] text-muted-foreground">
                    Back to LoanPro services
                  </span>
                </span>

                <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Privacy;