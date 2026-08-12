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
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-48 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
        </div>
        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-40 animate-pulse rounded-xl border bg-card"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h1 className="page-title">Unable to load applications</h1>
        <p className="mt-2 text-helper">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  const applications = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">My loans</h1>
          <p className="mt-1 text-helper">
            View drafts, track applications, and open loan details.
          </p>
        </div>

        <Button
          className="w-full sm:w-auto"
          onClick={() => navigate("/customer/loans/apply")}
        >
          Apply new loan
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-8 text-center">
          <p className="text-sm font-medium">No loan applications yet</p>
          <p className="mt-1 text-helper">
            Start an education loan application to get started.
          </p>
          <Button
            className="mt-5 w-full sm:w-auto"
            onClick={() => navigate("/customer/loans/apply")}
          >
            Apply for a loan
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((loan) => {
            const isDraft = loan.status === "DRAFT";
            const completion = getCompletionPercentage(loan.currentStep);

            return (
              <Card key={loan.id}>
                <CardContent className="space-y-4 p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="subsection-title truncate">
                        {loan.loanType?.name || "Loan application"}
                      </h2>

                      {loan.applicationNumber ? (
                        <p className="mt-1 text-caption">
                          {loan.applicationNumber}
                        </p>
                      ) : (
                        <p className="mt-1 text-caption">Draft application</p>
                      )}
                    </div>

                    <StatusBadge status={loan.status} type="loan" />
                  </div>

                  {isDraft ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-caption">
                          Step {loan.currentStep || 1} of 5
                        </p>
                        <p className="text-caption font-medium">
                          {completion}%
                        </p>
                      </div>
                      <Progress value={completion} className="h-1.5" />
                    </div>
                  ) : null}

                  <div className="grid grid-cols-3 gap-3 border-t pt-4">
                    <div>
                      <p className="financial-label">Amount</p>
                      <p className="mt-1 text-sm font-semibold tabular-nums">
                        {formatCurrency(loan.loanAmount)}
                      </p>
                    </div>

                    <div>
                      <p className="financial-label">Tenure</p>
                      <p className="mt-1 text-sm font-semibold tabular-nums">
                        {loan.tenureMonths
                          ? `${loan.tenureMonths} mo`
                          : "-"}
                      </p>
                    </div>

                    <div>
                      <p className="financial-label">EMI</p>
                      <p className="mt-1 text-sm font-semibold tabular-nums">
                        {formatCurrency(loan.emi)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    {isDraft ? (
                      <Button
                        className="w-full sm:w-auto"
                        onClick={() =>
                          navigate(`/customer/loans/${loan.id}/edit`)
                        }
                      >
                        Continue application
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => navigate(`/customer/loans/${loan.id}`)}
                      >
                        View details
                      </Button>
                    )}
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

export default MyLoans;
