import {
  ArrowLeft,
  Bell,
  BellOff,
  CheckCircle2,
  ChevronRight,
  Mail,
  MessageSquare,
  Moon,
  Save,
  ShieldCheck,
  Smartphone,
  WalletCards,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const notificationGroups = [
  {
    id: "application",
    title: "Application updates",
    description: "Stay informed about your loan application journey.",
    icon: FileTextIcon,
    items: [
      {
        id: "application-status",
        title: "Application status",
        description: "Updates when your application moves to another stage.",
        email: true,
        sms: true,
        push: true,
      },
      {
        id: "document-updates",
        title: "Document updates",
        description: "Notifications about document requests, corrections, or verification.",
        email: true,
        sms: false,
        push: true,
      },
      {
        id: "application-reminders",
        title: "Application reminders",
        description: "Reminders when an application needs your attention.",
        email: true,
        sms: false,
        push: true,
      },
    ],
  },
  {
    id: "payments",
    title: "Payments & EMIs",
    description: "Receive important repayment and payment-related alerts.",
    icon: WalletCards,
    items: [
      {
        id: "payment-due",
        title: "Payment due reminders",
        description: "Reminders before a scheduled repayment date.",
        email: true,
        sms: true,
        push: true,
      },
      {
        id: "payment-confirmation",
        title: "Payment confirmations",
        description: "Confirmation when a payment is successfully recorded.",
        email: true,
        sms: false,
        push: true,
      },
      {
        id: "payment-failed",
        title: "Payment issues",
        description: "Alerts when a payment attempt needs your attention.",
        email: true,
        sms: true,
        push: true,
      },
    ],
  },
  {
    id: "security",
    title: "Security alerts",
    description: "Important notifications related to your account security.",
    icon: ShieldCheck,
    items: [
      {
        id: "login-alerts",
        title: "Login alerts",
        description: "Alerts about new or unusual sign-ins to your account.",
        email: true,
        sms: false,
        push: true,
        locked: true,
      },
      {
        id: "security-changes",
        title: "Security changes",
        description: "Notifications when important account security settings change.",
        email: true,
        sms: true,
        push: true,
        locked: true,
      },
    ],
  },
  {
    id: "offers",
    title: "Offers & updates",
    description: "Optional product information and promotional communication.",
    icon: Bell,
    items: [
      {
        id: "product-updates",
        title: "Product updates",
        description: "News about new services and useful LoanPro features.",
        email: true,
        sms: false,
        push: true,
      },
      {
        id: "offers",
        title: "Offers and promotions",
        description: "Optional promotional messages and relevant offers.",
        email: false,
        sms: false,
        push: false,
      },
    ],
  },
];

const channels = [
  {
    id: "email",
    label: "Email",
    icon: Mail,
    description: "Updates sent to your registered email address.",
  },
  {
    id: "sms",
    label: "SMS",
    icon: MessageSquare,
    description: "Important alerts sent to your registered mobile number.",
  },
  {
    id: "push",
    label: "Push notifications",
    icon: Smartphone,
    description: "Real-time alerts inside supported devices or browsers.",
  },
];

function FileTextIcon(props) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}

function NotificationPreferences() {
  const [preferences, setPreferences] = useState(() => {
    const initial = {};

    notificationGroups.forEach((group) => {
      group.items.forEach((item) => {
        initial[item.id] = {
          email: item.email,
          sms: item.sms,
          push: item.push,
        };
      });
    });

    return initial;
  });

  const [quietHours, setQuietHours] = useState(false);
  const [saved, setSaved] = useState(false);

  const updatePreference = (itemId, channel, value) => {
    setSaved(false);

    setPreferences((current) => ({
      ...current,
      [itemId]: {
        ...current[itemId],
        [channel]: value,
      },
    }));
  };

  const enableAll = () => {
    const updated = {};

    Object.keys(preferences).forEach((id) => {
      updated[id] = {
        email: true,
        sms: true,
        push: true,
      };
    });

    setPreferences(updated);
    setSaved(false);
  };

  const disableOptional = () => {
    const updated = {};

    Object.entries(preferences).forEach(([id, value]) => {
      updated[id] = {
        email: id === "login-alerts" || id === "security-changes",
        sms: id === "login-alerts" || id === "security-changes",
        push: id === "login-alerts" || id === "security-changes",
      };
    });

    setPreferences(updated);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-muted/30">
        <div className="page-container py-6 sm:py-8">
          <Link
            to="/menu"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                <Bell className="h-4 w-4" />
                Account settings
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                Notification Preferences
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Choose which notifications you want to receive and how LoanPro
                should contact you.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <Save className="h-4 w-4" />
              Save Preferences
            </button>
          </div>
        </div>
      </section>

      <main className="page-container py-8 lg:py-10">
        {/* Saved state */}
        {saved && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 className="h-5 w-5 shrink-0" />

            <span>
              Your notification preferences have been saved successfully.
            </span>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Main settings */}
          <div className="min-w-0 space-y-6">
            {/* Quick controls */}
            <section className="rounded-2xl border bg-card p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="section-eyebrow">Quick controls</p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Manage your preferences
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Apply common settings across optional notifications.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={enableAll}
                    className="rounded-lg border px-3 py-2 text-xs font-semibold transition hover:bg-muted"
                  >
                    Enable all
                  </button>

                  <button
                    type="button"
                    onClick={disableOptional}
                    className="rounded-lg border px-3 py-2 text-xs font-semibold transition hover:bg-muted"
                  >
                    Essential only
                  </button>
                </div>
              </div>
            </section>

            {/* Notification groups */}
            {notificationGroups.map((group) => {
              const GroupIcon = group.icon;

              return (
                <section
                  key={group.id}
                  className="overflow-hidden rounded-2xl border bg-card"
                >
                  <div className="border-b bg-muted/20 px-5 py-5 sm:px-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <GroupIcon className="h-5 w-5" />
                      </div>

                      <div>
                        <h2 className="font-semibold">{group.title}</h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {group.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y">
                    {group.items.map((item) => {
                      const values = preferences[item.id];

                      return (
                        <div
                          key={item.id}
                          className="px-5 py-5 sm:px-6"
                        >
                          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div className="max-w-xl">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold">
                                  {item.title}
                                </h3>

                                {item.locked && (
                                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                    Essential
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                {item.description}
                              </p>
                            </div>

                            <div className="flex shrink-0 gap-3">
                              {channels.map((channel) => {
                                const ChannelIcon = channel.icon;

                                return (
                                  <label
                                    key={channel.id}
                                    className="flex cursor-pointer flex-col items-center gap-1.5"
                                  >
                                    <span className="sr-only">
                                      {item.title} via {channel.label}
                                    </span>

                                    <input
                                      type="checkbox"
                                      checked={values[channel.id]}
                                      disabled={item.locked}
                                      onChange={(event) =>
                                        updatePreference(
                                          item.id,
                                          channel.id,
                                          event.target.checked,
                                        )
                                      }
                                      className="peer sr-only"
                                    />

                                    <span
                                      className={[
                                        "flex h-10 w-10 items-center justify-center rounded-xl border transition",
                                        values[channel.id]
                                          ? "border-primary bg-primary text-primary-foreground"
                                          : "bg-background text-muted-foreground",
                                        item.locked
                                          ? "cursor-not-allowed opacity-60"
                                          : "peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                                      ].join(" ")}
                                    >
                                      <ChannelIcon className="h-4 w-4" />
                                    </span>

                                    <span className="text-[10px] font-medium text-muted-foreground">
                                      {channel.label === "Push notifications"
                                        ? "Push"
                                        : channel.label}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {/* Quiet hours */}
            <section className="rounded-2xl border bg-card p-5 sm:p-6">
              <div className="flex items-start justify-between gap-5">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <Moon className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-semibold">Quiet hours</h2>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Reduce non-essential push notifications during your
                      preferred quiet period.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={quietHours}
                  onClick={() => {
                    setQuietHours((current) => !current);
                    setSaved(false);
                  }}
                  className={[
                    "relative h-6 w-11 shrink-0 rounded-full transition",
                    quietHours ? "bg-primary" : "bg-muted-foreground/30",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "absolute top-1 h-4 w-4 rounded-full bg-white transition",
                      quietHours ? "left-6" : "left-1",
                    ].join(" ")}
                  />
                </button>
              </div>

              {quietHours && (
                <div className="mt-5 grid gap-4 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">
                      Starts
                    </label>

                    <input
                      type="time"
                      defaultValue="22:00"
                      className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">
                      Ends
                    </label>

                    <input
                      type="time"
                      defaultValue="07:00"
                      className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
            {/* Current setup */}
            <section className="rounded-2xl border bg-card p-5">
              <p className="section-eyebrow">Your setup</p>

              <h2 className="mt-1 text-lg font-semibold">
                Notification channels
              </h2>

              <div className="mt-5 space-y-3">
                {channels.map((channel) => {
                  const Icon = channel.icon;

                  return (
                    <div
                      key={channel.id}
                      className="flex items-start gap-3 rounded-xl border bg-background p-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          {channel.label}
                        </p>

                        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                          {channel.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Security */}
            <section className="rounded-2xl border bg-primary p-5 text-primary-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <h2 className="mt-4 font-semibold">
                Important security notifications
              </h2>

              <p className="mt-2 text-sm leading-6 text-primary-foreground/75">
                Certain security alerts may always be delivered because they
                are important for protecting your account.
              </p>

              <Link
                to="/security"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"
              >
                Security Centre
                <ChevronRight className="h-4 w-4" />
              </Link>
            </section>

            {/* Help */}
            <section className="rounded-2xl border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <BellOff className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold">
                    Not receiving notifications?
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Check your device settings and contact details.
                  </p>
                </div>
              </div>

              <Link
                to="/help"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                Visit Help Centre
                <ChevronRight className="h-4 w-4" />
              </Link>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default NotificationPreferences;