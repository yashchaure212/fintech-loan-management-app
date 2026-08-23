import { Check, Clock3, X } from "lucide-react";

function formatStatus(status) {
  if (!status) return "Unknown";

  return String(status)
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const WORKFLOW_STEPS = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "DISBURSED",
  "CLOSED",
];

function StatusTimeline({ history }) {
  if (!history?.length) {
    return (
      <div className="app-card border-dashed p-6 text-center">
        <Clock3 className="mx-auto size-6 text-muted-foreground" />

        <p className="text-helper mt-2">No application history available.</p>
      </div>
    );
  }

  /*
   * IMPORTANT:
   * Backend currently returns history newest -> oldest.
   *
   * Example:
   * APPROVED
   * UNDER_REVIEW
   * SUBMITTED
   * DRAFT
   *
   * We normalize it to oldest -> newest so the timeline
   * logic always works correctly.
   */
  const normalizedHistory = [...history].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );

  /*
   * The last item is now genuinely the latest status.
   */
  const latestStatus = normalizedHistory[normalizedHistory.length - 1]?.status;

  const isRejected = latestStatus === "REJECTED";

  /*
   * Find the current position in the visible workflow.
   */
  const latestIndex = WORKFLOW_STEPS.indexOf(latestStatus);

  /*
   * Build a lookup for each status.
   */
  const historyByStatus = new Map(
    normalizedHistory.map((item) => [item.status, item]),
  );

  return (
    <div className="app-card p-5 sm:p-6">
      {/* HEADER */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-foreground">
          Application progress
        </p>

        <p className="text-helper mt-1">
          Track how this application has moved through the review process.
        </p>
      </div>

      <ol className="space-y-0">
        {WORKFLOW_STEPS.map((step, index) => {
          const historyItem = historyByStatus.get(step);

          /*
           * Completed means this step happened BEFORE
           * the current/latest step.
           */
          const isCompleted = latestIndex >= 0 && latestIndex > index;

          /*
           * Current means this is the latest status.
           */
          const isCurrent = latestStatus === step;

          /*
           * Future means the application has not reached this step yet.
           */
          const isFuture = latestIndex >= 0 && latestIndex < index;

          const isLast = index === WORKFLOW_STEPS.length - 1;

          /*
           * Connector is green when the application has
           * progressed past this step.
           */
          const connectorCompleted = !isLast && latestIndex > index;

          return (
            <li key={step} className="relative flex gap-4 pb-7 last:pb-0">
              {/* CONNECTOR */}
              {!isLast ? (
                <div
                  className={[
                    "absolute left-[7px] top-5 h-[calc(100%-0.5rem)] w-px",
                    connectorCompleted
                      ? "bg-primary"
                      : "bg-[hsl(var(--border-subtle))]",
                  ].join(" ")}
                />
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
                {isCompleted ? (
                  <Check className="size-2.5 text-primary" strokeWidth={4} />
                ) : (
                  <span
                    className={[
                      "size-1.5 rounded-full",
                      isCurrent ? "bg-primary" : "bg-muted-foreground/30",
                    ].join(" ")}
                  />
                )}
              </div>

              {/* CONTENT */}
              <div
                className={[
                  "min-w-0 flex-1",
                  isFuture ? "opacity-55" : "",
                ].join(" ")}
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={[
                        "text-sm",
                        isCurrent
                          ? "font-bold text-foreground"
                          : isCompleted
                            ? "font-semibold text-foreground"
                            : "font-medium text-muted-foreground",
                      ].join(" ")}
                    >
                      {formatStatus(step)}
                    </p>

                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                        <Clock3 className="size-3" />
                        Current
                      </span>
                    ) : null}
                  </div>

                  {historyItem ? (
                    <p
                      className={
                        isFuture
                          ? "text-caption text-muted-foreground/50"
                          : "text-caption"
                      }
                    >
                      {formatDate(historyItem.createdAt)}
                    </p>
                  ) : null}
                </div>

                {historyItem?.remarks ? (
                  <p
                    className={[
                      "mt-1 text-sm leading-6",
                      isFuture ? "text-muted-foreground/50" : "text-helper",
                    ].join(" ")}
                  >
                    {historyItem.remarks}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}

        {/* REJECTED */}
        {isRejected ? (
          <li className="relative flex gap-4">
            {/* REJECTED INDICATOR */}
            <div className="relative z-10 mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-background ring-2 ring-destructive">
              <X className="size-2.5 text-destructive" strokeWidth={4} />
            </div>

            {/* REJECTED CONTENT */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-destructive">Rejected</p>

                  <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-destructive">
                    Application closed
                  </span>
                </div>

                {historyByStatus.get("REJECTED") ? (
                  <p className="text-caption">
                    {formatDate(historyByStatus.get("REJECTED").createdAt)}
                  </p>
                ) : null}
              </div>

              {historyByStatus.get("REJECTED")?.remarks ? (
                <p className="text-helper mt-1">
                  {historyByStatus.get("REJECTED").remarks}
                </p>
              ) : null}
            </div>
          </li>
        ) : null}
      </ol>
    </div>
  );
}

export default StatusTimeline;
