import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, Phone } from "lucide-react";

import ApplyNowButton from "./ApplyNowButton";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

const desktopLinks = [
  { label: "Home", href: "/" },
  { label: "Loan Products", href: "#loan-products" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "EMI Calculator", href: "/emi-calculator" },
];

function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setOpen(false);

  const handleAnchorClick = (href) => {
    closeMenu();

    if (!href.startsWith("#")) return;

    if (location.pathname !== "/") {
      window.location.href = `/${href}`;
      return;
    }

    requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              L
            </span>

            <span className="hidden text-left sm:block">
              <span className="block text-[15px] font-semibold leading-none tracking-tight">
                LoanPro
              </span>
              <span className="mt-1 block text-[10px] text-muted-foreground">
                Financial services
              </span>
            </span>
          </Link>

          <nav className="ml-8 hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            <Link
              to="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Home
            </Link>

            <button
              type="button"
              onClick={() => handleAnchorClick("#loan-products")}
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              Loans
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => handleAnchorClick("#how-it-works")}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              How It Works
            </button>

            <Link
              to="/emi-calculator"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              EMI Calculator
            </Link>
          </nav>

          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <a
              href="tel:+910000000000"
              className="mr-2 inline-flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground"
            >
              <Phone className="h-4 w-4" />
              <span>Support</span>
            </a>

            <Link to="/login">
              <Button variant="ghost" className="min-h-10">
                Login
              </Button>
            </Link>

            <ApplyNowButton
              className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            />
          </div>

          <div className="ml-auto flex items-center gap-1 lg:hidden">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-md"
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[88%] max-w-sm p-0">
          <SheetHeader className="border-b border-border px-5 py-5 text-left">
            <SheetTitle className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                L
              </span>
              LoanPro
            </SheetTitle>
          </SheetHeader>

          <div className="p-4">
            <nav className="space-y-1">
              <Link
                to="/"
                onClick={closeMenu}
                className="flex min-h-12 items-center rounded-md px-3 text-sm font-medium hover:bg-muted"
              >
                Home
              </Link>

              <button
                type="button"
                onClick={() => handleAnchorClick("#loan-products")}
                className="flex min-h-12 w-full items-center rounded-md px-3 text-left text-sm font-medium hover:bg-muted"
              >
                Loan Products
              </button>

              <button
                type="button"
                onClick={() => handleAnchorClick("#how-it-works")}
                className="flex min-h-12 w-full items-center rounded-md px-3 text-left text-sm font-medium hover:bg-muted"
              >
                How It Works
              </button>

              <Link
                to="/emi-calculator"
                onClick={closeMenu}
                className="flex min-h-12 items-center rounded-md px-3 text-sm font-medium hover:bg-muted"
              >
                EMI Calculator
              </Link>
            </nav>

            <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-sm font-semibold">Need help?</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Get support with your application or account.
              </p>

              <div className="mt-4 flex gap-2">
                <Link to="/login" onClick={closeMenu} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>

                <ApplyNowButton
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default PublicNavbar;
