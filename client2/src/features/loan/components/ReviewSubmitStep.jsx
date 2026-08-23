import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Check } from "lucide-react";

import { useGetStudentLoanDetailsQuery } from "../api/studentLoanApi";

import {
  useGetLoanApplicationQuery,
  useSubmitLoanApplicationMutation,
} from "../api/loanApi";

import { useGetLoanDocumentsQuery } from "../api/loanDocumentApi";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/common/StatusBadge";
import { LoanWizardShell, LoanWizardActions } from "./LoanWizardShell";
import { formatCurrency } from "../utils/loanFormatters";

function ReviewSubmitStep({ loanApplication, loanApplicationId, onBack }) {
  const navigate = useNavigate();

  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  const { data: loanData, isLoading: isLoanLoading } =
    useGetLoanApplicationQuery(loanApplicationId, {
      skip: !loanApplicationId,
    });

  const { data: educationData, isLoading: isEducationLoading } =
    useGetStudentLoanDetailsQuery(loanApplicationId, {
      skip: !loanApplicationId,
    });

  const { data: documentsData, isLoading: isDocumentsLoading } =
    useGetLoanDocumentsQuery(loanApplicationId, {
      skip: !loanApplicationId,
    });

  const [submitLoanApplication, { isLoading: isSubmitting }] =
    useSubmitLoanApplicationMutation();

  const application = submittedApplication || loanData?.data || loanApplication;

  const educationDetails = educationData?.data;

  const documents = Array.isArray(documentsData?.data)
    ? documentsData.data
    : [];

  async function handleSubmit() {
    if (!loanApplicationId) {
      toast.error("Loan application is missing.");
      return;
    }

    if (!declarationAccepted) {
      toast.error(
        "Please accept the declaration before submitting your application.",
      );
      return;
    }

    try {
      const response = await submitLoanApplication(loanApplicationId).unwrap();

      setSubmittedApplication(response.data);

      toast.success(
        response?.message || "Loan application submitted successfully",
      );
    } catch (error) {
      console.error("Submit loan application error:", error);

      toast.error(error?.data?.message || "Unable to submit loan application");
    }
  }

  if (isLoanLoading || isEducationLoading || isDocumentsLoading) {
    return (
      <LoanWizardShell
        step={5}
        totalSteps={5}
        title="Review Application"
        description="Loading your application details..."
      >
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </LoanWizardShell>
    );
  }

  return (
    <LoanWizardShell
      step={5}
      totalSteps={5}
      title="Review & Submit"
      description="Review your application details carefully before submitting."
    >
      {/* =====================================================
          LOAN DETAILS
      ====================================================== */}

      <section className="space-y-4">
        <h3 className="subsection-title">Loan details</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <ReviewField
            label="Application number"
            value={application?.applicationNumber}
          />

          <ReviewField label="Loan type" value={application?.loanType?.name} />

          <ReviewField
            label="Loan amount"
            value={formatCurrency(application?.loanAmount)}
            emphasize
          />

          <ReviewField
            label="Tenure"
            value={
              application?.tenureMonths
                ? `${application.tenureMonths} months`
                : "-"
            }
          />

          <ReviewField
            label="Interest rate"
            value={
              application?.interestRate !== undefined &&
              application?.interestRate !== null
                ? `${application.interestRate}% p.a.`
                : "-"
            }
          />

          <ReviewField
            label="Processing fee"
            value={formatCurrency(application?.processingFee)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-4">
          <span className="financial-label">Monthly EMI</span>

          <span className="financial-value">
            {formatCurrency(application?.emi)}
          </span>
        </div>
      </section>

      {/* =====================================================
          STUDENT DETAILS
      ====================================================== */}

      <section className="space-y-4 border-t pt-6">
        <h3 className="subsection-title">Student details</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <ReviewField
            label="Student name"
            value={educationDetails?.studentName}
          />

          <ReviewField
            label="Date of birth"
            value={
              educationDetails?.dateOfBirth
                ? String(educationDetails.dateOfBirth).split("T")[0]
                : "-"
            }
          />

          <ReviewField label="Gender" value={educationDetails?.gender} />

          <ReviewField label="Mobile" value={educationDetails?.mobile} />

          <ReviewField label="Email" value={educationDetails?.email} />

          <ReviewField label="Course" value={educationDetails?.courseName} />

          <ReviewField label="College" value={educationDetails?.collegeName} />

          <ReviewField
            label="University"
            value={educationDetails?.universityName}
          />

          <ReviewField
            label="Study country"
            value={educationDetails?.studyCountry}
          />

          <ReviewField
            label="Course duration"
            value={
              educationDetails?.courseDurationMonths
                ? `${educationDetails.courseDurationMonths} months`
                : "-"
            }
          />

          <ReviewField
            label="Admission status"
            value={educationDetails?.admissionStatus}
          />

          <ReviewField
            label="Estimated course fee"
            value={formatCurrency(educationDetails?.estimatedCourseFee)}
            emphasize
          />
        </div>
      </section>

      {/* =====================================================
          PARENT / CO-APPLICANT DETAILS
      ====================================================== */}

      <section className="space-y-4 border-t pt-6">
        <h3 className="subsection-title">Parent & co-applicant details</h3>

        {!educationDetails?.parents?.length ? (
          <p className="text-helper">No parent details found.</p>
        ) : (
          <div className="space-y-6">
            {educationDetails.parents.map((parent) => (
              <div
                key={parent.id}
                className="space-y-4 border-t pt-6 first:border-t-0 first:pt-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold">
                    {parent.relation === "MOTHER" ? "Mother" : "Father"}
                  </h4>

                  {parent.isCoApplicant ? (
                    <Badge variant="info">Co-applicant</Badge>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ReviewField label="Full name" value={parent.fullName} />

                  <ReviewField label="Mobile" value={parent.mobile} />

                  <ReviewField
                    label="Aadhaar"
                    value={parent.aadhaarNumber || "-"}
                  />

                  <ReviewField label="PAN" value={parent.panNumber || "-"} />

                  <ReviewField
                    label="Employment type"
                    value={parent.employment?.employmentType}
                  />

                  <ReviewField
                    label="Company / business"
                    value={
                      parent.employment?.companyName ||
                      parent.employment?.businessName ||
                      parent.employment?.employerName ||
                      "-"
                    }
                  />

                  <ReviewField
                    label="Designation"
                    value={parent.employment?.designation || "-"}
                  />

                  <ReviewField
                    label="Monthly income"
                    value={formatCurrency(parent.employment?.monthlyIncome)}
                  />

                  <ReviewField
                    label="Annual income"
                    value={formatCurrency(parent.employment?.annualIncome)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================
          DOCUMENTS
      ====================================================== */}

      <section className="space-y-4 border-t pt-6">
        <h3 className="subsection-title">Uploaded documents</h3>

        {documents.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm font-medium">No documents uploaded</p>

            <p className="text-helper mt-1">
              Please go back and upload the required documents.
            </p>
          </div>
        ) : (
          <div className="divide-y rounded-lg border">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {formatDocumentType(document.documentType)}
                  </p>

                  <p className="text-caption mt-1 text-muted-foreground">
                    Owner: {formatOwnerType(document.ownerType)}
                    {document.createdAt
                      ? ` • ${new Date(document.createdAt).toLocaleDateString(
                          "en-IN",
                        )}`
                      : ""}
                  </p>

                  {document.rejectionReason ? (
                    <p className="mt-2 text-xs text-destructive">
                      {document.rejectionReason}
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={document.status} type="document" />

                  {document.documentUrl ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          document.documentUrl,
                          "_blank",
                          "noopener,noreferrer",
                        )
                      }
                    >
                      View
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================
          SINGLE DECLARATION
      ====================================================== */}

      {!submittedApplication ? (
        <section className="border-t pt-6">
          <div className="rounded-lg border bg-muted/20 p-4 sm:p-5">
            <label
              htmlFor="loan-declaration"
              className="flex cursor-pointer items-start gap-3"
            >
              <button
                type="button"
                id="loan-declaration"
                role="checkbox"
                aria-checked={declarationAccepted}
                onClick={() => setDeclarationAccepted((current) => !current)}
                className={[
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border transition-colors",
                  declarationAccepted
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background",
                ].join(" ")}
              >
                {declarationAccepted ? <Check className="size-3.5" /> : null}
              </button>

              <span className="text-sm leading-6 text-muted-foreground">
                I confirm that the information and documents provided in this
                loan application are true, complete and accurate to the best of
                my knowledge. I understand that the lender may verify the
                information and documents provided and that submitting this
                application does not guarantee loan approval.
              </span>
            </label>
          </div>
        </section>
      ) : null}

      {/* =====================================================
          SUBMISSION RESULT
      ====================================================== */}

      {submittedApplication ? (
        <section className="space-y-4 rounded-lg border border-[hsl(var(--success-border))] bg-[hsl(var(--success-soft))] p-5">
          <div>
            <h3 className="subsection-title text-[hsl(var(--success))]">
              Application submitted
            </h3>

            <p className="text-helper mt-1">
              Your student loan application has been submitted successfully.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ReviewField
              label="Application number"
              value={submittedApplication.applicationNumber}
            />

            <div>
              <p className="financial-label">Status</p>

              <div className="mt-1">
                <StatusBadge status={submittedApplication.status} type="loan" />
              </div>
            </div>
          </div>

          <Button type="button" onClick={() => navigate("/customer/loans")}>
            Go to My Loans
          </Button>
        </section>
      ) : (
        /* =====================================================
           ACTIONS
        ====================================================== */

        <LoanWizardActions onBack={onBack} backDisabled={isSubmitting}>
          <Button
            type="button"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting || !declarationAccepted}
            loading={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </LoanWizardActions>
      )}
    </LoanWizardShell>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function formatDocumentType(type) {
  if (!type) return "Document";

  return type
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatOwnerType(type) {
  if (!type) return "Applicant";

  return type
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function ReviewField({ label, value, emphasize = false }) {
  return (
    <div className="min-w-0">
      <p className="financial-label">{label}</p>

      <p
        className={[
          "mt-1 break-words",
          emphasize ? "financial-value" : "text-sm font-medium text-foreground",
        ].join(" ")}
      >
        {value || "-"}
      </p>
    </div>
  );
}

export default ReviewSubmitStep;
