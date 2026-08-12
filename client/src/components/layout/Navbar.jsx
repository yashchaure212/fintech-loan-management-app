import { useState } from "react";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { logout as clearSession } from "@/features/auth/authSlice";
import { storage } from "@/utils/storage";

const customerNavigation = [
  {
    label: "My Loans",
    path: "/customer/loans",
  },
  {
    label: "Apply for Loan",
    path: "/customer/loans/apply",
  },
  {
    label: "Payments",
    path: "/customer/payments",
  },
];

const adminNavigation = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    label: "Loan Applications",
    path: "/admin/loans",
  },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [logoutRequest, { isLoading }] = useLogoutMutation();

  const isAdmin = location.pathname.startsWith("/admin");

  const navigation = isAdmin ? adminNavigation : customerNavigation;

  const dashboardPath = isAdmin ? "/admin/dashboard" : "/customer/dashboard";

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const handleLogout = async () => {
    const refreshToken = storage.getRefreshToken();

    try {
      await logoutRequest(refreshToken ? { refreshToken } : {}).unwrap();
    } catch (error) {
      console.error("Server logout failed:", error);
    } finally {
      dispatch(clearSession());

      toast.success("Logged out successfully");

      navigate("/login", {
        replace: true,
      });
    }
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <button
            type="button"
            onClick={() => navigate(dashboardPath)}
            className="flex shrink-0 items-center gap-2.5"
            aria-label="Go to dashboard"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-gradient text-sm font-bold text-white shadow-brand">
              L
            </span>

            <span className="hidden text-left sm:block">
              <span className="block text-[15px] font-semibold leading-none tracking-tight text-foreground">
                LoanPro
              </span>

              <span className="mt-1 block text-[10px] text-muted-foreground">
                Financial services
              </span>
            </span>
          </button>

          {/* Desktop navigation */}
          <nav
            aria-label={isAdmin ? "Admin navigation" : "Customer navigation"}
            className="ml-8 hidden items-center gap-1 lg:flex"
          >
            {navigation.map((item) => {
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={[
                    "relative flex min-h-10 items-center rounded-md px-3 text-sm font-medium",
                    "transition-colors duration-150",
                    active
                      ? "bg-primary-soft text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")}
                >
                  {item.label}

                  {active ? (
                    <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />

            {!isAdmin ? (
              <>
                {/* Notifications */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10 rounded-md"
                  onClick={() => navigate("/customer/notifications")}
                  aria-label="Notifications"
                >
                  <Bell className="h-[18px] w-[18px]" />

                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
                </Button>

                {/* Desktop profile */}
                <Button
                  type="button"
                  variant="ghost"
                  className="hidden h-10 gap-2 rounded-md px-2.5 lg:flex"
                  onClick={() => navigate("/customer/profile")}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <User className="h-4 w-4" />
                  </span>

                  <span className="text-sm font-medium">Profile</span>

                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </>
            ) : null}

            {/* Mobile menu */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-md lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Desktop logout */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden h-10 w-10 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive lg:flex"
              onClick={handleLogout}
              disabled={isLoading}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-[88%] max-w-sm p-0">
          <SheetHeader className="border-b border-border px-5 py-5 text-left">
            <SheetTitle className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-gradient text-sm font-bold text-white shadow-brand">
                L
              </span>

              <span>LoanPro</span>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-1 flex-col">
            {/* Account */}
            {!isAdmin ? (
              <button
                type="button"
                className="flex items-center gap-3 border-b border-border px-5 py-4 text-left transition-colors hover:bg-muted"
                onClick={() => {
                  navigate("/customer/profile");
                  closeMobileMenu();
                }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <User className="h-5 w-5" />
                </span>

                <span>
                  <span className="block text-sm font-semibold">
                    My Profile
                  </span>

                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Manage your account
                  </span>
                </span>
              </button>
            ) : null}

            {/* Navigation */}
            <nav className="space-y-1 p-4">
              {navigation.map((item) => {
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={[
                      "flex min-h-12 items-center rounded-md px-3 text-sm font-medium",
                      "transition-colors",
                      active
                        ? "bg-primary-soft text-primary"
                        : "text-foreground hover:bg-muted",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {!isAdmin ? (
                <Link
                  to="/customer/support"
                  onClick={closeMobileMenu}
                  className="flex min-h-12 items-center gap-3 rounded-md px-3 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <HelpCircle className="h-[18px] w-[18px] text-muted-foreground" />
                  Help & Support
                </Link>
              ) : null}
            </nav>

            {/* Help */}
            {!isAdmin ? (
              <div className="mx-4 mt-2 rounded-xl border border-primary/10 bg-primary-soft p-4">
                <p className="text-sm font-semibold">Need help?</p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Get assistance with your loan application or account.
                </p>
              </div>
            ) : null}

            {/* Logout */}
            <div className="mt-auto border-t border-border p-4">
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start gap-3 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={handleLogout}
                disabled={isLoading}
              >
                <LogOut className="h-[18px] w-[18px]" />
                {isLoading ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default Navbar;
