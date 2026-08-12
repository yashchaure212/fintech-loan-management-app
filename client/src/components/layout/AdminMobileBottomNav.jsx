import { Home, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { name: "Dashboard", path: "/admin/dashboard", icon: Home },
  { name: "Applications", path: "/admin/loans", icon: FileText },
];

function AdminMobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <div className="grid h-16 grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                [
                  "relative flex flex-col items-center justify-center gap-1",
                  "text-[11px] font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />
                  ) : null}
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default AdminMobileBottomNav;
