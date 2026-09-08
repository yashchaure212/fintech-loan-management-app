import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FileCheck2,
  FileText,
  Headphones,
  HelpCircle,
  LockKeyhole,
  MessageCircle,
  Search,
  ShieldCheck,
  User,
  WalletCards,
} from "lucide-react";

const helpCategories = [
  {
    icon: FileText,
    title: "Loans & Applications",
    description: "Applying for a loan, eligibility and application status.",
    topics: [
      "How do I apply for a loan?",
      "How can I check my application status?",
      "What information is required to apply?",
      "Can I save and continue my application later?",
    ],
  },
  {
    icon: WalletCards,
    title: "EMIs & Payments",
    description: "EMI schedules, repayments and payment information.",
    topics: [
      "How can I view my EMI schedule?",
      "Where can I make an EMI payment?",
      "How can I view my payment history?",
      "What happens after a payment is completed?",
    ],
  },
  {
    icon: FileCheck2,
    title: "Documents & KYC",
    description: "Documents, verification and application requirements.",
    topics: [
      "Which documents may be required?",
      "How do I upload a document?",
      "How can I update my profile information?",
      "What happens if a document needs correction?",
    ],
  },
  {
    icon: User,
    title: "Account & Profile",
    description: "Manage your profile, account and personal information.",
    topics: [
      "How do I update my profile?",
      "How can I change my password?",
      "How do I log out of my account?",
      "What should I do if I cannot access my account?",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Security & Privacy",
    description: "Account security, privacy and safe usage.",
    topics: [
      "How does LoanPro protect my account?",
      "What should I do if I notice unusual activity?",
      "How is my information handled?",
      "How can I keep my account secure?",
    ],
  },
  {
    icon: Headphones,
    title: "Technical Help",
    description: "Troubleshooting common website and application issues.",
    topics: [
      "Why is a page not loading?",
      "What should I do if a document upload fails?",
      "Why am I unable to continue my application?",
      "How can I report a technical issue?",
    ],
  },
];

const popularTopics = [
  {
    icon: FileText,
    title: "How to apply",
    description: "Learn the basic application journey.",
  },
  {
    icon: WalletCards,
    title: "EMI & payments",
    description: "Understand repayments and schedules.",
  },
  {
    icon: FileCheck2,
    title: "Documents",
    description: "Know what documents may be required.",
  },
  {
    icon: CircleHelp,
    title: "Application status",
    description: "Understand the different stages.",
  },
];

const faqs = [
  {
    question: "How do I start a loan application?",
    answer:
      "Open the available loan product, review the product information and select the application option. You can then complete the required details and continue through the application steps.",
  },
  {
    question: "Can I save my application and continue later?",
    answer:
      "Yes. The LoanPro application journey is designed to let you continue a saved application from your account when the relevant draft is available.",
  },
  {
    question: "How can I check my application status?",
    answer:
      "After signing in, open your loan section to view available applications and their current status. The information shown depends on the stage reached by your application.",
  },
  {
    question: "Where can I view my EMI schedule?",
    answer:
      "Open the Payments & EMIs section from your account to view the repayment information available for your loan.",
  },
  {
    question: "How do I upload a required document?",
    answer:
      "Open the relevant application and follow the document step. The application will indicate which documents are required and whether any submitted document needs attention.",
  },
  {
    question: "How can I contact LoanPro support?",
    answer:
      "Use the Contact Support option to reach the support flow. For the mockup, this opens the support experience that can later be connected to your real support channel.",
  },
];

function HelpCentre() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return helpCategories;
    }

    return helpCategories
      .map((category) => {
        const categoryMatch =
          category.title.toLowerCase().includes(query) ||
          category.description.toLowerCase().includes(query);

        const matchingTopics = category.topics.filter((topic) =>
          topic.toLowerCase().includes(query),
        );

        if (categoryMatch || matchingTopics.length > 0) {
          return {
            ...category,
            topics:
              matchingTopics.length > 0
                ? matchingTopics
                : category.topics,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [search]);

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return faqs;
    }

    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-[#f6f9fb] pb-10">
      <main>
        {/* ==========================================================
            HERO
        ========================================================== */}

        <section className="border-b border-border bg-[hsl(var(--brand-navy))] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-[1100px]">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-blue-200">
                <HelpCircle className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] sm:text-xs">
                  LoanPro Help Centre
                </span>
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                How can we help?
              </h1>

              <p className="mt-2 text-xs leading-5 text-white/70 sm:text-sm">
                Find answers about applications, documents, EMIs, payments and
                your LoanPro account.
              </p>
            </div>

            {/* Search */}
            <div className="relative mt-6 max-w-2xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search for a question or topic..."
                className="h-12 w-full rounded-xl border border-white/10 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none shadow-lg placeholder:text-slate-400 focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {["Application", "EMI", "Documents", "Profile"].map(
                (topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setSearch(topic)}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white/80 transition hover:bg-white/15 hover:text-white"
                  >
                    {topic}
                  </button>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ==========================================================
            MAIN CONTENT
        ========================================================== */}

        <main className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
          {/* ========================================================
              POPULAR
          ======================================================== */}

          <section className="py-7 sm:py-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
                Quick help
              </p>

              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Popular topics
              </h2>

              <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                Start with one of the most common LoanPro questions.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {popularTopics.map((topic) => {
                const Icon = topic.icon;

                return (
                  <button
                    key={topic.title}
                    type="button"
                    onClick={() => setSearch(topic.title)}
                    className="group rounded-xl border border-slate-200 bg-white p-3 text-left shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm sm:p-4"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon
                        className="h-4 w-4"
                        strokeWidth={1.8}
                      />
                    </span>

                    <h3 className="mt-2.5 text-[11px] font-bold text-slate-900 sm:text-xs">
                      {topic.title}
                    </h3>

                    <p className="mt-1 text-[9px] leading-4 text-muted-foreground sm:text-[10px]">
                      {topic.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ========================================================
              HELP CATEGORIES
          ======================================================== */}

          <section className="border-t border-border py-7 sm:py-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
                Browse help
              </p>

              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Help by category
              </h2>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {filteredCategories.map((category) => {
                const Icon = category.icon;

                return (
                  <article
                    key={category.title}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex items-start gap-3 border-b border-slate-100 p-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon
                          className="h-[18px] w-[18px]"
                          strokeWidth={1.8}
                        />
                      </span>

                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900">
                          {category.title}
                        </h3>

                        <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground sm:text-xs">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {category.topics.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => setSearch(topic)}
                          className="group flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />

                          <span className="min-w-0 flex-1 text-[11px] font-medium text-slate-700 sm:text-xs">
                            {topic}
                          </span>

                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                        </button>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            {search && filteredCategories.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center">
                <Search className="mx-auto h-6 w-6 text-slate-300" />

                <p className="mt-3 text-sm font-bold text-slate-900">
                  No help topics found
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Try another search term.
                </p>

                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-3 text-xs font-bold text-primary"
                >
                  Clear search
                </button>
              </div>
            )}
          </section>

          {/* ========================================================
              FAQ
          ======================================================== */}

          <section className="border-t border-border py-7 sm:py-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
                Common questions
              </p>

              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Frequently asked questions
              </h2>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div
                    key={faq.question}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(
                          isOpen ? null : index,
                        )
                      }
                      className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50 sm:px-5"
                    >
                      <HelpCircle className="h-4 w-4 shrink-0 text-primary" />

                      <span className="min-w-0 flex-1 text-xs font-bold text-slate-900 sm:text-sm">
                        {faq.question}
                      </span>

                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-11 pb-4 pr-5 sm:pr-8">
                        <p className="text-[11px] leading-5 text-muted-foreground sm:text-xs sm:leading-6">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredFaqs.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <p className="text-xs text-muted-foreground">
                    No matching questions found.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ========================================================
              SUPPORT CTA
          ======================================================== */}

          <section className="pb-8 pt-2">
            <div className="relative overflow-hidden rounded-2xl bg-[hsl(var(--brand-navy))] p-5 text-white shadow-sm sm:p-7">
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full border border-white/10" />

              <div className="relative max-w-2xl">
                <div className="flex items-center gap-2 text-blue-200">
                  <MessageCircle className="h-4 w-4" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.12em]">
                    Still need help?
                  </p>
                </div>

                <h2 className="mt-2 text-lg font-bold sm:text-xl">
                  Can't find what you're looking for?
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-white/65 sm:text-sm">
                  Contact the LoanPro support team for help with your account,
                  application or payment journey.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/contact-support"
                    className="inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2.5 text-[10px] font-bold text-[hsl(var(--brand-navy))] sm:text-xs"
                  >
                    Contact Support
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-4 py-2.5 text-[10px] font-bold text-white sm:text-xs"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================
              SUPPORT LINKS
          ======================================================== */}

          <section className="pb-5">
            <div className="grid gap-2.5 sm:grid-cols-3">
              <Link
                to="/more"
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition hover:border-primary/20 hover:shadow-sm"
              >
                <BookOpen className="h-4 w-4 text-primary" />

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-slate-900">
                    Explore LoanPro
                  </span>

                  <span className="block text-[10px] text-muted-foreground">
                    Products, tools and services
                  </span>
                </span>

                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                to="/services"
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition hover:border-primary/20 hover:shadow-sm"
              >
                <FileText className="h-4 w-4 text-primary" />

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-slate-900">
                    Browse Services
                  </span>

                  <span className="block text-[10px] text-muted-foreground">
                    Explore available products
                  </span>
                </span>

                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                to="/emi-calculator"
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition hover:border-primary/20 hover:shadow-sm"
              >
                <WalletCards className="h-4 w-4 text-primary" />

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-slate-900">
                    EMI Calculator
                  </span>

                  <span className="block text-[10px] text-muted-foreground">
                    Plan your estimated repayment
                  </span>
                </span>

                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>
        </main>
      </main>
    </div>
  );
}

export default HelpCentre;