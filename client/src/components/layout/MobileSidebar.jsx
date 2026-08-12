import {
  Home,
  User,
  FileText,
  CreditCard,
  ChevronRight,
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

function MobileSidebar({ open, setOpen }) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-[85%] max-w-sm p-0">
        <SheetHeader className="border-b border-border px-5 py-5">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              L
            </div>
            LoanPro
          </SheetTitle>

          <SheetDescription>Manage your loan application</SheetDescription>
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
                    "flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-medium",
                    "transition-colors",
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

                    {isActive && <ChevronRight className="h-4 w-4" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="rounded-lg bg-surface-blue p-4">
            <p className="text-sm font-semibold">Need help?</p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Contact support if you need help completing your application.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileSidebar;
