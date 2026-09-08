import {
  ChevronRight,
  FileCog,
  FileText,
  Headphones,
  LogOut,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const moreLinks = [
  {
    name: "Admin Profile",
    description: "Manage your account and profile",
    path: "/admin/profile",
    icon: UserRound,
  },
  {
    name: "Loan Configuration",
    description: "Manage loan products and settings",
    path: "/admin/loan-types",
    icon: Settings,
  },
  {
    name: "Required Documents",
    description: "Configure required loan documents",
    path: "/admin/required-documents",
    icon: FileText,
  },
  {
    name: "Eligibility Rules",
    description: "Manage loan eligibility criteria",
    path: "/admin/eligibility",
    icon: FileCog,
  },
  {
    name: "Institutions",
    description: "Manage schools and institutions",
    path: "/admin/institutions",
    icon: Users,
  },
  {
    name: "Security & Access",
    description: "Roles and access permissions",
    path: "/admin/security",
    icon: ShieldCheck,
  },
  {
    name: "Help & Support",
    description: "Get assistance with LoanPro",
    path: "/admin/help",
    icon: Headphones,
  },
];

function AdminMore() {
  const handleLogout = () => {
    // Keep your existing logout functionality here.
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <section className="bg-primary px-4 pb-4 pt-3 md:px-6">
        <div className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-primary-foreground text-base font-bold text-primary">
            L
          </span>

          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-primary-foreground">
              LoanPro Admin
            </h1>

            <p className="truncate text-[11px] text-primary-foreground/70">
              Administration & management
            </p>
          </div>
        </div>

        {/* Admin summary */}
        <dl className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-card p-2.5 text-center shadow-raised">
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Workspace
            </dt>
            <dd className="mt-0.5 text-[13px] font-bold text-foreground">
              Admin
            </dd>
          </div>

          <div>
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Access
            </dt>
            <dd className="mt-0.5 text-[13px] font-bold text-success">
              Active
            </dd>
          </div>

          <div>
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Security
            </dt>
            <dd className="mt-0.5 text-[13px] font-bold text-foreground">
              Secure
            </dd>
          </div>
        </dl>
      </section>

      {/* Account & Administration */}
      <section className="px-4 pt-4 md:px-6">
        <span className="section-eyebrow">
          Administration
        </span>

        <h2 className="mt-1 text-[15px] font-bold text-foreground">
          Account & management
        </h2>

        <ul className="mt-2.5 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card shadow-card">
          {moreLinks.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className="group grid grid-cols-[36px_minmax(0,1fr)_16px] items-center gap-3 px-3 py-2.5 transition-colors hover:bg-surface"
                >
                  <span className="grid size-9 place-items-center rounded-md bg-surface text-primary transition-colors group-hover:bg-primary-soft">
                    <Icon
                      className="size-[18px]"
                      strokeWidth={1.75}
                    />
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-foreground">
                      {item.name}
                    </span>

                    <span className="mt-0.5 block truncate text-[11px] leading-4 text-muted-foreground">
                      {item.description}
                    </span>
                  </span>

                  <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </NavLink>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Security information */}
      <section className="px-4 pt-4 md:px-6">
        <div className="rounded-lg border border-border bg-card p-3 shadow-card">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-md bg-primary-soft text-primary">
              <ShieldCheck
                className="size-[18px]"
                strokeWidth={1.75}
              />
            </span>

            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground">
                Secure admin workspace
              </p>

              <p className="text-[11px] text-muted-foreground">
                Your management access is protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Logout */}
      <section className="px-4 py-4 md:px-6">
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border-strong bg-card text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </section>
    </div>
  );
}

export default AdminMore;
