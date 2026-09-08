import {
  Home,
  FileText,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const menu = [
  {
    name: "Dashboard",
    description: "Overview and key metrics",
    path: "/admin/dashboard",
    icon: Home,
  },
  {
    name: "Loan Applications",
    description: "Review and manage applications",
    path: "/admin/loans",
    icon: FileText,
  },
];

function AdminMobileSidebar({ open, setOpen }) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        className="w-[88%] max-w-sm border-r border-border bg-muted/30 p-0"
      >
        {/* Header */}
        <SheetHeader className="border-b border-border bg-card px-4 py-4 text-left">
          <SheetTitle className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground shadow-sm">
              L
            </span>

            <span className="text-base font-bold tracking-tight text-foreground">
              LoanPro Admin
            </span>
          </SheetTitle>

          <SheetDescription className="pl-[46px] text-[11px] text-muted-foreground">
            Manage loan applications
          </SheetDescription>
        </SheetHeader>

        {/* Navigation */}
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
          <div className="mb-2">
            <span className="section-eyebrow">
              Administration
            </span>

            <h2 className="mt-1 text-sm font-bold text-foreground">
              Workspace
            </h2>
          </div>

          <nav className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      "group grid min-h-[64px] grid-cols-[38px_minmax(0,1fr)_16px] items-center gap-3 px-3 py-2.5",
                      "border-b border-border last:border-b-0",
                      "transition-colors",
                      isActive
                        ? "bg-primary/5"
                        : "hover:bg-muted/50",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Icon */}
                      <span
                        className={[
                          "grid size-9 place-items-center rounded-md transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground group-hover:text-foreground",
                        ].join(" ")}
                      >
                        <Icon
                          className="size-[18px]"
                          strokeWidth={1.75}
                        />
                      </span>

                      {/* Content */}
                      <span className="min-w-0">
                        <span
                          className={[
                            "block truncate text-[13px] font-semibold",
                            isActive
                              ? "text-primary"
                              : "text-foreground",
                          ].join(" ")}
                        >
                          {item.name}
                        </span>

                        <span className="mt-0.5 block truncate text-[11px] leading-4 text-muted-foreground">
                          {item.description}
                        </span>
                      </span>

                      {/* Chevron */}
                      <ChevronRight
                        className={[
                          "size-4 transition-all",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground/50 group-hover:text-muted-foreground",
                        ].join(" ")}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Security card */}
          <div className="mt-3 rounded-lg border border-border bg-card p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary">
                <ShieldCheck
                  className="size-4"
                  strokeWidth={1.75}
                />
              </span>

              <div>
                <p className="text-xs font-bold text-foreground">
                  Admin workspace
                </p>

                <p className="text-[10px] text-muted-foreground">
                  Secure management access
                </p>
              </div>
            </div>

            <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
              Use this workspace to review applications and manage the
              LoanPro lending workflow.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-card px-4 py-3">
          <p className="text-center text-[10px] leading-4 text-muted-foreground">
            LoanPro Administration
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default AdminMobileSidebar;