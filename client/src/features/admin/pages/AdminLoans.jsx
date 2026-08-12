import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/common/StatusBadge";
import { formatCurrency } from "@/features/loan/utils/loanFormatters";

import { useGetAdminLoansQuery } from "../api/adminLoanApi";

function getCustomerName(loan) {
  const profile = loan.user?.customerProfile;

  if (!profile) {
    return loan.user?.email || "-";
  }

  return [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "-";
}

function AdminLoans() {
  const { data, isLoading, isError } = useGetAdminLoansQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="hidden h-64 rounded-xl md:block" />
        <div className="space-y-3 md:hidden">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h1 className="page-title">Unable to load applications</h1>
        <p className="mt-2 text-helper">Please refresh and try again.</p>
      </div>
    );
  }

  const loans = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="page-header-card">
        <h1 className="page-title">Loan applications</h1>
        <p className="mt-1 text-helper">
          Review and process submitted education loan applications.
        </p>
      </div>

      {loans.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-8 text-center">
          <p className="text-sm font-medium">No applications found</p>
          <p className="mt-1 text-helper">
            New submissions will appear here for review.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden rounded-xl border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Application</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="px-4 font-medium">
                      {loan.applicationNumber || "—"}
                    </TableCell>
                    <TableCell>{getCustomerName(loan)}</TableCell>
                    <TableCell>{formatCurrency(loan.loanAmount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={loan.status} type="loan" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/admin/loans/${loan.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 md:hidden">
            {loans.map((loan) => (
              <Link
                key={loan.id}
                to={`/admin/loans/${loan.id}`}
                className="block rounded-xl border bg-card p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="subsection-title truncate">
                      {loan.applicationNumber || "Application"}
                    </p>
                    <p className="mt-1 text-caption">{getCustomerName(loan)}</p>
                  </div>
                  <StatusBadge status={loan.status} type="loan" />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="financial-label">Loan amount</p>
                    <p className="financial-value mt-1 text-base">
                      {formatCurrency(loan.loanAmount)}
                    </p>
                  </div>
                  <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminLoans;
