import {
  LogIn,
  Search,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/features/theme/ThemeToggle";

import NotificationMenu from "./NotificationMenu";
import AccountMenu from "./AccountMenu";

function NavbarActions({
  isAuthenticated,
  isAdmin,
  isCustomer,
  user,

  searchOpen,
  setSearchOpen,

  notificationsOpen,
  setNotificationsOpen,
  notificationRef,

  accountOpen,
  setAccountOpen,
  accountRef,

  notificationItems,
  unreadCount,
  markAllAsRead,
  markAsRead,

  closeMenus,
  handleLogout,
  isLoading,
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="ml-auto flex items-center gap-0.5">
        {/* DESKTOP SEARCH */}

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/15 hidden h-9 min-w-[200px] items-center gap-2 rounded-md border px-3 text-left transition-colors xl:flex"
        >
          <Search className="text-primary-foreground/60 h-4 w-4" />

          <span className="text-primary-foreground/60 flex-1 text-xs">
            Search loans & services
          </span>

          <kbd className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground/60 rounded border px-1.5 py-0.5 text-[10px]">
            Ctrl K
          </kbd>
        </button>

        {/* MOBILE SEARCH */}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setSearchOpen(true)}
          className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground h-9 w-9 rounded-md xl:hidden"
          aria-label="Search"
        >
          <Search className="h-[18px] w-[18px]" />
        </Button>

        {/* NOTIFICATIONS */}

        {isAuthenticated && (
          <NotificationMenu
            notificationRef={notificationRef}
            notificationsOpen={notificationsOpen}
            setNotificationsOpen={
              setNotificationsOpen
            }
            notificationItems={notificationItems}
            unreadCount={unreadCount}
            markAllAsRead={markAllAsRead}
            markAsRead={markAsRead}
            isCustomer={isCustomer}
            isAdmin={isAdmin}
            navigate={navigate}
          />
        )}

        {/* THEME */}

        <div className="hidden sm:block">
          <div className="[&_button]:text-primary-foreground [&_button:hover]:bg-primary-foreground/10">
            <ThemeToggle />
          </div>
        </div>

        {/* GUEST ACTIONS */}

        {!isAuthenticated && (
          <div className="hidden items-center gap-1.5 md:flex">
            <Button
              type="button"
              variant="ghost"
              className="text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground h-9 rounded-md px-3"
              onClick={() =>
                navigate("/login")
              }
            >
              <LogIn className="mr-2 h-4 w-4" />

              Login
            </Button>

            <Link
              to="/login?redirect=/customer/loans/apply"
              className="bg-primary-foreground text-primary inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-semibold transition hover:opacity-90"
            >
              Apply Now
            </Link>
          </div>
        )}

        {/* ACCOUNT */}

        {isAuthenticated && (
          <AccountMenu
            accountRef={accountRef}
            accountOpen={accountOpen}
            setAccountOpen={setAccountOpen}
            isAdmin={isAdmin}
            user={user}
            closeMenus={closeMenus}
            handleLogout={handleLogout}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* MOBILE SEARCH BAR */}

      <div className="border-primary-foreground/10 border-t px-3 py-2.5 lg:hidden">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="border-primary-foreground/15 bg-primary-foreground/10 hover:bg-primary-foreground/15 flex min-h-10 w-full items-center gap-3 rounded-md border px-3 text-left transition"
        >
          <Search className="text-primary-foreground/60 h-4 w-4 shrink-0" />

          <span className="text-primary-foreground/60 flex-1 text-xs">
            Search loans, FAQs, calculators...
          </span>

          <span className="bg-primary-foreground text-primary flex h-7 w-7 items-center justify-center rounded-md">
            <Search className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>
    </>
  );
}

export default NavbarActions;