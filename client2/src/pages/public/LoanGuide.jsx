import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  IndianRupee,
  Info,
  Landmark,
  Percent,
  SearchCheck,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

const guideSections = [
  {
    id: "loan-basics",
    title: "Understanding loans",
    description:
      "Start with the basic concepts before choosing a loan product.",
    icon: Landmark,
    articles: [
      {
        title: "What is a loan?",
        content:
          "A loan is an amount provided to a borrower that is generally repaid over an agreed period according to the applicable terms. The total cost can include interest and applicable fees.",
      },
      {
        title: "What is the loan amount?",
        content:
          "The loan amount is the principal amount you request or receive under the applicable loan product. The amount available to you depends on the product, eligibility and review process.",
      },
      {
        title: "What is tenure?",
        content:
          "Tenure is the period over which the loan is scheduled to be repaid. It is often expressed in months.",
      },
      {
        title: "What is an interest rate?",
        content:
          "The interest rate is the rate used to calculate the interest applicable to the outstanding loan amount according to the loan terms.",
      },
    ],
  },
  {
    id: "emi",
    title: "Understanding EMI",
    description:
      "Learn how monthly repayments work before you apply.",
    icon: WalletCards,
    articles: [
      {
        title: "What is EMI?",
        content:
          "EMI stands for Equated Monthly Instalment. It represents a scheduled monthly repayment amount for a loan under the applicable repayment structure.",
      },
      {
        title: "What affects your EMI?",
        content:
          "Loan amount, interest rate and repayment tenure are key inputs used to calculate an estimated EMI. Changing any of these can change the repayment amount.",
      },
      {
        title: "Does a longer tenure reduce EMI?",
        content:
          "A longer tenure can reduce the monthly repayment amount, but the overall interest paid may increase. The final result depends on the applicable loan terms.",
      },
      {
        title: "Can I estimate EMI before applying?",
        content:
          "Yes. LoanPro provides an EMI calculator so you can explore an illustrative repayment estimate before starting an application.",
      },
    ],
  },
  {
    id: "application",
    title: "Applying for a loan",
    description:
      "Understand the typical steps involved in an online application.",
    icon: ClipboardCheck,
    articles: [
      {
        title: "Step 1: Explore your options",
        content:
          "Review the available loan products and understand the product information, eligibility requirements and repayment considerations before starting.",
      },
      {
        title: "Step 2: Start your application",
        content:
          "Select the relevant loan product and provide the information requested by the application flow.",
      },
      {
        title: "Step 3: Submit documents",
        content:
          "Provide the documents requested for your selected product and application stage.",
      },
      {
        title: "Step 4: Review and decision",
        content:
          "Your application can move through the configured verification and review stages. Final outcomes depend on the applicable product and review process.",
      },
    ],
  },
  {
    id: "documents",
    title: "Documents & verification",
    description:
      "Know what to expect when documents and verification are involved.",
    icon: FileCheck2,
    articles: [
      {
        title: "Why are documents required?",
        content:
          "Documents can be used to verify information provided during the application and to support the applicable review process.",
      },
      {
        title: "Which documents will I need?",
        content:
          "Requirements can vary by loan product and application stage. The application should show the documents relevant to your journey.",
      },
      {
        title: "What if a document needs correction?",
        content:
          "Review the document status and instructions provided in the application, then submit the corrected information where the workflow allows.",
      },
    ],
  },
  {
    id: "before-applying",
    title: "Before you apply",
    description:
      "A few useful checks to make before starting your application.",
    icon: SearchCheck,
    articles: [
      {
        title: "Understand the repayment",
        content:
          "Use the EMI calculator and review the expected repayment structure before applying.",
      },
      {
        title: "Check your information",
        content:
          "Keep your personal, contact and other requested information ready so you can complete the application accurately.",
      },
      {
        title: "Review the requirements",
        content:
          "Understand the applicable eligibility and document requirements before beginning.",
      },
      {
        title: "Read the applicable terms",
        content:
          "Review the applicable product terms, pricing, fees and other important information before proceeding.",
      },
    ],
  },
];

const glossary = [
  {
    term: "Principal",
    meaning: "The original loan amount before applicable interest and other charges.",
    icon: IndianRupee,
  },
  {
    term: "Interest rate",
    meaning: "The rate used to calculate interest according to the applicable loan terms.",
    icon: Percent,
  },
  {
    term: "Tenure",
    meaning: "The agreed or scheduled repayment period of the loan.",
    icon: Clock3,
  },
  {
    term: "EMI",
    meaning: "The scheduled monthly instalment used to repay the loan.",
    icon: WalletCards,
  },
];

function LoanGuide() {
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("all");
  const [openArticles, setOpenArticles] = useState({});

  const filteredSections = useMemo(() => {
    const query = search.trim().toLowerCase();

    return guideSections
      .filter(
        (section) =>
          activeSection === "all" ||
          section.id === activeSection,
      )
      .map((section) => {
        if (!query) {
          return section;
        }

        const sectionMatches =
          section.title.toLowerCase().includes(query) ||
          section.description.toLowerCase().includes(query);

        const matchingArticles = section.articles.filter(
          (article) =>
            article.title.toLowerCase().includes(query) ||
            article.content.toLowerCase().includes(query),
        );

        if (sectionMatches) {
          return section;
        }

        if (matchingArticles.length > 0) {
          return {
            ...section,
            articles: matchingArticles,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [activeSection, search]);

  const toggleArticle = (key) => {
    setOpenArticles((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <div className="min-h-screen bg-[#f6f9fb] pb-10">
      {/* ==========================================================
          HERO
      ========================================================== */}

      <section className="relative overflow-hidden bg-[hsl(var(--brand-navy))] px-4 py-9 text-white sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1100px]">
          <div className="flex items-center gap-2 text-blue-200">
            <BookOpen className="h-4 w-4" />

            <span className="text-[10px] font-bold uppercase tracking-[0.12em] sm:text-xs">
              LoanPro Guide
            </span>
          </div>

          <h1 className="mt-2 max-w-3xl text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Understand loans before you apply.
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-6 text-white/70 sm:text-sm">
            A simple guide to loan basics, EMI, applications, documents and
            the things worth checking before you begin.
          </p>

          {/* Search */}
          <div className="relative mt-6 max-w-2xl">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search the loan guide..."
              className="h-12 w-full rounded-xl border border-white/10 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none shadow-lg placeholder:text-slate-400 focus:ring-2 focus:ring-white/25"
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        {/* ==========================================================
            INTRO
        ========================================================== */}

        <section className="py-7 sm:py-8">
          <div className="grid gap-3 sm:grid-cols-3">
            <GuideIntroCard
              icon={SearchCheck}
              title="Explore"
              text="Understand loan products and key terms."
            />

            <GuideIntroCard
              icon={Calculator}
              title="Plan"
              text="Use the EMI calculator before applying."
            />

            <GuideIntroCard
              icon={ClipboardCheck}
              title="Apply"
              text="Understand the application journey."
            />
          </div>
        </section>

        {/* ==========================================================
            CATEGORY FILTER
        ========================================================== */}

        <section className="border-y border-border bg-white py-3">
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setActiveSection("all")}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[10px] font-bold sm:text-xs ${
                activeSection === "all"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              All
            </button>

            {guideSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() =>
                  setActiveSection(section.id)
                }
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[10px] font-bold sm:text-xs ${
                  activeSection === section.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </section>

        {/* ==========================================================
            GUIDE
        ========================================================== */}

        <section className="py-7 sm:py-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
              Learn
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
              Loan guide
            </h2>

            <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
              Open a topic to read more.
            </p>
          </div>

          <div className="mt-5 space-y-5">
            {filteredSections.map((section) => {
              const SectionIcon = section.icon;

              return (
                <section key={section.id}>
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <SectionIcon
                        className="h-[18px] w-[18px]"
                        strokeWidth={1.8}
                      />
                    </span>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                        {section.title}
                      </h3>

                      <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground sm:text-xs">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    {section.articles.map(
                      (article, index) => {
                        const key = `${section.id}-${article.title}`;
                        const isOpen = openArticles[key];

                        return (
                          <div
                            key={article.title}
                            className={`${
                              index !==
                              section.articles.length - 1
                                ? "border-b border-slate-100"
                                : ""
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                toggleArticle(key)
                              }
                              className="group flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50 sm:px-5"
                              aria-expanded={isOpen}
                            >
                              <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                                  isOpen
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {index + 1}
                              </span>

                              <span className="min-w-0 flex-1 text-xs font-bold text-slate-900 sm:text-sm">
                                {article.title}
                              </span>

                              <ChevronDown
                                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                                  isOpen
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>

                            {isOpen && (
                              <div className="px-14 pb-4 pr-5 sm:pr-10">
                                <p className="text-[11px] leading-5 text-muted-foreground sm:text-xs sm:leading-6">
                                  {article.content}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          {filteredSections.length === 0 && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-12 text-center">
              <BookOpen className="mx-auto h-7 w-7 text-slate-300" />

              <h3 className="mt-3 text-sm font-bold text-slate-900">
                Nothing found
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Try another search term.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveSection("all");
                }}
                className="mt-3 text-xs font-bold text-primary"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* ==========================================================
            GLOSSARY
        ========================================================== */}

        <section className="border-y border-border bg-white px-4 py-7 sm:px-6 sm:py-8 lg:-mx-8 lg:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
              Quick reference
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
              Common loan terms
            </h2>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {glossary.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.term}
                  className="rounded-xl border border-slate-200 bg-[#f8fbfd] p-4"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary shadow-sm ring-1 ring-slate-200">
                    <Icon
                      className="h-4 w-4"
                      strokeWidth={1.8}
                    />
                  </span>

                  <h3 className="mt-3 text-xs font-bold text-slate-900 sm:text-sm">
                    {item.term}
                  </h3>

                  <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
                    {item.meaning}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ==========================================================
            BEFORE APPLYING
        ========================================================== */}

        <section className="py-7 sm:py-8">
          <div className="rounded-2xl border border-amber-100 bg-[#fff9ed] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <div>
                <p className="text-sm font-bold text-slate-900 sm:text-base">
                  Before you apply
                </p>

                <p className="mt-1 text-[10px] leading-5 text-muted-foreground sm:text-xs">
                  Take a moment to understand the applicable loan amount,
                  tenure, interest rate, fees, document requirements and
                  repayment structure before proceeding.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                "Understand your estimated repayment",
                "Check the applicable eligibility requirements",
                "Keep requested information and documents ready",
                "Review the applicable product terms",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />

                  <span className="text-[10px] font-medium text-slate-700 sm:text-xs">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================
            TOOLS
        ========================================================== */}

        <section className="pb-7 sm:pb-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/emi-calculator"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calculator className="h-5 w-5" />
              </span>

              <h3 className="mt-3 text-sm font-bold text-slate-900 sm:text-base">
                Try the EMI Calculator
              </h3>

              <p className="mt-1 text-[10px] leading-5 text-muted-foreground sm:text-xs">
                Explore an estimated monthly repayment using different loan
                amounts, rates and tenures.
              </p>

              <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-primary sm:text-xs">
                Open calculator
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>

            <Link
              to="/services"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Landmark className="h-5 w-5" />
              </span>

              <h3 className="mt-3 text-sm font-bold text-slate-900 sm:text-base">
                Explore loan products
              </h3>

              <p className="mt-1 text-[10px] leading-5 text-muted-foreground sm:text-xs">
                Browse the LoanPro product marketplace and explore available
                financing options.
              </p>

              <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-primary sm:text-xs">
                Explore services
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </section>

        {/* ==========================================================
            SUPPORT
        ========================================================== */}

        <section className="pb-5">
          <div className="relative overflow-hidden rounded-2xl bg-[hsl(var(--brand-navy))] p-5 text-white sm:p-7">
            <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full border border-white/10" />

            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200">
                Need more help?
              </p>

              <h2 className="mt-1.5 text-lg font-bold sm:text-xl">
                Have a question about your loan journey?
              </h2>

              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-white/65 sm:text-sm">
                Visit the Help Centre or browse frequently asked questions for
                more guidance.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/help"
                  className="inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2.5 text-[10px] font-bold text-[hsl(var(--brand-navy))] sm:text-xs"
                >
                  Help Centre
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  to="/faq"
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-4 py-2.5 text-[10px] font-bold text-white sm:text-xs"
                >
                  FAQs
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function GuideIntroCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </span>

      <h3 className="mt-3 text-xs font-bold text-slate-900 sm:text-sm">
        {title}
      </h3>

      <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
        {text}
      </p>
    </div>
  );
}

function SearchIcon(props) {
  return <SearchIconBase {...props} />;
}

function SearchIconBase(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default LoanGuide;