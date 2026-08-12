import { Home, User, FileText, CreditCard } from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  {
    name: "Dashboard",
    path: "/customer/dashboard",
    icon: Home,
  },
  {
    name: "Profile",
    path: "/customer/profile",
    icon: User,
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
];

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col">
        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Navigation
          </p>

          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "group flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium",
                    "border border-transparent transition-all duration-150",
                    isActive
                      ? "border-primary/10 bg-primary-soft text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={[
                        "h-[18px] w-[18px] shrink-0",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground",
                      ].join(" ")}
                    />

                    <span>{item.name}</span>

                    {isActive ? (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    ) : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="rounded-xl border border-primary/10 bg-primary-soft p-4">
            <p className="text-xs font-semibold text-foreground">
              Secure application
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Your application and account information are managed through a
              secure customer portal.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
