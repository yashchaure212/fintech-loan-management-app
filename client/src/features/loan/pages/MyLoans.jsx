import { ArrowRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/common/StatusBadge";
import { useGetMyLoanApplicationsQuery } from "../api/loanApi";

function formatCurrency(value) {
  if (value == null) return "-";
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function getCompletionPercentage(currentStep) {
  const step = Number(currentStep || 1);
  if (step <= 1) return 0;
  if (step >= 5) return 100;
  return Math.round(((step - 1) / 4) * 100);
}

function MyLoans() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetMyLoanApplicationsQuery();

  if (isLoading) {
    return <div className="space-y-4"><div className="h-36 animate-pulse rounded-2xl bg-card" /><div className="h-44 animate-pulse rounded-2xl bg-card" /></div>;
  }

  if (isError) {
    return <div className="page-header-card"><span className="section-eyebrow">My loans</span><h1 className="page-title mt-4">Unable to load applications</h1><p className="mt-2 text-helper">Please refresh the page and try again.</p></div>;
  }

  const applications = data?.data || [];

  return (
    <div className="space-y-6">
      <section className="page-header-card">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-eyebrow">Loan centre</span>
            <h1 className="page-title mt-4">My loans</h1>
            <p className="mt-2 max-w-2xl text-helper">View drafts, track applications and open the details of your loan journey.</p>
          </div>
          <Button className="w-full sm:w-auto" onClick={() => navigate("/customer/loans/apply")}>Apply new loan <ArrowRight /></Button>
        </div>
      </section>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-10 text-center shadow-card">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary"><FileText /></span>
          <p className="mt-4 text-sm font-bold">No loan applications yet</p>
          <p className="mt-1 text-helper">Start an education loan application to get started.</p>
          <Button className="mt-5" onClick={() => navigate("/customer/loans/apply")}>Apply for a loan</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((loan) => {
            const isDraft = loan.status === "DRAFT";
            const completion = getCompletionPercentage(loan.currentStep);

            return (
              <Card key={loan.id} className="overflow-hidden">
                <div className="h-1 bg-brand-gradient" />
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-bold sm:text-lg">{loan.loanType?.name || "Loan application"}</h2>
                        <StatusBadge status={loan.status} type="loan" />
                      </div>
                      <p className="mt-1 text-caption">{loan.applicationNumber || "Draft application"}</p>
                    </div>
                    <div className="flex gap-2">
                      {isDraft ? (
                        <Button className="w-full sm:w-auto" onClick={() => navigate(`/customer/loans/${loan.id}/edit`)}>Continue application <ArrowRight /></Button>
                      ) : (
                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate(`/customer/loans/${loan.id}`)}>View details <ArrowRight /></Button>
                      )}
                    </div>
                  </div>

                  {isDraft ? (
                    <div className="mt-6 rounded-2xl bg-primary-soft/60 p-4">
                      <div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold text-primary">Application progress</p><p className="text-xs font-bold text-primary">{completion}%</p></div>
                      <Progress value={completion} className="mt-3 h-2" />
                      <p className="mt-2 text-caption">Step {loan.currentStep || 1} of 5</p>
                    </div>
                  ) : null}

                  <div className="mt-5 grid grid-cols-3 divide-x rounded-2xl border bg-muted/20">
                    <Value label="Amount" value={formatCurrency(loan.loanAmount)} />
                    <Value label="Tenure" value={loan.tenureMonths ? `${loan.tenureMonths} mo` : "-"} />
                    <Value label="EMI" value={formatCurrency(loan.emi)} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Value({ label, value }) {
  return <div className="p-3.5 sm:p-4"><p className="financial-label">{label}</p><p className="mt-1 text-sm font-bold tabular-nums sm:text-base">{value}</p></div>;
}

export default MyLoans;
