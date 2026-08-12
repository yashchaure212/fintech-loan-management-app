import { useParams, useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import StatusBadge from "@/components/common/StatusBadge";
import { getStatusConfig } from "@/lib/status";

import { useGetLoanApplicationQuery } from "../api/loanApi";
import { useGetLoanEmiScheduleQuery } from "@/features/emi/api/emiApi";
import { formatCurrency } from "../utils/loanFormatters";

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function maskAadhaar(value) {
  if (!value) return "-";

  const aadhaar = String(value).replace(/\D/g, "");

  if (aadhaar.length !== 12) {
    return "•••• •••• ••••";
  }

  return `•••• •••• ${aadhaar.slice(-4)}`;
}

function Field({ label, value, emphasize = false }) {
  return (
    <div className="min-w-0">
      <p className="financial-label">{label}</p>
      <p
        className={[
          "mt-1 break-words",
          emphasize
            ? "financial-value"
            : "text-sm font-medium text-foreground",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function LoanDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetLoanApplicationQuery(id, {
    skip: !id,
  });

  const loanStatus = response?.data?.status;
  const shouldLoadSchedule =
    loanStatus === "DISBURSED" || loanStatus === "CLOSED";

  const { data: emiResponse, isLoading: isEmiLoading } =
    useGetLoanEmiScheduleQuery(id, {
      skip: !id || !shouldLoadSchedule,
    });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-48 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-40 animate-pulse rounded-xl border bg-card" />
        <div className="h-56 animate-pulse rounded-xl border bg-card" />
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center">
        <h1 className="page-title">Unable to load application</h1>
        <p className="mt-2 text-helper">
          {error?.data?.message ||
            "The loan application could not be loaded."}
        </p>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => navigate("/customer/loans")}
        >
          Back to my loans
        </Button>
      </div>
    );
  }

  const loan = response.data;
  const educationLoan = loan.educationLoan;
  const documents = loan.documents || [];
  const statusHistory = loan.statusHistory || [];
  const emiSchedule = emiResponse?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-caption text-primary">
            {loan.loanType?.name || "Loan application"}
          </p>
          <h1 className="page-title mt-1">Loan details</h1>
          {loan.applicationNumber ? (
            <p className="mt-1 text-helper">{loan.applicationNumber}</p>
          ) : null}
        </div>

        <StatusBadge status={loan.status} type="loan" />
      </div>

      <Card>
        <CardContent className="space-y-5 p-5 sm:p-6">
          <h2 className="section-title">Repayment summary</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Loan amount"
              value={formatCurrency(loan.loanAmount)}
              emphasize
            />
            <Field label="Monthly EMI" value={formatCurrency(loan.emi)} emphasize />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field
              label="Tenure"
              value={
                loan.tenureMonths ? `${loan.tenureMonths} months` : "-"
              }
            />
            <Field
              label="Interest rate"
              value={
                loan.interestRate != null ? `${loan.interestRate}%` : "-"
              }
            />
            <Field
              label="Processing fee"
              value={formatCurrency(loan.processingFee)}
            />
            <Field
              label="Total repayment"
              value={formatCurrency(loan.totalAmount)}
            />
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="section-title">Application info</h2>

        <div className="rounded-xl border bg-card p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Loan type" value={loan.loanType?.name || "-"} />
            <Field label="Category" value={loan.loanType?.category || "-"} />
            <Field
              label="Status"
              value={getStatusConfig(loan.status, "loan").label}
            />
            <Field
              label="Created on"
              value={formatDate(loan.createdAt)}
            />
          </div>
        </div>
      </section>

      {educationLoan ? (
        <section className="space-y-3">
          <h2 className="section-title">Student & course</h2>

          <div className="rounded-xl border bg-card p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Student name" value={educationLoan.studentName || "-"} />
              <Field label="Date of birth" value={formatDate(educationLoan.dateOfBirth)} />
              <Field label="Gender" value={educationLoan.gender || "-"} />
              <Field label="Mobile" value={educationLoan.mobile || "-"} />
              <Field label="Email" value={educationLoan.email || "-"} />
              <Field label="Aadhaar" value={maskAadhaar(educationLoan.aadhaarNumber)} />
              <Field label="PAN" value={educationLoan.panNumber || "-"} />
              <Field label="Course" value={educationLoan.courseName || "-"} />
              <Field label="College" value={educationLoan.collegeName || "-"} />
              <Field label="University" value={educationLoan.universityName || "-"} />
              <Field label="Study country" value={educationLoan.studyCountry || "-"} />
              <Field
                label="Course duration"
                value={
                  educationLoan.courseDurationMonths
                    ? `${educationLoan.courseDurationMonths} months`
                    : "-"
                }
              />
              <Field
                label="Admission status"
                value={educationLoan.admissionStatus || "-"}
              />
              <Field
                label="Estimated course fee"
                value={formatCurrency(educationLoan.estimatedCourseFee)}
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="section-title">Documents</h2>
          <p className="text-caption">
            {documents.length}{" "}
            {documents.length === 1 ? "document" : "documents"}
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card p-6 text-center">
            <p className="text-sm font-medium">No documents uploaded</p>
            <p className="mt-1 text-helper">
              Documents will appear here after upload.
            </p>
          </div>
        ) : (
          <div className="divide-y rounded-xl border bg-card">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {document.documentType?.name ||
                      document.documentType ||
                      document.documentTypeName ||
                      "Document"}
                  </p>
                  {document.ownerType ? (
                    <p className="mt-0.5 text-caption">{document.ownerType}</p>
                  ) : null}
                </div>

                <StatusBadge status={document.status || "PENDING"} type="document" />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="section-title">Timeline</h2>

        {statusHistory.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card p-6 text-center">
            <p className="text-helper">No application history available.</p>
          </div>
        ) : (
          <div className="rounded-xl border bg-card p-4 sm:p-5">
            <ol className="space-y-4">
              {statusHistory.map((history, index) => (
                <li key={history.id} className="relative flex gap-3">
                  {index < statusHistory.length - 1 ? (
                    <div className="absolute top-4 left-[5px] h-[calc(100%+0.5rem)] w-px bg-border" />
                  ) : null}

                  <div className="relative z-10 mt-1.5 size-2.5 shrink-0 rounded-full bg-primary" />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-medium">
                        {getStatusConfig(history.status, "loan").label}
                      </p>
                      <p className="text-caption">
                        {formatDateTime(history.createdAt)}
                      </p>
                    </div>

                    {history.remarks ? (
                      <p className="mt-1 text-helper">{history.remarks}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      {shouldLoadSchedule ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="section-title">EMI schedule</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/customer/payments")}
            >
              Pay EMI
            </Button>
          </div>

          {isEmiLoading ? (
            <div className="h-40 animate-pulse rounded-xl border bg-card" />
          ) : emiSchedule.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-card p-6 text-center">
              <p className="text-helper">EMI schedule is not available yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border bg-card">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b bg-muted/40 text-caption">
                  <tr>
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">Due date</th>
                    <th className="px-4 py-3 font-medium">EMI</th>
                    <th className="px-4 py-3 font-medium">Paid</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {emiSchedule.map((emi) => (
                    <tr key={emi.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3">{emi.installmentNumber}</td>
                      <td className="px-4 py-3">{formatDate(emi.dueDate)}</td>
                      <td className="px-4 py-3 tabular-nums">
                        {formatCurrency(emi.emiAmount)}
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {formatCurrency(emi.paidAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={emi.status} type="emi" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}

      <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => navigate("/customer/loans")}
        >
          Back to my loans
        </Button>

        {loan.status === "DRAFT" ? (
          <Button
            className="w-full sm:w-auto"
            onClick={() => navigate(`/customer/loans/${loan.id}/edit`)}
          >
            Continue application
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default LoanDetails;
