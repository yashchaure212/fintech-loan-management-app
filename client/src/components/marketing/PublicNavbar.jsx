import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Calculator,
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
  ShieldCheck,
  FileText,
  BookOpen,
  CircleHelp,
} from "lucide-react";
import { Link } from "react-router-dom";

import ApplyNowButton from "./ApplyNowButton";
import PublicSearch from "./PublicSearch";
import { loanCatalog, loanTone } from "./loanCatalog";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navItems = [
  {
    label: "Loans",
    menu: "loans",
    description: "Explore loan products",
  },
  {
    label: "Tools",
    menu: "tools",
    description: "Plan before you apply",
  },
  {
    label: "How It Works",
    href: "#how-it-works",
  },
  {
    label: "Resources",
    menu: "resources",
    description: "Guides and answers",
  },
];

const toolItems = [
  {
    label: "EMI Calculator",
    description: "Estimate a monthly repayment.",
    href: "/emi-calculator",
    icon: Calculator,
  },
  {
    label: "Check Eligibility",
    description: "Get application-ready.",
    href: "#eligibility",
    icon: ShieldCheck,
  },
];

const resourceItems = [
  {
    label: "Required Documents",
    description: "Understand the document journey.",
    href: "#faq",
    icon: FileText,
  },
  {
    label: "Application Guide",
    description: "See the journey from start to review.",
    href: "#how-it-works",
    icon: BookOpen,
  },
  {
    label: "FAQs",
    description: "Answers to common questions.",
    href: "#faq",
    icon: CircleHelp,
  },
];

function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeLoanId, setActiveLoanId] = useState("education");

  const closeTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (closeTimer.current) {
        window.clearTimeout(closeTimer.current);
      }
    };
  }, []);

  const openMenu = (menu) => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
    }

    setActiveMenu(menu);
  };

  const closeMenuSoon = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
    }

    closeTimer.current = window.setTimeout(() => {
      setActiveMenu(null);
    }, 120);
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const activeLoan =
    loanCatalog.find((item) => item.id === activeLoanId) || loanCatalog[0];

  const ActiveIcon = activeLoan?.icon;

  const activeTone = loanTone[activeLoan?.tone] || loanTone.blue;

  return (
    <>
      {/* =========================================================
          DESKTOP / PUBLIC NAVBAR
      ========================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[hsl(var(--brand-navy))] text-white shadow-[0_1px_0_rgba(255,255,255,0.05),0_12px_28px_rgba(2,20,45,0.18)]">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center px-4 sm:px-6 lg:px-8">
          {/* BRAND */}

          <Link
            to="/"
            className="group flex shrink-0 items-center gap-3"
            aria-label="LoanPro home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-[hsl(var(--brand-navy))] shadow-sm transition-transform duration-200 group-hover:-translate-y-px">
              L
            </span>

            <span className="hidden sm:block">
              <span className="block text-[17px] font-semibold leading-none tracking-tight">
                LoanPro
              </span>

              <span className="mt-1 block text-[10px] text-white/55">
                Digital lending platform
              </span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav
            className="ml-8 hidden items-center gap-1 xl:flex"
            aria-label="Public navigation"
            onMouseLeave={closeMenuSoon}
          >
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  if (item.menu) {
                    openMenu(item.menu);
                  }
                }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-white/80 transition-all duration-150 hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={[
                      "inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-all duration-150",
                      activeMenu === item.menu
                        ? "bg-white/10 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                    aria-expanded={activeMenu === item.menu}
                    onFocus={() => openMenu(item.menu)}
                  >
                    {item.label}

                    <ChevronDown
                      className={[
                        "h-3.5 w-3.5 transition-transform duration-200",
                        activeMenu === item.menu ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </button>
                )}

                {item.menu && activeMenu === item.menu ? (
                  <MegaMenu
                    type={item.menu}
                    activeLoanId={activeLoanId}
                    setActiveLoanId={setActiveLoanId}
                    activeLoan={activeLoan}
                    ActiveIcon={ActiveIcon}
                    activeTone={activeTone}
                    onClose={() => setActiveMenu(null)}
                  />
                ) : null}
              </div>
            ))}
          </nav>

          {/* RIGHT SIDE ACTIONS */}

          <div className="ml-auto flex items-center gap-1.5">
            {/* DESKTOP SEARCH */}

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white/70 transition-all duration-150 hover:border-white/15 hover:bg-white/10 hover:text-white lg:flex"
              aria-label="Search LoanPro"
            >
              <Search className="h-4 w-4" />

              <span>Search</span>

              <kbd className="ml-1 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-white/45">
                Ctrl K
              </kbd>
            </button>

            {/* LOGIN */}

            <Link to="/login" className="hidden lg:block">
              <Button
                variant="ghost"
                className="h-10 text-white/85 hover:bg-white/10 hover:text-white"
              >
                Login
              </Button>
            </Link>

            {/* APPLY */}

            <ApplyNowButton className="hidden min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[hsl(var(--brand-navy))] shadow-sm transition-all duration-200 hover:-translate-y-px hover:bg-white/90 lg:inline-flex" />

            {/* MOBILE SEARCH */}

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Search LoanPro"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* MOBILE MENU */}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-lg text-white hover:bg-white/10 hover:text-white lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* SEARCH */}

      <PublicSearch open={searchOpen} onOpenChange={setSearchOpen} />

      {/* =========================================================
    MOBILE SHEET
========================================================= */}

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="right"
          className="
      w-[92%]
      max-w-sm
      overflow-hidden
      border-l
      border-slate-200
      bg-white
      p-0
      text-slate-900
      shadow-[-20px_0_60px_rgba(15,23,42,0.18)]
    "
        >
          {/* =====================================================
        MOBILE HEADER
    ====================================================== */}

          <SheetHeader
            className="
        border-b
        border-slate-200
        bg-[hsl(var(--brand-navy))]
        px-5
        py-5
        text-left
      "
          >
            <SheetTitle className="flex items-center gap-2.5 text-white">
              <span
                className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-white
            text-sm
            font-bold
            text-[hsl(var(--brand-navy))]
            shadow-sm
          "
              >
                L
              </span>

              <span className="text-base font-semibold">LoanPro</span>
            </SheetTitle>
          </SheetHeader>

          {/* =====================================================
        MOBILE CONTENT
    ====================================================== */}

          <div className="flex min-h-[calc(100vh-5rem)] flex-col overflow-y-auto bg-white">
            {/* ===================================================
          SEARCH
      ==================================================== */}

            <div className="border-b border-slate-200 bg-slate-50 p-4">
              <button
                type="button"
                onClick={() => {
                  closeMobile();
                  setSearchOpen(true);
                }}
                className="
            flex
            min-h-11
            w-full
            items-center
            gap-3
            rounded-xl
            border
            border-slate-200
            bg-white
            px-3
            text-left
            text-sm
            text-slate-500
            shadow-sm
            transition-all
            duration-200
            hover:border-slate-300
            hover:bg-slate-50
            hover:text-slate-700
            active:scale-[0.99]
          "
              >
                <Search className="h-4 w-4 shrink-0 text-slate-400" />

                <span className="flex-1">Search loans, tools and guides</span>

                <kbd
                  className="
              hidden
              rounded-md
              border
              border-slate-200
              bg-slate-50
              px-1.5
              py-0.5
              text-[9px]
              text-slate-400
              sm:block
            "
                >
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* ===================================================
          MOBILE NAVIGATION
      ==================================================== */}

            <nav
              className="space-y-1 bg-white p-4"
              aria-label="Mobile public navigation"
            >
              {/* Home */}

              <Link
                to="/"
                onClick={closeMobile}
                className="
            flex
            min-h-12
            items-center
            rounded-xl
            px-3
            text-sm
            font-semibold
            text-slate-700
            transition-colors
            duration-150
            hover:bg-slate-100
            hover:text-slate-900
          "
              >
                Home
              </Link>

              {/* =================================================
            LOANS
        ================================================== */}

              <p
                className="
            px-3
            pb-1
            pt-5
            text-[11px]
            font-bold
            uppercase
            tracking-[0.12em]
            text-slate-400
          "
              >
                Loan products
              </p>

              {loanCatalog.map((loan) => {
                const Icon = loan.icon;
                const colors = loanTone[loan.tone] || loanTone.blue;

                return (
                  <a
                    key={loan.id}
                    href={loan.href}
                    onClick={closeMobile}
                    className="
                group
                flex
                min-h-12
                items-center
                gap-3
                rounded-xl
                border
                border-transparent
                px-3
                py-2.5
                transition-all
                duration-150
                hover:border-slate-200
                hover:bg-slate-50
                active:bg-slate-100
              "
                  >
                    {/* Icon */}

                    <span
                      className={`
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  ${colors.icon}
                `}
                    >
                      <Icon className="h-4 w-4" />
                    </span>

                    {/* Text */}

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-800">
                        {loan.name}
                      </span>

                      <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                        {loan.detail}
                      </span>
                    </span>

                    <ChevronRight
                      className="
                  h-4
                  w-4
                  shrink-0
                  text-slate-400
                  transition-transform
                  duration-150
                  group-hover:translate-x-0.5
                  group-hover:text-slate-600
                "
                    />
                  </a>
                );
              })}

              {/* =================================================
            TOOLS
        ================================================== */}

              <p
                className="
            px-3
            pb-1
            pt-5
            text-[11px]
            font-bold
            uppercase
            tracking-[0.12em]
            text-slate-400
          "
              >
                Tools & resources
              </p>

              <Link
                to="/emi-calculator"
                onClick={closeMobile}
                className="
            flex
            min-h-12
            items-center
            gap-3
            rounded-xl
            px-3
            text-sm
            font-semibold
            text-slate-700
            transition-colors
            duration-150
            hover:bg-slate-100
            hover:text-slate-900
          "
              >
                <Calculator className="h-4 w-4 text-slate-500" />
                EMI Calculator
              </Link>

              {/* How it works */}

              <a
                href="#how-it-works"
                onClick={closeMobile}
                className="
            flex
            min-h-12
            items-center
            rounded-xl
            px-3
            text-sm
            font-semibold
            text-slate-700
            transition-colors
            duration-150
            hover:bg-slate-100
            hover:text-slate-900
          "
              >
                How It Works
              </a>

              {/* Eligibility */}

              <a
                href="#eligibility"
                onClick={closeMobile}
                className="
            flex
            min-h-12
            items-center
            rounded-xl
            px-3
            text-sm
            font-semibold
            text-slate-700
            transition-colors
            duration-150
            hover:bg-slate-100
            hover:text-slate-900
          "
              >
                Eligibility
              </a>

              {/* FAQs */}

              <a
                href="#faq"
                onClick={closeMobile}
                className="
            flex
            min-h-12
            items-center
            rounded-xl
            px-3
            text-sm
            font-semibold
            text-slate-700
            transition-colors
            duration-150
            hover:bg-slate-100
            hover:text-slate-900
          "
              >
                FAQs
              </a>
            </nav>

            {/* ===================================================
          MOBILE CTA
      ==================================================== */}

            <div className="mt-auto border-t border-slate-200 bg-white p-4">
              <div
                className="
            rounded-2xl
            border
            border-blue-100
            bg-blue-50
            p-4
          "
              >
                <div className="flex items-start gap-3">
                  <span
                    className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-white
                text-blue-600
                shadow-sm
              "
                  >
                    <ArrowRight className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Ready to get started?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Start with the education-loan journey currently available
                      on LoanPro.
                    </p>
                  </div>
                </div>

                <ApplyNowButton
                  className="
              mt-4
              flex
              min-h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-4
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-px
              hover:bg-blue-700
              hover:shadow-md
              active:translate-y-0
            "
                />
              </div>

              {/* Login */}

              <Link
                to="/login"
                onClick={closeMobile}
                className="
            mt-3
            flex
            min-h-11
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            bg-white
            text-sm
            font-semibold
            text-slate-700
            transition-all
            duration-150
            hover:border-slate-300
            hover:bg-slate-50
            hover:text-slate-900
          "
              >
                Login
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

/* ===============================================================
   MEGA MENU
================================================================ */

function MegaMenu({
  type,
  activeLoanId,
  setActiveLoanId,
  activeLoan,
  ActiveIcon,
  activeTone,
  onClose,
}) {
  return (
    <div className="absolute left-0 top-full z-[60] w-[720px]">
      {/* Invisible hover bridge.
          Prevents the menu from closing while moving
          from the navbar into the floating panel. */}
      <div className="h-3 w-full" aria-hidden="true" />

      {/* Floating panel */}
      <div
        className="
          relative
          -mt-3
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          text-slate-900
          shadow-[0_24px_70px_rgba(15,23,42,0.20),0_8px_24px_rgba(15,23,42,0.08)]
          ring-1
          ring-slate-950/5
        "
      >
        {/* Subtle visual bridge between navbar and menu */}
        <div
          className="
            absolute
            -top-1
            left-8
            h-3
            w-3
            rotate-45
            border-l
            border-t
            border-slate-200
            bg-white
          "
          aria-hidden="true"
        />

        {type === "loans" ? (
          <div className="grid grid-cols-[260px_1fr]">
            {/* =====================================================
                LOAN CATEGORIES
            ====================================================== */}

            <div className="border-r border-slate-200 bg-slate-50 p-3">
              <div className="px-3 pb-2 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  Explore loans
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Choose a category to see what the journey is designed for.
                </p>
              </div>

              <div className="space-y-1">
                {loanCatalog.map((loan) => {
                  const Icon = loan.icon;
                  const colors = loanTone[loan.tone] || loanTone.blue;
                  const selected = loan.id === activeLoanId;

                  return (
                    <button
                      key={loan.id}
                      type="button"
                      onMouseEnter={() => setActiveLoanId(loan.id)}
                      onFocus={() => setActiveLoanId(loan.id)}
                      className={[
                        "group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-150",
                        selected
                          ? "bg-white shadow-sm ring-1 ring-slate-200"
                          : "bg-transparent hover:bg-white hover:shadow-sm",
                      ].join(" ")}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colors.icon}`}
                      >
                        {Icon ? <Icon className="h-4 w-4" /> : null}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-900">
                          {loan.name}
                        </span>

                        <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                          {loan.detail}
                        </span>
                      </span>

                      <ChevronRight
                        className={[
                          "h-4 w-4 shrink-0 transition-transform duration-150",
                          selected
                            ? "translate-x-0 text-slate-700"
                            : "text-slate-400 group-hover:translate-x-0.5",
                        ].join(" ")}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =====================================================
                DYNAMIC LOAN PREVIEW
            ====================================================== */}

            <LoanPreview
              loan={activeLoan}
              Icon={ActiveIcon}
              colors={activeTone}
              onClose={onClose}
            />
          </div>
        ) : (
          <SimpleMegaMenu type={type} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

/* ===============================================================
   LOAN PREVIEW
================================================================ */

function LoanPreview({ loan, Icon, colors, onClose }) {
  if (!loan) {
    return null;
  }

  return (
    <div className="relative bg-white p-6">
      <div className="flex items-start justify-between gap-5">
        <div className="flex items-start gap-4">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.icon}`}
          >
            {Icon ? <Icon className="h-6 w-6" /> : null}
          </span>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                {loan.name}
              </h3>

              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                {loan.detail}
              </span>
            </div>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              {loan.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <MiniBenefit label="Digital journey" />
        <MiniBenefit label="Clear next steps" />
        <MiniBenefit label="Document visibility" />
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {loan.status === "available" ? (
          <ApplyNowButton className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-px hover:bg-primary-hover" />
        ) : (
          <a
            href="#loan-products"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition-all duration-150 hover:border-primary/30 hover:bg-primary-soft hover:text-primary"
          >
            View planned products
            <ArrowRight className="h-4 w-4" />
          </a>
        )}

        <a
          href="#loan-products"
          onClick={onClose}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition-all duration-150 hover:border-primary/30 hover:bg-primary-soft hover:text-primary"
        >
          Know more
          <ArrowRight className="h-4 w-4" />
        </a>

        {loan.id === "education" ? (
          <Link
            to="/emi-calculator"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Calculate EMI
          </Link>
        ) : null}
      </div>

      <div className="mt-7 flex items-center gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        Product information and eligibility depend on the applicable
        configuration.
      </div>
    </div>
  );
}

/* ===============================================================
   MINI BENEFIT
================================================================ */

function MiniBenefit({ label }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-medium text-slate-600">
      <span className="mb-2 block h-1.5 w-1.5 rounded-full bg-primary" />

      {label}
    </div>
  );
}

/* ===============================================================
   SIMPLE MEGA MENU
================================================================ */

function SimpleMegaMenu({ type, onClose }) {
  const items = type === "tools" ? toolItems : resourceItems;

  return (
    <div className="bg-white p-5">
      <div className="grid gap-2">
        {items.map((item) => {
          const Icon = item.icon;

          const content = (
            <>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                {Icon ? (
                  <Icon className="h-[18px] w-[18px]" />
                ) : (
                  <FileText className="h-[18px] w-[18px]" />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-900">
                  {item.label}
                </span>

                <span className="mt-0.5 block text-xs text-slate-500">
                  {item.description}
                </span>
              </span>

              <ArrowRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-slate-700" />
            </>
          );

          if (item.href.startsWith("/")) {
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={onClose}
                className="group flex items-center gap-3 rounded-xl bg-white p-3 transition-all duration-150 hover:bg-slate-50 hover:shadow-sm"
              >
                {content}
              </Link>
            );
          }

          return (
            <a
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="group flex items-center gap-3 rounded-xl bg-white p-3 transition-all duration-150 hover:bg-slate-50 hover:shadow-sm"
            >
              {content}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default PublicNavbar;
