import { useState } from "react";
import { ExternalLink, FileCheck2, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/common/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

/* =============================================================
   DECISION COPY
   Document decisions get a calm confirmation dialog before they
   are applied (design-system.md section 29 / 75).
============================================================= */

const documentDecisionCopy = {
  verify: {
    title: "Verify this document?",
    description:
      "This document will be marked as verified. You can still re-verify or reject it later if needed.",
    confirmLabel: "Verify document",
    variant: "default",
  },
  reject: {
    title: "Reject this document?",
    description:
      "This document will be marked as rejected. The applicant may need to re-upload it.",
    confirmLabel: "Reject document",
    variant: "destructive",
  },
};

function formatLabel(value) {
  if (!value) return "Document";

  return String(value)
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function DocumentCard({
  document,
  onVerify,
  onReject,
  isVerifying = false,
  isRejecting = false,
}) {
  const isVerified =
    document.status === "VERIFIED" || document.status === "APPROVED";

  const isRejected = document.status === "REJECTED";
  const isBusy = isVerifying || isRejecting;

  const [pendingAction, setPendingAction] = useState(null);

  function confirmPendingAction() {
    if (pendingAction === "verify") {
      onVerify(document.id);
    } else if (pendingAction === "reject") {
      onReject(document.id);
    }

    setPendingAction(null);
  }

  return (
    <article className="border-y border-border first:border-t-0">
      {/* Document information */}
      <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <FileText
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="text-sm font-semibold">
                {formatLabel(document.documentType)}
              </h3>

              <StatusBadge status={document.status} type="document" />
            </div>

            {document.ownerType ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {formatLabel(document.ownerType)}
              </p>
            ) : null}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          {document.documentUrl ? (
            <Button asChild variant="outline" size="sm">
              <a
                href={document.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4" />
                View document
              </a>
            </Button>
          ) : null}

          {isVerified ? (
            <Badge variant="success" className="gap-1.5">
              <FileCheck2 className="size-3.5" />
              Verified
            </Badge>
          ) : (
            <>
              <Button
                size="sm"
                disabled={isBusy}
                loading={isVerifying}
                onClick={() => setPendingAction("verify")}
              >
                Verify
              </Button>

              <Button
                size="sm"
                variant="destructive"
                disabled={isBusy}
                loading={isRejecting}
                onClick={() => setPendingAction("reject")}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Rejection information */}
      {isRejected && document.rejectionReason ? (
        <div className="mb-5 border-l-2 border-destructive pl-4">
          <p className="text-xs font-semibold text-destructive">
            Rejection reason
          </p>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {document.rejectionReason}
          </p>
        </div>
      ) : null}

      <Dialog
        open={Boolean(pendingAction)}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null);
        }}
      >
        <DialogContent>
          {pendingAction ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {documentDecisionCopy[pendingAction].title}
                </DialogTitle>

                <DialogDescription>
                  {documentDecisionCopy[pendingAction].description}
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" disabled={isBusy}>
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  variant={documentDecisionCopy[pendingAction].variant}
                  disabled={isBusy}
                  onClick={confirmPendingAction}
                >
                  {documentDecisionCopy[pendingAction].confirmLabel}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </article>
  );
}

export default DocumentCard;
