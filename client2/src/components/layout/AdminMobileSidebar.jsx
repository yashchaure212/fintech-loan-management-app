import { Home, FileText, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: Home },
  { name: "Loan Applications", path: "/admin/loans", icon: FileText },
];

function AdminMobileSidebar({ open, setOpen }) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-[85%] max-w-sm p-0">
        <SheetHeader className="border-b border-border px-5 py-5">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              L
            </div>
            LoanPro Admin
          </SheetTitle>
          <SheetDescription>Manage loan applications</SheetDescription>
        </SheetHeader>

        <nav className="flex-1 space-y-1 p-4">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    "flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    {isActive ? <ChevronRight className="h-4 w-4" /> : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default AdminMobileSidebar;
