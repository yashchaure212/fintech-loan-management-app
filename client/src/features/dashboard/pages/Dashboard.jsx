import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import StatusBadge from "@/components/common/StatusBadge";

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-40 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-36 animate-pulse rounded-xl border bg-card" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-lg border bg-card"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h1 className="page-title">Unable to load dashboard</h1>
        <p className="mt-2 text-helper">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  const recentApplications = dashboard.recentApplications || [];
  const emiDue = dashboard.nextEmi?.amount ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="mt-1 text-helper">
            Track your loans, EMI, and applications.
          </p>
        </div>

        <Button
          className="w-full sm:w-auto"
          onClick={() => navigate("/customer/loans/apply")}
        >
          Apply for a loan
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-5 p-5 sm:p-6">
          <div>
            <h2 className="section-title">Loan overview</h2>
            <p className="mt-1 text-helper">
              Your current borrowing and repayment position.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="financial-label">Total borrowed</p>
              <p className="financial-value mt-1">
                {formatCurrency(dashboard.totalBorrowed)}
              </p>
            </div>

            <div>
              <p className="financial-label">Outstanding</p>
              <p className="financial-value mt-1">
                {formatCurrency(dashboard.totalOutstanding)}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="financial-label">Next EMI</p>
              <p className="mt-1 text-base font-semibold tabular-nums">
                {formatCurrency(emiDue)}
              </p>
              {dashboard.nextEmi?.dueDate ? (
                <p className="mt-1 text-caption">
                  Due {formatDate(dashboard.nextEmi.dueDate)}
                </p>
              ) : (
                <p className="mt-1 text-caption">No EMI due right now</p>
              )}
              {emiDue > 0 ? (
                <Button
                  variant="link"
                  className="mt-1 h-auto p-0"
                  onClick={() => navigate("/customer/payments")}
                >
                  Pay now
                </Button>
              ) : null}
            </div>

            <div>
              <p className="financial-label">Active loans</p>
              <p className="mt-1 text-base font-semibold tabular-nums">
                {dashboard.activeLoans}
              </p>
              <p className="mt-1 text-caption">
                {dashboard.pendingApplications} pending application
                {dashboard.pendingApplications === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Profile complete" value={`${dashboard.profileCompletion}%`} />
        <Metric label="Active loans" value={String(dashboard.activeLoans)} />
        <Metric
          label="Pending apps"
          value={String(dashboard.pendingApplications)}
        />
        <Metric label="EMI due" value={formatCurrency(emiDue)} />
      </section>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => navigate("/customer/profile")}
        >
          Complete profile
        </Button>

        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => navigate("/customer/loans")}
        >
          View my loans
        </Button>

        {emiDue > 0 ? (
          <Button
            className="w-full sm:w-auto"
            onClick={() => navigate("/customer/payments")}
          >
            Pay EMI
          </Button>
        ) : null}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="section-title">Recent applications</h2>

          {recentApplications.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/customer/loans")}
            >
              View all
            </Button>
          ) : null}
        </div>

        {recentApplications.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card p-6 text-center">
            <p className="text-sm font-medium">No applications yet</p>
            <p className="mt-1 text-helper">
              Start an education loan application when you are ready.
            </p>
          </div>
        ) : (
          <div className="divide-y rounded-xl border bg-card">
            {recentApplications.map((application) => (
              <button
                key={application.id}
                type="button"
                className="flex w-full flex-col gap-2 px-4 py-4 text-left transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                onClick={() => {
                  if (application.status === "DRAFT") {
                    navigate(`/customer/loans/${application.id}/edit`);
                    return;
                  }

                  navigate(`/customer/loans/${application.id}`);
                }}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {application.loanType?.name || "Loan Application"}
                  </p>
                  <p className="mt-0.5 text-caption">
                    {application.applicationNumber || "Draft application"}
                  </p>
                </div>

                <StatusBadge status={application.status} type="loan" />
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border bg-card px-3 py-3 sm:px-4 sm:py-4">
      <p className="text-caption">{label}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums sm:text-base">
        {value}
      </p>
    </div>
  );
}

export default Dashboard;
