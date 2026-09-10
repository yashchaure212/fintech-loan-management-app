import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileCheck2,
  FileText,
  GraduationCap,
  Info,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const heroImage =
  "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1800";

const adImages = [
  {
    image:
      "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1000",
    eyebrow: "Education journey",
    title: "Plan your child's next academic step",
    description:
      "Explore a dedicated education financing journey for eligible education expenses.",
    href: "#overview",
  },
  {
    image:
      "https://images.pexels.com/photos/5905710/pexels-photo-5905710.jpeg?auto=compress&cs=tinysrgb&w=1000",
    eyebrow: "Digital application",
    title: "Apply online, track every step",
    description:
      "Keep your application information and progress in one place.",
    href: "#how-it-works",
  },
  {
    image:
      "https://images.pexels.com/photos/3769984/pexels-photo-3769984.jpeg?auto=compress&cs=tinysrgb&w=1000",
    eyebrow: "Education support",
    title: "One journey for education expenses",
    description:
      "Review eligible education-related costs before you begin.",
    href: "#coverage",
  },
];

const highlights = [
  {
    icon: GraduationCap,
    title: "Education-focused",
    description:
      "A dedicated loan journey built around education-related requirements.",
  },
  {
    icon: FileCheck2,
    title: "Digital documentation",
    description:
      "Submit and track the documents required for your application.",
  },
  {
    icon: WalletCards,
    title: "Application tracking",
    description:
      "Follow your application progress from one account.",
  },
];

const coverage = [
  "School or course-related fees",
  "Books and learning materials",
  "Eligible study equipment",
  "Accommodation or related education expenses where supported",
  "Other approved education-related expenses",
];

const eligibility = [
  "Meet the applicable product eligibility requirements",
  "Provide the required personal and verification information",
  "Provide applicable academic or admission information",
  "Provide supporting documents when requested",
  "Pass the applicable assessment and verification process",
];

const documents = [
  "Identity and KYC documents",
  "Address proof",
  "Admission or academic documents",
  "Fee structure or expense-related documents",
  "Additional documents based on the application",
];

const steps = [
  {
    number: "01",
    title: "Choose",
    description:
      "Understand the product and review the requirements before starting.",
  },
  {
    number: "02",
    title: "Apply",
    description:
      "Complete the digital application and provide the requested information.",
  },
  {
    number: "03",
    title: "Verify",
    description:
      "Your information and supporting documents go through the applicable review.",
  },
  {
    number: "04",
    title: "Decision",
    description:
      "Approved applications proceed according to the applicable loan terms and conditions.",
  },
];

const faqs = [
  {
    question: "Who can apply for a School Student Loan?",
    answer:
      "Eligibility depends on the applicable product criteria. The application may require information from the student, parent, guardian, co-applicant, or other relevant applicant depending on the product.",
  },
  {
    question: "What can the loan be used for?",
    answer:
      "Eligible education-related expenses may include fees, books, study materials, equipment, accommodation, or other expenses supported by the applicable product terms.",
  },
  {
    question: "What documents will I need?",
    answer:
      "The exact document list depends on the application. Identity, address, academic, admission, and expense-related documents may be requested.",
  },
  {
    question: "Does applying guarantee approval?",
    answer:
      "No. Submission of an application does not guarantee approval. Final decisions depend on eligibility, verification, assessment, documentation, and applicable loan terms.",
  },
  {
    question: "Can I save my application?",
    answer:
      "Supported applications can be saved as drafts so you can return and continue the application journey later.",
  },
];

function SchoolStudentLoan() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      {/* =========================================================
          TOP PROMOTIONAL STRIP
      ========================================================== */}

      <div className="bg-primary text-primary-foreground">
        <div className="page-container flex min-h-10 items-center justify-center gap-2 px-4 py-2 text-center">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />

          <p className="text-[11px] font-semibold sm:text-xs">
            Education-focused financing with a simple digital application
            journey.
          </p>
        </div>
      </div>

      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Student studying"
            className="h-full w-full object-cover opacity-25"
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,24,47,0.98)_0%,rgba(7,24,47,0.88)_45%,rgba(7,24,47,0.35)_100%)]" />
        </div>

        <div className="page-container relative py-8 sm:py-12 lg:py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mt-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white/85">
              <GraduationCap className="h-3.5 w-3.5" />
              Education Loan
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              School Student Loan
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              A dedicated digital loan journey for eligible education-related
              expenses, with application tracking and document support built
              into your LoanPro account.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login?redirect=/customer/loans/apply"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-primary shadow-lg transition hover:bg-white/90"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/emi-calculator"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 text-sm font-bold text-white transition hover:bg-white/15"
              >
                Calculate EMI
                <WalletCards className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HIGHLIGHTS
      ========================================================== */}

      <section className="page-container -mt-5 relative z-10 py-0">
        <div className="grid overflow-hidden rounded-2xl border bg-white shadow-sm md:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={[
                  "p-5 sm:p-6",
                  index !== 0 ? "border-t md:border-l md:border-t-0" : "",
                ].join(" ")}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <h2 className="mt-4 text-sm font-bold sm:text-base">
                  {item.title}
                </h2>

                <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          AD / PROMOTIONAL BANNERS
      ========================================================== */}

      <section className="page-container py-8 sm:py-10">
        <div className="mb-5">
          <span className="section-eyebrow">
            Explore the journey
          </span>

          <h2 className="section-title mt-2">
            Make your education plans easier to manage
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {adImages.map((ad) => (
            <Link
              key={ad.title}
              to={ad.href}
              className="group relative min-h-[220px] overflow-hidden rounded-2xl"
            >
              <img
                src={ad.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />

              <div className="relative flex min-h-[220px] flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/65">
                  {ad.eyebrow}
                </span>

                <h3 className="mt-2 text-lg font-bold tracking-tight">
                  {ad.title}
                </h3>

                <p className="mt-1 max-w-sm text-xs leading-5 text-white/70">
                  {ad.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold">
                  Explore
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================
          OVERVIEW + SIDE CTA
      ========================================================== */}

      <section
        id="overview"
        className="border-y bg-white"
      >
        <div className="page-container py-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div>
              <span className="section-eyebrow">
                About the product
              </span>

              <h2 className="section-title mt-2">
                Education financing designed around your journey
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                LoanPro's School Student Loan experience is designed to bring
                education-related loan information, documents, and application
                progress into one digital journey.
              </p>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                The actual loan amount, interest rate, charges, eligibility,
                documentation, and repayment terms depend on the applicable
                product and final assessment.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl bg-primary text-primary-foreground">
              <div className="p-6">
                <BookOpen className="h-6 w-6" />

                <h3 className="mt-5 text-xl font-bold">
                  Ready to explore?
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/70">
                  Start your application when you're ready and continue it from
                  your account.
                </p>

                <Link
                  to="/login?redirect=/customer/loans/apply"
                  className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-primary"
                >
                  Start Application
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          COVERAGE
      ========================================================== */}

      <section
        id="coverage"
        className="page-container py-10 sm:py-14"
      >
        <div className="max-w-3xl">
          <span className="section-eyebrow">
            Possible uses
          </span>

          <h2 className="section-title mt-2">
            What may be covered
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Eligible expenses depend on the applicable product terms and
            approved loan conditions.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coverage.map((item) => (
            <div
              key={item}
              className="rounded-2xl border bg-white p-5"
            >
              <CheckCircle2 className="h-5 w-5 text-primary" />

              <p className="mt-4 text-sm font-semibold">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          ELIGIBILITY
      ========================================================== */}

      <section className="bg-[#eef5f9]">
        <div className="page-container py-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="section-eyebrow">
                Eligibility
              </span>

              <h2 className="section-title mt-2">
                What you may need
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Requirements can vary based on the applicant, product,
                application information, and assessment.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {eligibility.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border bg-white p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                  <p className="text-sm leading-6 text-muted-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          DOCUMENTS
      ========================================================== */}

      <section className="page-container py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            <span className="section-eyebrow">
              Documentation
            </span>

            <h2 className="section-title mt-2">
              Documents you may need
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The exact list is determined during the application process.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {documents.map((document) => (
                <div
                  key={document}
                  className="flex items-center gap-3 rounded-xl border bg-white p-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" />
                  </span>

                  <span className="text-sm font-medium">
                    {document}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <h3 className="mt-5 font-bold">
              Keep your documents ready
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Having your supporting information ready can make the digital
              application process easier.
            </p>

            <Link
              to="/customer/kyc"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary"
            >
              Open KYC
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================== */}

      <section
        id="how-it-works"
        className="bg-white border-y"
      >
        <div className="page-container py-10 sm:py-14">
          <div className="max-w-3xl">
            <span className="section-eyebrow">
              Simple digital journey
            </span>

            <h2 className="section-title mt-2">
              From application to decision
            </h2>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border bg-[#f8fafc] p-5"
              >
                <span className="text-xs font-black text-primary">
                  {step.number}
                </span>

                <h3 className="mt-4 text-base font-bold">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>

                {step.number !== "04" && (
                  <ChevronRight className="absolute right-4 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground md:block lg:right-[-10px]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          EMI PROMO
      ========================================================== */}

      <section className="page-container py-10 sm:py-14">
        <div className="relative overflow-hidden rounded-2xl bg-[#07182f]">
          <img
            src="https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=1400"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#07182f] via-[#07182f]/95 to-[#07182f]/40" />

          <div className="relative p-6 text-white sm:p-8 lg:p-10">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">
                Plan your repayment
              </span>

              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                See an estimated EMI before you apply
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/70">
                Use the LoanPro EMI calculator to explore an estimated monthly
                repayment based on the amount, interest rate, and tenure you
                enter.
              </p>

              <Link
                to="/emi-calculator"
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-primary"
              >
                Calculate EMI
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FAQ
      ========================================================== */}

      <section className="page-container pb-10 sm:pb-14">
        <div className="max-w-3xl">
          <span className="section-eyebrow">
            FAQs
          </span>

          <h2 className="section-title mt-2">
            School Student Loan questions
          </h2>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border bg-white">
          {faqs.map((faq, index) => {
            const open = openFaq === index;

            return (
              <div
                key={faq.question}
                className="border-b last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(open ? null : index)
                  }
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-muted/40 sm:px-6"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Info className="h-4 w-4" />
                  </span>

                  <span className="min-w-0 flex-1 text-sm font-semibold">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={[
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                      open ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </button>

                {open && (
                  <div className="px-5 pb-5 pl-[4.75rem] sm:px-6 sm:pl-[4.9rem]">
                    <p className="text-sm leading-6 text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          FINAL COMMERCIAL CTA
      ========================================================== */}

      <section className="bg-primary">
        <div className="page-container py-10 text-center sm:py-14">
          <div className="mx-auto max-w-2xl text-white">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">
              School Student Loan
            </span>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Ready to start your application?
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/70">
              Sign in or create your account to begin your digital loan
              application journey.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/login?redirect=/customer/loans/apply"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-primary transition hover:bg-white/90"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/loan-terms"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 text-sm font-bold text-white transition hover:bg-white/15"
              >
                View Loan Terms
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SchoolStudentLoan;