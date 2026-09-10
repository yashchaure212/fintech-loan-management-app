import {
  ChevronDown,
  FileText,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

function AccountMenu({
  accountRef,
  accountOpen,
  setAccountOpen,
  isAdmin,
  user,
  closeMenus,
  handleLogout,
  isLoading,
}) {
  const displayName =
    user?.firstName ||
    user?.name ||
    (isAdmin ? "Administrator" : "Customer");

  return (
    <div
      ref={accountRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setAccountOpen(!accountOpen)
        }
        className="hover:bg-primary-foreground/10 flex h-9 items-center gap-2 rounded-md px-1.5 transition-colors"
        aria-label="Open account menu"
        aria-expanded={accountOpen}
      >
        <span className="bg-primary-foreground text-primary flex h-7 w-7 items-center justify-center rounded-full">
          {isAdmin ? (
            <ShieldCheck className="h-4 w-4" />
          ) : (
            <User className="h-4 w-4" />
          )}
        </span>

        <span className="text-primary-foreground hidden max-w-[110px] truncate text-xs font-semibold lg:block">
          {user?.firstName ||
            user?.name ||
            (isAdmin ? "Admin" : "Account")}
        </span>

        <ChevronDown className="text-primary-foreground/60 hidden h-3.5 w-3.5 lg:block" />
      </button>

      {accountOpen && (
        <div className="border-border bg-background absolute top-[calc(100%+8px)] right-0 z-[100] w-[280px] overflow-hidden rounded-lg border shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
          <div className="border-border border-b p-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                {isAdmin ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {displayName}
                </p>

                <p className="text-muted-foreground truncate text-xs">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <Link
              to={
                isAdmin
                  ? "/admin/dashboard"
                  : "/customer/profile"
              }
              onClick={closeMenus}
              className="hover:bg-muted flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition"
            >
              <User className="text-muted-foreground h-4 w-4" />

              <span>
                {isAdmin
                  ? "Admin Dashboard"
                  : "My Profile"}
              </span>
            </Link>

            {!isAdmin && (
              <Link
                to="/customer/loans"
                onClick={closeMenus}
                className="hover:bg-muted flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition"
              >
                <FileText className="text-muted-foreground h-4 w-4" />

                <span>My Loans</span>
              </Link>
            )}

            <div className="border-border my-1 border-t" />

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoading}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-medium transition"
            >
              <LogOut className="h-4 w-4" />

              <span>
                {isLoading
                  ? "Signing out..."
                  : "Sign out"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountMenu;