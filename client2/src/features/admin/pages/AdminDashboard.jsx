import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/common/StatusBadge";

import { formatCurrency } from "@/features/loan/utils/loanFormatters";
import { useGetAdminDashboardQuery } from "@/features/dashboard/dashboardApi";
import { useGetAdminLoanDashboardQuery } from "../api/adminLoanApi";

function AdminDashboard() {
  const { data, isLoading, isError } = useGetAdminLoanDashboardQuery();

  const {
    data: overviewResponse,
    isLoading: overviewLoading,
    isError: overviewError,
  } = useGetAdminDashboardQuery();

  const loading = isLoading || overviewLoading;

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <div>
          <p className="section-eyebrow">Administration</p>
          <h1 className="page-title mt-3">Dashboard</h1>
          <p className="mt-2 text-helper">
            Unable to load the dashboard right now.
          </p>
        </div>

        <div className="border-y border-border py-8">
          <p className="text-sm font-medium text-foreground">
            Something went wrong while loading your data.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  const stats = data?.data || [];
  const overview = overviewResponse?.data || {};

  const totalApplications = stats.reduce(
    (sum, item) => sum + (item._count?.status || 0),
    0,
  );

  const pendingApplications = getStatusCount(stats, "UNDER_REVIEW");
  const approvedApplications = getStatusCount(stats, "APPROVED");
  const disbursedApplications = getStatusCount(stats, "DISBURSED");

  return (
    <div className="space-y-10">
      {/* -------------------------------------------------------
          HEADER
      ------------------------------------------------------- */}
      <header className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Administration</p>

          <h1 className="page-title mt-3">Dashboard</h1>

          <p className="mt-2 max-w-2xl text-helper">
            Monitor customers, loan applications and the overall lending
            pipeline from one place.
          </p>
        </div>

        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link to="/admin/loans">
            View applications
            <ArrowRight />
          </Link>
        </Button>
      </header>

      {/* -------------------------------------------------------
          FINANCIAL / BUSINESS SUMMARY
      ------------------------------------------------------- */}
      {!overviewError ? (
        <section>
          <div className="grid divide-y border-y border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            <Metric
              icon={Users}
              label="Total customers"
              value={overview.totalCustomers ?? 0}
              description="Registered customers"
            />

            <Metric
              icon={CheckCircle2}
              label="Active customers"
              value={overview.activeCustomers ?? 0}
              description="Currently active"
            />

            <Metric
              icon={BriefcaseBusiness}
              label="Loan amount"
              value={formatCurrency(overview.totalLoanAmount)}
              description="Across applications"
            />

            <Metric
              icon={FileCheck2}
              label="Total disbursed"
              value={formatCurrency(overview.totalDisbursed)}
              description="Disbursed loans"
            />
          </div>
        </section>
      ) : null}

      {/* -------------------------------------------------------
          APPLICATION OVERVIEW
      ------------------------------------------------------- */}
      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-title">Application overview</p>

            <p className="mt-1 text-helper">
              Current position of applications across the loan pipeline.
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {totalApplications}
            </span>{" "}
            total applications
          </p>
        </div>

        <div className="mt-5 grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
          <PipelineMetric
            label="Pending review"
            value={pendingApplications}
            icon={Clock3}
            description="Applications waiting for review"
          />

          <PipelineMetric
            label="Approved"
            value={approvedApplications}
            icon={CheckCircle2}
            description="Applications approved"
          />

          <PipelineMetric
            label="Disbursed"
            value={disbursedApplications}
            icon={FileCheck2}
            description="Loans already disbursed"
          />

          <PipelineMetric
            label="All applications"
            value={totalApplications}
            icon={BriefcaseBusiness}
            description="Applications received"
          />
        </div>
      </section>

      {/* -------------------------------------------------------
          APPLICATION STATUS
      ------------------------------------------------------- */}
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-title">Application status</p>

            <p className="mt-1 text-helper">
              A breakdown of applications by their current stage.
            </p>
          </div>

          {stats.length > 0 ? (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Link to="/admin/loans">
                View all
                <ArrowRight />
              </Link>
            </Button>
          ) : null}
        </div>

        {stats.length === 0 ? (
          <div className="mt-5 border-y border-dashed border-border py-12 text-center">
            <BriefcaseBusiness className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-3 text-sm font-semibold">
              No application data yet
            </p>

            <p className="mt-1 text-helper">
              Application statistics will appear here once customers submit
              applications.
            </p>
          </div>
        ) : (
          <div className="mt-5 divide-y border-y border-border">
            {stats.map((item) => (
              <ApplicationStatusRow
                key={item.status}
                status={item.status}
                count={item._count?.status ?? 0}
                total={totalApplications}
              />
            ))}
          </div>
        )}

        {stats.length > 0 ? (
          <div className="mt-4 sm:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link to="/admin/loans">
                View all applications
                <ArrowRight />
              </Link>
            </Button>
          </div>
        ) : null}
      </section>

      {/* -------------------------------------------------------
          QUICK ACTION
      ------------------------------------------------------- */}
      <section className="border-t border-border pt-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">
              Need to review an application?
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Open the application workspace to review customer details,
              documents and loan status.
            </p>
          </div>

          <Button asChild variant="outline">
            <Link to="/admin/loans">
              Open application workspace
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   METRIC
============================================================ */

function Metric({ icon: Icon, label, value, description }) {
  return (
    <div className="group flex min-h-32 flex-col justify-center px-0 py-5 sm:px-5 lg:first:pl-0">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />

        <p className="financial-label">{label}</p>
      </div>

      <p className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

/* ============================================================
   PIPELINE METRIC
============================================================ */

function PipelineMetric({ label, value, icon: Icon, description }) {
  return (
    <div className="flex items-start gap-3 px-0 py-5 sm:px-5 lg:first:pl-0">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0">
        <p className="financial-label">{label}</p>

        <p className="mt-1 text-xl font-bold tracking-tight">{value}</p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   APPLICATION STATUS ROW
============================================================ */

function ApplicationStatusRow({ status, count, total }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <Link
      to="/admin/loans"
      className="group flex flex-col gap-4 py-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <StatusBadge status={status} type="loan" />

        <span className="text-sm text-muted-foreground">
          {count === 1 ? "application" : "applications"}
        </span>
      </div>

      <div className="flex items-center gap-4 sm:w-64">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-brand-gradient transition-[width] duration-500"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        <span className="w-12 text-right text-sm font-semibold tabular-nums">
          {count}
        </span>

        <span className="hidden w-10 text-right text-xs text-muted-foreground sm:block">
          {percentage}%
        </span>
      </div>

      <ArrowRight className="hidden h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 sm:block" />
    </Link>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function getStatusCount(stats, status) {
  return stats.find((item) => item.status === status)?._count?.status ?? 0;
}

/* ============================================================
   LOADING
============================================================ */

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-4 h-9 w-48" />
          <Skeleton className="mt-3 h-4 w-80" />
        </div>

        <Skeleton className="h-11 w-full rounded-lg sm:w-40" />
      </div>

      <div className="grid divide-y border-y border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="min-h-32 px-0 py-5 sm:px-5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-3 h-8 w-24" />
            <Skeleton className="mt-2 h-3 w-32" />
          </div>
        ))}
      </div>

      <div>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />

        <div className="mt-5 grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex min-h-28 gap-3 px-0 py-5 sm:px-5">
              <Skeleton className="h-9 w-9 rounded-lg" />

              <div>
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-2 h-6 w-12" />
                <Skeleton className="mt-2 h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />

        <div className="mt-5 divide-y border-y border-border">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 py-5">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-2 flex-1 rounded-full" />
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
