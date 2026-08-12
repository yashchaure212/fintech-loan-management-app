import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/common/StatusBadge";

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
  const isVerified = document.status === "VERIFIED";

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {formatLabel(document.documentType)}
          </p>
          {document.ownerType ? (
            <p className="text-caption mt-1 text-muted-foreground">
              Owner: {formatLabel(document.ownerType)}
            </p>
          ) : null}
        </div>

        <StatusBadge status={document.status} type="document" />
      </div>

      {document.status === "REJECTED" && document.rejectionReason ? (
        <p className="text-xs text-destructive">{document.rejectionReason}</p>
      ) : null}

      {document.documentUrl ? (
        <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
          <a href={document.documentUrl} target="_blank" rel="noreferrer">
            View document
          </a>
        </Button>
      ) : null}

      {!isVerified ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            size="sm"
            className="w-full sm:w-auto"
            disabled={isVerifying || isRejecting}
            loading={isVerifying}
            onClick={() => onVerify(document.id)}
          >
            Verify
          </Button>

          <Button
            size="sm"
            variant="destructive"
            className="w-full sm:w-auto"
            disabled={isVerifying || isRejecting}
            loading={isRejecting}
            onClick={() => onReject(document.id)}
          >
            Reject
          </Button>
        </div>
      ) : (
        <Badge variant="success">Verified</Badge>
      )}
    </div>
  );
}

export default DocumentCard;
