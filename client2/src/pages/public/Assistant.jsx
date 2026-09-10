import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  Headphones,
  Landmark,
  MessageCircle,
  Send,
  Sparkles,
  User,
  WalletCards,
} from "lucide-react";

const QUICK_ACTIONS = [
  {
    id: "status",
    label: "Check application status",
    icon: CheckCircle2,
    prompt: "What is my loan application status?",
  },
  {
    id: "emi",
    label: "EMI & repayment",
    icon: WalletCards,
    prompt: "How can I check my EMI and repayment details?",
  },
  {
    id: "documents",
    label: "Required documents",
    icon: FileCheck2,
    prompt: "What documents are required for my loan?",
  },
  {
    id: "kyc",
    label: "KYC help",
    icon: Landmark,
    prompt: "I need help with my KYC.",
  },
  {
    id: "eligibility",
    label: "Loan eligibility",
    icon: CheckCircle2,
    prompt: "How can I check my loan eligibility?",
  },
  {
    id: "support",
    label: "Talk to support",
    icon: Headphones,
    prompt: "I want to talk to a support person.",
  },
];

const MOCK_REPLIES = {
  "what is my loan application status":
    "You can check your latest loan application from your Dashboard. Open My Applications to see the current status and application details. For account-specific status information, I'll be connected to your live application data in the production version.",

  "how can i check my emi and repayment details":
    "Once your loan is disbursed, your EMI schedule will be available from your loan details page. You can view your EMI amount, due dates, outstanding balance and repayment history there.",

  "what documents are required for my loan":
    "Required documents depend on the loan type. Typically, LoanPro may ask for identity proof, address proof, bank details and loan-specific documents. Your application will show the exact documents required for your selected loan.",

  "i need help with my kyc":
    "For KYC, make sure the information you provide matches your identity documents. If a document is rejected, check the reason shown in your application and upload a clear, valid document.",

  "how can i check my loan eligibility":
    "Loan eligibility depends on factors such as the selected loan product, loan amount, tenure and the eligibility rules configured for that product. Start an application to see the applicable requirements.",

  "i want to talk to a support person":
    "Of course. If you need help from a person, you can contact the LoanPro support team using the Help & Support page.",
};

const DEFAULT_REPLY =
  "I can help you with LoanPro questions about applications, EMIs, documents, KYC and loan eligibility. Try one of the quick options above or type your question.";

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findReply(text) {
  const normalized = normalizeText(text);

  for (const [question, reply] of Object.entries(MOCK_REPLIES)) {
    if (normalized.includes(question) || question.includes(normalized)) {
      return reply;
    }
  }

  if (normalized.includes("status") || normalized.includes("application")) {
    return MOCK_REPLIES["what is my loan application status"];
  }

  if (normalized.includes("emi") || normalized.includes("repayment")) {
    return MOCK_REPLIES["how can i check my emi and repayment details"];
  }

  if (normalized.includes("document") || normalized.includes("documents")) {
    return MOCK_REPLIES["what documents are required for my loan"];
  }

  if (normalized.includes("kyc") || normalized.includes("verification")) {
    return MOCK_REPLIES["i need help with my kyc"];
  }

  if (normalized.includes("eligible") || normalized.includes("eligibility")) {
    return MOCK_REPLIES["how can i check my loan eligibility"];
  }

  if (
    normalized.includes("support") ||
    normalized.includes("human") ||
    normalized.includes("person")
  ) {
    return MOCK_REPLIES["i want to talk to a support person"];
  }

  return DEFAULT_REPLY;
}

function AssistantMessage({ message }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
        <Bot className="size-4" />
      </div>

      <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-border bg-surface px-4 py-3 text-sm leading-6 text-foreground shadow-sm">
        {message.text}
      </div>
    </div>
  );
}

function UserMessage({ message }) {
  return (
    <div className="flex items-start justify-end gap-3">
      <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground shadow-sm">
        {message.text}
      </div>

      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
        <User className="size-4" />
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
        <Bot className="size-4" />
      </div>

      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-border bg-surface px-4 py-3 shadow-sm">
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
      </div>
    </div>
  );
}

function Assistant() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I'm LoanPro Assistant. I can help you with loan applications, EMIs, documents, KYC and eligibility.",
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  function sendMessage(text) {
    const value = text.trim();

    if (!value || typing) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: value,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setTyping(true);

    window.setTimeout(() => {
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: findReply(value),
      };

      setMessages((previous) => [...previous, assistantMessage]);
      setTyping(false);
    }, 900);
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="min-h-dvh bg-background">
      {/* =========================================================
          PAGE HEADER
      ========================================================== */}
      <section className="border-b border-border bg-primary">
        <div className="mx-auto max-w-6xl px-4 py-5 md:px-6 md:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-foreground text-primary shadow-sm">
                <Bot className="size-5" strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-lg font-bold tracking-tight text-primary-foreground">
                    LoanPro Assistant
                  </h1>

                  <span className="hidden items-center gap-1 rounded-full bg-primary-foreground/10 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground/80 sm:flex">
                    <Sparkles className="size-3" />
                    AI Support
                  </span>
                </div>

                <p className="mt-0.5 truncate text-xs text-primary-foreground/70">
                  Help with your loans, EMIs and applications
                </p>
              </div>
            </div>

            <Link
              to="/help"
              className="hidden shrink-0 items-center gap-2 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/15 sm:flex"
            >
              <Headphones className="size-4" />
              Support
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}
      <main className="mx-auto w-full max-w-6xl px-4 pb-8 md:px-6 md:pb-10">

        <div className="mt-5 grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* =====================================================
              QUICK ACTIONS
          ====================================================== */}
          <aside className="order-2 lg:order-1">
            <div className="lg:sticky lg:top-24">
              <div className="mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Quick help
                </p>

                <h2 className="mt-1 text-base font-bold text-foreground">
                  What can we help with?
                </h2>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.id}
                      type="button"
                      disabled={typing}
                      onClick={() => sendMessage(action.prompt)}
                      className="group flex w-full items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 text-left transition-all hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-sm disabled:pointer-events-none disabled:opacity-50"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="size-4" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold text-foreground">
                          {action.label}
                        </span>
                      </span>

                      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <Headphones className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Need a person?
                    </p>

                    <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                      Our support team can help with account-specific issues.
                    </p>

                    <Link
                      to="/help"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Contact support
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* =====================================================
              CHAT
          ====================================================== */}
          <section className="order-1 min-w-0 lg:order-2">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              {/* Chat header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3 md:px-5">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
                      <MessageCircle className="size-4" />
                    </div>

                    <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      LoanPro Assistant
                    </p>

                    <p className="text-[11px] text-muted-foreground">
                      Available to help
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Online
                </span>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="h-[52vh] min-h-[380px] max-h-[620px] space-y-4 overflow-y-auto p-4 md:p-5"
                aria-live="polite"
                aria-label="LoanPro assistant conversation"
              >
                {messages.map((message) =>
                  message.role === "user" ? (
                    <UserMessage key={message.id} message={message} />
                  ) : (
                    <AssistantMessage key={message.id} message={message} />
                  ),
                )}

                {typing ? <TypingIndicator /> : null}
              </div>

              {/* Input */}
              <div className="border-t border-border bg-muted/20 p-3 md:p-4">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-end gap-2 rounded-xl border border-border bg-card p-2 shadow-sm transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
                    <textarea
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={typing}
                      placeholder="Ask about your loan, EMI, KYC..."
                      rows={1}
                      className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
                      aria-label="Ask LoanPro Assistant"
                    />

                    <button
                      type="submit"
                      disabled={!input.trim() || typing}
                      aria-label="Send message"
                      className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
                    >
                      <Send className="size-4" />
                    </button>
                  </div>

                  <p className="mt-2 px-1 text-[10px] text-muted-foreground">
                    Press Enter to send · Shift + Enter for a new line
                  </p>
                </form>
              </div>
            </div>

            {/* Suggested questions */}
            {messages.length === 1 ? (
              <div className="mt-5">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />

                  <h2 className="text-sm font-semibold text-foreground">
                    Popular questions
                  </h2>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    "What documents do I need?",
                    "How can I check my loan status?",
                    "How does EMI repayment work?",
                    "How do I complete KYC?",
                  ].map((question) => (
                    <button
                      key={question}
                      type="button"
                      disabled={typing}
                      onClick={() => sendMessage(question)}
                      className="rounded-xl border border-border bg-card px-3.5 py-3 text-left text-xs font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary/[0.03] disabled:pointer-events-none disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Human support */}
            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <Headphones className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Prefer talking to a person?
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Get help from the LoanPro support team.
                  </p>
                </div>
              </div>

              <Link
                to="/help"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border-strong px-3 text-xs font-semibold text-primary transition-colors hover:bg-muted"
              >
                <Headphones className="size-3.5" />
                Talk to support
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Assistant;
