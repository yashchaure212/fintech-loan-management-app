import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  FileCheck2,
  ShieldCheck,
  X,
  Clock3,
  UserRound,
  WalletCards,
  GraduationCap,
  Users,
  Landmark,
  FileText,
  History,
} from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

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

const decisionCopy = {
  UNDER_REVIEW: {
    title: "Move to review?",
    description:
      "This application will move to Under Review. The applicant will be notified of this update.",
    confirmLabel: "Move to review",
    variant: "outline",
    requiresConfirm: false,
  },
  APPROVED: {
    title: "Approve this application?",
    description:
      "The applicant will be notified that their loan has been approved. This action can be reversed later if needed.",
    confirmLabel: "Approve application",
    variant: "success",
    requiresConfirm: true,
  },
  REJECTED: {
    title: "Reject this application?",
    description:
      "The applicant will be notified that their loan has been rejected. Once rejected, this application cannot move forward.",
    confirmLabel: "Reject application",
    variant: "destructive",
    requiresConfirm: true,
  },
  DISBURSED: {
    title: "Disburse this loan?",
    description:
      "This marks the loan amount as disbursed to the applicant. Only confirm once the funds have actually been transferred.",
    confirmLabel: "Disburse loan",
    variant: "default",
    requiresConfirm: true,
  },
  CLOSED: {
    title: "Close this application?",
    description:
      "Closing this loan marks it as complete. This is typically done once the loan has been fully repaid.",
    confirmLabel: "Close application",
    variant: "outline",
    requiresConfirm: true,
  },
};

function AdminLoanDetails() {
  const { id } = useParams();

  const { data, isLoading, isError } = useGetAdminLoanByIdQuery(id);

  const loan = data?.data;

  const [pendingStatus, setPendingStatus] = useState(null);

  const [updateLoanStatus, { isLoading: isUpdatingStatus }] =
    useUpdateLoanStatusMutation();

  const [verifyLoanDocument, { isLoading: isVerifyingDocument }] =
    useVerifyLoanDocumentMutation();

  const [rejectLoanDocument, { isLoading: isRejectingDocument }] =
    useRejectLoanDocumentMutation();

  if (isLoading) {
    return <LoanDetailsSkeleton />;
  }

  if (isError || !loan) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10 text-destructive">
            <CircleAlert className="size-6" />
          </div>

          <h1 className="mt-5 text-xl font-semibold tracking-tight">
            Application not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The loan application could not be loaded. Please return to the
            applications list and try again.
          </p>

          <Button asChild variant="outline" className="mt-6">
            <Link to="/admin/loans">
              <ArrowLeft className="size-4" />
              Back to applications
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const availableActions = workflow[loan.status] || [];
  const customer = loan.user?.customerProfile;

  const documentCount = loan.documents?.length || 0;

  const verifiedDocuments =
    loan.documents?.filter(
      (document) =>
        document.status === "VERIFIED" || document.status === "APPROVED",
    ).length || 0;

  const verificationPercentage =
    documentCount > 0
      ? Math.min(100, (verifiedDocuments / documentCount) * 100)
      : 0;

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
    } finally {
      setPendingStatus(null);
    }
  }

  function requestStatusChange(status) {
    const copy = decisionCopy[status];

    if (!copy?.requiresConfirm) {
      changeLoanStatus(status);
      return;
    }

    setPendingStatus(status);
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
    <div className="min-h-dvh bg-background pb-32">
      <div className="mx-auto w-full max-w-[1480px] px-4 py-5 sm:px-6 lg:px-8">
        {/* =========================================================
            BACK NAVIGATION
        ========================================================= */}
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link to="/admin/loans">
              <ArrowLeft className="size-4" />
              Applications
            </Link>
          </Button>
        </div>

        {/* =========================================================
            APPLICATION HEADER
        ========================================================= */}
        <header className="border-b border-border pb-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Loan application
                </p>

                <StatusBadge status={loan.status} type="loan" />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <h1 className="break-all text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {loan.applicationNumber || "Application"}
                </h1>

                <span className="text-muted-foreground">/</span>

                <span className="text-sm font-medium text-muted-foreground">
                  {loan.loanType?.name || "Loan application"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {loan.user?.email ? <span>{loan.user.email}</span> : null}

                {loan.user?.phone ? (
                  <>
                    <span className="hidden text-border sm:block">•</span>
                    <span>{loan.user.phone}</span>
                  </>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {loan.status === "UNDER_REVIEW" ? (
                <Badge variant="warning" className="gap-1.5 px-3 py-1.5">
                  <CircleAlert className="size-3.5" />
                  Review required
                </Badge>
              ) : null}

              {loan.status === "APPROVED" ? (
                <Badge variant="success" className="gap-1.5 px-3 py-1.5">
                  <CheckCircle2 className="size-3.5" />
                  Approved
                </Badge>
              ) : null}

              {loan.status === "SUBMITTED" ? (
                <Badge variant="info" className="gap-1.5 px-3 py-1.5">
                  <Clock3 className="size-3.5" />
                  Awaiting review
                </Badge>
              ) : null}
            </div>
          </div>
        </header>

        {/* =========================================================
            FINANCIAL SUMMARY
        ========================================================= */}
        <section className="border-b border-border">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            <FinancialSummary
              label="Loan amount"
              value={formatCurrency(loan.loanAmount)}
              emphasize
            />

            <FinancialSummary
              label="Monthly EMI"
              value={formatCurrency(loan.emi)}
              emphasize
            />

            <FinancialSummary
              label="Interest rate"
              value={
                loan.interestRate != null ? `${loan.interestRate}% p.a.` : "-"
              }
            />

            <FinancialSummary
              label="Repayment tenure"
              value={
                loan.tenureMonths != null ? `${loan.tenureMonths} months` : "-"
              }
            />
          </div>
        </section>

        {/* =========================================================
            MAIN LAYOUT
        ========================================================= */}
        <div className="grid gap-10 py-9 xl:grid-cols-[minmax(0,1fr)_300px]">
          <main className="min-w-0 space-y-10">
            {/* =====================================================
                APPLICANT
            ===================================================== */}
            <ContentSection
              eyebrow="Applicant"
              title="Customer information"
              description="Identity and contact information associated with this application."
              icon={UserRound}
            >
              <div className="border-y border-border">
                {customer ? (
                  <div className="py-6">
                    <CustomerInfo customer={customer} />
                  </div>
                ) : (
                  <div className="grid gap-x-10 gap-y-7 py-6 sm:grid-cols-2">
                    <AdminField label="Email" value={loan.user?.email} />
                    <AdminField label="Phone" value={loan.user?.phone} />
                  </div>
                )}
              </div>
            </ContentSection>

            {/* =====================================================
                LOAN DETAILS
            ===================================================== */}
            <ContentSection
              eyebrow="Financials"
              title="Loan details"
              description="Financial configuration and calculated repayment information."
              icon={WalletCards}
            >
              <div className="border-y border-border">
                <div className="grid gap-x-10 gap-y-8 py-7 sm:grid-cols-2 lg:grid-cols-3">
                  <AdminField
                    label="Loan amount"
                    value={formatCurrency(loan.loanAmount)}
                    emphasize
                  />

                  <AdminField
                    label="Tenure"
                    value={
                      loan.tenureMonths != null
                        ? `${loan.tenureMonths} months`
                        : "-"
                    }
                  />

                  <AdminField
                    label="Interest rate"
                    value={
                      loan.interestRate != null
                        ? `${loan.interestRate}% p.a.`
                        : "-"
                    }
                  />

                  <AdminField
                    label="Processing fee"
                    value={formatCurrency(loan.processingFee)}
                  />

                  <AdminField
                    label="Monthly EMI"
                    value={formatCurrency(loan.emi)}
                    emphasize
                  />

                  <AdminField
                    label="Total interest"
                    value={formatCurrency(loan.totalInterest)}
                  />

                  <AdminField
                    label="Total amount payable"
                    value={formatCurrency(loan.totalAmount)}
                    emphasize
                  />
                </div>
              </div>
            </ContentSection>

            {/* =====================================================
                CONFIGURATION
            ===================================================== */}
            {loan.configurationSnapshot ? (
              <ContentSection
                eyebrow="Configuration"
                title="Loan configuration"
                description="Configuration captured when this application was created."
                icon={Landmark}
              >
                <div className="border-y border-border py-6">
                  <LoanSnapshot
                    snapshot={loan.configurationSnapshot}
                    loanType={loan.loanType}
                  />
                </div>
              </ContentSection>
            ) : null}

            {/* =====================================================
                STUDENT LOAN
            ===================================================== */}
            {loan.studentLoan ? (
              <ContentSection
                eyebrow="Education"
                title="Student loan details"
                description="Academic information supplied with the application."
                icon={GraduationCap}
              >
                <div className="border-y border-border">
                  <div className="grid gap-x-10 gap-y-8 py-7 sm:grid-cols-2 lg:grid-cols-3">
                    <AdminField
                      label="Student name"
                      value={loan.studentLoan.studentName}
                    />

                    <AdminField
                      label="Course"
                      value={loan.studentLoan.courseName}
                    />

                    <AdminField
                      label="College"
                      value={loan.studentLoan.collegeName}
                    />

                    <AdminField
                      label="University"
                      value={loan.studentLoan.universityName}
                    />

                    <AdminField
                      label="Study country"
                      value={loan.studentLoan.studyCountry}
                    />

                    <AdminField
                      label="Course duration"
                      value={
                        loan.studentLoan.courseDurationMonths != null
                          ? `${loan.studentLoan.courseDurationMonths} months`
                          : "-"
                      }
                    />

                    <AdminField
                      label="Admission status"
                      value={loan.studentLoan.admissionStatus}
                    />

                    <AdminField
                      label="Estimated course fee"
                      value={formatCurrency(
                        loan.studentLoan.estimatedCourseFee,
                      )}
                      emphasize
                    />
                  </div>
                </div>
              </ContentSection>
            ) : null}

            {/* =====================================================
                PARENTS / CO-APPLICANTS
            ===================================================== */}
            {loan.studentLoan?.parents?.length > 0 ? (
              <ContentSection
                eyebrow="Co-applicants"
                title="Parents / co-applicants"
                description="Applicant relationships and financial information."
                icon={Users}
              >
                <div className="divide-y divide-border border-y border-border">
                  {loan.studentLoan.parents.map((parent, index) => (
                    <PersonSection
                      key={parent.id}
                      index={index}
                      title={parent.relation || "Parent"}
                      badge={parent.isCoApplicant ? "Co-applicant" : null}
                    >
                      <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
                        <AdminField label="Name" value={parent.fullName} />

                        <AdminField label="Mobile" value={parent.mobile} />
                      </div>

                      {parent.employment ? (
                        <EmploymentSection employment={parent.employment} />
                      ) : null}
                    </PersonSection>
                  ))}
                </div>
              </ContentSection>
            ) : null}

            {/* =====================================================
                SCHOOL LOAN
            ===================================================== */}
            {loan.schoolLoan ? (
              <ContentSection
                eyebrow="School education"
                title="School student details"
                description="Academic and school information for the applicant."
                icon={GraduationCap}
              >
                <div className="border-y border-border">
                  <div className="grid gap-x-10 gap-y-8 py-7 sm:grid-cols-2 lg:grid-cols-3">
                    <AdminField
                      label="Student name"
                      value={loan.schoolLoan.studentName}
                    />

                    <AdminField
                      label="Date of birth"
                      value={
                        loan.schoolLoan.dateOfBirth
                          ? String(loan.schoolLoan.dateOfBirth).split("T")[0]
                          : "-"
                      }
                    />

                    <AdminField
                      label="School"
                      value={loan.schoolLoan.currentSchoolName}
                    />

                    <AdminField
                      label="School type"
                      value={loan.schoolLoan.schoolType}
                    />

                    <AdminField
                      label="Class"
                      value={loan.schoolLoan.currentClass?.replace(
                        "CLASS_",
                        "Class ",
                      )}
                    />

                    <AdminField
                      label="Academic year"
                      value={loan.schoolLoan.academicYear}
                    />

                    <AdminField
                      label="Continuing same school"
                      value={
                        loan.schoolLoan.continuingSameSchool ? "Yes" : "No"
                      }
                    />

                    {!loan.schoolLoan.continuingSameSchool ? (
                      <>
                        <AdminField
                          label="New school"
                          value={loan.schoolLoan.newSchoolName}
                        />

                        <AdminField
                          label="Expected joining date"
                          value={
                            loan.schoolLoan.expectedJoiningDate
                              ? String(
                                  loan.schoolLoan.expectedJoiningDate,
                                ).split("T")[0]
                              : "-"
                          }
                        />
                      </>
                    ) : null}
                  </div>

                  <div className="border-t border-border py-7">
                    <p className="mb-6 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      Education expenses
                    </p>

                    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                      <AdminField
                        label="Tuition fees"
                        value={formatCurrency(loan.schoolLoan.tuitionFees)}
                      />

                      <AdminField
                        label="Admission fees"
                        value={formatCurrency(loan.schoolLoan.admissionFees)}
                      />

                      <AdminField
                        label="Examination fees"
                        value={formatCurrency(loan.schoolLoan.examinationFees)}
                      />

                      <AdminField
                        label="Books"
                        value={formatCurrency(loan.schoolLoan.booksAmount)}
                      />

                      <AdminField
                        label="Uniform"
                        value={formatCurrency(loan.schoolLoan.uniformAmount)}
                      />

                      <AdminField
                        label="Equipment"
                        value={formatCurrency(loan.schoolLoan.equipmentAmount)}
                      />

                      <AdminField
                        label="Transportation"
                        value={formatCurrency(loan.schoolLoan.transportAmount)}
                      />

                      <AdminField
                        label="Hostel / boarding"
                        value={formatCurrency(loan.schoolLoan.hostelAmount)}
                      />

                      <AdminField
                        label="Other expenses"
                        value={formatCurrency(
                          loan.schoolLoan.otherExpensesAmount,
                        )}
                      />

                      <AdminField
                        label="Family contribution"
                        value={formatCurrency(
                          loan.schoolLoan.familyContribution,
                        )}
                      />

                      <AdminField
                        label="Scholarship / aid"
                        value={formatCurrency(
                          loan.schoolLoan.scholarshipAmount,
                        )}
                      />

                      <AdminField
                        label="Other funding"
                        value={formatCurrency(
                          loan.schoolLoan.otherFundingAmount,
                        )}
                      />
                    </div>
                  </div>
                </div>
              </ContentSection>
            ) : null}

            {/* =====================================================
                SCHOOL CO-APPLICANTS
            ===================================================== */}
            {loan.schoolLoan?.coApplicants?.length > 0 ? (
              <ContentSection
                eyebrow="Guardian"
                title="Parent / co-applicant"
                description="Guardian and financial information."
                icon={Users}
              >
                <div className="divide-y divide-border border-y border-border">
                  {loan.schoolLoan.coApplicants.map((person, index) => (
                    <PersonSection
                      key={person.id}
                      index={index}
                      title={person.relation || "Co-applicant"}
                      badge={person.isCoApplicant ? "Co-applicant" : null}
                    >
                      <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                        <AdminField label="Name" value={person.fullName} />

                        <AdminField label="Mobile" value={person.mobile} />

                        <AdminField
                          label="Date of birth"
                          value={
                            person.dateOfBirth
                              ? String(person.dateOfBirth).split("T")[0]
                              : "-"
                          }
                        />

                        <AdminField
                          label="Family monthly income"
                          value={formatCurrency(person.familyMonthlyIncome)}
                        />

                        <AdminField
                          label="Current address"
                          value={
                            person.currentAddress
                              ? `${person.currentAddress.city}, ${person.currentAddress.state}`
                              : "-"
                          }
                        />
                      </div>

                      {person.employment ? (
                        <div className="mt-8 border-t border-border pt-7">
                          <p className="mb-5 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                            Employment
                          </p>

                          <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                            <AdminField
                              label="Employment type"
                              value={person.employment.employmentType}
                            />

                            <AdminField
                              label="Company / business"
                              value={
                                person.employment.companyName ||
                                person.employment.businessName ||
                                "-"
                              }
                            />

                            <AdminField
                              label="Designation"
                              value={person.employment.designation}
                            />

                            <AdminField
                              label="Income"
                              value={formatCurrency(
                                person.employment.monthlyIncome ||
                                  person.employment.annualIncome ||
                                  person.employment.agriculturalIncome,
                              )}
                            />

                            {person.employment.registrations?.length > 0 ? (
                              <AdminField
                                label="Business registrations"
                                value={person.employment.registrations
                                  .map(
                                    (registration) =>
                                      `${registration.registrationType}: ${registration.registrationNumber}`,
                                  )
                                  .join(", ")}
                              />
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </PersonSection>
                  ))}
                </div>
              </ContentSection>
            ) : null}

            {/* =====================================================
                EXISTING LOANS
            ===================================================== */}
            {loan.schoolLoan ? (
              <ContentSection
                eyebrow="Liabilities"
                title="Existing loans"
                description="Existing borrowing declared by the applicant."
                icon={Landmark}
              >
                <div className="border-y border-border">
                  {!loan.schoolLoan.hasExistingLoans ? (
                    <EmptyMessage>No existing loans declared.</EmptyMessage>
                  ) : !loan.existingLoans?.length ? (
                    <EmptyMessage>No existing loan records found.</EmptyMessage>
                  ) : (
                    <div className="divide-y divide-border">
                      {loan.existingLoans.map((existingLoan) => (
                        <div
                          key={existingLoan.id}
                          className="grid gap-5 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                        >
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {existingLoan.loanTypeLabel}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {existingLoan.lenderName}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-8 sm:text-right">
                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                Outstanding
                              </p>

                              <p className="mt-1 text-sm font-semibold">
                                {formatCurrency(existingLoan.outstandingAmount)}
                              </p>
                            </div>

                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                Status
                              </p>

                              <p className="mt-1 text-sm font-medium">
                                {existingLoan.status}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ContentSection>
            ) : null}

            {/* =====================================================
                DOCUMENT REVIEW
            ===================================================== */}
            <ContentSection
              eyebrow="Verification"
              title="Document review"
              description="Review and verify documents submitted with the application."
              icon={FileText}
            >
              <div className="border-y border-border">
                <div className="grid border-b border-border sm:grid-cols-2">
                  <ReviewMetric
                    icon={FileCheck2}
                    label="Documents submitted"
                    value={documentCount}
                  />

                  <ReviewMetric
                    icon={ShieldCheck}
                    label="Documents verified"
                    value={`${verifiedDocuments}/${documentCount}`}
                  />
                </div>

                {loan.documents?.length > 0 ? (
                  <div className="grid gap-4 py-6 md:grid-cols-2">
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
                  <EmptyMessage>No loan documents uploaded.</EmptyMessage>
                )}
              </div>
            </ContentSection>

            {/* =====================================================
                TIMELINE
            ===================================================== */}
            <ContentSection
              eyebrow="History"
              title="Application timeline"
              description="Status changes and actions recorded for this application."
              icon={History}
            >
              <div className="border-y border-border py-6">
                <StatusTimeline history={loan.statusHistory} />
                {console.log(loan.statusHistory)}
              </div>
            </ContentSection>
          </main>

          {/* =======================================================
              REVIEW SIDEBAR
          ======================================================= */}
          <aside className="hidden xl:block">
            <div className="sticky top-6">
              <div className="border-l border-border pl-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Review workspace
                </p>

                <h2 className="mt-2 text-lg font-bold tracking-tight">
                  Application summary
                </h2>

                <div className="mt-6 space-y-5">
                  <SidebarItem
                    label="Application"
                    value={loan.applicationNumber || "-"}
                  />

                  <SidebarItem
                    label="Loan type"
                    value={loan.loanType?.name || "-"}
                  />

                  <SidebarItem
                    label="Amount"
                    value={formatCurrency(loan.loanAmount)}
                  />

                  <SidebarItem
                    label="Monthly EMI"
                    value={formatCurrency(loan.emi)}
                  />

                  <SidebarItem
                    label="Status"
                    value={<StatusBadge status={loan.status} type="loan" />}
                  />
                </div>

                <Separator className="my-7" />

                <div>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold">Verification progress</p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Document review
                      </p>
                    </div>

                    <span className="text-lg font-bold">
                      {Math.round(verificationPercentage)}%
                    </span>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${verificationPercentage}%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{verifiedDocuments} verified</span>
                    <span>{documentCount} total</span>
                  </div>
                </div>

                <Separator className="my-7" />

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Current stage
                  </p>

                  <div className="mt-3">
                    <StatusBadge status={loan.status} type="loan" />
                  </div>

                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    Review customer information, financial details and submitted
                    documents before moving the application forward.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* =========================================================
          STICKY DECISION BAR
      ========================================================= */}
      {availableActions.length > 0 ? (
        <div className="fixed inset-x-0 bottom-16 z-40 border-t border-border bg-background/95 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur lg:bottom-0">
          <div className="mx-auto flex max-w-[1480px] flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="hidden xl:block">
              <p className="text-sm font-bold">Application decision</p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Select the next stage for{" "}
                {loan.applicationNumber || "this application"}.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
              {availableActions.includes("UNDER_REVIEW") ? (
                <Button
                  disabled={isUpdatingStatus}
                  loading={isUpdatingStatus}
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => requestStatusChange("UNDER_REVIEW")}
                >
                  <ChevronRight className="size-4" />
                  Move to review
                </Button>
              ) : null}

              {availableActions.includes("APPROVED") ? (
                <Button
                  disabled={isUpdatingStatus}
                  loading={isUpdatingStatus}
                  variant="success"
                  className="w-full sm:w-auto"
                  onClick={() => requestStatusChange("APPROVED")}
                >
                  <Check className="size-4" />
                  Approve application
                </Button>
              ) : null}

              {availableActions.includes("REJECTED") ? (
                <Button
                  disabled={isUpdatingStatus}
                  loading={isUpdatingStatus}
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={() => requestStatusChange("REJECTED")}
                >
                  <X className="size-4" />
                  Reject
                </Button>
              ) : null}

              {availableActions.includes("DISBURSED") ? (
                <Button
                  disabled={isUpdatingStatus}
                  loading={isUpdatingStatus}
                  className="w-full sm:w-auto"
                  onClick={() => requestStatusChange("DISBURSED")}
                >
                  Disburse loan
                </Button>
              ) : null}

              {availableActions.includes("CLOSED") ? (
                <Button
                  variant="outline"
                  disabled={isUpdatingStatus}
                  loading={isUpdatingStatus}
                  className="w-full sm:w-auto"
                  onClick={() => requestStatusChange("CLOSED")}
                >
                  Close application
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* =========================================================
          DECISION CONFIRMATION
      ========================================================= */}
      <Dialog
        open={Boolean(pendingStatus)}
        onOpenChange={(open) => {
          if (!open) setPendingStatus(null);
        }}
      >
        <DialogContent>
          {pendingStatus ? (
            <>
              <DialogHeader>
                <DialogTitle>{decisionCopy[pendingStatus].title}</DialogTitle>

                <DialogDescription>
                  {decisionCopy[pendingStatus].description}
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" disabled={isUpdatingStatus}>
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  variant={decisionCopy[pendingStatus].variant}
                  disabled={isUpdatingStatus}
                  loading={isUpdatingStatus}
                  onClick={() => changeLoanStatus(pendingStatus)}
                >
                  {decisionCopy[pendingStatus].confirmLabel}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* =============================================================
   PRESENTATIONAL COMPONENTS
============================================================= */

function FinancialSummary({ label, value, emphasize = false }) {
  return (
    <div className="border-b border-border px-5 py-5 last:border-b-0 sm:px-6 sm:nth-[2]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>

      <p
        className={
          emphasize
            ? "mt-1.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl"
            : "mt-2 text-base font-bold text-foreground"
        }
      >
        {value || "-"}
      </p>
    </div>
  );
}

function ContentSection({ eyebrow, title, description, icon: Icon, children }) {
  return (
    <section>
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
            {eyebrow}
          </p>

          {Icon ? <Icon className="size-4 text-primary/60" /> : null}
        </div>

        <h2 className="mt-1.5 text-xl font-bold tracking-tight text-foreground">
          {title}
        </h2>

        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {children}
    </section>
  );
}

function PersonSection({ index, title, badge, children }) {
  return (
    <div className="py-7 first:pt-6 last:pb-0">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-xs font-bold">
            {index + 1}
          </span>

          <h3 className="text-sm font-bold">{title}</h3>
        </div>

        {badge ? <Badge variant="info">{badge}</Badge> : null}
      </div>

      {children}
    </div>
  );
}

function EmploymentSection({ employment }) {
  return (
    <div className="mt-8 border-t border-border pt-7">
      <p className="mb-5 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
        Employment
      </p>

      <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        <AdminField label="Employment type" value={employment.employmentType} />

        <AdminField label="Company" value={employment.companyName} />

        <AdminField label="Designation" value={employment.designation} />

        <AdminField
          label="Monthly income"
          value={formatCurrency(employment.monthlyIncome)}
        />

        <AdminField
          label="Experience"
          value={
            employment.experienceYears != null
              ? `${employment.experienceYears} years`
              : "-"
          }
        />
      </div>
    </div>
  );
}

function SidebarItem({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>

      <span className="max-w-[170px] text-right text-sm font-semibold text-foreground">
        {value || "-"}
      </span>
    </div>
  );
}

function ReviewMetric({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5 text-red-800">
      <div className="flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
          <Icon className="size-4 text-primary" />
        </div>

        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>

      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

function EmptyMessage({ children }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-sm font-medium text-muted-foreground">{children}</p>
    </div>
  );
}

function LoanDetailsSkeleton() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-32" />

        <div className="mt-6 border-b border-border pb-7">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-4 h-9 w-72" />
          <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        </div>

        <div className="grid border-b border-border sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="px-6 py-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-7 w-32" />
            </div>
          ))}
        </div>

        <div className="mt-9 grid gap-10 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-10">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-3 h-7 w-52" />
                <Skeleton className="mt-2 h-4 w-80 max-w-full" />

                <div className="mt-6 border-y border-border py-7">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, itemIndex) => (
                      <Skeleton key={itemIndex} className="h-12 w-full" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden xl:block">
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoanDetails;
