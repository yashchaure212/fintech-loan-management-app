import { useMemo, useState } from "react";
import {
  FileText,
  CheckCircle2,
  Upload,
  Eye,
  Trash2,
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
import {
  LoanWizardShell,
  LoanWizardActions,
} from "./LoanWizardShell";

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
};

const OWNER_TYPE_LABELS = {
  STUDENT: "Student",
  FATHER: "Father",
  MOTHER: "Mother",
  CO_APPLICANT: "Co-applicant",
  APPLICANT: "Applicant",
};

function DocumentsStep({ loanApplicationId, onBack, onNext }) {
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
  } = useGetLoanDocumentsQuery(loanApplicationId);

  const {
    data: requirementsData,
    isLoading: isRequirementsLoading,
    isError: isRequirementsError,
    refetch: refetchRequirements,
  } = useGetRequiredLoanDocumentsQuery(loanApplicationId);

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
    return Array.isArray(requirementsData?.data) ? requirementsData.data : [];
  }, [requirementsData]);

  /*
   * ============================================================
   * GROUP REQUIREMENTS BY OWNER
   *
   * Example:
   *
   * STUDENT
   *   Aadhaar Card
   *   10th Marksheet
   *
   * FATHER
   *   Aadhaar Card
   *   PAN Card
   *   Income Proof
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
   * DOCUMENT HELPERS
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

  /*
   * Find the current document for a requirement.
   *
   * Prefer a non-rejected (PENDING/VERIFIED) document.
   * Fall back to the newest rejected document so Replace
   * remains available.
   */

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

    return Boolean(
      uploadedDocument && uploadedDocument.status !== "REJECTED",
    );
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
   * OPEN UPLOAD DIALOG
   *
   * IMPORTANT:
   * We only pass the requirement.
   *
   * User never chooses ownerType/documentType manually.
   * ============================================================
   */

  function handleOpenUpload(requirement) {
    setSelectedRequirement(requirement);
    setSelectedFile(null);
    setFileInputKey((value) => value + 1);
  }

  /*
   * ============================================================
   * CLOSE DIALOG
   * ============================================================
   */

  function handleCloseUpload() {
    if (isUploading) {
      return;
    }

    setSelectedRequirement(null);
    setSelectedFile(null);
    setFileInputKey((value) => value + 1);
  }

  /*
   * ============================================================
   * UPLOAD
   * ============================================================
   */

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
      await deleteLoanDocument(documentId).unwrap();

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
   * VIEW DOCUMENT
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
      <LoanWizardShell step={4} title="Documents" description="Loading requirements...">
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </LoanWizardShell>
    );
  }

  if (isDocumentsError || isRequirementsError) {
    return (
      <LoanWizardShell
        step={4}
        title="Documents"
        description="We could not load your document requirements."
      >
        <div className="flex flex-col gap-2 sm:flex-row">
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
      </LoanWizardShell>
    );
  }

  return (
    <>
      <LoanWizardShell
        step={4}
        title="Documents"
        description="Upload the documents required for your education loan application."
      >
        <section className="space-y-3 rounded-xl border bg-muted/20 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-label">Document progress</p>
              <p className="text-caption text-muted-foreground">
                {uploadedMandatoryCount} of {totalMandatoryCount} required
                documents uploaded
              </p>
            </div>

            <Badge variant={allMandatoryUploaded ? "success" : "warning"}>
              {allMandatoryUploaded ? "Complete" : `${progressPercentage}%`}
            </Badge>
          </div>

          <Progress value={progressPercentage} />
        </section>

        {requiredDocuments.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <FileText className="mx-auto size-8 text-muted-foreground" />
            <p className="subsection-title mt-3">No document requirements found</p>
            <p className="text-helper mx-auto mt-1 max-w-md">
              No documents have been configured for this loan application yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedRequirements).map(
              ([ownerType, requirements]) => {
                const ownerMandatoryRequirements = requirements.filter(
                  (requirement) => requirement.isMandatory,
                );

                const ownerUploadedCount = ownerMandatoryRequirements.filter(
                  (requirement) => isRequirementSatisfied(requirement),
                ).length;

                return (
                  <section key={ownerType} className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="subsection-title">
                          {getOwnerLabel(ownerType)}
                        </h3>
                        <p className="text-caption text-muted-foreground">
                          Documents for the {getOwnerLabel(ownerType).toLowerCase()}
                        </p>
                      </div>

                      {ownerMandatoryRequirements.length > 0 ? (
                        <span className="text-caption font-medium text-muted-foreground">
                          {ownerUploadedCount}/{ownerMandatoryRequirements.length}
                        </span>
                      ) : null}
                    </div>

                    <div className="divide-y rounded-xl border">
                      {requirements.map((requirement) => {
                        const uploadedDocument =
                          getUploadedDocument(requirement);

                        const isUploaded = Boolean(uploadedDocument);
                        const isRejected =
                          uploadedDocument?.status === "REJECTED";

                        const canDelete =
                          isUploaded &&
                          uploadedDocument?.status !== "VERIFIED" &&
                          (uploadedDocument?.status === "PENDING" || isRejected);

                        return (
                          <div
                            key={getRequirementKey(
                              requirement.ownerType,
                              requirement.documentType,
                            )}
                            className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex min-w-0 items-start gap-3">
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                                {uploadedDocument?.status === "VERIFIED" ? (
                                  <CheckCircle2 className="size-5 text-[hsl(var(--success))]" />
                                ) : (
                                  <FileText className="size-5" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-medium">
                                    {getDocumentLabel(requirement.documentType)}
                                  </p>

                                  <Badge
                                    variant={
                                      requirement.isMandatory
                                        ? "destructive"
                                        : "neutral"
                                    }
                                  >
                                    {requirement.isMandatory
                                      ? "Required"
                                      : "Optional"}
                                  </Badge>

                                  {isUploaded && uploadedDocument?.status ? (
                                    <StatusBadge
                                      status={uploadedDocument.status}
                                      type="document"
                                    />
                                  ) : null}
                                </div>

                                <p className="text-caption mt-1 text-muted-foreground">
                                  {getOwnerLabel(ownerType)}
                                  {!isUploaded ? " • Not uploaded" : null}
                                </p>

                                {isRejected &&
                                uploadedDocument?.rejectionReason ? (
                                  <p className="mt-2 text-xs text-destructive">
                                    {uploadedDocument.rejectionReason}
                                  </p>
                                ) : null}
                              </div>
                            </div>

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
                                  onClick={() =>
                                    handleOpenUpload(requirement)
                                  }
                                >
                                  <Upload />
                                  Upload
                                </Button>
                              ) : null}

                              {isRejected ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() =>
                                    handleOpenUpload(requirement)
                                  }
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

        <p className="text-helper rounded-lg border border-primary/20 bg-primary/5 p-4">
          Each upload is linked to the correct person and document type — no
          manual selection needed.
        </p>

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
      ========================================================= */}

      <Dialog
        open={Boolean(selectedRequirement)}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseUpload();
          }
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Upload{" "}
              {selectedRequirement
                ? getDocumentLabel(selectedRequirement.documentType)
                : "Document"}
            </DialogTitle>

            <DialogDescription>
              Upload the document belonging to the person shown below.
            </DialogDescription>
          </DialogHeader>

          {selectedRequirement && (
            <form onSubmit={handleUpload}>
              <div className="space-y-5">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="financial-label">Document owner</p>
                  <p className="mt-1 text-sm font-semibold">
                    {getOwnerLabel(selectedRequirement.ownerType)}
                  </p>
                  <p className="text-caption mt-1 text-muted-foreground">
                    {getDocumentLabel(selectedRequirement.documentType)}
                  </p>
                </div>

                <FormField
                  label="Document file"
                  htmlFor="loan-document-file"
                  helperText="Supported formats: PDF, JPG, JPEG and PNG (max 5MB)."
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
                  <div className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2 text-xs">
                    <FileText className="size-4 shrink-0 text-primary" />
                    <span className="min-w-0 truncate">{selectedFile.name}</span>
                  </div>
                ) : null}
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
                  {isUploading ? "Uploading..." : "Upload Document"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DocumentsStep;
