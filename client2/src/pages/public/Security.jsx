import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileCheck2,
  Headphones,
  LockKeyhole,
  Mail,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";
import { useState } from "react";

const securityTopics = [
  {
    id: "account",
    icon: UserRound,
    title: "Protect your account",
    description:
      "Use strong credentials and keep your sign-in information private.",
    points: [
      "Use a strong, unique password for your LoanPro account.",
      "Never share your password with another person.",
      "Avoid signing in from devices you do not trust.",
      "Sign out when using a shared device.",
    ],
  },
  {
    id: "verification",
    icon: ShieldCheck,
    title: "Protect verification details",
    description:
      "Keep authentication and verification information private.",
    points: [
      "Never share an OTP with anyone.",
      "Do not share account PINs or passwords.",
      "Do not approve an unexpected authentication request.",
      "Contact support if you suspect your account has been compromised.",
    ],
  },
  {
    id: "payments",
    icon: CreditCard,
    title: "Stay safe with payments",
    description:
      "Use trusted payment flows when managing your loan repayments.",
    points: [
      "Use the payment options provided through the LoanPro experience.",
      "Check the payment details before confirming a transaction.",
      "Do not share card PINs, CVVs or authentication codes.",
      "Keep payment confirmations for your records.",
    ],
  },
  {
    id: "documents",
    icon: FileCheck2,
    title: "Handle documents carefully",
    description:
      "Take care when submitting personal or supporting documents.",
    points: [
      "Upload documents only through the intended application flow.",
      "Avoid sending sensitive documents through unofficial channels.",
      "Check that documents are being submitted to the correct application.",
      "Contact support if you suspect a document has been misused.",
    ],
  },
];

const securityFaqs = [
  {
    question: "Will LoanPro ask for my password or OTP?",
    answer:
      "You should never share passwords, OTPs, PINs, CVVs or other authentication credentials with a support representative or another person.",
  },
  {
    question: "What should I do if I receive a suspicious message?",
    answer:
      "Do not share information, click unfamiliar links or approve unexpected requests. Use official LoanPro support channels to report the concern.",
  },
  {
    question: "What should I do if I think my account is compromised?",
    answer:
      "Secure your account as soon as possible and contact support so the issue can be reviewed.",
  },
  {
    question: "How can I identify a safe LoanPro interaction?",
    answer:
      "Use the official LoanPro website or application and avoid instructions asking for passwords, OTPs, PINs or other authentication credentials.",
  },
];

function Security() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTopic, setActiveTopic] = useState("account");

  const selectedTopic =
    securityTopics.find(
      (item) => item.id === activeTopic,
    ) || securityTopics[0];

  return (
    <div className="min-h-screen bg-[#f6f9fb] pb-10">
      {/* ==========================================================
          HERO
      ========================================================== */}

      <section className="relative overflow-hidden bg-[hsl(var(--brand-navy))] px-4 py-8 text-white sm:px-6 sm:py-11 lg:px-8 lg:py-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1100px]">
          <Link
            to="/more"
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-blue-200 transition hover:text-white sm:text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to More
          </Link>

          <div className="mt-4 flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <ShieldCheck className="h-5 w-5" />
            </span>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200 sm:text-xs">
                LoanPro Security
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Keep your account and information protected.
              </h1>

              <p className="mt-2 max-w-2xl text-xs leading-6 text-white/70 sm:text-sm">
                Learn how to stay safe when using LoanPro, applying for a loan,
                submitting documents and making payments.
              </p>
            </div>
          </div>

          {/* Security status */}
          <div className="mt-6 flex max-w-2xl items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur-sm sm:p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
            </span>

            <div>
              <p className="text-xs font-bold">
                Security starts with you
              </p>

              <p className="mt-0.5 text-[10px] leading-4 text-white/60 sm:text-xs">
                Keep your account credentials private and use official LoanPro
                channels when accessing your account.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        {/* ==========================================================
            QUICK RULES
        ========================================================== */}

        <section className="py-6 sm:py-8">
          <div className="grid gap-2.5 sm:grid-cols-3">
            <SecurityRule
              icon={LockKeyhole}
              title="Keep credentials private"
              text="Never share passwords, OTPs or PINs."
            />

            <SecurityRule
              icon={ShieldAlert}
              title="Verify unexpected requests"
              text="Do not approve unfamiliar requests."
            />

            <SecurityRule
              icon={Smartphone}
              title="Use trusted devices"
              text="Keep your account access secure."
            />
          </div>
        </section>

        {/* ==========================================================
            SECURITY TOPICS
        ========================================================== */}

        <section className="border-t border-border py-7 sm:py-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
              Security topics
            </p>

            <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              Protect every part of your journey
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-muted-foreground sm:text-xs">
              Select a topic to see practical security guidance.
            </p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[280px_1fr]">
            {/* Topic selector */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              {securityTopics.map((topic) => {
                const Icon = topic.icon;
                const active = topic.id === activeTopic;

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() =>
                      setActiveTopic(topic.id)
                    }
                    className={`flex w-full items-center gap-3 border-b border-slate-100 p-3.5 text-left transition last:border-b-0 ${
                      active
                        ? "bg-primary/[0.05]"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon
                        className="h-4 w-4"
                        strokeWidth={1.8}
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold text-slate-900">
                        {topic.title}
                      </span>

                      <span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">
                        {topic.description}
                      </span>
                    </span>

                    <ChevronRight
                      className={`h-4 w-4 shrink-0 ${
                        active
                          ? "text-primary"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Selected topic */}
            <article className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <selectedTopic.icon
                    className="h-[18px] w-[18px]"
                    strokeWidth={1.8}
                  />
                </span>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
                    Security guidance
                  </p>

                  <h3 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">
                    {selectedTopic.title}
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-muted-foreground sm:text-xs">
                    {selectedTopic.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {selectedTopic.points.map(
                  (point) => (
                    <div
                      key={point}
                      className="flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                      <p className="text-xs leading-5 text-slate-700 sm:text-sm">
                        {point}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </article>
          </div>
        </section>

        {/* ==========================================================
            NEVER SHARE
        ========================================================== */}

        <section className="border-y border-red-100 bg-[#fff8f7] px-4 py-7 sm:px-6 sm:py-8 lg:-mx-8 lg:px-8">
          <div className="mx-auto max-w-[1100px]">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <ShieldAlert className="h-5 w-5" />
              </span>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-red-600">
                  Important
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                  Never share sensitive credentials
                </h2>

                <p className="mt-1 text-[10px] leading-5 text-muted-foreground sm:text-xs">
                  Keep authentication and payment credentials private,
                  even when someone claims to be helping you.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                "Password",
                "OTP",
                "PIN",
                "CVV",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-red-100 bg-white p-3"
                >
                  <XMark />
                  <span className="text-xs font-bold text-slate-800">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================
            SUSPICIOUS ACTIVITY
        ========================================================== */}

        <section className="py-7 sm:py-8">
          <div className="rounded-2xl border border-amber-100 bg-[#fff9ed] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700">
                  See something suspicious?
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                  Take action quickly.
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">
                  If you notice unexpected account activity, suspicious
                  communication or an unfamiliar request, secure your account
                  and contact support through an official LoanPro channel.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/contact-support"
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-[10px] font-bold text-primary-foreground sm:text-xs"
                  >
                    Contact Support
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    to="/report-issue"
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-700 sm:text-xs"
                  >
                    Report an Issue
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================
            FAQ
        ========================================================== */}

        <section className="border-t border-border py-7 sm:py-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
              Security FAQ
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
              Common security questions
            </h2>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {securityFaqs.map((faq, index) => {
              const open = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(
                        open ? null : index,
                      )
                    }
                    className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50 sm:px-5"
                    aria-expanded={open}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </span>

                    <span className="min-w-0 flex-1 text-xs font-bold text-slate-900 sm:text-sm">
                      {faq.question}
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
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ==========================================================
            QUICK LINKS
        ========================================================== */}

        <section className="pb-7">
          <div className="grid gap-2.5 sm:grid-cols-3">
            <Link
              to="/help"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary/20 hover:shadow-sm"
            >
              <Headphones className="h-4 w-4 text-primary" />

              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-slate-900">
                  Help Centre
                </span>

                <span className="block mt-0.5 text-[10px] text-muted-foreground">
                  Get help with LoanPro
                </span>
              </span>

              <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>

            <Link
              to="/faq"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary/20 hover:shadow-sm"
            >
              <MessageCircle className="h-4 w-4 text-primary" />

              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-slate-900">
                  Security FAQs
                </span>

                <span className="block mt-0.5 text-[10px] text-muted-foreground">
                  Find common answers
                </span>
              </span>

              <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>

            <Link
              to="/contact-support"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary/20 hover:shadow-sm"
            >
              <Mail className="h-4 w-4 text-primary" />

              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-slate-900">
                  Contact Support
                </span>

                <span className="block mt-0.5 text-[10px] text-muted-foreground">
                  Report a security concern
                </span>
              </span>

              <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function SecurityRule({ icon: Icon, title, text }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </span>

      <h3 className="mt-3 text-xs font-bold text-slate-900 sm:text-sm">
        {title}
      </h3>

      <p className="mt-1 text-[10px] leading-4 text-muted-foreground sm:text-xs">
        {text}
      </p>
    </div>
  );
}

function XMark() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-black text-red-600">
      ×
    </span>
  );
}

export default Security;