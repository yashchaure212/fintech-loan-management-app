import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  Clock3,
  FileText,
  Info,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const initialNotifications = [
  {
    id: 1,
    type: "application",
    title: "Application saved",
    message:
      "Your education loan application has been saved. You can continue it whenever you're ready.",
    time: "10 minutes ago",
    date: "Today",
    unread: true,
    href: "/customer/loans",
  },
  {
    id: 2,
    type: "document",
    title: "Document action required",
    message:
      "Check your application to see whether any additional documents are required.",
    time: "2 hours ago",
    date: "Today",
    unread: true,
    href: "/customer/loans",
  },
  {
    id: 3,
    type: "payment",
    title: "Payment schedule available",
    message:
      "Your repayment schedule is available to view from your loan account.",
    time: "Yesterday",
    date: "Yesterday",
    unread: false,
    href: "/customer/payments",
  },
  {
    id: 4,
    type: "security",
    title: "Security reminder",
    message:
      "Remember to keep your password, OTP, PIN, and other authentication information private.",
    time: "Yesterday",
    date: "Yesterday",
    unread: false,
    href: "/security",
  },
  {
    id: 5,
    type: "application",
    title: "Application journey updated",
    message:
      "Your application timeline has been updated. Open your application to view the latest status.",
    time: "2 days ago",
    date: "2 days ago",
    unread: false,
    href: "/customer/loans",
  },
  {
    id: 6,
    type: "info",
    title: "Welcome to LoanPro",
    message:
      "Explore your account, loan applications, documents, payments, and support options from one place.",
    time: "3 days ago",
    date: "3 days ago",
    unread: false,
    href: "/",
  },
];

const filters = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "application", label: "Applications" },
  { value: "payment", label: "Payments" },
  { value: "document", label: "Documents" },
  { value: "security", label: "Security" },
];

function Notifications() {
  const [notifications, setNotifications] = useState(
    initialNotifications,
  );

  const [filter, setFilter] = useState("all");

  const filteredNotifications = useMemo(() => {
    if (filter === "all") {
      return notifications;
    }

    if (filter === "unread") {
      return notifications.filter((item) => item.unread);
    }

    return notifications.filter((item) => item.type === filter);
  }, [notifications, filter]);

  const unreadCount = notifications.filter(
    (item) => item.unread,
  ).length;

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, unread: false }
          : item,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        unread: false,
      })),
    );
  };

  const clearNotification = (id) => {
    setNotifications((current) =>
      current.filter((item) => item.id !== id),
    );
  };

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="space-y-6">
        {/* BACK */}
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </Link>

        {/* HEADER */}
        <section className="overflow-hidden rounded-2xl border bg-card">
          <div className="bg-[linear-gradient(135deg,#07182f_0%,#0d2b52_55%,#163f6b_100%)] p-6 text-white sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                  <Bell className="h-6 w-6" />
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                    Account
                  </span>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                    Notifications
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                    Stay updated on your applications, documents, payments,
                    security, and important account activity.
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
                  <span className="h-2 w-2 rounded-full bg-amber-300" />
                  {unreadCount} unread
                </div>
              )}
            </div>
          </div>

          <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Notifications
              </p>

              <p className="mt-1 text-sm font-semibold">
                {notifications.length} total
              </p>
            </div>

            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Unread
              </p>

              <p className="mt-1 text-sm font-semibold">
                {unreadCount}
              </p>
            </div>

            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Preferences
              </p>

              <Link
                to="/notification-preferences"
                className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                Manage notifications
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* FILTERS */}
        <section className="rounded-2xl border bg-card p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-eyebrow">
                Notification centre
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Your recent activity
              </h2>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {filters.map((item) => {
              const active = filter === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={[
                    "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted",
                  ].join(" ")}
                >
                  {item.label}

                  {item.value === "unread" && unreadCount > 0 && (
                    <span className="ml-1.5">
                      ({unreadCount})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* NOTIFICATIONS */}
        <section className="overflow-hidden rounded-2xl border bg-card">
          {filteredNotifications.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                  onClear={clearNotification}
                />
              ))}
            </div>
          )}
        </section>

        {/* SECURITY NOTE */}
        <section className="rounded-2xl border bg-muted/30 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="text-sm font-semibold">
                Important security alerts
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Some account and security notifications may always be sent
                because they are important for protecting your account.
              </p>

              <Link
                to="/security"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Visit Security Centre
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function NotificationItem({
  notification,
  onRead,
  onClear,
}) {
  const Icon = getNotificationIcon(notification.type);

  return (
    <div
      className={[
        "group relative flex gap-4 p-5 transition sm:p-6",
        notification.unread
          ? "bg-primary/[0.025]"
          : "bg-card",
      ].join(" ")}
    >
      {/* unread indicator */}
      {notification.unread && (
        <span className="absolute left-0 top-0 h-full w-0.5 bg-primary" />
      )}

      <div
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          getNotificationIconBackground(notification.type),
        ].join(" ")}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className={[
                  "text-sm sm:text-base",
                  notification.unread
                    ? "font-bold text-foreground"
                    : "font-semibold text-foreground",
                ].join(" ")}
              >
                {notification.title}
              </h3>

              {notification.unread && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
              )}
            </div>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {notification.message}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" />
            {notification.time}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link
            to={notification.href}
            onClick={() => onRead(notification.id)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
          >
            View
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>

          {notification.unread && (
            <button
              type="button"
              onClick={() => onRead(notification.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition hover:bg-muted"
            >
              <Check className="h-3.5 w-3.5" />
              Mark as read
            </button>
          )}

          <button
            type="button"
            onClick={() => onClear(notification.id)}
            className="rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ filter }) {
  const message =
    filter === "unread"
      ? "You're all caught up."
      : "No notifications found.";

  const description =
    filter === "unread"
      ? "There are no unread notifications at the moment."
      : "Notifications related to this category will appear here.";

  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Bell className="h-5 w-5 text-muted-foreground" />
      </div>

      <h3 className="mt-4 text-base font-semibold">
        {message}
      </h3>

      <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function getNotificationIcon(type) {
  switch (type) {
    case "application":
      return FileText;

    case "document":
      return FileCheckIcon;

    case "payment":
      return WalletCards;

    case "security":
      return ShieldCheck;

    case "info":
    default:
      return Info;
  }
}

function getNotificationIconBackground(type) {
  switch (type) {
    case "application":
      return "bg-blue-50 text-blue-700";

    case "document":
      return "bg-amber-50 text-amber-700";

    case "payment":
      return "bg-emerald-50 text-emerald-700";

    case "security":
      return "bg-violet-50 text-violet-700";

    case "info":
    default:
      return "bg-muted text-foreground";
  }
}

function FileCheckIcon(props) {
  return <FileText {...props} />;
}

export default Notifications;