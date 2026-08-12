import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

import {
  useGetAdminLoanByIdQuery,
  useUpdateLoanStatusMutation,
  useVerifyLoanDocumentMutation,
  useRejectLoanDocumentMutation,
} from "../api/adminLoanApi";

import CustomerInfo from "../components/CustomerInfo";
import LoanSnapshot from "../components/LoanSnapshot";
import StatusTimeline from "../components/StatusTimeline";
import DocumentCard from "../components/DocumentCard";
import AdminField from "../components/AdminField";
import StatusBadge from "../components/StatusBadge";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/features/loan/utils/loanFormatters";

const workflow = {
  DRAFT: [],
  SUBMITTED: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["DISBURSED"],
  DISBURSED: ["CLOSED"],
  CLOSED: [],
  REJECTED: [],
};

function AdminLoanDetails() {
  const { id } = useParams();

  const { data, isLoading, isError } = useGetAdminLoanByIdQuery(id);

  const loan = data?.data;

  const [updateLoanStatus, { isLoading: isUpdatingStatus }] =
    useUpdateLoanStatusMutation();

  const [verifyLoanDocument, { isLoading: isVerifyingDocument }] =
    useVerifyLoanDocumentMutation();

  const [rejectLoanDocument, { isLoading: isRejectingDocument }] =
    useRejectLoanDocumentMutation();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !loan) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h1 className="page-title">Application not found</h1>
        <p className="mt-2 text-helper">
          The loan application could not be loaded.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/admin/loans">← Back to applications</Link>
        </Button>
      </div>
    );
  }

  const availableActions = workflow[loan.status] || [];
  const customer = loan.user?.customerProfile;

  async function changeLoanStatus(status) {
    try {
      await updateLoanStatus({
        id,
        status,
        remarks: `Status changed to ${status}`,
      }).unwrap();

      toast.success(`Loan moved to ${status}`);
    } catch (error) {
      toast.error(error?.data?.message || "Status update failed");
    }
  }

  async function handleVerifyDocument(documentId) {
    try {
      await verifyLoanDocument(documentId).unwrap();
      toast.success("Document verified successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to verify document");
    }
  }

  async function handleRejectDocument(documentId) {
    try {
      await rejectLoanDocument({
        documentId,
        rejectionReason: "Document rejected by admin",
      }).unwrap();
      toast.success("Document rejected successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject document");
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="w-fit px-0">
          <Link to="/admin/loans">
            <ArrowLeft />
            Back to applications
          </Link>
        </Button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="page-title">Loan application</h1>
            <p className="mt-1 text-caption">
              {loan.applicationNumber || "No application number"}
            </p>
          </div>

          <StatusBadge status={loan.status} type="loan" />
        </div>
      </div>

      <section className="rounded-xl border bg-card p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminField label="Application" value={loan.applicationNumber} />
          <AdminField label="Loan type" value={loan.loanType?.name} />
          <AdminField
            label="Loan amount"
            value={formatCurrency(loan.loanAmount)}
            emphasize
          />
          <AdminField
            label="Monthly EMI"
            value={formatCurrency(loan.emi)}
            emphasize
          />
        </div>
      </section>

      {customer ? (
        <section className="rounded-xl border bg-card p-4 sm:p-5">
          <CustomerInfo customer={customer} />
        </section>
      ) : (
        <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-5">
          <h2 className="subsection-title">Customer information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Email" value={loan.user?.email} />
            <AdminField label="Phone" value={loan.user?.phone} />
          </div>
        </section>
      )}

      <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-5">
        <h2 className="subsection-title">Loan details</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminField
            label="Loan amount"
            value={formatCurrency(loan.loanAmount)}
            emphasize
          />
          <AdminField
            label="Tenure"
            value={
              loan.tenureMonths != null ? `${loan.tenureMonths} months` : "-"
            }
          />
          <AdminField
            label="Interest rate"
            value={
              loan.interestRate != null ? `${loan.interestRate}% p.a.` : "-"
            }
          />
          <AdminField
            label="Processing fee"
            value={formatCurrency(loan.processingFee)}
          />
          <AdminField label="EMI" value={formatCurrency(loan.emi)} emphasize />
          <AdminField
            label="Total interest"
            value={formatCurrency(loan.totalInterest)}
          />
          <AdminField
            label="Total amount"
            value={formatCurrency(loan.totalAmount)}
            emphasize
          />
        </div>
      </section>

      {loan.configurationSnapshot ? (
        <section className="rounded-xl border bg-card p-4 sm:p-5">
          <LoanSnapshot
            snapshot={loan.configurationSnapshot}
            loanType={loan.loanType}
          />
        </section>
      ) : null}

      {loan.educationLoan ? (
        <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-5">
          <h2 className="subsection-title">Education loan details</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AdminField
              label="Student name"
              value={loan.educationLoan.studentName}
            />
            <AdminField label="Course" value={loan.educationLoan.courseName} />
            <AdminField
              label="College"
              value={loan.educationLoan.collegeName}
            />
            <AdminField
              label="University"
              value={loan.educationLoan.universityName}
            />
            <AdminField
              label="Study country"
              value={loan.educationLoan.studyCountry}
            />
            <AdminField
              label="Course duration"
              value={
                loan.educationLoan.courseDurationMonths != null
                  ? `${loan.educationLoan.courseDurationMonths} months`
                  : "-"
              }
            />
            <AdminField
              label="Admission status"
              value={loan.educationLoan.admissionStatus}
            />
            <AdminField
              label="Estimated course fee"
              value={formatCurrency(loan.educationLoan.estimatedCourseFee)}
              emphasize
            />
          </div>
        </section>
      ) : null}

      {loan.educationLoan?.parents?.length > 0 ? (
        <section className="space-y-6 rounded-xl border bg-card p-4 sm:p-5">
          <h2 className="subsection-title">Parents / co-applicants</h2>

          {loan.educationLoan.parents.map((parent) => (
            <div
              key={parent.id}
              className="space-y-4 border-t pt-6 first:border-t-0 first:pt-0"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">
                  {parent.relation || "Parent"}
                </h3>
                {parent.isCoApplicant ? (
                  <Badge variant="info">Co-applicant</Badge>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField label="Name" value={parent.fullName} />
                <AdminField label="Mobile" value={parent.mobile} />
              </div>

              {parent.employment ? (
                <div className="grid gap-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-3">
                  <AdminField
                    label="Employment type"
                    value={parent.employment.employmentType}
                  />
                  <AdminField
                    label="Company"
                    value={parent.employment.companyName}
                  />
                  <AdminField
                    label="Designation"
                    value={parent.employment.designation}
                  />
                  <AdminField
                    label="Monthly income"
                    value={formatCurrency(parent.employment.monthlyIncome)}
                  />
                  <AdminField
                    label="Experience"
                    value={
                      parent.employment.experienceYears != null
                        ? `${parent.employment.experienceYears} years`
                        : "-"
                    }
                  />
                </div>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-5">
        <h2 className="subsection-title">Document review</h2>

        {loan.documents?.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {loan.documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onVerify={handleVerifyDocument}
                onReject={handleRejectDocument}
                isVerifying={isVerifyingDocument}
                isRejecting={isRejectingDocument}
              />
            ))}
          </div>
        ) : (
          <p className="text-helper">No loan documents uploaded.</p>
        )}
      </section>

      <section className="rounded-xl border bg-card p-4 sm:p-5">
        <StatusTimeline history={loan.statusHistory} />
      </section>

      {availableActions.length > 0 ? (
        <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-5">
          <h2 className="subsection-title">Application actions</h2>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {availableActions.includes("UNDER_REVIEW") ? (
              <Button
                disabled={isUpdatingStatus}
                loading={isUpdatingStatus}
                className="w-full sm:w-auto"
                onClick={() => changeLoanStatus("UNDER_REVIEW")}
              >
                Move to review
              </Button>
            ) : null}

            {availableActions.includes("APPROVED") ? (
              <Button
                variant="success"
                disabled={isUpdatingStatus}
                loading={isUpdatingStatus}
                className="w-full sm:w-auto"
                onClick={() => changeLoanStatus("APPROVED")}
              >
                Approve
              </Button>
            ) : null}

            {availableActions.includes("REJECTED") ? (
              <Button
                variant="destructive"
                disabled={isUpdatingStatus}
                loading={isUpdatingStatus}
                className="w-full sm:w-auto"
                onClick={() => changeLoanStatus("REJECTED")}
              >
                Reject
              </Button>
            ) : null}

            {availableActions.includes("DISBURSED") ? (
              <Button
                disabled={isUpdatingStatus}
                loading={isUpdatingStatus}
                className="w-full sm:w-auto"
                onClick={() => changeLoanStatus("DISBURSED")}
              >
                Disburse
              </Button>
            ) : null}

            {availableActions.includes("CLOSED") ? (
              <Button
                variant="outline"
                disabled={isUpdatingStatus}
                loading={isUpdatingStatus}
                className="w-full sm:w-auto"
                onClick={() => changeLoanStatus("CLOSED")}
              >
                Close
              </Button>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default AdminLoanDetails;
