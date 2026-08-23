import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/common/StatusBadge";
import { Progress } from "@/components/ui/progress";

import { useGetCustomerDashboardQuery } from "../dashboardApi";

function formatCurrency(value) {
  if (value == null) return "₹0";

  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Dashboard() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetCustomerDashboardQuery();

  const dashboard = data?.data;

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (isError || !dashboard) {
    return (
      <div className="space-y-8">
        <section className="border-b border-border pb-7">
          <span className="section-eyebrow">Customer portal</span>

          <h1 className="page-title mt-3">Unable to load your dashboard</h1>

          <p className="mt-2 max-w-xl text-helper">
            Something went wrong while loading your account information. Please
            refresh the page and try again.
          </p>

          <Button className="mt-5" onClick={() => window.location.reload()}>
            Refresh page
          </Button>
        </section>
      </div>
    );
  }

  /* =========================================================
     DATA
  ========================================================= */

  const recentApplications = dashboard.recentApplications || [];

  const emiDue = dashboard.nextEmi?.amount ?? 0;

  const profileCompletion = Math.min(
    100,
    Math.max(0, Number(dashboard.profileCompletion || 0)),
  );

  return (
    <div className="space-y-8 pb-6">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="border-b border-border pb-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <span className="section-eyebrow">Customer portal</span>

            <h1 className="page-title mt-3">
              Your loan journey, in one place.
            </h1>

            <p className="mt-2 max-w-2xl text-helper">
              Track applications, repayments and important account actions.
            </p>
          </div>

          <Button
            className="min-h-11 w-full shrink-0 sm:w-auto"
            onClick={() => navigate("/customer/loans/apply")}
          >
            Apply for a loan
            <ArrowRight />
          </Button>
        </div>
      </section>

      {/* =====================================================
          LOAN OVERVIEW
      ===================================================== */}

      <section>
        <div className="mb-3">
          <p className="section-title">Loan overview</p>
          <p className="mt-1 text-caption">Your current borrowing position</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          {/* Main balance */}

          <div className="bg-brand-gradient px-5 py-5 text-white sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/60">
                  Outstanding balance
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                  {formatCurrency(dashboard.totalOutstanding)}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-[11px] text-white/60">Total borrowed</p>

                <p className="mt-1 text-lg font-semibold">
                  {formatCurrency(dashboard.totalBorrowed)}
                </p>
              </div>
            </div>
          </div>

          {/* Metrics */}

          <div className="grid divide-y border-t border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <FinancialMetric
              label="Next EMI"
              value={formatCurrency(emiDue)}
              description={
                dashboard.nextEmi?.dueDate
                  ? `Due ${formatDate(dashboard.nextEmi.dueDate)}`
                  : "No EMI due"
              }
              action={
                emiDue > 0
                  ? {
                      label: "Pay now",
                      onClick: () => navigate("/customer/payments"),
                    }
                  : null
              }
            />

            <FinancialMetric
              label="Active loans"
              value={dashboard.activeLoans}
              description="Currently active"
            />

            <FinancialMetric
              label="Pending applications"
              value={dashboard.pendingApplications}
              description="Need attention"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section>
        <div className="mb-3">
          <p className="section-title">Quick actions</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <ActionRow
            icon={FileText}
            title="My loans"
            description="Applications and loan details"
            onClick={() => navigate("/customer/loans")}
          />

          <ActionRow
            icon={Wallet}
            title="Payments"
            description="EMI schedules and payments"
            onClick={() => navigate("/customer/payments")}
          />

          <ActionRow
            icon={CheckCircle2}
            title="Profile"
            description={`${profileCompletion}% complete`}
            onClick={() => navigate("/customer/profile")}
          />
        </div>
      </section>

      {/* =====================================================
          PROFILE COMPLETION
      ===================================================== */}

      {profileCompletion < 100 ? (
        <section className="rounded-xl border border-border bg-card px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Complete your profile
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Keep your information ready for a smoother loan review.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => navigate("/customer/profile")}
            >
              Complete profile
              <ArrowRight />
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Progress value={profileCompletion} className="h-1.5 flex-1" />

            <span className="text-xs font-semibold tabular-nums text-primary">
              {profileCompletion}%
            </span>
          </div>
        </section>
      ) : null}

      {/* =====================================================
          RECENT APPLICATIONS
      ===================================================== */}

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="section-title">Recent applications</p>

            <p className="mt-1 text-caption">Latest loan activity</p>
          </div>

          {recentApplications.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/customer/loans")}
            >
              View all
              <ArrowRight />
            </Button>
          ) : null}
        </div>

        {recentApplications.length === 0 ? (
          <EmptyApplications
            onStart={() => navigate("/customer/loans/apply")}
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            {recentApplications.map((application, index) => (
              <ApplicationRow
                key={application.id}
                application={application}
                index={index}
                onClick={() =>
                  application.status === "DRAFT"
                    ? navigate(`/customer/loans/${application.id}/edit`)
                    : navigate(`/customer/loans/${application.id}`)
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ============================================================
   FINANCIAL METRIC
============================================================ */

function FinancialMetric({ label, value, description, action }) {
  return (
    <div className="px-5 py-4 sm:px-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="financial-label">{label}</p>

          <p className="financial-value mt-1 text-lg">{value}</p>

          <p className="mt-0.5 text-caption">{description}</p>
        </div>

        {action ? (
          <Button
            variant="link"
            size="sm"
            className="mt-1 h-auto shrink-0 p-0"
            onClick={action.onClick}
          >
            {action.label}
            <ArrowRight />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

/* ============================================================
   ACTION ROW
============================================================ */

function ActionRow({ icon: Icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        w-full
        items-center
        gap-3
        border-b
        border-border
        px-4
        py-3.5
        text-left
        transition-colors
        last:border-b-0
        hover:bg-muted/30
        focus-visible:bg-muted/30
        focus-visible:outline-none
        sm:px-5
      "
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon className="h-4 w-4" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">
          {title}
        </span>

        <span className="mt-0.5 block text-xs text-muted-foreground">
          {description}
        </span>
      </span>

      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
    </button>
  );
}

/* ============================================================
   APPLICATION ROW
============================================================ */

function ApplicationRow({ application, index, onClick }) {
  const isDraft = application.status === "DRAFT";

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        w-full
        items-center
        gap-3
        border-b
        border-border
        px-4
        py-3.5
        text-left
        transition-colors
        last:border-b-0
        hover:bg-muted/30
        focus-visible:bg-muted/30
        focus-visible:outline-none
        sm:px-5
      "
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-soft text-[11px] font-semibold text-primary">
        {String(index + 1).padStart(2, "0")}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">
            {application.loanType?.name || "Loan Application"}
          </span>

          <StatusBadge status={application.status} type="loan" />
        </span>

        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
          {application.applicationNumber ||
            (isDraft ? "Draft application" : "Application")}
        </span>
      </span>

      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
    </button>
  );
}

/* ============================================================
   EMPTY APPLICATIONS
============================================================ */

function EmptyApplications({ onStart }) {
  return (
    <div className="rounded-xl border border-dashed border-border px-5 py-8 text-center">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Clock3 className="h-5 w-5" />
      </span>

      <p className="mt-3 text-sm font-semibold">No applications yet</p>

      <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
        Start a School Student Loan application when you are ready.
      </p>

      <Button size="sm" className="mt-4" onClick={onStart}>
        Start application
        <ArrowRight />
      </Button>
    </div>
  );
}

/* ============================================================
   LOADING SKELETON
============================================================ */

function DashboardSkeleton() {
  return (
    <div className="space-y-8 pb-6">
      {/* Header */}

      <section className="border-b border-border pb-6">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />

        <div className="mt-4 h-9 w-72 animate-pulse rounded bg-muted" />

        <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded bg-muted" />

        <div className="mt-5 h-11 w-40 animate-pulse rounded-lg bg-muted" />
      </section>

      {/* Loan overview */}

      <section>
        <div className="mb-3 h-5 w-32 animate-pulse rounded bg-muted" />

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="h-28 animate-pulse bg-muted" />

          <div className="grid sm:grid-cols-3">
            <div className="h-24 animate-pulse border-b bg-muted/40 sm:border-b-0 sm:border-r" />
            <div className="h-24 animate-pulse border-b bg-muted/30 sm:border-b-0 sm:border-r" />
            <div className="h-24 animate-pulse bg-muted/40" />
          </div>
        </div>
      </section>

      {/* Quick actions */}

      <section>
        <div className="mb-3 h-5 w-32 animate-pulse rounded bg-muted" />

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="h-16 animate-pulse bg-muted/30" />
          <div className="h-16 animate-pulse bg-muted/20" />
          <div className="h-16 animate-pulse bg-muted/30" />
        </div>
      </section>

      {/* Profile */}

      <section>
        <div className="h-28 animate-pulse rounded-xl border border-border bg-muted/20" />
      </section>

      {/* Applications */}

      <section>
        <div className="mb-3 h-5 w-40 animate-pulse rounded bg-muted" />

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="h-16 animate-pulse border-b bg-muted/30" />
          <div className="h-16 animate-pulse border-b bg-muted/20" />
          <div className="h-16 animate-pulse bg-muted/30" />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
