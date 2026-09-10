import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  FileCheck2,
  FileText,
  Info,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

function NotificationPanel({
  mobile = false,
  notificationItems,
  unreadCount,
  markAllAsRead,
  markAsRead,
  setNotificationsOpen,
  isCustomer,
  isAdmin,
  navigate,
}) {
  return (
    <div
      className={[
        "border-border bg-background overflow-hidden rounded-xl border shadow-[0_18px_50px_rgba(15,23,42,0.16)]",
        mobile
          ? "w-full"
          : "w-[min(390px,calc(100vw-24px))]",
      ].join(" ")}
    >
      {/* HEADER */}

      <div className="border-border flex items-center justify-between border-b px-4 py-3.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-foreground text-sm font-bold">
              Notifications
            </p>

            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[9px] font-bold">
                {unreadCount} new
              </span>
            )}
          </div>

          <p className="text-muted-foreground mt-0.5 text-[11px]">
            Updates from your LoanPro account
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setNotificationsOpen(false)
          }
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition"
          aria-label="Close notifications"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* LIST */}

      <div className="max-h-[min(460px,calc(100dvh-180px))] overflow-y-auto">
        {notificationItems.length > 0 ? (
          notificationItems.map((notification) => {
            let Icon = Info;
            let iconClass =
              "bg-primary/10 text-primary";

            if (
              notification.type === "application"
            ) {
              Icon = FileText;
              iconClass =
                "bg-blue-50 text-blue-600";
            }

            if (
              notification.type === "document"
            ) {
              Icon = FileCheck2;
              iconClass =
                "bg-violet-50 text-violet-600";
            }

            if (
              notification.type === "payment"
            ) {
              Icon = CreditCard;
              iconClass =
                "bg-emerald-50 text-emerald-600";
            }

            if (notification.type === "info") {
              Icon = Info;
              iconClass =
                "bg-slate-100 text-slate-600";
            }

            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => {
                  markAsRead(notification.id);
                  setNotificationsOpen(false);
                }}
                className="group border-border hover:bg-muted/50 flex w-full gap-3 border-b p-4 text-left transition"
              >
                <span
                  className={`relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
                >
                  <Icon
                    className="h-4 w-4"
                    strokeWidth={1.8}
                  />

                  {notification.unread && (
                    <span className="bg-primary ring-background absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ring-2" />
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span
                      className={`text-xs ${
                        notification.unread
                          ? "text-foreground font-bold"
                          : "text-foreground/85 font-semibold"
                      }`}
                    >
                      {notification.title}
                    </span>

                    {notification.unread && (
                      <span className="bg-primary mt-1 h-1.5 w-1.5 shrink-0 rounded-full" />
                    )}
                  </span>

                  <span className="text-muted-foreground mt-1 block text-[11px] leading-5">
                    {notification.message}
                  </span>

                  <span className="text-muted-foreground mt-1.5 flex items-center gap-1 text-[9px] font-medium">
                    <Clock3 className="h-3 w-3" />

                    {notification.time}
                  </span>
                </span>

                <ChevronRight className="group-hover:text-primary mt-2 h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5" />
              </button>
            );
          })
        ) : (
          <div className="px-5 py-12 text-center">
            <span className="bg-primary/10 text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-full">
              <CheckCircle2 className="h-6 w-6" />
            </span>

            <p className="text-foreground mt-3 text-sm font-semibold">
              You're all caught up
            </p>

            <p className="text-muted-foreground mt-1 text-xs leading-5">
              There are no new notifications right
              now.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}

      <div className="border-border grid grid-cols-2 gap-2 border-t p-2">
        <button
          type="button"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="text-primary hover:bg-primary/10 flex min-h-10 items-center justify-center rounded-md text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          Mark all as read
        </button>

        <button
          type="button"
          onClick={() => {
            setNotificationsOpen(false);

            navigate(
              isCustomer
                ? "/customer/loans"
                : isAdmin
                  ? "/admin/loans"
                  : "/",
            );
          }}
          className="bg-muted/60 text-foreground hover:bg-muted flex min-h-10 items-center justify-center rounded-md text-[11px] font-semibold transition"
        >
          View activity
        </button>
      </div>
    </div>
  );
}

function NotificationMenu({
  notificationRef,
  notificationsOpen,
  setNotificationsOpen,
  notificationItems,
  unreadCount,
  markAllAsRead,
  markAsRead,
  isCustomer,
  isAdmin,
  navigate,
}) {
  if (!notificationsOpen) {
    return (
      <div ref={notificationRef} className="relative">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() =>
            setNotificationsOpen(true)
          }
          className="text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground relative h-9 w-9 rounded-md"
          aria-label="Notifications"
          aria-expanded={false}
        >
          <Bell className="h-[18px] w-[18px]" />

          {unreadCount > 0 && (
            <span className="ring-primary md:bg-accent md:ring-primary absolute top-0.5 right-0.5 size-2 rounded-full bg-white ring-1 md:-top-1 md:-right-0.5 md:flex md:min-h-4 md:min-w-4 md:items-center md:justify-center md:rounded-full md:px-1 md:text-[8px] md:leading-none md:font-bold md:text-white md:ring-2">
              <span className="hidden md:block">
                {unreadCount > 9
                  ? "9+"
                  : unreadCount}
              </span>
            </span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={notificationRef}
      className="relative"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => {
          setNotificationsOpen(false);
        }}
        className="text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground relative h-9 w-9 rounded-md"
        aria-label="Notifications"
        aria-expanded={true}
      >
        <Bell className="h-[18px] w-[18px]" />

        {unreadCount > 0 && (
          <span className="ring-primary md:bg-accent md:ring-primary absolute top-0.5 right-0.5 size-2 rounded-full bg-white ring-1 md:-top-1 md:-right-0.5 md:flex md:min-h-4 md:min-w-4 md:items-center md:justify-center md:rounded-full md:px-1 md:text-[8px] md:leading-none md:font-bold md:text-white md:ring-2">
            <span className="hidden md:block">
              {unreadCount > 9
                ? "9+"
                : unreadCount}
            </span>
          </span>
        )}
      </Button>

      {/* MOBILE */}

      <div
        className="fixed inset-0 z-[90] bg-black/20 lg:hidden"
        onClick={() =>
          setNotificationsOpen(false)
        }
      />

      <div className="fixed top-[68px] right-3 left-3 z-[100] mx-auto max-w-[420px] lg:hidden">
        <NotificationPanel
          mobile
          notificationItems={notificationItems}
          unreadCount={unreadCount}
          markAllAsRead={markAllAsRead}
          markAsRead={markAsRead}
          setNotificationsOpen={
            setNotificationsOpen
          }
          isCustomer={isCustomer}
          isAdmin={isAdmin}
          navigate={navigate}
        />
      </div>

      {/* DESKTOP */}

      <div className="absolute top-[calc(100%+8px)] right-0 z-[100] hidden lg:block">
        <NotificationPanel
          notificationItems={notificationItems}
          unreadCount={unreadCount}
          markAllAsRead={markAllAsRead}
          markAsRead={markAsRead}
          setNotificationsOpen={
            setNotificationsOpen
          }
          isCustomer={isCustomer}
          isAdmin={isAdmin}
          navigate={navigate}
        />
      </div>
    </div>
  );
}

export default NotificationMenu;