import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  CircleHelp,
  FileCheck2,
  FileText,
  Headphones,
  Search,
  ShieldCheck,
  User,
  WalletCards,
} from "lucide-react";

const categories = [
  {
    id: "all",
    label: "All questions",
  },
  {
    id: "loans",
    label: "Loans",
  },
  {
    id: "payments",
    label: "EMIs & Payments",
  },
  {
    id: "documents",
    label: "Documents",
  },
  {
    id: "account",
    label: "Account",
  },
  {
    id: "security",
    label: "Security",
  },
];

const faqGroups = [
  {
    id: "loans",
    title: "Loans & Applications",
    description:
      "Questions about applying for a loan and tracking your application.",
    icon: FileText,
    questions: [
      {
        question: "How do I apply for a loan?",
        answer:
          "Choose the loan product you are interested in, review the available information and start the application. You will then be guided through the required details and documents.",
      },
      {
        question: "What information do I need to provide?",
        answer:
          "The information requested depends on the selected loan product. The application will guide you through the personal, financial and other details required at each step.",
      },
      {
        question: "Can I save my application and continue later?",
        answer:
          "Yes. A draft application can be continued later from your account when the saved application is available.",
      },
      {
        question: "How can I check my application status?",
        answer:
          "Sign in to your LoanPro account and open My Loans to view the applications and status information currently available for your account.",
      },
      {
        question: "Can I apply for more than one loan?",
        answer:
          "Availability of additional applications depends on the applicable product rules and your current account or application status.",
      },
    ],
  },
  {
    id: "payments",
    title: "EMIs & Payments",
    description:
      "Information about repayment schedules, EMI payments and payment history.",
    icon: WalletCards,
    questions: [
      {
        question: "Where can I view my EMI schedule?",
        answer:
          "Open the Payments & EMIs section in your account to view repayment information available for your loan.",
      },
      {
        question: "How can I make an EMI payment?",
        answer:
          "Open Payments & EMIs from your account and select the available payment option for your loan.",
      },
      {
        question: "Can I view my previous payments?",
        answer:
          "Yes. Your available payment history can be viewed from the Payments & EMIs area of your account.",
      },
      {
        question: "What happens after I make a payment?",
        answer:
          "Once the payment is processed, the available payment and repayment information is updated in your account.",
      },
    ],
  },
  {
    id: "documents",
    title: "Documents & KYC",
    description:
      "Questions about required documents, uploads and verification.",
    icon: FileCheck2,
    questions: [
      {
        question: "Which documents may be required?",
        answer:
          "Required documents depend on the selected loan product and application stage. LoanPro shows the applicable requirements during the application journey.",
      },
      {
        question: "How do I upload a document?",
        answer:
          "Open your application and continue to the document step. You can upload the documents requested for that stage from there.",
      },
      {
        question: "What if my document is rejected or needs correction?",
        answer:
          "Review the document status and any available instructions, then provide the corrected document through the application flow.",
      },
      {
        question: "Can I update my KYC information?",
        answer:
          "Available profile and KYC information can be managed from your profile area, subject to the options provided by the application.",
      },
    ],
  },
  {
    id: "account",
    title: "Account & Profile",
    description:
      "Help with your LoanPro account, profile and application access.",
    icon: User,
    questions: [
      {
        question: "How do I update my profile?",
        answer:
          "Go to My Profile from your account menu and update the information that is available for editing.",
      },
      {
        question: "How can I change my password?",
        answer:
          "Use the password management option available in your profile or account security settings.",
      },
      {
        question: "What should I do if I cannot access my account?",
        answer:
          "Use the available sign-in recovery options or contact LoanPro support for help with account access.",
      },
      {
        question: "How do I log out?",
        answer:
          "Open the Menu and use the Log out option to securely sign out of your LoanPro account.",
      },
    ],
  },
  {
    id: "security",
    title: "Security & Privacy",
    description:
      "Learn about keeping your account safe and protecting your information.",
    icon: ShieldCheck,
    questions: [
      {
        question: "How can I keep my account secure?",
        answer:
          "Use a strong password, avoid sharing account credentials and sign out when using a shared device.",
      },
      {
        question: "What should I do if I notice unusual activity?",
        answer:
          "Secure your account and contact LoanPro support as soon as possible so the issue can be reviewed.",
      },
      {
        question: "How is my information handled?",
        answer:
          "Information handling is subject to the applicable LoanPro privacy policy and terms.",
      },
    ],
  },
];

function FAQGroup({
  group,
  openQuestions,
  toggleQuestion,
}) {
  const Icon = group.icon;

  return (
    <section
      id={`faq-${group.id}`}
      className="scroll-mt-24"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon
            className="h-[18px] w-[18px]"
            strokeWidth={1.8}
          />
        </span>

        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            {group.title}
          </h2>

          <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground sm:text-xs">
            {group.description}
          </p>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {group.questions.map((item, index) => {
          const key = `${group.id}-${index}`;
          const open = openQuestions[key];

          return (
            <div
              key={item.question}
              className="border-b border-slate-100 last:border-b-0"
            >
              <button
                type="button"
                onClick={() =>
                  toggleQuestion(key)
                }
                className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50 sm:px-5"
                aria-expanded={open}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    open
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  ?
                </span>

                <span className="min-w-0 flex-1 text-xs font-bold text-slate-900 sm:text-sm">
                  {item.question}
                </span>

                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <div className="px-14 pb-4 pr-5 sm:pr-10">
                  <p className="text-[11px] leading-5 text-muted-foreground sm:text-xs sm:leading-6">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FrequentlyAskedQuestions() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("all");
  const [openQuestions, setOpenQuestions] =
    useState({});

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();

    return faqGroups
      .filter(
        (group) =>
          activeCategory === "all" ||
          group.id === activeCategory,
      )
      .map((group) => {
        if (!query) {
          return group;
        }

        const groupMatches =
          group.title.toLowerCase().includes(query) ||
          group.description.toLowerCase().includes(query);

        const questions = group.questions.filter(
          (item) =>
            item.question
              .toLowerCase()
              .includes(query) ||
            item.answer
              .toLowerCase()
              .includes(query),
        );

        if (groupMatches) {
          return group;
        }

        if (questions.length > 0) {
          return {
            ...group,
            questions,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [activeCategory, search]);

  const totalQuestions = faqGroups.reduce(
    (total, group) => total + group.questions.length,
    0,
  );

  const toggleQuestion = (key) => {
    setOpenQuestions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <div className="min-h-screen bg-[#f6f9fb] pb-10">
      {/* ========================================================
          HERO
      ======================================================== */}

      <section className="border-b border-border bg-[hsl(var(--brand-navy))] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex items-center gap-2 text-blue-200">
            <CircleHelp className="h-4 w-4" />

            <span className="text-[10px] font-bold uppercase tracking-[0.12em] sm:text-xs">
              LoanPro FAQ
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Frequently asked questions
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-white/70 sm:text-sm">
            Find straightforward answers about loans, applications, documents,
            EMIs, payments and your LoanPro account.
          </p>

          {/* Search */}
          <div className="relative mt-6 max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search your question..."
              className="h-12 w-full rounded-xl border border-white/10 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none shadow-lg placeholder:text-slate-400 focus:ring-2 focus:ring-white/25"
            />
          </div>

          <p className="mt-2 text-[9px] text-white/50 sm:text-[10px]">
            {totalQuestions} answers across {faqGroups.length} help categories
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            CATEGORY FILTER
        ======================================================== */}

        <section className="py-5">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => {
              const active =
                activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    setActiveCategory(category.id)
                  }
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[10px] font-bold transition sm:text-xs ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            FAQ CONTENT
        ======================================================== */}

        <div className="space-y-8">
          {filteredGroups.map((group) => (
            <FAQGroup
              key={group.id}
              group={group}
              openQuestions={openQuestions}
              toggleQuestion={toggleQuestion}
            />
          ))}
        </div>

        {/* ========================================================
            NO RESULTS
        ======================================================== */}

        {filteredGroups.length === 0 && (
          <section className="rounded-xl border border-slate-200 bg-white px-5 py-12 text-center">
            <Search className="mx-auto h-7 w-7 text-slate-300" />

            <h2 className="mt-3 text-sm font-bold text-slate-900">
              No matching questions
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Try searching with different words.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
              className="mt-3 text-xs font-bold text-primary"
            >
              Clear filters
            </button>
          </section>
        )}

        {/* ========================================================
            QUICK LINKS
        ======================================================== */}

        <section className="mt-8">
          <div className="grid gap-2.5 sm:grid-cols-3">
            <Link
              to="/help"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary/20 hover:shadow-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-4 w-4" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-slate-900">
                  Help Centre
                </span>

                <span className="mt-0.5 block text-[10px] text-muted-foreground">
                  Browse help by category
                </span>
              </span>

              <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>

            <Link
              to="/more"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary/20 hover:shadow-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Headphones className="h-4 w-4" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-slate-900">
                  Customer Support
                </span>

                <span className="mt-0.5 block text-[10px] text-muted-foreground">
                  Find support options
                </span>
              </span>

              <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>

            <Link
              to="/emi-calculator"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary/20 hover:shadow-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <WalletCards className="h-4 w-4" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-slate-900">
                  EMI Calculator
                </span>

                <span className="mt-0.5 block text-[10px] text-muted-foreground">
                  Plan your estimated repayment
                </span>
              </span>

              <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          </div>
        </section>

        {/* ========================================================
            SUPPORT CTA
        ======================================================== */}

        <section className="mt-5 pb-5">
          <div className="relative overflow-hidden rounded-2xl bg-[hsl(var(--brand-navy))] p-5 text-white shadow-sm sm:p-7">
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full border border-white/10" />

            <div className="relative max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200">
                Need more help?
              </p>

              <h2 className="mt-1.5 text-lg font-bold sm:text-xl">
                Couldn't find your answer?
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-white/65 sm:text-sm">
                Visit the Help Centre or contact support for assistance with
                your account, application or payments.
              </p>

              <Link
                to="/help"
                className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2.5 text-[10px] font-bold text-[hsl(var(--brand-navy))] sm:text-xs"
              >
                Visit Help Centre
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default FrequentlyAskedQuestions;