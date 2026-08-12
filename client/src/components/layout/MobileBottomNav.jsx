import { Home, User, FileText, CreditCard } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  {
    name: "Home",
    path: "/customer/dashboard",
    icon: Home,
  },
  {
    name: "Loans",
    path: "/customer/loans",
    icon: FileText,
  },
  {
    name: "Payments",
    path: "/customer/payments",
    icon: CreditCard,
  },
  {
    name: "Profile",
    path: "/customer/profile",
    icon: User,
  },
];

function MobileBottomNav() {
  return (
    <nav
      aria-label="Customer navigation"
      className="
        fixed inset-x-0 bottom-0 z-40
        border-t border-border/80
        bg-background/95
        pb-[env(safe-area-inset-bottom)]
        shadow-[0_-4px_20px_rgba(15,23,42,0.06)]
        backdrop-blur
        lg:hidden
      "
    >
      <div className="mx-auto grid h-16 max-w-lg grid-cols-4 px-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className="group relative flex min-w-0 items-center justify-center"
            >
              {({ isActive }) => (
                <div
                  className={[
                    "relative flex min-h-12 min-w-[64px] flex-col items-center justify-center gap-1 rounded-xl px-2",
                    "transition-all duration-200",
                    isActive
                      ? "bg-primary-soft text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")}
                >
                  {/* Active indicator */}
                  {isActive ? (
                    <span className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-primary" />
                  ) : null}

                  <Icon
                    className={[
                      "h-[19px] w-[19px] transition-transform duration-200",
                      isActive
                        ? "scale-105 text-primary"
                        : "group-hover:scale-105",
                    ].join(" ")}
                    strokeWidth={isActive ? 2.25 : 1.9}
                  />

                  <span
                    className={[
                      "text-[11px] leading-none",
                      isActive
                        ? "font-semibold text-primary"
                        : "font-medium text-muted-foreground",
                    ].join(" ")}
                  >
                    {item.name}
                  </span>
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
