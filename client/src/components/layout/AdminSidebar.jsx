import { Home, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: Home,
  },
  {
    name: "Loan Applications",
    path: "/admin/loans",
    icon: FileText,
  },
];

function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block shadow-[8px_0_30px_rgba(15,23,42,0.025)]">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col">
        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Administration
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
                    "transition-colors duration-150",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={[
                        "h-4.5 w-4.5 shrink-0",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground",
                      ].join(" ")}
                    />

                    <span>{item.name}</span>

                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="rounded-2xl border border-primary/10 bg-primary-soft p-4">
            <p className="text-xs font-semibold">Admin workspace</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Manage applications and loan processing.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
