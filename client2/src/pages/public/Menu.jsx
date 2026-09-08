import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Bell,
  BookOpen,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  CreditCard,
  FileCheck2,
  FileText,
  HelpCircle,
  Info,
  LockKeyhole,
  LogIn,
  LogOut,
  MessageCircle,
  Settings2,
  ShieldCheck,
  User,
  WalletCards,
  History,
  AlertCircle,
  Scale,
  Eye,
  Smartphone,
  ReceiptText,
} from "lucide-react";
import { toast } from "react-hot-toast";

import ThemeToggle from "@/features/theme/ThemeToggle";
import { useLogoutMutation } from "@/features/auth/authApi";

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
   MENU ITEM
================================================================ */

function MenuItem({ icon: Icon, label, description, to, danger = false }) {
  return (
    <Link
      to={to}
      className="group flex min-h-[64px] items-center gap-3 border-b border-border px-3 py-3 transition-colors last:border-b-0 hover:bg-muted/50 sm:px-4"
    >
      <span
        className={`
          grid
          size-10
          shrink-0
          place-items-center
          rounded-lg
          ${
            danger
              ? "bg-destructive/10 text-destructive"
              : "bg-primary/10 text-primary"
          }
        `}
      >
        <Icon className="size-[18px]" strokeWidth={1.8} />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-[13px] font-semibold ${
            danger ? "text-destructive" : "text-foreground"
          }`}
        >
          {label}
        </span>

        <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
          {description}
        </span>
      </span>

      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

/* ================================================================
   SECTION
================================================================ */

function MenuSection({ title, caption, children }) {
  return (
    <section>
      <div className="mb-2.5">
        <h2 className="text-[15px] font-bold text-foreground sm:text-base">
          {title}
        </h2>

        {caption && (
          <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
            {caption}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        {children}
      </div>
    </section>
  );
}

/* ================================================================
   QUICK ACCOUNT ACTION
================================================================ */

function QuickAction({ icon: Icon, label, to }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2 rounded-lg border border-primary/10 bg-primary/[0.04] px-3 py-3 transition hover:border-primary/20 hover:bg-primary/[0.07]"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
        <Icon className="size-4" strokeWidth={1.8} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[11px] font-bold text-foreground">
          {label}
        </span>
      </span>

      <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-primary" />
    </Link>
  );
}

/* ================================================================
   COMPONENT
================================================================ */

function Menu() {
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [logoutRequest, { isLoading }] = useLogoutMutation();

  const role = getUserRole(user);

  const isAdmin = isAuthenticated && role === "ADMIN";

  const isCustomer = isAuthenticated && role === "CUSTOMER";

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

      navigate("/login", {
        replace: true,
      });
    }
  };

  /* ==============================================================
     RENDER
  ============================================================== */

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <main className="page-container py-5 sm:py-8">
        {/* ========================================================
            TOP HEADER
        ======================================================== */}

        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                LoanPro
              </p>

              <h1 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Menu
              </h1>

              <p className="mt-1 text-[11px] leading-5 text-muted-foreground sm:text-sm">
                Manage your account, applications and support.
              </p>
            </div>

            {isAuthenticated && (
              <Link
                to="/customer/profile"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary sm:size-11"
              >
                {user?.firstName || user?.name ? (
                  <span className="text-sm font-bold">
                    {(
                      user?.firstName?.[0] ||
                      user?.name?.[0] ||
                      "U"
                    ).toUpperCase()}
                  </span>
                ) : (
                  <User className="size-5" />
                )}
              </Link>
            )}
          </div>
        </section>

        {/* ========================================================
            LOGGED OUT
        ======================================================== */}

        {!isAuthenticated && (
          <section className="mt-5 overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm">
            <div className="flex items-start gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-foreground text-primary">
                <User className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary-foreground/60">
                  Your Account
                </p>

                <h2 className="mt-1 text-base font-bold">
                  Login to manage your LoanPro journey
                </h2>

                <p className="mt-1 text-[10px] leading-4 text-primary-foreground/70">
                  Access applications, payments, documents and your account.
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                to="/login"
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary-foreground px-4 text-xs font-bold text-primary"
              >
                <LogIn className="size-4" />
                Login
              </Link>

              <Link
                to="/login?redirect=/customer/loans/apply"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-4 text-xs font-bold text-primary-foreground"
              >
                Apply
              </Link>
            </div>
          </section>
        )}

        {/* ========================================================
            CUSTOMER ACCOUNT
        ======================================================== */}

        {isCustomer && (
          <>
            <section className="mt-5 overflow-hidden rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm sm:p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-foreground text-sm font-bold text-primary">
                  {(
                    user?.firstName?.[0] ||
                    user?.name?.[0] ||
                    "U"
                  ).toUpperCase()}
                </span>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary-foreground/60">
                    Welcome back
                  </p>

                  <h2 className="truncate text-base font-bold">
                    {user?.firstName || user?.name || "LoanPro Customer"}
                  </h2>

                  {user?.email && (
                    <p className="truncate text-[10px] text-primary-foreground/70">
                      {user.email}
                    </p>
                  )}
                </div>

                <Link
                  to="/customer/profile"
                  className="ml-auto rounded-md bg-primary-foreground/10 px-3 py-2 text-[10px] font-bold"
                >
                  Profile
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <QuickAction
                  icon={FileText}
                  label="My Loans"
                  to="/customer/loans"
                />

                <QuickAction
                  icon={CreditCard}
                  label="Pay EMI"
                  to="/customer/payments"
                />
              </div>
            </section>

            {/* Account */}
            <div className="mt-5 space-y-5">
              <MenuSection
                title="My Account"
                caption="Your personal account information"
              >
                <MenuItem
                  icon={User}
                  label="My Profile"
                  description="Manage personal and contact details"
                  to="/customer/profile"
                />

                <MenuItem
                  icon={ShieldCheck}
                  label="KYC & Verification"
                  description="Manage your verification information"
                  to="/customer/kyc"
                />

                <MenuItem
                  icon={Bell}
                  label="Notifications"
                  description="View important account updates"
                  to="/notifications"
                />

                <MenuItem
                  icon={LockKeyhole}
                  label="Security"
                  description="Keep your account secure"
                  to="/security"
                />
              </MenuSection>

              {/* Loan management */}
              <MenuSection
                title="My Loan Journey"
                caption="Everything related to your applications"
              >
                <MenuItem
                  icon={FileText}
                  label="My Loans"
                  description="View applications and loan status"
                  to="/customer/loans"
                />

                <MenuItem
                  icon={ClipboardList}
                  label="Application Status"
                  description="Track the progress of your application"
                  to="/customer/loans"
                />

                <MenuItem
                  icon={FileCheck2}
                  label="Loan Documents"
                  description="View documents associated with your loan"
                  to="/customer/loans"
                />

                <MenuItem
                  icon={History}
                  label="Application Activity"
                  description="Review important application updates"
                  to="/customer/loans"
                />
              </MenuSection>

              {/* Payments */}
              <MenuSection
                title="Payments"
                caption="Manage your loan repayments"
              >
                <MenuItem
                  icon={WalletCards}
                  label="Payments & EMIs"
                  description="View upcoming and due payments"
                  to="/customer/payments"
                />

                <MenuItem
                  icon={ReceiptText}
                  label="Payment History"
                  description="View previous payment activity"
                  to="/customer/payments"
                />

                <MenuItem
                  icon={CreditCard}
                  label="Repayment Details"
                  description="View your repayment schedule"
                  to="/customer/payments"
                />
              </MenuSection>
            </div>
          </>
        )}

        {/* ========================================================
            ADMIN
        ======================================================== */}

        {isAdmin && (
          <div className="mt-5 space-y-5">
            <section className="flex items-center gap-3 rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-foreground text-primary">
                <ShieldCheck className="size-5" />
              </span>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary-foreground/60">
                  Administration
                </p>

                <h2 className="truncate text-base font-bold">
                  {user?.firstName || user?.name || "Administrator"}
                </h2>

                <p className="text-[10px] text-primary-foreground/70">
                  Manage LoanPro operations
                </p>
              </div>
            </section>

            <MenuSection
              title="Administration"
              caption="Manage LoanPro operations"
            >
              <MenuItem
                icon={Home}
                label="Admin Dashboard"
                description="View your administration overview"
                to="/admin/dashboard"
              />

              <MenuItem
                icon={ClipboardList}
                label="Loan Applications"
                description="Review submitted applications"
                to="/admin/loans"
              />

              <MenuItem
                icon={Settings2}
                label="Loan Configuration"
                description="Manage loan products and configuration"
                to="/admin/loan-configuration"
              />

              <MenuItem
                icon={History}
                label="Application Activity"
                description="Review application workflow activity"
                to="/admin/loans"
              />
            </MenuSection>
          </div>
        )}

        {/* ========================================================
            HELP & SUPPORT
        ======================================================== */}

        <div className="mt-5 space-y-5">
          <MenuSection
            title="Help & Support"
            caption="Get assistance when you need it"
          >
            <MenuItem
              icon={HelpCircle}
              label="Help Centre"
              description="Find help for common LoanPro questions"
              to="/help"
            />

            <MenuItem
              icon={CircleHelp}
              label="Frequently Asked Questions"
              description="Browse answers to common questions"
              to="/help"
            />

            <MenuItem
              icon={MessageCircle}
              label="Contact Support"
              description="Get help with your account or application"
              to="/contact-support"
            />

            <MenuItem
              icon={AlertCircle}
              label="Report an Issue"
              description="Tell us if something is not working"
              to="/report-issue"
            />

            <MenuItem
              icon={Scale}
              label="Grievance Redressal"
              description="Learn about the complaint process"
              to="/grievance"
            />
          </MenuSection>

          {/* ======================================================
              INFORMATION
          ====================================================== */}

          <MenuSection
            title="Information"
            caption="Important information about LoanPro"
          >
            <MenuItem
              icon={Info}
              label="About LoanPro"
              description="Learn more about our platform"
              to="/about"
            />

            <MenuItem
              icon={BookOpen}
              label="Loan Guide"
              description="Learn about loans, EMIs and applications"
              to="/loan-guide"
            />

            <MenuItem
              icon={ShieldCheck}
              label="Security"
              description="How we help protect your account"
              to="/security"
            />

            <MenuItem
              icon={LockKeyhole}
              label="Privacy"
              description="Information about data and privacy"
              to="/privacy"
            />
          </MenuSection>

          {/* ======================================================
              LEGAL
          ====================================================== */}

          <MenuSection title="Legal" caption="Policies and important terms">
            <MenuItem
              icon={FileText}
              label="Terms & Conditions"
              description="Review the terms of using LoanPro"
              to="/terms"
            />

            <MenuItem
              icon={ShieldCheck}
              label="Privacy Policy"
              description="Read our privacy policy"
              to="/privacy"
            />

            <MenuItem
              icon={Scale}
              label="Loan Terms"
              description="General information about loan terms"
              to="/loan-terms"
            />
          </MenuSection>

          {/* ======================================================
              APP SETTINGS
          ====================================================== */}

          <MenuSection
            title="App Settings"
            caption="Customize your LoanPro experience"
          >
            <div className="flex min-h-[64px] items-center gap-3 border-b border-border px-3 py-3 sm:px-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
                <Eye className="size-[18px]" strokeWidth={1.8} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-foreground">
                  Appearance
                </span>

                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                  Switch between light and dark mode
                </span>
              </span>

              <ThemeToggle />
            </div>

            <MenuItem
              icon={Bell}
              label="Notification Preferences"
              description="Manage how you receive updates"
              to="/notification-preferences"
            />

            <MenuItem
              icon={Smartphone}
              label="App Experience"
              description="Manage your app preferences"
              to="/app-experience"
            />
          </MenuSection>

          {/* ======================================================
              LOGOUT
          ====================================================== */}

          {isAuthenticated && (
            <section>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoading}
                className="flex min-h-[64px] w-full items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/[0.03] px-3 py-3 text-left transition hover:bg-destructive/[0.07] sm:px-4"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive">
                  <LogOut className="size-[18px]" strokeWidth={1.8} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold text-destructive">
                    {isLoading ? "Signing out..." : "Log out"}
                  </span>

                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    Sign out of your LoanPro account
                  </span>
                </span>

                <ChevronRight className="size-4 text-destructive/60" />
              </button>
            </section>
          )}

          {/* ======================================================
              APP FOOTER
          ====================================================== */}

          <section className="pb-5 pt-3 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" />

              <p className="text-[10px] font-bold text-slate-500">LoanPro</p>
            </div>

            <p className="mt-1 text-[9px] leading-4 text-slate-400">
              Your digital lending journey.
            </p>

            <div className="mt-2 flex justify-center gap-3 text-[9px] text-slate-400">
              <Link to="#" className="hover:text-primary">
                Privacy
              </Link>

              <Link to="#" className="hover:text-primary">
                Terms
              </Link>

              <Link to="#" className="hover:text-primary">
                Grievance
              </Link>
            </div>

            <p className="mt-2 text-[9px] text-slate-400">Version 1.0.0</p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Menu;
