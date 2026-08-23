import { useMemo, useState } from "react";
import {
  FileText,
  CheckCircle2,
  Upload,
  Eye,
  Trash2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  useGetLoanDocumentsQuery,
  useGetRequiredLoanDocumentsQuery,
  useUploadLoanDocumentMutation,
  useDeleteLoanDocumentMutation,
} from "../api/loanDocumentApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import FormField from "@/components/common/FormField";
import StatusBadge from "@/components/common/StatusBadge";

import { LoanWizardShell, LoanWizardActions } from "./LoanWizardShell";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DOCUMENT_TYPE_LABELS = {
  AADHAAR_CARD: "Aadhaar Card",
  PAN_CARD: "PAN Card",
  PHOTO: "Photograph",
  ADMISSION_LETTER: "Admission Letter",
  FEE_STRUCTURE: "Fee Structure",
  TENTH_MARKSHEET: "10th Marksheet",
  TWELFTH_MARKSHEET: "12th Marksheet",
  ENTRANCE_SCORECARD: "Entrance Scorecard",
  COLLEGE_ID_CARD: "College ID Card",
  PREVIOUS_DEGREE_CERTIFICATE: "Previous Degree Certificate",
  BANK_STATEMENT: "Bank Statement",
  SALARY_SLIP: "Salary Slip",
  INCOME_PROOF: "Income Proof",
  BUSINESS_PROOF: "Business Proof",
  BUSINESS_REGISTRATION: "Business Registration",
  GST_CERTIFICATE: "GST Certificate",
  LAND_RECORD: "Land Record",
  CONTRACT_LETTER: "Contract Letter",
  PASSPORT: "Passport",
  OTHER: "Other",
  BIRTH_CERTIFICATE: "Birth Certificate",
  ADDRESS_PROOF: "Address Proof",
  SCHOOL_ADMISSION_PROOF: "School Admission / Continuation Proof",
  PREVIOUS_CLASS_RESULT: "Previous Class Result",
  UDYAM_CERTIFICATE: "Udyam Certificate",
  LAND_LEASE_PROOF: "Land Lease Proof",
  EXISTING_LOAN_STATEMENT: "Existing Loan Statement",
  FINANCIAL_STATEMENT: "Financial Statement",
};

const OWNER_TYPE_LABELS = {
  STUDENT: "Student",
  FATHER: "Father",
  MOTHER: "Mother",
  CO_APPLICANT: "Co-applicant",
  APPLICANT: "Applicant",
  GUARDIAN: "Guardian",
};

function DocumentsStep({
  loanApplicationId,
  onBack,
  onNext,
  step = 4,
  totalSteps = 5,
}) {
  /*
   * ============================================================
   * API
   * ============================================================
   */

  const {
    data: documentsData,
    isLoading: isDocumentsLoading,
    isError: isDocumentsError,
    refetch: refetchDocuments,
  } = useGetLoanDocumentsQuery(loanApplicationId, {
    skip: !loanApplicationId,
  });

  const {
    data: requirementsData,
    isLoading: isRequirementsLoading,
    isError: isRequirementsError,
    refetch: refetchRequirements,
  } = useGetRequiredLoanDocumentsQuery(loanApplicationId, {
    skip: !loanApplicationId,
  });

  const [uploadLoanDocument, { isLoading: isUploading }] =
    useUploadLoanDocumentMutation();

  const [deleteLoanDocument, { isLoading: isDeleting }] =
    useDeleteLoanDocumentMutation();

  /*
   * ============================================================
   * LOCAL STATE
   * ============================================================
   */

  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  /*
   * ============================================================
   * NORMALIZE API DATA
   * ============================================================
   */

  const documents = useMemo(() => {
    return Array.isArray(documentsData?.data) ? documentsData.data : [];
  }, [documentsData]);

  const requiredDocuments = useMemo(() => {
    if (!Array.isArray(requirementsData?.data)) {
      return [];
    }

    return requirementsData.data.filter((requirement) => {
      // These documents are intentionally not shown/required in the
      // frontend school-loan form. They can remain in the backend/API
      // contract without affecting the UI or mandatory-document checks.
      if (
        requirement.documentType === "BIRTH_CERTIFICATE" ||
        requirement.documentType === "PREVIOUS_CLASS_RESULT"
      ) {
        return false;
      }

      // Address proof is not required for the student. Keep address proof
      // available for other owners such as a parent/co-applicant.
      if (
        requirement.ownerType === "STUDENT" &&
        requirement.documentType === "ADDRESS_PROOF"
      ) {
        return false;
      }

      return true;
    });
  }, [requirementsData]);

  /*
   * ============================================================
   * GROUP REQUIREMENTS
   * ============================================================
   */

  const groupedRequirements = useMemo(() => {
    return requiredDocuments.reduce((groups, requirement) => {
      const owner = requirement.ownerType;

      if (!groups[owner]) {
        groups[owner] = [];
      }

      groups[owner].push(requirement);

      return groups;
    }, {});
  }, [requiredDocuments]);

  /*
   * ============================================================
   * HELPERS
   * ============================================================
   */

  function getDocumentLabel(type) {
    return DOCUMENT_TYPE_LABELS[type] || type;
  }

  function getOwnerLabel(type) {
    return OWNER_TYPE_LABELS[type] || type;
  }

  function getRequirementKey(ownerType, documentType) {
    return `${ownerType}:${documentType}`;
  }

  function getUploadedDocument(requirement) {
    const matchingDocuments = documents.filter(
      (document) =>
        document.ownerType === requirement.ownerType &&
        document.documentType === requirement.documentType,
    );

    if (matchingDocuments.length === 0) {
      return null;
    }

    const activeDocument = matchingDocuments.find(
      (document) => document.status !== "REJECTED",
    );

    if (activeDocument) {
      return activeDocument;
    }

    return [...matchingDocuments].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];
  }

  function isRequirementSatisfied(requirement) {
    const uploadedDocument = getUploadedDocument(requirement);

    return Boolean(uploadedDocument && uploadedDocument.status !== "REJECTED");
  }

  /*
   * ============================================================
   * PROGRESS
   * ============================================================
   */

  const mandatoryRequirements = requiredDocuments.filter(
    (requirement) => requirement.isMandatory,
  );

  const uploadedMandatoryCount = mandatoryRequirements.filter((requirement) =>
    isRequirementSatisfied(requirement),
  ).length;

  const totalMandatoryCount = mandatoryRequirements.length;

  const allMandatoryUploaded =
    totalMandatoryCount === 0 || uploadedMandatoryCount === totalMandatoryCount;

  const progressPercentage =
    totalMandatoryCount === 0
      ? 100
      : Math.round((uploadedMandatoryCount / totalMandatoryCount) * 100);

  /*
   * ============================================================
   * UPLOAD
   * ============================================================
   */

  function handleOpenUpload(requirement) {
    setSelectedRequirement(requirement);
    setSelectedFile(null);
    setFileInputKey((value) => value + 1);
  }

  function handleCloseUpload() {
    if (isUploading) {
      return;
    }

    setSelectedRequirement(null);
    setSelectedFile(null);
    setFileInputKey((value) => value + 1);
  }

  async function handleUpload(event) {
    event.preventDefault();

    if (!selectedRequirement) {
      toast.error("Please select a document requirement.");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a file.");
      return;
    }

    try {
      await uploadLoanDocument({
        file: selectedFile,
        loanApplicationId,
        ownerType: selectedRequirement.ownerType,
        documentType: selectedRequirement.documentType,
      }).unwrap();

      toast.success(
        `${getDocumentLabel(
          selectedRequirement.documentType,
        )} uploaded successfully.`,
      );

      setSelectedRequirement(null);
      setSelectedFile(null);
      setFileInputKey((value) => value + 1);

      await refetchDocuments();
    } catch (error) {
      console.error("Document upload error:", error);

      toast.error(
        error?.data?.message || error?.message || "Unable to upload document.",
      );
    }
  }

  /*
   * ============================================================
   * DELETE
   * ============================================================
   */

  async function handleDelete(documentId) {
    try {
      await deleteLoanDocument({
        documentId,
        loanApplicationId,
      }).unwrap();

      toast.success("Document deleted successfully.");

      await refetchDocuments();
    } catch (error) {
      console.error("Delete document error:", error);

      toast.error(
        error?.data?.message || error?.message || "Unable to delete document.",
      );
    }
  }

  /*
   * ============================================================
   * VIEW
   * ============================================================
   */

  function handleView(documentUrl) {
    if (!documentUrl) {
      toast.error("Document URL is not available.");
      return;
    }

    window.open(documentUrl, "_blank", "noopener,noreferrer");
  }

  /*
   * ============================================================
   * CONTINUE
   * ============================================================
   */

  function handleContinue() {
    if (!allMandatoryUploaded) {
      toast.error("Please upload all mandatory documents before continuing.");

      return;
    }

    onNext();
  }

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (isDocumentsLoading || isRequirementsLoading) {
    return (
      <LoanWizardShell
        step={step}
        totalSteps={totalSteps}
        title="Documents"
        description="Loading your document requirements..."
      >
        <div className="space-y-6">
          <div className="rounded-lg border p-5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-3 h-3 w-full" />
            <Skeleton className="mt-4 h-2 w-full" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </LoanWizardShell>
    );
  }

  /*
   * ============================================================
   * ERROR
   * ============================================================
   */

  if (isDocumentsError || isRequirementsError) {
    return (
      <LoanWizardShell
        step={step}
        totalSteps={totalSteps}
        title="Documents"
        description="We could not load your document requirements."
      >
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />

            <div>
              <p className="text-sm font-semibold">Unable to load documents</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Please try again. Your application data has not been changed.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              onClick={() => {
                refetchDocuments();
                refetchRequirements();
              }}
            >
              Retry
            </Button>

            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
          </div>
        </div>
      </LoanWizardShell>
    );
  }

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <>
      <LoanWizardShell
        step={step}
        totalSteps={totalSteps}
        title="Documents"
        description="Upload the documents required to assess your loan application."
      >
        {/* ======================================================
            PROGRESS
        ====================================================== */}

        <section className="border-b pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />

                <p className="text-sm font-semibold">Document checklist</p>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {totalMandatoryCount === 0
                  ? "No mandatory documents are currently required."
                  : `${uploadedMandatoryCount} of ${totalMandatoryCount} mandatory documents uploaded`}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {progressPercentage}%
              </p>

              <p className="text-xs text-muted-foreground">complete</p>
            </div>
          </div>

          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {allMandatoryUploaded ? (
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[hsl(var(--success))]">
              <CheckCircle2 className="size-4" />
              All mandatory documents have been uploaded.
            </div>
          ) : (
            <p className="mt-4 text-xs text-muted-foreground">
              Documents marked as required must be uploaded before you can
              continue.
            </p>
          )}
        </section>

        {/* ======================================================
            NO REQUIREMENTS
        ====================================================== */}

        {requiredDocuments.length === 0 ? (
          <div className="border-y py-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
              <FileText className="size-6 text-muted-foreground" />
            </div>

            <p className="mt-4 text-sm font-semibold">
              No document requirements found
            </p>

            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Documents have not been configured for this loan application yet.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedRequirements).map(
              ([ownerType, requirements]) => {
                const ownerMandatoryRequirements = requirements.filter(
                  (requirement) => requirement.isMandatory,
                );

                const ownerUploadedCount = ownerMandatoryRequirements.filter(
                  (requirement) => isRequirementSatisfied(requirement),
                ).length;

                return (
                  <section key={ownerType}>
                    {/* OWNER HEADER */}

                    <div className="mb-4 flex flex-col gap-2 border-b pb-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h3 className="text-base font-semibold">
                          {getOwnerLabel(ownerType)}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Documents belonging to the{" "}
                          {getOwnerLabel(ownerType).toLowerCase()}.
                        </p>
                      </div>

                      {ownerMandatoryRequirements.length > 0 ? (
                        <span className="text-xs font-medium text-muted-foreground">
                          {ownerUploadedCount}/
                          {ownerMandatoryRequirements.length} required
                        </span>
                      ) : null}
                    </div>

                    {/* DOCUMENT LIST */}

                    <div className="overflow-hidden rounded-lg border">
                      {requirements.map((requirement, requirementIndex) => {
                        const uploadedDocument =
                          getUploadedDocument(requirement);

                        const isUploaded = Boolean(uploadedDocument);

                        const isRejected =
                          uploadedDocument?.status === "REJECTED";

                        const isVerified =
                          uploadedDocument?.status === "VERIFIED";

                        const canDelete =
                          isUploaded &&
                          uploadedDocument?.status !== "VERIFIED" &&
                          (uploadedDocument?.status === "PENDING" ||
                            isRejected);

                        return (
                          <div
                            key={getRequirementKey(
                              requirement.ownerType,
                              requirement.documentType,
                            )}
                            className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between ${
                              requirementIndex !== requirements.length - 1
                                ? "border-b"
                                : ""
                            }`}
                          >
                            {/* DOCUMENT INFO */}

                            <div className="flex min-w-0 items-start gap-3">
                              <div
                                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                                  isVerified
                                    ? "bg-[hsl(var(--success))]/10"
                                    : isRejected
                                      ? "bg-destructive/10"
                                      : "bg-muted"
                                }`}
                              >
                                {isVerified ? (
                                  <CheckCircle2 className="size-5 text-[hsl(var(--success))]" />
                                ) : isRejected ? (
                                  <AlertCircle className="size-5 text-destructive" />
                                ) : (
                                  <FileText className="size-5 text-primary" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold">
                                    {getDocumentLabel(requirement.documentType)}
                                  </p>

                                  {requirement.isMandatory ? (
                                    <Badge
                                      variant="destructive"
                                      className="text-[10px]"
                                    >
                                      Required
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="neutral"
                                      className="text-[10px]"
                                    >
                                      Optional
                                    </Badge>
                                  )}

                                  {isUploaded && uploadedDocument?.status ? (
                                    <StatusBadge
                                      status={uploadedDocument.status}
                                      type="document"
                                    />
                                  ) : null}
                                </div>

                                <p className="mt-1 text-xs text-muted-foreground">
                                  {isRejected
                                    ? "Document rejected — replacement required"
                                    : isVerified
                                      ? "Document verified"
                                      : isUploaded
                                        ? "Document uploaded and awaiting review"
                                        : "Document not uploaded"}
                                </p>

                                {isRejected &&
                                uploadedDocument?.rejectionReason ? (
                                  <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
                                    <p className="text-xs font-medium text-destructive">
                                      Review note
                                    </p>

                                    <p className="mt-1 text-xs text-destructive/80">
                                      {uploadedDocument.rejectionReason}
                                    </p>
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            {/* ACTIONS */}

                            <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                              {isUploaded && uploadedDocument?.documentUrl ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 sm:flex-none"
                                  onClick={() =>
                                    handleView(uploadedDocument.documentUrl)
                                  }
                                >
                                  <Eye />
                                  View
                                </Button>
                              ) : null}

                              {!isUploaded ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  className="flex-1 sm:flex-none"
                                  onClick={() => handleOpenUpload(requirement)}
                                >
                                  <Upload />
                                  Upload
                                </Button>
                              ) : null}

                              {isRejected ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  className="flex-1 sm:flex-none"
                                  onClick={() => handleOpenUpload(requirement)}
                                >
                                  <Upload />
                                  Replace
                                </Button>
                              ) : null}

                              {canDelete ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  disabled={isDeleting}
                                  onClick={() =>
                                    handleDelete(uploadedDocument.id)
                                  }
                                  title="Delete document"
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 />
                                </Button>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              },
            )}
          </div>
        )}

        {/* ======================================================
            SECURITY NOTE
        ====================================================== */}

        <div className="flex items-start gap-3 border-t pt-5">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />

          <p className="text-xs leading-5 text-muted-foreground">
            Each document is securely linked to the correct applicant and
            document requirement. You do not need to select the document owner
            manually.
          </p>
        </div>

        {/* ======================================================
            ACTIONS
        ====================================================== */}

        <LoanWizardActions onBack={onBack}>
          {!allMandatoryUploaded ? (
            <p className="text-center text-xs text-destructive sm:text-right">
              Upload all required documents to continue.
            </p>
          ) : null}

          <Button
            type="button"
            size="lg"
            onClick={handleContinue}
            disabled={!allMandatoryUploaded}
            className="w-full sm:w-auto"
          >
            Continue →
          </Button>
        </LoanWizardActions>
      </LoanWizardShell>

      {/* ========================================================
          UPLOAD DIALOG
      ======================================================== */}

      <Dialog
        open={Boolean(selectedRequirement)}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseUpload();
          }
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Upload{" "}
              {selectedRequirement
                ? getDocumentLabel(selectedRequirement.documentType)
                : "Document"}
            </DialogTitle>

            <DialogDescription>
              Upload a clear copy of the required document.
            </DialogDescription>
          </DialogHeader>

          {selectedRequirement ? (
            <form onSubmit={handleUpload}>
              <div className="space-y-5">
                {/* DOCUMENT SUMMARY */}

                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background">
                      <FileText className="size-5 text-primary" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {getDocumentLabel(selectedRequirement.documentType)}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Owner:{" "}
                        <span className="font-medium text-foreground">
                          {getOwnerLabel(selectedRequirement.ownerType)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* FILE */}

                <FormField
                  label="Document file"
                  htmlFor="loan-document-file"
                  helperText="PDF, JPG, JPEG or PNG • Maximum 5MB"
                >
                  <Input
                    key={fileInputKey}
                    id="loan-document-file"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    disabled={isUploading}
                    onChange={(event) => {
                      setSelectedFile(event.target.files?.[0] || null);
                    }}
                    className="h-auto min-h-11 cursor-pointer py-2"
                  />
                </FormField>

                {selectedFile ? (
                  <div className="flex items-center gap-3 rounded-lg border bg-muted/20 px-3 py-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background">
                      <FileText className="size-4 text-primary" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">
                        {selectedFile.name}
                      </p>

                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="flex items-start gap-2 rounded-lg border border-primary/15 bg-primary/5 p-3">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />

                  <p className="text-xs leading-5 text-muted-foreground">
                    Make sure the document is clear, readable, and belongs to
                    the applicant shown above.
                  </p>
                </div>
              </div>

              <DialogFooter className="mt-6 flex-col-reverse gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  onClick={handleCloseUpload}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  loading={isUploading}
                  className="w-full sm:w-auto"
                >
                  <Upload />
                  {isUploading ? "Uploading..." : "Upload document"}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DocumentsStep;
