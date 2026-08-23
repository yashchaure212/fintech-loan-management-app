import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useGetSchoolLoanDetailsQuery } from "../api/schoolLoanApi";
import { useGetExistingLoansQuery } from "../api/existingLoanApi";
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

const classLabel = (value) => value?.replace("CLASS_", "Class ") || "-";

function relationLabel(relation) {
  if (relation === "FATHER") return "Father";
  if (relation === "MOTHER") return "Mother";
  if (relation === "GUARDIAN") return "Guardian";
  return "Other";
}

/*
 * One user-facing declaration.
 *
 * The backend can still receive the existing five
 * consent fields as true when this checkbox is checked.
 */
const DECLARATION_TEXT =
  "I confirm that the information and documents provided in this application are true, accurate and complete, and I authorize LoanPro to verify them. I have read and agree to the Terms & Conditions and Privacy Policy.";

function SchoolReviewSubmitStep({
  loanApplication,
  loanApplicationId,
  onBack,
}) {
  const navigate = useNavigate();

  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  const { data: loanData, isLoading: isLoanLoading } =
    useGetLoanApplicationQuery(loanApplicationId, {
      skip: !loanApplicationId,
    });

  const { data: schoolLoanData, isLoading: isSchoolLoading } =
    useGetSchoolLoanDetailsQuery(loanApplicationId, {
      skip: !loanApplicationId,
    });

  const { data: existingLoansData } = useGetExistingLoansQuery(
    loanApplicationId,
    {
      skip: !loanApplicationId,
    },
  );

  const { data: documentsData, isLoading: isDocumentsLoading } =
    useGetLoanDocumentsQuery(loanApplicationId, {
      skip: !loanApplicationId,
    });

  const [submitLoanApplication, { isLoading: isSubmitting }] =
    useSubmitLoanApplicationMutation();

  const application = submittedApplication || loanData?.data || loanApplication;

  const schoolLoan = schoolLoanData?.data;

  const existingLoans = Array.isArray(existingLoansData?.data)
    ? existingLoansData.data
    : [];

  const documents = Array.isArray(documentsData?.data)
    ? documentsData.data
    : [];

  /*
   * Keep the existing backend contract.
   *
   * One checkbox controls all declaration fields.
   */
  const consent = {
    infoAccuracyConsent: declarationAccepted,
    infoVerificationConsent: declarationAccepted,
    documentVerificationConsent: declarationAccepted,
    termsAccepted: declarationAccepted,
    privacyPolicyAccepted: declarationAccepted,
  };

  async function handleSubmit() {
    if (!loanApplicationId) {
      toast.error("Loan application is missing.");
      return;
    }

    if (!declarationAccepted) {
      toast.error("Please accept the declaration before submitting.");
      return;
    }

    try {
      const response = await submitLoanApplication({
        loanApplicationId,
        data: consent,
      }).unwrap();

      setSubmittedApplication(response.data);

      toast.success(
        response?.message || "Loan application submitted successfully",
      );
    } catch (error) {
      console.error("Submit school loan application error:", error);

      toast.error(
        error?.data?.message ||
          error?.message ||
          "Unable to submit loan application",
      );
    }
  }

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (isLoanLoading || isSchoolLoading || isDocumentsLoading) {
    return (
      <LoanWizardShell
        step={7}
        totalSteps={7}
        title="Review & Declaration"
        description="Loading..."
      >
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </LoanWizardShell>
    );
  }

  /*
   * ============================================================
   * MAIN
   * ============================================================
   */

  return (
    <LoanWizardShell
      step={7}
      totalSteps={7}
      title="Review & Declaration"
      description="Review your application, then confirm the declaration to submit."
    >
      {/* ========================================================
          LOAN DETAILS
      ======================================================== */}

      <section className="space-y-4">
        <h3 className="subsection-title">Loan requirement</h3>

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
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-4">
          <span className="financial-label">Monthly EMI</span>

          <span className="financial-value">
            {formatCurrency(application?.emi)}
          </span>
        </div>
      </section>

      {/* ========================================================
          STUDENT & SCHOOL
      ======================================================== */}

      <section className="space-y-4 border-t pt-6">
        <h3 className="subsection-title">Student & school</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <ReviewField label="Student name" value={schoolLoan?.studentName} />

          <ReviewField
            label="Date of birth"
            value={
              schoolLoan?.dateOfBirth
                ? String(schoolLoan.dateOfBirth).split("T")[0]
                : "-"
            }
          />

          <ReviewField label="School" value={schoolLoan?.currentSchoolName} />

          <ReviewField
            label="Class"
            value={classLabel(schoolLoan?.currentClass)}
          />

          <ReviewField label="Academic year" value={schoolLoan?.academicYear} />

          <ReviewField
            label="Continuing same school"
            value={schoolLoan?.continuingSameSchool ? "Yes" : "No"}
          />
        </div>
      </section>

      {/* ========================================================
          CO-APPLICANTS
      ======================================================== */}

      <section className="space-y-4 border-t pt-6">
        <h3 className="subsection-title">Co-applicants</h3>

        {!schoolLoan?.coApplicants?.length ? (
          <p className="text-helper">No co-applicant details found.</p>
        ) : (
          <div className="space-y-6">
            {schoolLoan.coApplicants.map((person) => (
              <div
                key={person.id}
                className="space-y-4 border-t pt-6 first:border-t-0 first:pt-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold">
                    {relationLabel(person.relation)}
                  </h4>

                  {person.isCoApplicant ? (
                    <Badge variant="info">Co-applicant</Badge>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ReviewField label="Full name" value={person.fullName} />

                  <ReviewField label="Mobile" value={person.mobile} />

                  <ReviewField
                    label="Employment type"
                    value={person.employment?.employmentType}
                  />

                  <ReviewField
                    label="Income"
                    value={formatCurrency(
                      person.employment?.monthlyIncome ||
                        person.employment?.annualIncome ||
                        person.employment?.agriculturalIncome,
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          EXISTING LOANS
      ======================================================== */}

      <section className="space-y-4 border-t pt-6">
        <h3 className="subsection-title">Existing loans</h3>

        {!schoolLoan?.hasExistingLoans ? (
          <p className="text-helper">No existing loans declared.</p>
        ) : existingLoans.length === 0 ? (
          <p className="text-helper">No existing loan records found.</p>
        ) : (
          <div className="divide-y rounded-lg border">
            {existingLoans.map((loan) => (
              <div
                key={loan.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div>
                  <p className="text-sm font-medium">
                    {loan.loanTypeLabel} -- {loan.lenderName}
                  </p>

                  <p className="text-caption text-muted-foreground">
                    Outstanding: {formatCurrency(loan.outstandingAmount)}
                  </p>
                </div>

                <Badge variant="outline">{loan.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          DOCUMENTS
      ======================================================== */}

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
                  </p>
                </div>

                <StatusBadge status={document.status} type="document" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          DECLARATION
      ======================================================== */}

      {!submittedApplication ? (
        <section className="space-y-4 border-t pt-6">
          <div>
            <h3 className="subsection-title">Declaration</h3>

            <p className="text-helper mt-1">
              Please confirm the declaration below before submitting your
              application.
            </p>
          </div>

          <label
            htmlFor="loan-declaration"
            className={[
              "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
              declarationAccepted
                ? "border-primary/40 bg-primary/5"
                : "hover:bg-muted/30",
            ].join(" ")}
          >
            <input
              id="loan-declaration"
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 accent-primary"
              checked={declarationAccepted}
              disabled={isSubmitting}
              onChange={(event) => setDeclarationAccepted(event.target.checked)}
            />

            <span className="text-sm leading-6 text-foreground">
              {DECLARATION_TEXT}
            </span>
          </label>

          <p className="text-helper">
            By checking this box, you provide your consent for the information
            and documents submitted with this application to be verified and
            processed.
          </p>
        </section>
      ) : null}

      {/* ========================================================
          SUBMITTED STATE
      ======================================================== */}

      {submittedApplication ? (
        <section className="space-y-4 rounded-lg border border-[hsl(var(--success-border))] bg-[hsl(var(--success-soft))] p-5">
          <div>
            <h3 className="subsection-title text-[hsl(var(--success))]">
              Application submitted
            </h3>

            <p className="text-helper mt-1">
              Your school student loan application has been submitted
              successfully.
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

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

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

export default SchoolReviewSubmitStep;
