import { ArrowRight, CheckCircle2, Clock3, FileText, Wallet } from "lucide-react";
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
        <div className="page-header-card animate-pulse">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="mt-3 h-8 w-64 rounded bg-muted" />
          <div className="mt-3 h-4 w-80 rounded bg-muted" />
        </div>
        <div className="h-56 animate-pulse rounded-2xl bg-card" />
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="page-header-card">
        <span className="section-eyebrow">Dashboard</span>
        <h1 className="page-title mt-4">Unable to load dashboard</h1>
        <p className="mt-2 text-helper">Please refresh the page and try again.</p>
      </div>
    );
  }

  const recentApplications = dashboard.recentApplications || [];
  const emiDue = dashboard.nextEmi?.amount ?? 0;
  const profileCompletion = Number(dashboard.profileCompletion || 0);

  return (
    <div className="space-y-6">
      <section className="page-header-card">
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="section-eyebrow">Customer portal</span>
            <h1 className="page-title mt-4">Your loan journey, in one place.</h1>
            <p className="mt-2 max-w-2xl text-helper">
              Track applications, review your loan position and take the next required action.
            </p>
          </div>
          <Button className="w-full sm:w-auto" size="lg" onClick={() => navigate("/customer/loans/apply")}>
            Apply for a loan <ArrowRight />
          </Button>
        </div>
      </section>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-brand-gradient p-5 text-white sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/65">Loan overview</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">{formatCurrency(dashboard.totalOutstanding)}</p>
                <p className="mt-1 text-sm text-white/70">Current outstanding balance</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs text-white/65">Total borrowed</p>
                <p className="mt-1 text-lg font-semibold">{formatCurrency(dashboard.totalBorrowed)}</p>
              </div>
            </div>
          </div>

          <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="p-5">
              <p className="financial-label">Next EMI</p>
              <p className="financial-value mt-1">{formatCurrency(emiDue)}</p>
              <p className="mt-1 text-caption">
                {dashboard.nextEmi?.dueDate ? `Due ${formatDate(dashboard.nextEmi.dueDate)}` : "No EMI due right now"}
              </p>
              {emiDue > 0 ? (
                <Button variant="link" className="mt-2 h-auto p-0" onClick={() => navigate("/customer/payments")}>
                  Pay now <ArrowRight />
                </Button>
              ) : null}
            </div>
            <div className="p-5">
              <p className="financial-label">Active loans</p>
              <p className="financial-value mt-1">{dashboard.activeLoans}</p>
              <p className="mt-1 text-caption">Currently active</p>
            </div>
            <div className="p-5">
              <p className="financial-label">Pending applications</p>
              <p className="financial-value mt-1">{dashboard.pendingApplications}</p>
              <p className="mt-1 text-caption">Need review or completion</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <QuickCard icon={FileText} title="My loans" description="Review your applications and loan details." onClick={() => navigate("/customer/loans")} />
        <QuickCard icon={Wallet} title="Payments" description="View EMI schedules and pending payments." onClick={() => navigate("/customer/payments")} />
        <QuickCard icon={CheckCircle2} title="Profile" description={`Your profile is ${profileCompletion}% complete.`} onClick={() => navigate("/customer/profile")} />
      </section>

      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-title">Application progress</p>
              <p className="mt-1 text-helper">Keep your profile and documents ready for a smoother review.</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/customer/profile")}>Complete profile</Button>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${Math.min(100, Math.max(0, profileCompletion))}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-caption">
            <span>Profile completion</span><span>{profileCompletion}%</span>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="section-title">Recent applications</p>
            <p className="mt-1 text-helper">Your latest loan activity.</p>
          </div>
          {recentApplications.length > 0 ? <Button variant="ghost" size="sm" onClick={() => navigate("/customer/loans")}>View all</Button> : null}
        </div>

        {recentApplications.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card p-8 text-center">
            <Clock3 className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-semibold">No applications yet</p>
            <p className="mt-1 text-helper">Start an education loan application when you are ready.</p>
            <Button className="mt-5" onClick={() => navigate("/customer/loans/apply")}>Start application</Button>
          </div>
        ) : (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {recentApplications.map((application, index) => (
                <button
                  key={application.id}
                  type="button"
                  className="flex w-full flex-col gap-3 border-b px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-muted/35 sm:flex-row sm:items-center sm:justify-between"
                  onClick={() => application.status === "DRAFT" ? navigate(`/customer/loans/${application.id}/edit`) : navigate(`/customer/loans/${application.id}`)}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">{index + 1}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{application.loanType?.name || "Loan Application"}</p>
                      <p className="mt-0.5 text-caption">{application.applicationNumber || "Draft application"}</p>
                    </div>
                  </div>
                  <StatusBadge status={application.status} type="loan" />
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

function QuickCard({ icon: Icon, title, description, onClick }) {
  return (
    <button type="button" onClick={onClick} className="app-card app-card-hover group flex w-full items-start gap-4 p-5 text-left">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span>
      </span>
    </button>
  );
}

export default Dashboard;
