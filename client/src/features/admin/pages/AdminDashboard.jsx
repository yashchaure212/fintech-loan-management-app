import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  if (isLoading || overviewLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h1 className="page-title">Unable to load dashboard</h1>
        <p className="mt-2 text-helper">Please refresh and try again.</p>
      </div>
    );
  }

  const stats = data?.data || [];
  const overview = overviewResponse?.data || {};
  const totalApplications = stats.reduce(
    (sum, item) => sum + (item._count?.status || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="page-header-card flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Admin dashboard</h1>
          <p className="mt-1 text-helper">
            Overview of customers, loan amounts, and applications by status.
          </p>
        </div>

        <Button asChild className="w-full sm:w-auto">
          <Link to="/admin/loans">
            View applications
            <ArrowRight />
          </Link>
        </Button>
      </div>

      {!overviewError ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card p-4 sm:p-5">
            <p className="financial-label">Total customers</p>
            <p className="financial-value mt-1">{overview.totalCustomers ?? 0}</p>
          </div>
          <div className="rounded-xl border bg-card p-4 sm:p-5">
            <p className="financial-label">Active customers</p>
            <p className="financial-value mt-1">{overview.activeCustomers ?? 0}</p>
          </div>
          <div className="rounded-xl border bg-card p-4 sm:p-5">
            <p className="financial-label">Total loan amount</p>
            <p className="financial-value mt-1">
              {formatCurrency(overview.totalLoanAmount)}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4 sm:p-5">
            <p className="financial-label">Total disbursed</p>
            <p className="financial-value mt-1">
              {formatCurrency(overview.totalDisbursed)}
            </p>
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border bg-card p-4 sm:p-5">
        <p className="financial-label">Total applications</p>
        <p className="financial-value mt-1">{totalApplications}</p>
      </div>

      {stats.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-8 text-center">
          <p className="text-sm font-medium">No application data yet</p>
          <p className="mt-1 text-helper">
            Statistics will appear when applications are submitted.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <Card key={item.status}>
              <CardContent className="space-y-3 p-4 sm:p-5">
                <StatusBadge status={item.status} type="loan" />
                <p className="financial-value">{item._count?.status ?? 0}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
