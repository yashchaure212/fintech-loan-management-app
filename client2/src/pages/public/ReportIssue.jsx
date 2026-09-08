import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileText,
  ImagePlus,
  Info,
  ShieldAlert,
  Smartphone,
  Upload,
  X,
} from "lucide-react";

const issueTypes = [
  {
    id: "application",
    label: "Loan application issue",
    description: "Something is wrong with your application",
    icon: FileText,
  },
  {
    id: "payment",
    label: "Payment issue",
    description: "Payment failed, delayed or incorrect",
    icon: AlertCircle,
  },
  {
    id: "document",
    label: "Document upload issue",
    description: "Unable to upload or submit a document",
    icon: Upload,
  },
  {
    id: "account",
    label: "Account or login issue",
    description: "Problems accessing your account",
    icon: ShieldAlert,
  },
  {
    id: "technical",
    label: "Technical issue",
    description: "Something on the app is not working",
    icon: Smartphone,
  },
  {
    id: "other",
    label: "Other issue",
    description: "Something else you'd like to report",
    icon: Info,
  },
];

const priorities = [
  {
    value: "low",
    label: "Low",
    description: "General issue or minor problem",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Issue is affecting my journey",
  },
  {
    value: "high",
    label: "High",
    description: "Issue is blocking an important step",
  },
];

function ReportIssue() {
  const [issueType, setIssueType] = useState("");
  const [priority, setPriority] = useState("medium");
  const [reference, setReference] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [showIssueTypes, setShowIssueTypes] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attachment, setAttachment] = useState(null);

  const selectedIssue = issueTypes.find(
    (item) => item.id === issueType,
  );

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setAttachment(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!issueType) {
      setShowIssueTypes(true);
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f6f9fb] pb-10">
        <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[850px] items-center px-4 py-10 sm:px-6 lg:px-8">
          <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="bg-[hsl(var(--brand-navy))] px-5 py-8 text-center text-white sm:px-8 sm:py-10">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                <CheckCircle2 className="h-8 w-8" />
              </span>

              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200">
                Issue report
              </p>

              <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
                Issue reported successfully
              </h1>

              <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-white/65 sm:text-sm">
                Your issue has been recorded in this UI mockup. A production
                implementation would create a support ticket and provide a
                reference number.
              </p>
            </div>

            <div className="p-5 sm:p-7">
              {/* Ticket preview */}
              <div className="rounded-xl border border-blue-100 bg-[#f3f9fc] p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
                      Mock ticket
                    </p>

                    <p className="mt-1 text-lg font-bold tracking-wide text-slate-900">
                      LP-2026-00124
                    </p>
                  </div>

                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold text-amber-700">
                    Under review
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                      Issue
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-900">
                      {selectedIssue?.label || "Other issue"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                      Priority
                    </p>

                    <p className="mt-1 text-xs font-semibold capitalize text-slate-900">
                      {priority}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                      Contact
                    </p>

                    <p className="mt-1 truncate text-xs font-semibold text-slate-900">
                      {email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-5">
                <h2 className="text-sm font-bold text-slate-900">
                  What happens next?
                </h2>

                <div className="mt-3 space-y-3">
                  <div className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />

                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        Issue received
                      </p>

                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        Your report has been recorded.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300" />

                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        Review
                      </p>

                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        The support team reviews the reported issue.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300" />

                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        Resolution
                      </p>

                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        Status and resolution details can appear here.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  to="/help"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-[10px] font-bold text-primary-foreground sm:text-xs"
                >
                  Visit Help Centre
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  to="/contact-support"
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-700 sm:text-xs"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f9fb] pb-10">
      {/* Header */}
      <section className="border-b border-border bg-[hsl(var(--brand-navy))] px-4 py-7 text-white sm:px-6 sm:py-9 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <Link
            to="/help"
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-blue-200 transition hover:text-white sm:text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Help Centre
          </Link>

          <div className="mt-4 flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <ShieldAlert className="h-5 w-5" />
            </span>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200 sm:text-xs">
                LoanPro Support
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Report an issue
              </h1>

              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-white/70 sm:text-sm">
                Tell us about something that isn't working correctly so it can
                be reviewed and resolved.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-[1100px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_310px] lg:px-8">
        {/* ========================================================
            FORM
        ======================================================== */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)]"
        >
          <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              Tell us what went wrong
            </h2>

            <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
              Include enough detail for the issue to be understood and
              investigated.
            </p>
          </div>

          <div className="space-y-5 p-4 sm:p-6">
            {/* Issue type */}

            <div className="relative z-30">
              <label className="text-[11px] font-semibold text-slate-700 sm:text-xs">
                Issue type
              </label>

              <button
                type="button"
                onClick={() =>
                  setShowIssueTypes((current) => !current)
                }
                className={`mt-1.5 flex h-11 w-full items-center gap-3 rounded-lg border bg-white px-3 text-left text-xs outline-none transition ${
                  issueType
                    ? "border-primary"
                    : "border-slate-200"
                }`}
              >
                {selectedIssue ? (
                  <>
                    <selectedIssue.icon className="h-4 w-4 text-primary" />

                    <span className="flex-1 truncate font-medium text-slate-900">
                      {selectedIssue.label}
                    </span>
                  </>
                ) : (
                  <span className="flex-1 text-slate-400">
                    Select the type of issue
                  </span>
                )}

                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    showIssueTypes ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showIssueTypes && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  {issueTypes.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setIssueType(item.id);
                          setShowIssueTypes(false);
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

            {/* Priority */}

            <div>
              <label className="text-[11px] font-semibold text-slate-700 sm:text-xs">
                Priority
              </label>

              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {priorities.map((item) => {
                  const active =
                    priority === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        setPriority(item.value)
                      }
                      className={`rounded-xl border p-3 text-left transition ${
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            item.value === "high"
                              ? "bg-red-500"
                              : item.value === "medium"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }`}
                        />

                        <span className="text-xs font-bold text-slate-900">
                          {item.label}
                        </span>
                      </span>

                      <p className="mt-1 text-[9px] leading-4 text-muted-foreground">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reference */}

            <div>
              <label
                htmlFor="reference"
                className="text-[11px] font-semibold text-slate-700 sm:text-xs"
              >
                Application / reference number
                <span className="ml-1 font-normal text-slate-400">
                  optional
                </span>
              </label>

              <input
                id="reference"
                value={reference}
                onChange={(event) =>
                  setReference(event.target.value)
                }
                placeholder="Example: LP-APP-12345"
                className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:text-sm"
              />
            </div>

            {/* Subject */}

            <div>
              <label
                htmlFor="subject"
                className="text-[11px] font-semibold text-slate-700 sm:text-xs"
              >
                Subject
              </label>

              <input
                id="subject"
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value)
                }
                required
                placeholder="Briefly describe the issue"
                className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:text-sm"
              />
            </div>

            {/* Description */}

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="description"
                  className="text-[11px] font-semibold text-slate-700 sm:text-xs"
                >
                  What happened?
                </label>

                <span className="text-[9px] text-muted-foreground">
                  {description.length}/1000
                </span>
              </div>

              <textarea
                id="description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                maxLength={1000}
                required
                rows={6}
                placeholder="Describe what you were trying to do, what happened, and any message you saw..."
                className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-xs leading-5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:text-sm"
              />
            </div>

            {/* Attachment */}

            <div>
              <p className="text-[11px] font-semibold text-slate-700 sm:text-xs">
                Add a screenshot
                <span className="ml-1 font-normal text-slate-400">
                  optional
                </span>
              </p>

              <label
                htmlFor="issue-attachment"
                className="mt-1.5 flex min-h-[90px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-center transition hover:border-primary/40 hover:bg-primary/[0.02]"
              >
                <ImagePlus className="h-5 w-5 text-slate-400" />

                <p className="mt-2 text-[10px] font-semibold text-slate-700 sm:text-xs">
                  Upload a screenshot
                </p>

                <p className="mt-0.5 text-[9px] text-muted-foreground">
                  PNG or JPG
                </p>

                <input
                  id="issue-attachment"
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {attachment && (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <ImagePlus className="h-4 w-4 shrink-0 text-primary" />

                  <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-slate-700">
                    {attachment.name}
                  </span>

                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Remove attachment"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="text-[11px] font-semibold text-slate-700 sm:text-xs"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                placeholder="you@example.com"
                className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:text-sm"
              />
            </div>

            {/* Submit */}

            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />

                <p className="text-[9px] leading-4 text-muted-foreground">
                  Never include your password, OTP, PIN or other sensitive
                  account credentials in an issue report.
                </p>
              </div>

              <button
                type="submit"
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-xs font-bold text-primary-foreground transition hover:bg-primary-hover sm:w-auto"
              >
                Submit issue
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </form>

        {/* ========================================================
            SIDEBAR
        ======================================================== */}

        <aside className="space-y-4">
          {/* Before reporting */}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
              Before reporting
            </p>

            <h2 className="mt-1 text-sm font-bold text-slate-900">
              Quick things to check
            </h2>

            <div className="mt-3 space-y-3">
              {[
                "Refresh the page and try again.",
                "Check your internet connection.",
                "Make sure the required fields are complete.",
                "Check the Help Centre for a known solution.",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-2"
                >
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[8px] font-bold text-primary">
                    {index + 1}
                  </span>

                  <p className="text-[10px] leading-4 text-muted-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Support */}

          <section className="rounded-2xl border border-blue-100 bg-[#edf7fc] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
              Need help now?
            </p>

            <h2 className="mt-1 text-sm font-bold text-slate-900">
              Talk to support
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
              For general questions, the Help Centre or Contact Support page
              may be a better place to start.
            </p>

            <div className="mt-3 flex flex-col gap-2">
              <Link
                to="/contact-support"
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2.5 text-[10px] font-bold text-primary-foreground"
              >
                Contact Support
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                to="/faq"
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2.5 text-[10px] font-bold text-slate-700"
              >
                View FAQs
              </Link>
            </div>
          </section>

          {/* Security */}

          <section className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

              <div>
                <p className="text-xs font-bold text-slate-900">
                  Keep your information safe
                </p>

                <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
                  Support teams should never ask you to share passwords, OTPs,
                  PINs or other authentication credentials.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}

export default ReportIssue;