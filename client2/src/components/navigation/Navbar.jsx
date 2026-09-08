import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  Calculator,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CreditCard,
  FileCheck2,
  FileText,
  Home,
  Info,
  LogIn,
  LogOut,
  Search,
  ShieldCheck,
  User,
  X,
  SlidersHorizontal,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import ThemeToggle from "@/features/theme/ThemeToggle";
import { Button } from "@/components/ui/button";

import { useLogoutMutation } from "@/features/auth/authApi";
import PublicSearch from "@/components/marketing/PublicSearch";
import { loanCatalog } from "@/features/loan/data/loanCatalog";

/* ================================================================
   NAVIGATION
================================================================ */

const adminNavigation = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: Home,
  },
  {
    label: "Loan Applications",
    path: "/admin/loans",
    icon: FileText,
  },
  {
    label: "Loan Configuration",
    path: "/admin/loan-configuration",
    icon: SlidersHorizontal,
  },
];

const publicResources = [
  {
    label: "How It Works",
    hash: "#how-it-works",
    icon: BookOpen,
  },
  {
    label: "Eligibility",
    hash: "#eligibility",
    icon: ShieldCheck,
  },
  {
    label: "FAQs",
    hash: "#faq",
    icon: CircleHelp,
  },
];

/* ================================================================
   HELPERS
================================================================ */

function getUserRole(user) {
  if (!user?.role) return null;

  if (typeof user.role === "string") {
    return user.role;
  }

  return user.role?.name ?? null;
}

/* ================================================================
   NOTIFICATION DATA
================================================================ */

const notificationData = {
  customer: [
    {
      id: 1,
      type: "application",
      title: "Application saved",
      message:
        "Your loan application has been saved. You can continue whenever you're ready.",
      time: "Just now",
      unread: true,
    },
    {
      id: 2,
      type: "document",
      title: "Documents may be required",
      message:
        "Check your application to see which documents are required for the next step.",
      time: "Today",
      unread: true,
    },
    {
      id: 3,
      type: "payment",
      title: "Payment schedule available",
      message:
        "Your repayment schedule is available to view from the payments section.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 4,
      type: "info",
      title: "Welcome to LoanPro",
      message:
        "You can manage your application, documents and payments from your account.",
      time: "2 days ago",
      unread: false,
    },
  ],

  admin: [
    {
      id: 1,
      type: "application",
      title: "New application received",
      message:
        "A new loan application is ready for review in the admin workspace.",
      time: "Just now",
      unread: true,
    },
    {
      id: 2,
      type: "document",
      title: "Application requires review",
      message: "A submitted application has moved to the review stage.",
      time: "Today",
      unread: true,
    },
    {
      id: 3,
      type: "info",
      title: "Configuration update",
      message:
        "Review the current loan product configuration from the admin panel.",
      time: "Yesterday",
      unread: false,
    },
  ],

  guest: [
    {
      id: 1,
      type: "info",
      title: "Welcome to LoanPro",
      message:
        "Explore loan products, calculate your EMI and learn how the application journey works.",
      time: "Today",
      unread: true,
    },
  ],
};
/* ================================================================
   COMPONENT
================================================================ */

function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [activeLoanId, setActiveLoanId] = useState("school");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationItems, setNotificationItems] = useState([]);

  const menuRef = useRef(null);
  const notificationRef = useRef(null);
  const accountRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [logoutRequest, { isLoading }] = useLogoutMutation();

  const role = getUserRole(user);

  const isAdmin = isAuthenticated && role === "ADMIN";

  const isCustomer = isAuthenticated && role === "CUSTOMER";

  const notificationRole = isAdmin
    ? "admin"
    : isCustomer
      ? "customer"
      : "guest";

  useEffect(() => {
    setNotificationItems(notificationData[notificationRole] || []);
  }, [notificationRole]);

  const unreadCount = notificationItems.filter(
    (notification) => notification.unread,
  ).length;

  const markAllAsRead = () => {
    setNotificationItems((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const markAsRead = (id) => {
    setNotificationItems((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  };

  const activeLoan = useMemo(
    () =>
      loanCatalog.find((loan) => loan.id === activeLoanId) || loanCatalog[0],
    [activeLoanId],
  );

  /* ==============================================================
     ACTIVE ROUTE
  ============================================================== */

  const isActive = (path) => {
    if (!path) return false;

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  /* ==============================================================
     CLOSE MENUS
  ============================================================== */

  const closeMenus = () => {
    setDesktopMenu(null);
    setNotificationsOpen(false);
    setAccountOpen(false);
  };

  /* ==============================================================
     HASH NAVIGATION
  ============================================================== */

  const navigateToHash = (hash) => {
    closeMenus();

    if (location.pathname === "/") {
      const id = hash.replace("#", "");

      window.history.pushState(null, "", hash);

      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });

      return;
    }

    navigate(`/${hash}`);
  };

  /* ==============================================================
     LOGOUT
  ============================================================== */

  const handleLogout = async () => {
    try {
      await logoutRequest().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      toast.success("Logged out successfully");

      closeMenus();

      navigate("/login", {
        replace: true,
      });
    }
  };

  /* ==============================================================
     OUTSIDE CLICK
  ============================================================== */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDesktopMenu(null);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }

      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* ==============================================================
     KEYBOARD
  ============================================================== */

  useEffect(() => {
    const handleKeyboard = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        setSearchOpen(true);
        closeMenus();
      }

      if (event.key === "Escape") {
        closeMenus();
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  /* ==============================================================
     NOTIFICATION PANEL
  ============================================================== */

  const NotificationPanel = ({ mobile = false }) => (
    <div
      className={[
        "overflow-hidden rounded-xl border border-border bg-background shadow-[0_18px_50px_rgba(15,23,42,0.16)]",
        mobile ? "w-full" : "w-[min(390px,calc(100vw-24px))]",
      ].join(" ")}
    >
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-foreground">Notifications</p>

            {unreadCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                {unreadCount} new
              </span>
            )}
          </div>

          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Updates from your LoanPro account
          </p>
        </div>

        <button
          type="button"
          onClick={() => setNotificationsOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Close notifications"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* NOTIFICATION LIST */}

      <div className="max-h-[min(460px,calc(100dvh-180px))] overflow-y-auto">
        {notificationItems.length > 0 ? (
          notificationItems.map((notification) => {
            let Icon = Info;
            let iconClass = "bg-primary/10 text-primary";

            if (notification.type === "application") {
              Icon = FileText;
              iconClass = "bg-blue-50 text-blue-600";
            }

            if (notification.type === "document") {
              Icon = FileCheck2;
              iconClass = "bg-violet-50 text-violet-600";
            }

            if (notification.type === "payment") {
              Icon = CreditCard;
              iconClass = "bg-emerald-50 text-emerald-600";
            }

            if (notification.type === "info") {
              Icon = Info;
              iconClass = "bg-slate-100 text-slate-600";
            }

            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => {
                  markAsRead(notification.id);
                  setNotificationsOpen(false);
                }}
                className="
                group
                flex
                w-full
                gap-3
                border-b
                border-border
                p-4
                text-left
                transition
                hover:bg-muted/50
              "
              >
                {/* ICON */}

                <span
                  className={`
                  relative
                  mt-0.5
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  ${iconClass}
                `}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.8} />

                  {notification.unread && (
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                  )}
                </span>

                {/* CONTENT */}

                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span
                      className={`
                      text-xs
                      ${
                        notification.unread
                          ? "font-bold text-foreground"
                          : "font-semibold text-foreground/85"
                      }
                    `}
                    >
                      {notification.title}
                    </span>

                    {notification.unread && (
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    )}
                  </span>

                  <span className="mt-1 block text-[11px] leading-5 text-muted-foreground">
                    {notification.message}
                  </span>

                  <span className="mt-1.5 flex items-center gap-1 text-[9px] font-medium text-muted-foreground">
                    <Clock3 className="h-3 w-3" />

                    {notification.time}
                  </span>
                </span>

                <ChevronRight className="mt-2 h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </button>
            );
          })
        ) : (
          <div className="px-5 py-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-6 w-6" />
            </span>

            <p className="mt-3 text-sm font-semibold text-foreground">
              You're all caught up
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              There are no new notifications right now.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}

      <div className="grid grid-cols-2 gap-2 border-t border-border p-2">
        <button
          type="button"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="
          flex
          min-h-10
          items-center
          justify-center
          rounded-md
          text-[11px]
          font-semibold
          text-primary
          transition
          hover:bg-primary/10
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
        >
          Mark all as read
        </button>

        <button
          type="button"
          onClick={() => {
            setNotificationsOpen(false);
            navigate(
              isCustomer ? "/customer/loans" : isAdmin ? "/admin/loans" : "/",
            );
          }}
          className="
          flex
          min-h-10
          items-center
          justify-center
          rounded-md
          bg-muted/60
          text-[11px]
          font-semibold
          text-foreground
          transition
          hover:bg-muted
        "
        >
          View activity
        </button>
      </div>
    </div>
  );

  /* ==============================================================
     RENDER
  ============================================================== */

  return (
    <>
      <header className="sticky top-0 z-50 bg-primary shadow-[0_2px_12px_rgba(15,23,42,0.10)]">
        <div className="mx-auto w-full max-w-[1440px]">
          {/* ==========================================================
              TOP NAVBAR
          ========================================================== */}

          <div className="flex min-h-[60px] items-center gap-2 px-3 sm:px-5 lg:min-h-[64px] lg:px-8">
            {/* BRAND */}

            <Link
              to="/"
              onClick={closeMenus}
              className="flex shrink-0 items-center gap-2.5"
            >
              <span
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-md
                  bg-primary-foreground
                  text-sm
                  font-black
                  text-primary
                  sm:h-10
                  sm:w-10
                "
              >
                L
              </span>

              <div className="hidden sm:block">
                <span className="block text-base font-bold tracking-tight text-primary-foreground">
                  LoanPro
                </span>

                <span className="hidden text-[10px] font-medium text-primary-foreground/60 md:block">
                  Digital Lending
                </span>
              </div>
            </Link>

            {/* ========================================================
                PUBLIC NAVIGATION
            ======================================================== */}

            {!isAuthenticated && (
              <nav
                ref={menuRef}
                className="ml-4 hidden items-center gap-0.5 lg:flex"
              >
                {/* LOANS */}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setDesktopMenu(desktopMenu === "loans" ? null : "loans");

                      setNotificationsOpen(false);
                      setAccountOpen(false);
                    }}
                    className="
                      inline-flex
                      min-h-9
                      items-center
                      gap-1.5
                      rounded-md
                      px-3
                      text-sm
                      font-medium
                      text-primary-foreground/85
                      transition-colors
                      hover:bg-primary-foreground/10
                      hover:text-primary-foreground
                    "
                  >
                    Loans
                    <ChevronDown
                      className={[
                        "h-4 w-4 transition-transform",
                        desktopMenu === "loans" ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </button>

                  {desktopMenu === "loans" && (
                    <div
                      className="
                        absolute
                        left-0
                        top-[calc(100%+8px)]
                        z-[100]
                        w-[560px]
                        overflow-hidden
                        rounded-lg
                        border
                        border-border
                        bg-background
                        shadow-[0_18px_50px_rgba(15,23,42,0.16)]
                      "
                    >
                      <div className="grid grid-cols-[185px_1fr]">
                        {/* PRODUCT LIST */}

                        <div className="border-r border-border bg-muted/30 p-2">
                          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                            Loan Products
                          </p>

                          <div className="space-y-1">
                            {loanCatalog.map((loan) => {
                              const Icon = loan.icon;

                              const active = loan.id === activeLoan.id;

                              return (
                                <button
                                  key={loan.id}
                                  type="button"
                                  onClick={() => setActiveLoanId(loan.id)}
                                  className={[
                                    "flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-xs font-semibold transition",
                                    active
                                      ? "bg-background text-primary shadow-sm"
                                      : "text-muted-foreground hover:bg-background hover:text-foreground",
                                  ].join(" ")}
                                >
                                  <Icon className="h-4 w-4 shrink-0" />

                                  <span className="truncate">
                                    {loan.shortName}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* PRODUCT DETAIL */}

                        <div className="p-5">
                          {activeLoan && (
                            <>
                              <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                  <activeLoan.icon className="h-5 w-5" />
                                </div>

                                <div className="min-w-0">
                                  <h3 className="text-base font-semibold text-foreground">
                                    {activeLoan.name}
                                  </h3>

                                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                    {activeLoan.description}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-5 rounded-md border border-border bg-muted/30 p-4">
                                <p className="text-sm font-semibold text-foreground">
                                  {activeLoan.detail}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                  {activeLoan.status === "available"
                                    ? "Apply online in a few simple steps."
                                    : "This product is coming soon."}
                                </p>

                                <div className="mt-4">
                                  {activeLoan.status === "available" ? (
                                    <Link
                                      to="/login?redirect=/customer/loans/apply"
                                      onClick={closeMenus}
                                      className="
                                        inline-flex
                                        h-10
                                        items-center
                                        gap-2
                                        rounded-md
                                        bg-primary
                                        px-4
                                        text-sm
                                        font-semibold
                                        text-primary-foreground
                                        transition
                                        hover:opacity-90
                                      "
                                    >
                                      Apply Now
                                      <ChevronRight className="h-4 w-4" />
                                    </Link>
                                  ) : (
                                    <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
                                      Coming soon
                                    </span>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* EMI CALCULATOR */}

                <Link
                  to="/emi-calculator"
                  onClick={closeMenus}
                  className="
                    rounded-md
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-primary-foreground/85
                    transition-colors
                    hover:bg-primary-foreground/10
                    hover:text-primary-foreground
                  "
                >
                  EMI Calculator
                </Link>

                {/* HOW IT WORKS */}

                <button
                  type="button"
                  onClick={() => navigateToHash("#how-it-works")}
                  className="
                    rounded-md
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-primary-foreground/85
                    transition-colors
                    hover:bg-primary-foreground/10
                    hover:text-primary-foreground
                  "
                >
                  How It Works
                </button>

                {/* RESOURCES */}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setDesktopMenu(
                        desktopMenu === "resources" ? null : "resources",
                      );

                      setNotificationsOpen(false);
                      setAccountOpen(false);
                    }}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-md
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-primary-foreground/85
                      transition-colors
                      hover:bg-primary-foreground/10
                      hover:text-primary-foreground
                    "
                  >
                    Resources
                    <ChevronDown
                      className={[
                        "h-4 w-4 transition-transform",
                        desktopMenu === "resources" ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </button>

                  {desktopMenu === "resources" && (
                    <div
                      className="
                        absolute
                        right-0
                        top-[calc(100%+8px)]
                        z-[100]
                        w-72
                        rounded-lg
                        border
                        border-border
                        bg-background
                        p-2
                        shadow-[0_18px_50px_rgba(15,23,42,0.16)]
                      "
                    >
                      {publicResources.map((item) => {
                        const Icon = item.icon;

                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => navigateToHash(item.hash)}
                            className="
                              flex
                              w-full
                              items-center
                              gap-3
                              rounded-md
                              p-3
                              text-left
                              transition
                              hover:bg-muted
                            "
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                              <Icon className="h-4 w-4" />
                            </span>

                            <span>
                              <span className="block text-sm font-semibold text-foreground">
                                {item.label}
                              </span>

                              <span className="mt-0.5 block text-xs text-muted-foreground">
                                Explore LoanPro
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </nav>
            )}

            {/* ========================================================
                CUSTOMER NAVIGATION
            ======================================================== */}

            {isCustomer && (
              <nav className="ml-4 hidden items-center gap-0.5 lg:flex">
                {[
                  {
                    label: "Dashboard",
                    path: "/customer/dashboard",
                  },
                  {
                    label: "My Loans",
                    path: "/customer/loans",
                  },
                  {
                    label: "Payments",
                    path: "/customer/payments",
                  },
                ].map((item) => {
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMenus}
                      className={[
                        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary-foreground/15 text-primary-foreground"
                          : "text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* ========================================================
                ADMIN NAVIGATION
            ======================================================== */}

            {isAdmin && (
              <nav className="ml-4 hidden items-center gap-0.5 lg:flex">
                {adminNavigation.map((item) => {
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMenus}
                      className={[
                        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary-foreground/15 text-primary-foreground"
                          : "text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* ========================================================
                RIGHT ACTIONS
            ======================================================== */}

            <div className="ml-auto flex items-center gap-0.5">
              {/* DESKTOP SEARCH */}

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="
                  hidden
                  h-9
                  min-w-[200px]
                  items-center
                  gap-2
                  rounded-md
                  border
                  border-primary-foreground/20
                  bg-primary-foreground/10
                  px-3
                  text-left
                  transition-colors
                  hover:bg-primary-foreground/15
                  xl:flex
                "
              >
                <Search className="h-4 w-4 text-primary-foreground/60" />

                <span className="flex-1 text-xs text-primary-foreground/60">
                  Search loans & services
                </span>

                <kbd className="rounded border border-primary-foreground/20 bg-primary-foreground/10 px-1.5 py-0.5 text-[10px] text-primary-foreground/60">
                  Ctrl K
                </kbd>
              </button>

              {/* MOBILE / TABLET SEARCH */}

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="
                  h-9
                  w-9
                  rounded-md
                  text-primary-foreground
                  hover:bg-primary-foreground/10
                  hover:text-primary-foreground
                  xl:hidden
                "
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" />
              </Button>

              {/* NOTIFICATIONS */}

              {isAuthenticated && (
                <div ref={notificationRef} className="relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);

                      setAccountOpen(false);
                      setDesktopMenu(null);
                    }}
                    className="
                      relative
                      h-9
                      w-9
                      rounded-md
                      text-primary-foreground/90
                      hover:bg-primary-foreground/10
                      hover:text-primary-foreground
                    "
                    aria-label="Notifications"
                    aria-expanded={notificationsOpen}
                  >
                    <Bell className="h-[18px] w-[18px]" />

                    {unreadCount > 0 && (
                      <span
                        className="
      absolute
      -right-0.5
      -top-1
      flex
      min-h-4
      min-w-4
      items-center
      justify-center
      rounded-full
      bg-accent
      px-1
      text-[8px]
      font-bold
      leading-none
      text-white
      ring-2
      ring-primary
    "
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Button>

                  {notificationsOpen && (
                    <>
                      {/* MOBILE */}

                      <div
                        className="
                          fixed
                          inset-0
                          z-[90]
                          bg-black/20
                          lg:hidden
                        "
                        onClick={() => setNotificationsOpen(false)}
                      />

                      <div
                        className="
                          fixed
                          left-3
                          right-3
                          top-[68px]
                          z-[100]
                          mx-auto
                          max-w-[420px]
                          lg:hidden
                        "
                      >
                        <NotificationPanel mobile />
                      </div>

                      {/* DESKTOP */}

                      <div
                        className="
                          absolute
                          right-0
                          top-[calc(100%+8px)]
                          z-[100]
                          hidden
                          lg:block
                        "
                      >
                        <NotificationPanel />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* THEME */}

              <div className="hidden sm:block">
                <div className="[&_button]:text-primary-foreground [&_button:hover]:bg-primary-foreground/10">
                  <ThemeToggle />
                </div>
              </div>

              {/* LOGIN / APPLY */}

              {!isAuthenticated && (
                <div className="hidden items-center gap-1.5 md:flex">
                  <Button
                    type="button"
                    variant="ghost"
                    className="
                      h-9
                      rounded-md
                      px-3
                      text-primary-foreground/90
                      hover:bg-primary-foreground/10
                      hover:text-primary-foreground
                    "
                    onClick={() => navigate("/login")}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>

                  <Link
                    to="/login?redirect=/customer/loans/apply"
                    className="
                      inline-flex
                      h-9
                      items-center
                      justify-center
                      rounded-md
                      bg-primary-foreground
                      px-4
                      text-sm
                      font-semibold
                      text-primary
                      transition
                      hover:opacity-90
                    "
                  >
                    Apply Now
                  </Link>
                </div>
              )}

              {/* ACCOUNT */}

              {isAuthenticated && (
                <div ref={accountRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen(!accountOpen);

                      setNotificationsOpen(false);
                      setDesktopMenu(null);
                    }}
                    className="
                      flex
                      h-9
                      items-center
                      gap-2
                      rounded-md
                      px-1.5
                      transition-colors
                      hover:bg-primary-foreground/10
                    "
                    aria-label="Open account menu"
                    aria-expanded={accountOpen}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground text-primary">
                      {isAdmin ? (
                        <ShieldCheck className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </span>

                    <span className="hidden max-w-[110px] truncate text-xs font-semibold text-primary-foreground lg:block">
                      {user?.firstName ||
                        user?.name ||
                        (isAdmin ? "Admin" : "Account")}
                    </span>

                    <ChevronDown className="hidden h-3.5 w-3.5 text-primary-foreground/60 lg:block" />
                  </button>

                  {accountOpen && (
                    <div
                      className="
                        absolute
                        right-0
                        top-[calc(100%+8px)]
                        z-[100]
                        w-[280px]
                        overflow-hidden
                        rounded-lg
                        border
                        border-border
                        bg-background
                        shadow-[0_18px_50px_rgba(15,23,42,0.16)]
                      "
                    >
                      {/* ACCOUNT HEADER */}

                      <div className="border-b border-border p-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            {isAdmin ? (
                              <ShieldCheck className="h-5 w-5" />
                            ) : (
                              <User className="h-5 w-5" />
                            )}
                          </span>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {user?.firstName ||
                                user?.name ||
                                (isAdmin ? "Administrator" : "Customer")}
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                              {user?.email || ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ACCOUNT ITEMS */}

                      <div className="p-2">
                        <Link
                          to={
                            isAdmin ? "/admin/dashboard" : "/customer/profile"
                          }
                          onClick={closeMenus}
                          className="
                            flex
                            min-h-11
                            items-center
                            gap-3
                            rounded-md
                            px-3
                            text-sm
                            font-medium
                            transition
                            hover:bg-muted
                          "
                        >
                          <User className="h-4 w-4 text-muted-foreground" />

                          <span>
                            {isAdmin ? "Admin Dashboard" : "My Profile"}
                          </span>
                        </Link>

                        {!isAdmin && (
                          <Link
                            to="/customer/loans"
                            onClick={closeMenus}
                            className="
                              flex
                              min-h-11
                              items-center
                              gap-3
                              rounded-md
                              px-3
                              text-sm
                              font-medium
                              transition
                              hover:bg-muted
                            "
                          >
                            <FileText className="h-4 w-4 text-muted-foreground" />

                            <span>My Loans</span>
                          </Link>
                        )}

                        <div className="my-1 border-t border-border" />

                        <button
                          type="button"
                          onClick={handleLogout}
                          disabled={isLoading}
                          className="
                            flex
                            min-h-11
                            w-full
                            items-center
                            gap-3
                            rounded-md
                            px-3
                            text-left
                            text-sm
                            font-medium
                            text-muted-foreground
                            transition
                            hover:bg-destructive/10
                            hover:text-destructive
                          "
                        >
                          <LogOut className="h-4 w-4" />

                          <span>
                            {isLoading ? "Signing out..." : "Sign out"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ==========================================================
              MOBILE SEARCH BAR
          ========================================================== */}

          <div className="border-t border-primary-foreground/10 px-3 py-2.5 lg:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="
                flex
                min-h-10
                w-full
                items-center
                gap-3
                rounded-md
                border
                border-primary-foreground/15
                bg-primary-foreground/10
                px-3
                text-left
                transition
                hover:bg-primary-foreground/15
              "
            >
              <Search className="h-4 w-4 shrink-0 text-primary-foreground/60" />

              <span className="flex-1 text-xs text-primary-foreground/60">
                Search loans, FAQs, calculators...
              </span>

              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-foreground text-primary">
                <Search className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================
          GLOBAL SEARCH
      ================================================================ */}

      <PublicSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

export default Navbar;
