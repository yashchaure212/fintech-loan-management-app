import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileText,
  Headphones,
  Mail,
  MessageCircle,
  Phone,
  Receipt,
  ShieldCheck,
  User,
  WalletCards,
  X,
} from "lucide-react";

const topics = [
  {
    id: "application",
    label: "Loan application",
    description: "Application, status or next steps",
    icon: FileText,
  },
  {
    id: "payment",
    label: "EMI & payments",
    description: "Payments, schedules or history",
    icon: WalletCards,
  },
  {
    id: "documents",
    label: "Documents & KYC",
    description: "Upload, verification or correction",
    icon: ShieldCheck,
  },
  {
    id: "account",
    label: "Account & login",
    description: "Profile, password or access",
    icon: User,
  },
  {
    id: "technical",
    label: "Technical issue",
    description: "Something is not working correctly",
    icon: CircleHelp,
  },
];

const contactMethods = [
  {
    id: "chat",
    label: "Chat",
    description: "Get help through chat",
    icon: MessageCircle,
  },
  {
    id: "email",
    label: "Email",
    description: "Receive a response by email",
    icon: Mail,
  },
  {
    id: "call",
    label: "Call",
    description: "Talk to customer support",
    icon: Phone,
  },
];

function ContactSupport() {
  const [topic, setTopic] = useState("");
  const [contactMethod, setContactMethod] = useState("email");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showTopicMenu, setShowTopicMenu] = useState(false);

  const selectedTopic = topics.find(
    (item) => item.id === topic,
  );

  const selectedMethod = contactMethods.find(
    (item) => item.id === contactMethod,
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setTopic("");
    setContactMethod("email");
    setSubject("");
    setMessage("");
    setName("");
    setEmail("");
    setPhone("");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f6f9fb]">
        <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[900px] items-center px-4 py-10 sm:px-6 lg:px-8">
          <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="bg-[hsl(var(--brand-navy))] px-5 py-7 text-center text-white sm:px-8 sm:py-9">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                <CheckCircle2 className="h-7 w-7" />
              </span>

              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200">
                Support request
              </p>

              <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
                Request received
              </h1>

              <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-white/65 sm:text-sm">
                Your support request has been recorded in this mockup. In the
                real app, this would be sent to the LoanPro support system.
              </p>
            </div>

            <div className="p-5 sm:p-7">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-[#f8fbfd] p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    Topic
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-900">
                    {selectedTopic?.label || "General support"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-[#f8fbfd] p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    Contact
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-900">
                    {selectedMethod?.label || "Email"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-[#f8fbfd] p-4">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    Request
                  </p>

                  <p className="mt-1 truncate text-xs font-bold text-slate-900">
                    {subject || "Support request"}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      What happens next?
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-muted-foreground sm:text-xs">
                      A real implementation could create a support ticket and
                      show its status here so customers can follow the request.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  to="/help"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-[10px] font-bold text-primary-foreground sm:text-xs"
                >
                  Visit Help Centre
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-700 sm:text-xs"
                >
                  Submit another request
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f9fb] pb-10">
      {/* ==========================================================
          HERO
      ========================================================== */}

      <section className="border-b border-border bg-[hsl(var(--brand-navy))] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex items-center gap-2 text-blue-200">
            <Headphones className="h-4 w-4" />

            <span className="text-[10px] font-bold uppercase tracking-[0.12em] sm:text-xs">
              LoanPro Support
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            How can we help?
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-white/70 sm:text-sm">
            Tell us what you need help with and we'll guide you to the right
            support option.
          </p>
        </div>
      </section>

      <main className="mx-auto grid max-w-[1100px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        {/* ========================================================
            FORM
        ======================================================== */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)]"
        >
          <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              Contact support
            </h2>

            <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
              Fill in the details below so we can understand your request.
            </p>
          </div>

          <div className="space-y-5 p-4 sm:p-6">
            {/* Topic */}

            <div>
              <label className="text-[11px] font-semibold text-slate-700 sm:text-xs">
                What do you need help with?
              </label>

              <div className="relative mt-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setShowTopicMenu((current) => !current)
                  }
                  className="flex h-11 w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 text-left text-xs outline-none transition hover:bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  {selectedTopic ? (
                    <>
                      <selectedTopic.icon className="h-4 w-4 text-primary" />

                      <span className="flex-1 truncate text-slate-900">
                        {selectedTopic.label}
                      </span>
                    </>
                  ) : (
                    <>
                      <CircleHelp className="h-4 w-4 text-slate-400" />

                      <span className="flex-1 text-slate-400">
                        Select a topic
                      </span>
                    </>
                  )}

                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {showTopicMenu && (
                  <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                    {topics.map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setTopic(item.id);
                            setShowTopicMenu(false);
                          }}
                          className="flex w-full items-center gap-3 border-b border-slate-100 px-3 py-3 text-left transition last:border-b-0 hover:bg-slate-50"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </span>

                          <span className="min-w-0">
                            <span className="block text-xs font-semibold text-slate-900">
                              {item.label}
                            </span>

                            <span className="mt-0.5 block text-[10px] text-muted-foreground">
                              {item.description}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Contact method */}

            <div>
              <label className="text-[11px] font-semibold text-slate-700 sm:text-xs">
                How would you like us to contact you?
              </label>

              <div className="mt-2 grid grid-cols-3 gap-2">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  const active =
                    contactMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() =>
                        setContactMethod(method.id)
                      }
                      className={`rounded-xl border p-3 text-left transition ${
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>

                      <p className="mt-2 text-[10px] font-bold text-slate-900 sm:text-xs">
                        {method.label}
                      </p>

                      <p className="mt-0.5 hidden text-[9px] leading-4 text-muted-foreground sm:block">
                        {method.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personal details */}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="support-name"
                  className="text-[11px] font-semibold text-slate-700 sm:text-xs"
                >
                  Full name
                </label>

                <input
                  id="support-name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your name"
                  required
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="support-phone"
                  className="text-[11px] font-semibold text-slate-700 sm:text-xs"
                >
                  Phone number
                </label>

                <input
                  id="support-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="Enter your phone"
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:text-sm"
                />
              </div>
            </div>

            {/* Email */}

            <div>
              <label
                htmlFor="support-email"
                className="text-[11px] font-semibold text-slate-700 sm:text-xs"
              >
                Email address
              </label>

              <input
                id="support-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                required
                className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:text-sm"
              />
            </div>

            {/* Subject */}

            <div>
              <label
                htmlFor="support-subject"
                className="text-[11px] font-semibold text-slate-700 sm:text-xs"
              >
                Subject
              </label>

              <input
                id="support-subject"
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value)
                }
                placeholder="Briefly describe your issue"
                required
                className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:text-sm"
              />
            </div>

            {/* Message */}

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="support-message"
                  className="text-[11px] font-semibold text-slate-700 sm:text-xs"
                >
                  Describe your issue
                </label>

                <span className="text-[9px] text-muted-foreground">
                  {message.length}/500
                </span>
              </div>

              <textarea
                id="support-message"
                value={message}
                maxLength={500}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Tell us what happened and how we can help..."
                required
                rows={5}
                className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-xs leading-5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:text-sm"
              />
            </div>

            {/* Submit */}

            <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[9px] leading-4 text-muted-foreground sm:max-w-sm">
                This is a UI mockup. In the production implementation,
                submitting this form would create a support request.
              </p>

              <button
                type="submit"
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-5 text-xs font-bold text-primary-foreground transition hover:bg-primary-hover"
              >
                Submit request
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </form>

        {/* ========================================================
            RIGHT SIDE
        ======================================================== */}

        <aside className="space-y-4">
          {/* Quick support */}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
              Quick support
            </p>

            <h2 className="mt-1 text-base font-bold text-slate-900">
              Looking for an answer?
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-muted-foreground sm:text-xs">
              Check our help resources before submitting a support request.
            </p>

            <div className="mt-4 space-y-2">
              <Link
                to="/help"
                className="group flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition hover:border-primary/20 hover:bg-slate-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Headphones className="h-4 w-4" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-slate-900">
                    Help Centre
                  </span>

                  <span className="block text-[10px] text-muted-foreground">
                    Browse help topics
                  </span>
                </span>

                <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>

              <Link
                to="/faq"
                className="group flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition hover:border-primary/20 hover:bg-slate-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CircleHelp className="h-4 w-4" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-slate-900">
                    FAQs
                  </span>

                  <span className="block text-[10px] text-muted-foreground">
                    Find common answers
                  </span>
                </span>

                <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </div>
          </section>

          {/* Support channels */}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-primary" />

              <h2 className="text-sm font-bold text-slate-900">
                Support options
              </h2>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <MessageCircle className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Chat support
                  </p>

                  <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                    Available in the support experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Mail className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Email support
                  </p>

                  <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                    Send a detailed request through this form.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <Phone className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Phone support
                  </p>

                  <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                    Connect this to your real support number later.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Helpful note */}

          <section className="rounded-2xl border border-[#d8e7ef] bg-[#edf7fc] p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

              <div>
                <p className="text-xs font-bold text-slate-900">
                  Never share sensitive credentials
                </p>

                <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
                  Do not share your password, OTP or other account security
                  credentials through a support request.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </main>

      {/* Close topic dropdown when needed */}
      {showTopicMenu && (
        <button
          type="button"
          aria-label="Close topic menu"
          onClick={() => setShowTopicMenu(false)}
          className="fixed inset-0 z-20 cursor-default bg-transparent"
        />
      )}
    </div>
  );
}

export default ContactSupport;