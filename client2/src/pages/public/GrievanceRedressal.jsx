import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Headphones,
  Info,
  Mail,
  MessageCircle,
  Scale,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";

const grievanceTypes = [
  {
    id: "loan",
    label: "Loan application",
    description: "Application handling or service experience",
    icon: FileText,
  },
  {
    id: "payment",
    label: "Payments & EMI",
    description: "Payment, repayment or account issue",
    icon: MessageCircle,
  },
  {
    id: "documents",
    label: "Documents & verification",
    description: "Document or verification related concern",
    icon: ShieldCheck,
  },
  {
    id: "service",
    label: "Service experience",
    description: "Concern about service or support",
    icon: Headphones,
  },
  {
    id: "other",
    label: "Other grievance",
    description: "Another concern requiring review",
    icon: Scale,
  },
];

const grievanceLevels = [
  {
    id: "first",
    label: "First level",
    description: "Raise your concern with LoanPro support",
  },
  {
    id: "follow-up",
    label: "Follow-up",
    description: "Follow up on an unresolved concern",
  },
];

function GrievanceRedressal() {
  const [type, setType] = useState("");
  const [level, setLevel] = useState("first");
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reference, setReference] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const selectedType = grievanceTypes.find(
    (item) => item.id === type,
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!type) {
      setShowTypeMenu(true);
      return;
    }

    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setType("");
    setLevel("first");
    setName("");
    setEmail("");
    setPhone("");
    setReference("");
    setSubject("");
    setDescription("");
    setShowTypeMenu(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f6f9fb] pb-10">
        <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[900px] items-center px-4 py-10 sm:px-6 lg:px-8">
          <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            {/* Success header */}
            <div className="bg-[hsl(var(--brand-navy))] px-5 py-8 text-center text-white sm:px-8 sm:py-10">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                <CheckCircle2 className="h-8 w-8" />
              </span>

              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200">
                Grievance registered
              </p>

              <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
                Your grievance has been received
              </h1>

              <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-white/65 sm:text-sm">
                This mockup has recorded your grievance. In the production
                application, a reference number and tracking workflow would be
                created for your request.
              </p>
            </div>

            <div className="p-5 sm:p-7">
              {/* Reference card */}
              <div className="rounded-xl border border-blue-100 bg-[#f2f8fc] p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
                      Grievance reference
                    </p>

                    <p className="mt-1 text-xl font-bold tracking-wide text-slate-900">
                      GRV-2026-00128
                    </p>
                  </div>

                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1.5 text-[9px] font-bold text-amber-700">
                    <Clock3 className="h-3 w-3" />
                    Registered
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                      Category
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-900">
                      {selectedType?.label || "Other grievance"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                      Level
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-900">
                      {
                        grievanceLevels.find(
                          (item) => item.id === level,
                        )?.label
                      }
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

              {/* Process */}
              <div className="mt-6">
                <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                  What happens next?
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      1
                    </span>

                    <p className="mt-3 text-xs font-bold text-slate-900">
                      Registration
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                      Your grievance is registered with a reference number.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                      2
                    </span>

                    <p className="mt-3 text-xs font-bold text-slate-900">
                      Review
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                      The relevant team reviews the concern and supporting
                      details.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                      3
                    </span>

                    <p className="mt-3 text-xs font-bold text-slate-900">
                      Resolution
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                      The response and resolution status can be shown here.
                    </p>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50 p-4">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                <p className="text-[10px] leading-5 text-muted-foreground sm:text-xs">
                  This screen represents the UI flow only. A live grievance
                  process should display your actual policy, escalation path,
                  service timelines and support contact details.
                </p>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-2">
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

                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-700 sm:text-xs"
                >
                  Submit another grievance
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
          HEADER
      ========================================================== */}

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
              <Scale className="h-5 w-5" />
            </span>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200 sm:text-xs">
                LoanPro Support
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Grievance Redressal
              </h1>

              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-white/70 sm:text-sm">
                Share a concern about your LoanPro experience and provide the
                details needed for review.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          {/* ========================================================
              FORM
          ======================================================== */}

          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)]"
          >
            <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                Register a grievance
              </h2>

              <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
                Provide the details below so the concern can be reviewed.
              </p>
            </div>

            <div className="space-y-5 p-4 sm:p-6">
              {/* Grievance type */}
              <div className="relative z-20">
                <label className="text-[11px] font-semibold text-slate-700 sm:text-xs">
                  What is your grievance about?
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setShowTypeMenu((current) => !current)
                  }
                  className="mt-1.5 flex h-11 w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 text-left text-xs outline-none transition hover:bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  {selectedType ? (
                    <>
                      <selectedType.icon className="h-4 w-4 text-primary" />

                      <span className="flex-1 truncate font-medium text-slate-900">
                        {selectedType.label}
                      </span>
                    </>
                  ) : (
                    <span className="flex-1 text-slate-400">
                      Select a grievance category
                    </span>
                  )}

                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      showTypeMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showTypeMenu && (
                  <div className="absolute left-0 right-0 top-[calc(100%+6px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                    {grievanceTypes.map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setType(item.id);
                            setShowTypeMenu(false);
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

              {/* Level */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 sm:text-xs">
                  Request level
                </label>

                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {grievanceLevels.map((item) => {
                    const active =
                      level === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setLevel(item.id)
                        }
                        className={`rounded-xl border p-3 text-left transition ${
                          active
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-900">
                          {item.label}
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                          {item.description}
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
                    htmlFor="grievance-name"
                    className="text-[11px] font-semibold text-slate-700 sm:text-xs"
                  >
                    Full name
                  </label>

                  <div className="relative mt-1.5">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="grievance-name"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      required
                      placeholder="Enter your name"
                      className="h-11 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="grievance-phone"
                    className="text-[11px] font-semibold text-slate-700 sm:text-xs"
                  >
                    Phone number
                  </label>

                  <input
                    id="grievance-phone"
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
                  htmlFor="grievance-email"
                  className="text-[11px] font-semibold text-slate-700 sm:text-xs"
                >
                  Email address
                </label>

                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="grievance-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:text-sm"
                  />
                </div>
              </div>

              {/* Reference */}
              <div>
                <label
                  htmlFor="grievance-reference"
                  className="text-[11px] font-semibold text-slate-700 sm:text-xs"
                >
                  Loan / application reference
                  <span className="ml-1 font-normal text-slate-400">
                    optional
                  </span>
                </label>

                <input
                  id="grievance-reference"
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
                  htmlFor="grievance-subject"
                  className="text-[11px] font-semibold text-slate-700 sm:text-xs"
                >
                  Subject
                </label>

                <input
                  id="grievance-subject"
                  value={subject}
                  onChange={(event) =>
                    setSubject(event.target.value)
                  }
                  required
                  placeholder="Briefly describe your concern"
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="grievance-description"
                    className="text-[11px] font-semibold text-slate-700 sm:text-xs"
                  >
                    Describe your grievance
                  </label>

                  <span className="text-[9px] text-muted-foreground">
                    {description.length}/1500
                  </span>
                </div>

                <textarea
                  id="grievance-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  maxLength={1500}
                  required
                  rows={7}
                  placeholder="Explain what happened, when it happened and what outcome you are looking for..."
                  className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-xs leading-5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:text-sm"
                />
              </div>

              {/* Safety note */}
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Protect your account information
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
                      Do not include passwords, OTPs, PINs or other
                      authentication credentials in your grievance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[9px] leading-4 text-muted-foreground">
                  This is a UI mockup. A production version should connect
                  this form to the actual grievance handling workflow and
                  published policy.
                </p>

                <button
                  type="submit"
                  className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-xs font-bold text-primary-foreground transition hover:bg-primary-hover sm:w-auto"
                >
                  Register grievance
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </form>

          {/* ========================================================
              SIDEBAR
          ======================================================== */}

          <aside className="space-y-4">
            {/* Overview */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" />

                <h2 className="text-sm font-bold text-slate-900">
                  Grievance process
                </h2>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    1
                  </span>

                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Raise your concern
                    </p>

                    <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                      Submit the issue with relevant details.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                    2
                  </span>

                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Review
                    </p>

                    <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                      The concern is reviewed by the appropriate team.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                    3
                  </span>

                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Response
                    </p>

                    <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                      A response or resolution can be provided through the
                      support process.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Useful links */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                Before you submit
              </p>

              <div className="mt-3 space-y-2">
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
                      Browse help topics first
                    </span>
                  </span>

                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>

                <Link
                  to="/contact-support"
                  className="group flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition hover:border-primary/20 hover:bg-slate-50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MessageCircle className="h-4 w-4" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-slate-900">
                      Contact Support
                    </span>

                    <span className="block text-[10px] text-muted-foreground">
                      General support may be more suitable
                    </span>
                  </span>

                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              </div>
            </section>

            {/* Important info */}
            <section className="rounded-2xl border border-blue-100 bg-[#edf7fc] p-4">
              <div className="flex items-start gap-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Important information
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
                    Your final production page should display the officially
                    approved grievance process, escalation contacts and
                    applicable timelines.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default GrievanceRedressal;