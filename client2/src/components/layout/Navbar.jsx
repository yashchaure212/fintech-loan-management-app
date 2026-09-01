import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  Calculator,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CreditCard,
  FileText,
  GraduationCap,
  Home,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import ThemeToggle from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useLogoutMutation } from "@/features/auth/authApi";
import PublicSearch from "@/components/marketing/PublicSearch";
import { loanCatalog } from "@/components/marketing/loanCatalog";

/* ================================================================
   NAVIGATION
================================================================ */

const customerNavigation = [
  {
    label: "My Loans",
    path: "/customer/loans",
    icon: FileText,
  },
  {
    label: "Payments",
    path: "/customer/payments",
    icon: CreditCard,
  },
];

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

const notifications = [
  {
    id: 1,
    title: "Welcome to LoanPro",
    message: "Your account is ready. Complete your profile to continue.",
    time: "Just now",
    unread: true,
  },
  {
    id: 2,
    title: "Loan applications",
    message: "You can start a new loan application from your dashboard.",
    time: "Today",
    unread: false,
  },
];

/* ================================================================
   COMPONENT
================================================================ */

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [desktopMenu, setDesktopMenu] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const [activeLoanId, setActiveLoanId] = useState("school");

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

  const closeMobile = () => {
    setMobileOpen(false);
    setDesktopMenu(null);
    setNotificationsOpen(false);
    setAccountOpen(false);
  };

  /* ==============================================================
     HASH NAVIGATION
  ============================================================== */

  const navigateToHash = (hash) => {
    closeMobile();

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

      closeMobile();

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
        setMobileOpen(false);
        closeMenus();
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  /* ==============================================================
     NOTIFICATION CONTENT
  ============================================================== */

  const NotificationPanel = ({ mobile = false }) => (
    <div
      className={[
        "overflow-hidden rounded-md border border-border bg-background shadow-[var(--shadow-md)]",
        mobile ? "w-full" : "w-[min(360px,calc(100vw-32px))]",
      ].join(" ")}
    >
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="text-sm font-bold text-foreground">Notifications</p>

          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Stay updated with your account
          </p>
        </div>

        <button
          type="button"
          onClick={() => setNotificationsOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close notifications"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* NOTIFICATIONS */}

      <div className="max-h-[min(420px,calc(100dvh-180px))] overflow-y-auto">
        {notifications.map((notification) => (
          <button
            key={notification.id}
            type="button"
            className="
              flex
              w-full
              gap-3
              border-b
              border-border
              p-4
              text-left
              transition
              hover:bg-muted/60
            "
            onClick={() => setNotificationsOpen(false)}
          >
            <span
              className="
                relative
                mt-0.5
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-primary-soft
                text-primary
              "
            >
              <Bell className="h-4 w-4" />

              {notification.unread && (
                <span
                  className="
                    absolute
                    right-0
                    top-0
                    h-2
                    w-2
                    rounded-full
                    bg-destructive
                    ring-2
                    ring-background
                  "
                />
              )}
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-foreground">
                  {notification.title}
                </span>

                {notification.unread && (
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                )}
              </span>

              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                {notification.message}
              </span>

              <span className="mt-1.5 block text-[10px] font-medium text-muted-foreground">
                {notification.time}
              </span>
            </span>
          </button>
        ))}

        {notifications.length === 0 && (
          <div className="px-5 py-10 text-center">
            <Bell className="mx-auto h-7 w-7 text-muted-foreground/50" />

            <p className="mt-3 text-sm font-semibold">No notifications</p>

            <p className="mt-1 text-xs text-muted-foreground">
              You're all caught up.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}

      <div className="border-t border-border p-2">
        <button
          type="button"
          onClick={() => setNotificationsOpen(false)}
          className="
            flex
            min-h-10
            w-full
            items-center
            justify-center
            rounded-md
            text-xs
            font-semibold
            text-primary
            transition
            hover:bg-primary-soft
          "
        >
          Mark all as read
        </button>
      </div>
    </div>
  );

  /* ==============================================================
     RENDER
  ============================================================== */

  return (
    <>
      {/* ==========================================================
         NAVBAR
      ========================================================== */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-border
          bg-background
          shadow-[0_1px_8px_rgba(15,23,42,0.06)]
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[68px]
            max-w-[1440px]
            items-center
            gap-2
            px-3
            sm:px-6
            lg:px-8
          "
        >
          {/* ======================================================
             BRAND
          ====================================================== */}

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
                bg-brand-navy
                text-sm
                font-bold
                text-white
                shadow-brand
                sm:h-10
                sm:w-10
              "
            >
              L
            </span>

            <span className="hidden sm:block">
              <span className="block text-[15px] font-bold tracking-tight text-foreground">
                LoanPro
              </span>

              <span className="block text-[10px] font-medium text-muted-foreground">
                Digital lending platform
              </span>
            </span>
          </Link>

          {/* ======================================================
             PUBLIC DESKTOP NAV
          ====================================================== */}

          {!isAuthenticated && (
            <nav
              ref={menuRef}
              className="ml-3 hidden items-center gap-0.5 lg:flex"
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
                    min-h-10
                    items-center
                    gap-1.5
                    rounded-md
                    px-3
                    text-sm
                    font-semibold
                    text-muted-foreground
                    transition
                    hover:bg-primary-soft
                    hover:text-primary
                  "
                >
                  Loans
                  <ChevronDown
                    className={[
                      "h-3.5 w-3.5 transition-transform",
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
                      w-[580px]
                      overflow-hidden
                      rounded-md
                      border
                      border-border
                      bg-background
                      p-2
                      shadow-[0_24px_70px_rgba(15,23,42,0.16)]
                    "
                  >
                    <div className="grid grid-cols-[190px_1fr] gap-2">
                      <div className="rounded-md bg-muted/50 p-2">
                        <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Loan Products
                        </p>

                        {loanCatalog.map((loan) => {
                          const Icon = loan.icon;
                          const active = loan.id === activeLoan.id;

                          return (
                            <button
                              key={loan.id}
                              type="button"
                              onClick={() => setActiveLoanId(loan.id)}
                              className={[
                                "flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-xs font-semibold transition",
                                active
                                  ? "bg-background text-primary shadow-sm"
                                  : "text-muted-foreground hover:bg-background hover:text-foreground",
                              ].join(" ")}
                            >
                              <Icon className="h-4 w-4" />

                              <span className="truncate">{loan.shortName}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="p-4">
                        {activeLoan && (
                          <>
                            <div className="flex gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
                                <activeLoan.icon className="h-5 w-5" />
                              </div>

                              <div>
                                <h3 className="text-base font-semibold text-foreground">
                                  {activeLoan.name}
                                </h3>

                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                  {activeLoan.description}
                                </p>
                              </div>
                            </div>

                            <div className="mt-5 flex items-center justify-between rounded-md border border-border bg-muted/30 p-3">
                              <div>
                                <p className="text-xs font-semibold text-foreground">
                                  {activeLoan.detail}
                                </p>

                                <p className="mt-1 text-[11px] text-muted-foreground">
                                  {activeLoan.status === "available"
                                    ? "Apply online in a few simple steps."
                                    : "This product is coming soon."}
                                </p>
                              </div>

                              {activeLoan.status === "available" ? (
                                <Link
                                  to="/login?redirect=/customer/loans/apply"
                                  onClick={closeMenus}
                                  className="
                                    inline-flex
                                    h-9
                                    items-center
                                    gap-1.5
                                    rounded-md
                                    bg-primary
                                    px-3
                                    text-xs
                                    font-semibold
                                    text-primary-foreground
                                    hover:opacity-90
                                  "
                                >
                                  Apply
                                  <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                              ) : (
                                <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
                                  Coming soon
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* EMI */}

              <Link
                to="/emi-calculator"
                className="
                  rounded-md
                  px-3
                  py-2.5
                  text-sm
                  font-semibold
                  text-muted-foreground
                  transition
                  hover:bg-primary-soft
                  hover:text-primary
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
                  py-2.5
                  text-sm
                  font-semibold
                  text-muted-foreground
                  transition
                  hover:bg-primary-soft
                  hover:text-primary
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
                    py-2.5
                    text-sm
                    font-semibold
                    text-muted-foreground
                    transition
                    hover:bg-primary-soft
                    hover:text-primary
                  "
                >
                  Resources
                  <ChevronDown
                    className={[
                      "h-3.5 w-3.5 transition-transform",
                      desktopMenu === "resources" ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </button>

                {desktopMenu === "resources" && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-80 rounded-md border border-border bg-background p-2 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
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
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
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

          {/* ======================================================
             CUSTOMER DESKTOP NAV
          ====================================================== */}

          {isCustomer && (
            <nav className="ml-3 hidden items-center gap-0.5 lg:flex">
              {customerNavigation.map((item) => {
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={[
                      "rounded-md px-3.5 py-2.5 text-sm font-semibold transition",
                      active
                        ? "bg-primary-soft text-primary"
                        : "text-muted-foreground hover:bg-primary-soft hover:text-primary",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* ======================================================
             ADMIN DESKTOP NAV
          ====================================================== */}

          {isAdmin && (
            <nav className="ml-3 hidden items-center gap-0.5 lg:flex">
              {adminNavigation.map((item) => {
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={[
                      "rounded-md px-3.5 py-2.5 text-sm font-semibold transition",
                      active
                        ? "bg-primary-soft text-primary"
                        : "text-muted-foreground hover:bg-primary-soft hover:text-primary",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* ======================================================
             RIGHT SIDE
          ====================================================== */}

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            {/* DESKTOP SEARCH */}

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="
                hidden
                h-10
                w-[210px]
                items-center
                gap-2
                rounded-md
                border
                border-border
                bg-muted/30
                px-3
                text-left
                transition
                hover:border-primary/30
                hover:bg-primary-soft
                xl:flex
              "
            >
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />

              <span className="flex-1 text-xs text-muted-foreground">
                Search LoanPro
              </span>

              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">
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
                sm:h-10
                sm:w-10
                xl:hidden
              "
              aria-label="Search"
            >
              <Search className="h-[17px] w-[17px]" />
            </Button>

            {/* ====================================================
               NOTIFICATIONS
            ==================================================== */}

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
                    sm:h-10
                    sm:w-10
                  "
                  aria-label="Notifications"
                  aria-expanded={notificationsOpen}
                >
                  <Bell className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />

                  <span
                    className="
                      absolute
                      right-[7px]
                      top-[7px]
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-destructive
                      ring-2
                      ring-background
                    "
                  />
                </Button>

                {notificationsOpen && (
                  <>
                    {/* MOBILE BACKDROP */}

                    <div
                      className="
                        fixed
                        inset-0
                        z-[90]
                        bg-black/20
                        backdrop-blur-[2px]
                        lg:hidden
                      "
                      onClick={() => setNotificationsOpen(false)}
                    />

                    {/* MOBILE PANEL */}

                    <div
                      className="
                        fixed
                        left-3
                        right-3
                        top-[72px]
                        z-[100]
                        mx-auto
                        max-w-[420px]
                        lg:hidden
                      "
                    >
                      <NotificationPanel mobile />
                    </div>

                    {/* DESKTOP PANEL */}

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

            {/* ====================================================
               THEME
            ==================================================== */}

            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* ====================================================
               PUBLIC ACTIONS
            ==================================================== */}

            {!isAuthenticated && (
              <div className="hidden items-center gap-1.5 md:flex">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 rounded-md px-3"
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>

                <Link
                  to="/login?redirect=/customer/loans/apply"
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
                </Link>
              </div>
            )}

            {/* ====================================================
               ACCOUNT
            ==================================================== */}

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
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-primary-soft
                    text-primary
                    transition
                    hover:bg-primary/15
                    sm:h-10
                    sm:w-10
                    lg:w-auto
                    lg:gap-2
                    lg:rounded-md
                    lg:bg-transparent
                    lg:px-1.5
                  "
                  aria-label="Open account menu"
                  aria-expanded={accountOpen}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft">
                    {isAdmin ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </span>

                  <span className="hidden max-w-[100px] truncate text-xs font-semibold lg:block">
                    {user?.firstName ||
                      user?.name ||
                      (isAdmin ? "Admin" : "Account")}
                  </span>

                  <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground lg:block" />
                </button>

                {accountOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      top-[calc(100%+8px)]
                      z-[100]
                      w-[min(280px,calc(100vw-24px))]
                      overflow-hidden
                      rounded-md
                      border
                      border-border
                      bg-background
                      shadow-[0_24px_70px_rgba(15,23,42,0.16)]
                    "
                  >
                    <div className="border-b border-border p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
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

                          <p className="truncate text-[11px] text-muted-foreground">
                            {user?.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <Link
                        to={isAdmin ? "/admin/dashboard" : "/customer/profile"}
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

                        <span>{isLoading ? "Signing out..." : "Sign out"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ====================================================
               MOBILE MENU BUTTON
            ==================================================== */}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                closeMenus();
                setMobileOpen(true);
              }}
              className="
                h-9
                w-9
                rounded-md
                lg:hidden
                sm:h-10
                sm:w-10
              "
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ==========================================================
         MOBILE NAVIGATION
      ========================================================== */}

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="right"
          className="
            flex
            h-dvh
            w-[88%]
            max-w-[390px]
            flex-col
            gap-0
            overflow-hidden
            p-0
          "
        >
          {/* HEADER */}

          <SheetHeader
            className="
              shrink-0
              border-b
              border-border
              bg-brand-gradient
              px-5
              py-5
              text-left
              text-white
            "
          >
            <SheetTitle className="flex items-center gap-3 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/15 font-bold ring-1 ring-white/20">
                L
              </span>

              <span>
                <span className="block text-base font-bold">LoanPro</span>

                <span className="mt-0.5 block text-[11px] text-white/70">
                  {isAuthenticated
                    ? isAdmin
                      ? "Administration"
                      : "Your account"
                    : "Simple, secure lending"}
                </span>
              </span>
            </SheetTitle>
          </SheetHeader>

          {/* BODY */}

          <div className="min-h-0 flex-1 overflow-y-auto">
            {/* MOBILE SEARCH */}

            <div className="border-b border-border px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(true);
                  setMobileOpen(false);
                }}
                className="
                  mx-auto
                  flex
                  min-h-11
                  w-full
                  max-w-[310px]
                  items-center
                  gap-3
                  rounded-md
                  border
                  border-border
                  bg-muted/30
                  px-3
                  text-left
                  transition
                  hover:border-primary/30
                  hover:bg-primary-soft
                "
              >
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />

                <span className="flex-1 text-xs text-muted-foreground">
                  Search LoanPro
                </span>
              </button>
            </div>

            {/* LOGGED-IN USER */}

            {isAuthenticated && (
              <div className="border-b border-border p-4">
                <div className="flex items-center gap-3 rounded-md bg-primary-soft p-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-primary">
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

                    <p className="truncate text-[11px] text-muted-foreground">
                      {user?.email || ""}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ====================================================
               MOBILE MENU ITEMS
            ==================================================== */}

            <div className="p-4">
              {!isAuthenticated ? (
                <>
                  <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Explore
                  </p>

                  <div className="space-y-1">
                    {/* LOANS */}

                    <button
                      type="button"
                      onClick={() =>
                        setDesktopMenu(
                          desktopMenu === "mobile-loans"
                            ? null
                            : "mobile-loans",
                        )
                      }
                      className="
                        flex
                        min-h-13
                        w-full
                        items-center
                        gap-3
                        rounded-md
                        px-3
                        text-left
                        text-sm
                        font-semibold
                        transition
                        hover:bg-muted
                      "
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-soft text-primary">
                        <GraduationCap className="h-4 w-4" />
                      </span>

                      <span className="flex-1">Loans</span>

                      <ChevronRight
                        className={[
                          "h-4 w-4 transition-transform",
                          desktopMenu === "mobile-loans" ? "rotate-90" : "",
                        ].join(" ")}
                      />
                    </button>

                    {desktopMenu === "mobile-loans" && (
                      <div className="ml-4 space-y-1 border-l border-border pl-3">
                        {loanCatalog.map((loan) => {
                          const Icon = loan.icon;

                          return (
                            <Link
                              key={loan.id}
                              to={
                                loan.status === "available"
                                  ? "/login?redirect=/customer/loans/apply"
                                  : "/#loan-products"
                              }
                              onClick={closeMobile}
                              className="
                                flex
                                min-h-11
                                items-center
                                gap-3
                                rounded-md
                                px-3
                                text-sm
                                text-muted-foreground
                                transition
                                hover:bg-muted
                                hover:text-foreground
                              "
                            >
                              <Icon className="h-4 w-4" />

                              <span className="flex-1 truncate">
                                {loan.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {/* EMI */}

                    <Link
                      to="/emi-calculator"
                      onClick={closeMobile}
                      className="
                        flex
                        min-h-13
                        items-center
                        gap-3
                        rounded-md
                        px-3
                        text-sm
                        font-semibold
                        transition
                        hover:bg-muted
                      "
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-soft text-primary">
                        <Calculator className="h-4 w-4" />
                      </span>

                      <span className="flex-1">EMI Calculator</span>

                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>

                    {/* HOW IT WORKS */}

                    <button
                      type="button"
                      onClick={() => navigateToHash("#how-it-works")}
                      className="
                        flex
                        min-h-13
                        w-full
                        items-center
                        gap-3
                        rounded-md
                        px-3
                        text-left
                        text-sm
                        font-semibold
                        transition
                        hover:bg-muted
                      "
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-soft text-primary">
                        <BookOpen className="h-4 w-4" />
                      </span>

                      <span className="flex-1">How It Works</span>

                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {/* FAQ */}

                    <button
                      type="button"
                      onClick={() => navigateToHash("#faq")}
                      className="
                        flex
                        min-h-13
                        w-full
                        items-center
                        gap-3
                        rounded-md
                        px-3
                        text-left
                        text-sm
                        font-semibold
                        transition
                        hover:bg-muted
                      "
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-soft text-primary">
                        <CircleHelp className="h-4 w-4" />
                      </span>

                      <span className="flex-1">FAQs</span>

                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {isAdmin ? "Management" : "My Account"}
                  </p>

                  <div className="space-y-1">
                    {(isAdmin
                      ? adminNavigation
                      : [
                          {
                            label: "Dashboard",
                            path: "/customer/dashboard",
                            icon: Home,
                          },
                          {
                            label: "My Loans",
                            path: "/customer/loans",
                            icon: FileText,
                          },
                          {
                            label: "Apply for Loan",
                            path: "/customer/loans/apply",
                            icon: GraduationCap,
                          },
                          {
                            label: "Payments",
                            path: "/customer/payments",
                            icon: CreditCard,
                          },
                          {
                            label: "Profile",
                            path: "/customer/profile",
                            icon: User,
                          },
                        ]
                    ).map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={closeMobile}
                          className={[
                            "flex min-h-13 items-center gap-3 rounded-md px-3 text-sm font-semibold transition",
                            active
                              ? "bg-primary-soft text-primary"
                              : "hover:bg-muted",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "flex h-9 w-9 items-center justify-center rounded-md",
                              active ? "bg-primary/10" : "bg-muted",
                            ].join(" ")}
                          >
                            <Icon className="h-4 w-4" />
                          </span>

                          <span className="flex-1">{item.label}</span>

                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ======================================================
             MOBILE FOOTER
          ====================================================== */}

          <div className="shrink-0 border-t border-border bg-background p-4">
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-md"
                  onClick={() => {
                    navigate("/login");
                    closeMobile();
                  }}
                >
                  Login
                </Button>

                <Link
                  to="/login?redirect=/customer/loans/apply"
                  onClick={closeMobile}
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    rounded-md
                    bg-primary
                    text-sm
                    font-semibold
                    text-primary-foreground
                  "
                >
                  Apply Now
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2">
                  <span className="text-xs font-semibold">Appearance</span>

                  <ThemeToggle />
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    gap-3
                    rounded-md
                    px-3
                    text-left
                    text-sm
                    font-semibold
                    text-muted-foreground
                    transition
                    hover:bg-destructive/10
                    hover:text-destructive
                  "
                >
                  <LogOut className="h-4 w-4" />

                  {isLoading ? "Signing out..." : "Sign out"}
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* ==========================================================
         SEARCH
      ========================================================== */}

      <PublicSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

export default Navbar;
