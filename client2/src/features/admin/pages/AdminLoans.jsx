import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Search,
  SlidersHorizontal,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function formatStatus(status) {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function AdminLoans() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useGetAdminLoansQuery({
    page,
    limit: 20,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>

        <div className="space-y-1">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10">
        <div className="max-w-lg">
          <p className="section-eyebrow">Applications</p>

          <h1 className="page-title mt-3">Unable to load applications</h1>

          <p className="mt-2 text-helper">
            We couldn't retrieve the application list right now. Please refresh
            and try again.
          </p>

          <Button
            variant="outline"
            className="mt-5"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  const loans = data?.data?.items || [];
  const totalPages = data?.data?.totalPages || 1;

  const filteredLoans = loans.filter((loan) => {
    if (!search.trim()) return true;

    const query = search.toLowerCase();

    const applicationNumber = loan.applicationNumber?.toLowerCase() || "";

    const customerName = getCustomerName(loan).toLowerCase();

    const loanType = loan.loanType?.name?.toLowerCase() || "";

    return (
      applicationNumber.includes(query) ||
      customerName.includes(query) ||
      loanType.includes(query)
    );
  });

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="flex flex-col gap-5 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="size-4" />

            <span className="text-xs font-medium">Loan operations</span>
          </div>

          <h1 className="page-title mt-3">Loan applications</h1>

          <p className="mt-2 max-w-2xl text-helper">
            Review submitted applications, verify customer information and move
            applications through the lending workflow.
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="financial-label">Total applications</p>

          <p className="mt-1 text-2xl font-bold tracking-tight">
            {data?.data?.total ?? loans.length}
          </p>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search applications..."
            className="h-10 pl-9"
          />
        </div>

        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <SlidersHorizontal />
          Filters
        </Button>
      </div>

      {/* Desktop table */}
      {filteredLoans.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
            <FileText className="size-5 text-muted-foreground" />
          </div>

          <p className="mt-4 text-sm font-semibold">
            {search ? "No matching applications" : "No applications yet"}
          </p>

          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            {search
              ? "Try a different application number, customer name or loan type."
              : "New loan submissions will appear here when customers apply."}
          </p>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/70 hover:bg-transparent">
                  <TableHead className="h-11 pl-0">Application</TableHead>

                  <TableHead className="h-11">Customer</TableHead>

                  <TableHead className="h-11">Loan type</TableHead>

                  <TableHead className="h-11">Amount</TableHead>

                  <TableHead className="h-11">Status</TableHead>

                  <TableHead className="h-11 pr-0 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredLoans.map((loan) => (
                  <TableRow
                    key={loan.id}
                    className="group border-b border-border/50 transition-colors hover:bg-muted/25"
                  >
                    <TableCell className="py-4 pl-0">
                      <div>
                        <p className="text-sm font-semibold">
                          {loan.applicationNumber || "—"}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {loan.id}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div>
                        <p className="text-sm font-medium">
                          {getCustomerName(loan)}
                        </p>

                        {loan.user?.phone ? (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {loan.user.phone}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <span className="text-sm">
                        {loan.loanType?.name || "—"}
                      </span>
                    </TableCell>

                    <TableCell className="py-4">
                      <span className="text-sm font-semibold">
                        {formatCurrency(loan.loanAmount)}
                      </span>
                    </TableCell>

                    <TableCell className="py-4">
                      <StatusBadge status={loan.status} type="loan" />
                    </TableCell>

                    <TableCell className="py-4 pr-0 text-right">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="opacity-70 transition-opacity group-hover:opacity-100"
                      >
                        <Link to={`/admin/loans/${loan.id}`}>
                          Review
                          <ChevronRight />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile */}
          <div className="space-y-1 md:hidden">
            {filteredLoans.map((loan) => (
              <Link
                key={loan.id}
                to={`/admin/loans/${loan.id}`}
                className="group block border-b border-border/60 py-4 transition-colors first:border-t hover:bg-muted/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {loan.applicationNumber || "Application"}
                    </p>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {getCustomerName(loan)}
                    </p>
                  </div>

                  <StatusBadge status={loan.status} type="loan" />
                </div>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {loan.loanType?.name || "Loan"}
                    </p>

                    <p className="mt-1 text-base font-semibold">
                      {formatCurrency(loan.loanAmount)}
                    </p>
                  </div>

                  <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 ? (
        <div className="flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AdminLoans;
