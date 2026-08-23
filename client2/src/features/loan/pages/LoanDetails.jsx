import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  FileText,
  GraduationCap,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";

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

function formatClass(value) {
  if (!value) return "-";

  return String(value).replace("CLASS_", "Class ").replaceAll("_", " ");
}

function formatEnum(value) {
  if (!value) return "-";

  return String(value)
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function Field({ label, value, emphasize = false }) {
  return (
    <div className="min-w-0">
      <p className="financial-label">{label}</p>

      <p
        className={[
          "mt-1 break-words",
          emphasize ? "financial-value" : "text-sm font-medium text-foreground",
        ].join(" ")}
      >
        {value ?? "-"}
      </p>
    </div>
  );
}

function SectionHeader({ eyebrow, title, description, icon: Icon, action }) {
  return (
    <div className="flex flex-col gap-3 border-b border-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-start gap-3">
        {Icon ? (
          <span className="hidden size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex">
            <Icon className="size-4" />
          </span>
        ) : null}

        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
              {eyebrow}
            </p>
          ) : null}

          <h2 className="section-title mt-0.5">{title}</h2>

          {description ? (
            <p className="text-helper mt-1">{description}</p>
          ) : null}
        </div>
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function DetailSection({ title, description, icon, children, className = "" }) {
  return (
    <section className={`app-card overflow-hidden ${className}`}>
      <SectionHeader title={title} description={description} icon={icon} />

      <div className="p-5 sm:p-6">{children}</div>
    </section>
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
    return <LoanDetailsSkeleton />;
  }

  if (isError || !response?.data) {
    return (
      <section className="app-card p-6 text-center sm:p-8">
        <span className="section-eyebrow">Loan centre</span>

        <h1 className="page-title mt-4">Unable to load application</h1>

        <p className="text-helper mx-auto mt-2 max-w-lg">
          {error?.data?.message || "The loan application could not be loaded."}
        </p>

        <Button
          className="mt-6"
          variant="outline"
          onClick={() => navigate("/customer/loans")}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to my loans
        </Button>
      </section>
    );
  }

  const loan = response.data;

  const studentLoan = loan.studentLoan || null;
  const schoolLoan = loan.schoolLoan || null;

  const existingLoans = Array.isArray(loan.existingLoans)
    ? loan.existingLoans
    : [];

  const documents = Array.isArray(loan.documents) ? loan.documents : [];

  const statusHistory = Array.isArray(loan.statusHistory)
    ? loan.statusHistory
    : [];

  const emiSchedule = Array.isArray(emiResponse?.data) ? emiResponse.data : [];

  const statusConfig = getStatusConfig(loan.status, "loan");

  const isDraft = loan.status === "DRAFT";

  return (
    <div className="space-y-6 pb-16 lg:pb-0">
      {/* --------------------------------------------------
          PAGE HEADER
      -------------------------------------------------- */}
      <section className="page-header-card">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="section-eyebrow">
                {loan.loanType?.name || "Loan application"}
              </span>
            </div>

            <h1 className="page-title mt-3">Loan details</h1>

            <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <p className="text-helper">Application number:</p>

              <span className="text-sm font-semibold text-foreground">
                {loan.applicationNumber || "-"}
              </span>
            </div>

            {loan.createdAt ? (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                Submitted / created {formatDate(loan.createdAt)}
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge status={loan.status} type="loan" />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------
          REPAYMENT SUMMARY
      -------------------------------------------------- */}
      <section className="app-card overflow-hidden">
        <SectionHeader
          title="Repayment summary"
          description="Key financial details for this loan application."
          icon={IndianRupee}
        />

        <div className="p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-primary/15 bg-primary/[0.035] p-4">
              <p className="financial-label">Loan amount</p>

              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {formatCurrency(loan.loanAmount)}
              </p>
            </div>

            <div className="rounded-xl border border-primary/15 bg-primary/[0.035] p-4">
              <p className="financial-label">Monthly EMI</p>

              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {formatCurrency(loan.emi)}
              </p>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-4">
            <Field
              label="Tenure"
              value={loan.tenureMonths ? `${loan.tenureMonths} months` : "-"}
            />

            <Field
              label="Interest rate"
              value={
                loan.interestRate != null ? `${loan.interestRate}% p.a.` : "-"
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
        </div>
      </section>

      {/* --------------------------------------------------
          APPLICATION INFO
      -------------------------------------------------- */}
      <DetailSection
        title="Application information"
        description="Basic information about this loan application."
        icon={FileText}
      >
        <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Loan type" value={loan.loanType?.name || "-"} />

          <Field label="Category" value={formatEnum(loan.loanType?.category)} />

          <Field label="Status" value={statusConfig.label} />

          <Field label="Created on" value={formatDate(loan.createdAt)} />
        </div>
      </DetailSection>

      {/* --------------------------------------------------
          STUDENT + COURSE
      -------------------------------------------------- */}
      {studentLoan ? (
        <DetailSection
          title="Student & course"
          description="Student and education details provided with the application."
          icon={GraduationCap}
        >
          <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Student name" value={studentLoan.studentName} />

            <Field
              label="Date of birth"
              value={formatDate(studentLoan.dateOfBirth)}
            />

            <Field label="Gender" value={formatEnum(studentLoan.gender)} />

            <Field label="Mobile" value={studentLoan.mobile} />

            <Field label="Email" value={studentLoan.email} />

            <Field
              label="Aadhaar"
              value={maskAadhaar(studentLoan.aadhaarNumber)}
            />

            <Field label="PAN" value={studentLoan.panNumber} />

            <Field label="Course" value={studentLoan.courseName} />

            <Field label="College" value={studentLoan.collegeName} />

            <Field label="University" value={studentLoan.universityName} />

            <Field label="Study country" value={studentLoan.studyCountry} />

            <Field
              label="Course duration"
              value={
                studentLoan.courseDurationMonths
                  ? `${studentLoan.courseDurationMonths} months`
                  : "-"
              }
            />

            <Field
              label="Admission status"
              value={formatEnum(studentLoan.admissionStatus)}
            />

            <Field
              label="Estimated course fee"
              value={formatCurrency(studentLoan.estimatedCourseFee)}
            />
          </div>
        </DetailSection>
      ) : null}

      {/* --------------------------------------------------
          SCHOOL LOAN
      -------------------------------------------------- */}
      {schoolLoan ? (
        <DetailSection
          title="Student & school"
          description="School and academic information provided for this application."
          icon={GraduationCap}
        >
          <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Student name" value={schoolLoan.studentName} />

            <Field
              label="Date of birth"
              value={formatDate(schoolLoan.dateOfBirth)}
            />

            <Field label="Gender" value={formatEnum(schoolLoan.gender)} />

            <Field label="Mobile" value={schoolLoan.mobile} />

            <Field label="Email" value={schoolLoan.email} />

            <Field
              label="Aadhaar"
              value={maskAadhaar(schoolLoan.aadhaarNumber)}
            />

            <Field label="PAN" value={schoolLoan.panNumber} />

            <Field label="School" value={schoolLoan.currentSchoolName} />

            <Field
              label="School type"
              value={formatEnum(schoolLoan.schoolType)}
            />

            <Field label="Class" value={formatClass(schoolLoan.currentClass)} />

            <Field label="Academic year" value={schoolLoan.academicYear} />

            <Field
              label="Continuing same school"
              value={schoolLoan.continuingSameSchool ? "Yes" : "No"}
            />

            {!schoolLoan.continuingSameSchool ? (
              <>
                <Field label="New school" value={schoolLoan.newSchoolName} />

                <Field
                  label="Expected joining date"
                  value={formatDate(schoolLoan.expectedJoiningDate)}
                />
              </>
            ) : null}
          </div>
        </DetailSection>
      ) : null}

      {/* --------------------------------------------------
          EDUCATION EXPENSES
      -------------------------------------------------- */}
      {schoolLoan ? (
        <DetailSection
          title="Education expenses"
          description="Estimated costs and available funding declared in the application."
          icon={IndianRupee}
        >
          <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            <Field
              label="Tuition fees"
              value={formatCurrency(schoolLoan.tuitionFees)}
            />

            <Field
              label="Admission fees"
              value={formatCurrency(schoolLoan.admissionFees)}
            />

            <Field
              label="Examination fees"
              value={formatCurrency(schoolLoan.examinationFees)}
            />

            <Field
              label="Books"
              value={formatCurrency(schoolLoan.booksAmount)}
            />

            <Field
              label="Uniform"
              value={formatCurrency(schoolLoan.uniformAmount)}
            />

            <Field
              label="Equipment"
              value={formatCurrency(schoolLoan.equipmentAmount)}
            />

            <Field
              label="Transportation"
              value={formatCurrency(schoolLoan.transportAmount)}
            />

            <Field
              label="Hostel / boarding"
              value={formatCurrency(schoolLoan.hostelAmount)}
            />

            <Field
              label="Other expenses"
              value={formatCurrency(schoolLoan.otherExpensesAmount)}
            />

            <Field
              label="Family contribution"
              value={formatCurrency(schoolLoan.familyContribution)}
            />

            <Field
              label="Scholarship / aid"
              value={formatCurrency(schoolLoan.scholarshipAmount)}
            />

            <Field
              label="Other funding"
              value={formatCurrency(schoolLoan.otherFundingAmount)}
            />
          </div>
        </DetailSection>
      ) : null}

      {/* --------------------------------------------------
          PARENT / CO-APPLICANT
      -------------------------------------------------- */}
      {schoolLoan?.coApplicants?.length > 0 ? (
        <section className="space-y-3">
          <div>
            <h2 className="section-title">Parent / co-applicant</h2>

            <p className="text-helper mt-1">
              Details of the parent or co-applicant associated with this
              application.
            </p>
          </div>

          <div className="space-y-3">
            {schoolLoan.coApplicants.map((person) => (
              <div key={person.id} className="app-card overflow-hidden">
                <div className="flex flex-col gap-2 border-b border-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {formatEnum(person.relation) || "Co-applicant"}
                    </p>

                    {person.isCoApplicant ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Primary co-applicant
                      </p>
                    ) : null}
                  </div>

                  {person.isCoApplicant ? (
                    <span className="w-fit rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      Co-applicant
                    </span>
                  ) : null}
                </div>

                <div className="p-5 sm:p-6">
                  <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Field label="Name" value={person.fullName} />

                    <Field label="Mobile" value={person.mobile} />

                    <Field
                      label="Date of birth"
                      value={formatDate(person.dateOfBirth)}
                    />

                    <Field
                      label="Family monthly income"
                      value={formatCurrency(person.familyMonthlyIncome)}
                    />

                    <Field
                      label="Current address"
                      value={
                        person.currentAddress
                          ? [
                              person.currentAddress.city,
                              person.currentAddress.state,
                            ]
                              .filter(Boolean)
                              .join(", ")
                          : "-"
                      }
                    />

                    {person.employment ? (
                      <>
                        <Field
                          label="Employment type"
                          value={formatEnum(person.employment.employmentType)}
                        />

                        <Field
                          label="Company / business"
                          value={
                            person.employment.companyName ||
                            person.employment.businessName ||
                            "-"
                          }
                        />

                        <Field
                          label="Income"
                          value={formatCurrency(
                            person.employment.monthlyIncome ||
                              person.employment.annualIncome ||
                              person.employment.agriculturalIncome,
                          )}
                        />
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* --------------------------------------------------
          EXISTING LOANS
      -------------------------------------------------- */}
      {schoolLoan ? (
        <DetailSection
          title="Existing loans"
          description="Existing credit obligations declared in the application."
          icon={CreditCard}
        >
          {!schoolLoan.hasExistingLoans ? (
            <EmptyState
              title="No existing loans declared"
              description="You have indicated that there are no existing loans."
            />
          ) : existingLoans.length === 0 ? (
            <EmptyState
              title="No existing loan records"
              description="No existing loan records were found for this application."
            />
          ) : (
            <div className="divide-y divide-[hsl(var(--border-subtle))]">
              {existingLoans.map((existingLoan) => (
                <div
                  key={existingLoan.id}
                  className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {existingLoan.loanTypeLabel || "Existing loan"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {existingLoan.lenderName || "Lender not specified"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 sm:min-w-[280px]">
                    <Field
                      label="Outstanding"
                      value={formatCurrency(existingLoan.outstandingAmount)}
                    />

                    <Field
                      label="Status"
                      value={formatEnum(existingLoan.status)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </DetailSection>
      ) : null}

      {/* --------------------------------------------------
          DOCUMENTS
      -------------------------------------------------- */}
      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Documents</h2>

            <p className="text-helper mt-1">
              Documents submitted with this application.
            </p>
          </div>

          <p className="shrink-0 text-caption">
            {documents.length}{" "}
            {documents.length === 1 ? "document" : "documents"}
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="app-card border-dashed p-6 text-center">
            <FileText className="mx-auto size-6 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium text-foreground">
              No documents uploaded
            </p>

            <p className="text-helper mx-auto mt-1 max-w-md">
              Documents will appear here after they are uploaded.
            </p>
          </div>
        ) : (
          <div className="app-card overflow-hidden">
            <div className="divide-y divide-[hsl(var(--border-subtle))]">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <FileText className="size-4" />
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {document.documentType?.name ||
                          document.documentType ||
                          document.documentTypeName ||
                          "Document"}
                      </p>

                      {document.ownerType ? (
                        <p className="mt-0.5 text-caption">
                          Owner: {formatEnum(document.ownerType)}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 pl-12 sm:pl-0">
                    <StatusBadge
                      status={document.status || "PENDING"}
                      type="document"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* --------------------------------------------------
          TIMELINE
      -------------------------------------------------- */}
      <section className="space-y-3">
        <div>
          <h2 className="section-title">Timeline</h2>

          <p className="text-helper mt-1">
            Track the progress and status changes of your application.
          </p>
        </div>
        {statusHistory.length === 0 ? (
          <div className="app-card border-dashed p-6 text-center">
            <Clock3 className="mx-auto size-6 text-muted-foreground" />

            <p className="text-helper mt-2">
              No application history available.
            </p>
          </div>
        ) : (
          <div className="app-card p-5 sm:p-6">
            <ol className="space-y-0">
              {statusHistory.map((history, index) => {
                const isLast = index === statusHistory.length - 1;

                const isCurrent = isLast;

                const isCompleted = !isCurrent;

                return (
                  <li
                    key={history.id}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    {/* CONNECTOR */}
                    {!isLast ? (
                      <div className="absolute left-[7px] top-5 h-[calc(100%-0.5rem)] w-px bg-primary" />
                    ) : null}

                    {/* INDICATOR */}
                    <div
                      className={[
                        "relative z-10 mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-background",
                        isCompleted || isCurrent
                          ? "ring-2 ring-primary"
                          : "ring-2 ring-border",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "size-1.5 rounded-full",
                          isCompleted || isCurrent
                            ? "bg-primary"
                            : "bg-muted-foreground/30",
                        ].join(" ")}
                      />
                    </div>

                    {/* CONTENT */}
                    <div
                      className={[
                        "min-w-0 flex-1",
                        !isCompleted && !isCurrent ? "opacity-55" : "",
                      ].join(" ")}
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className={[
                              "text-sm",
                              isCurrent
                                ? "font-bold text-foreground"
                                : "font-semibold text-foreground",
                            ].join(" ")}
                          >
                            {getStatusConfig(history.status, "loan").label}
                          </p>

                          {isCurrent ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                              <Clock3 className="size-3" />
                              Current
                            </span>
                          ) : null}
                        </div>

                        <p className="text-caption">
                          {formatDateTime(history.createdAt)}
                        </p>
                      </div>

                      {history.remarks ? (
                        <p className="text-helper mt-1">{history.remarks}</p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </section>

      {/* --------------------------------------------------
          EMI SCHEDULE
      -------------------------------------------------- */}
      {shouldLoadSchedule ? (
        <section className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="section-title">EMI schedule</h2>

              <p className="text-helper mt-1">
                Review your repayment schedule and payment status.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/customer/payments")}
              className="w-full sm:w-auto"
            >
              <CreditCard className="mr-2 size-4" />
              Pay EMI
            </Button>
          </div>

          {isEmiLoading ? (
            <div className="app-card h-40 animate-pulse" />
          ) : emiSchedule.length === 0 ? (
            <div className="app-card border-dashed p-6 text-center">
              <p className="text-helper">EMI schedule is not available yet.</p>
            </div>
          ) : (
            <div className="app-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-[680px] w-full text-left text-sm">
                  <thead className="border-b border-default bg-[hsl(var(--surface-secondary))]">
                    <tr>
                      <th className="px-4 py-3 financial-label">#</th>

                      <th className="px-4 py-3 financial-label">Due date</th>

                      <th className="px-4 py-3 financial-label">EMI</th>

                      <th className="px-4 py-3 financial-label">Paid</th>

                      <th className="px-4 py-3 financial-label">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {emiSchedule.map((emi) => (
                      <tr
                        key={emi.id}
                        className="border-b border-[hsl(var(--border-subtle))] last:border-b-0"
                      >
                        <td className="px-4 py-3 text-foreground">
                          {emi.installmentNumber}
                        </td>

                        <td className="px-4 py-3 text-foreground">
                          {formatDate(emi.dueDate)}
                        </td>

                        <td className="px-4 py-3 font-medium tabular-nums text-foreground">
                          {formatCurrency(emi.emiAmount)}
                        </td>

                        <td className="px-4 py-3 font-medium tabular-nums text-foreground">
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
            </div>
          )}
        </section>
      ) : null}

      {/* --------------------------------------------------
          SECURITY NOTE
      -------------------------------------------------- */}
      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />

        <div>
          <p className="text-xs font-semibold text-foreground">
            Your information is protected
          </p>

          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
            Sensitive identification information is partially masked for your
            security.
          </p>
        </div>
      </div>

      {/* --------------------------------------------------
          PAGE ACTIONS
      -------------------------------------------------- */}
      <div className="flex flex-col-reverse gap-3 border-t border-subtle pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => navigate("/customer/loans")}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to my loans
        </Button>

        {isDraft ? (
          <Button
            className="w-full sm:w-auto"
            onClick={() => navigate(`/customer/loans/${loan.id}/edit`)}
          >
            Continue application
            <ChevronRight className="ml-2 size-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
      <CheckCircle2 className="mx-auto size-5 text-muted-foreground" />

      <p className="mt-2 text-sm font-medium text-foreground">{title}</p>

      {description ? <p className="text-helper mt-1">{description}</p> : null}
    </div>
  );
}

function LoanDetailsSkeleton() {
  return (
    <div className="space-y-6 pb-16 lg:pb-0">
      <section className="page-header-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            <div className="h-8 w-52 animate-pulse rounded bg-muted" />
            <div className="h-4 w-64 animate-pulse rounded bg-muted" />
          </div>

          <div className="h-7 w-24 animate-pulse rounded-full bg-muted" />
        </div>
      </section>

      <section className="app-card overflow-hidden">
        <div className="border-b border-subtle px-5 py-4 sm:px-6">
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="h-24 animate-pulse rounded-xl bg-muted" />
            <div className="h-24 animate-pulse rounded-xl bg-muted" />
          </div>

          <div className="h-px bg-muted" />

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="h-10 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </section>

      <section className="app-card p-6">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </section>
    </div>
  );
}

export default LoanDetails;
