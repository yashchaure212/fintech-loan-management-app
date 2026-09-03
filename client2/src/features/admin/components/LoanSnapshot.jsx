import AdminField from "./AdminField";
import {
  formatCurrency,
  formatCurrencyRange,
} from "@/features/loan/utils/loanFormatters";

function LoanSnapshot({ snapshot, loanType, loanTypeName }) {
  if (!snapshot) return null;

  const typeName = loanType?.name || loanTypeName || "N/A";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-sm font-semibold">Captured configuration</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Terms captured at submission. These remain in force for this loan
            even if pricing has changed since.
          </p>
        </div>

        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          Snapshot
        </span>
      </div>

      <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
        <AdminField label="Loan type" value={typeName} />

        <AdminField
          label="Interest rate"
          value={
            snapshot.interestRate != null
              ? `${snapshot.interestRate}% p.a.`
              : "-"
          }
          emphasize
        />

        <AdminField
          label="Processing fee"
          value={
            snapshot.processingFee != null
              ? `${snapshot.processingFee}${
                  snapshot.processingFeeType === "PERCENTAGE" ? "%" : ""
                }`
              : "-"
          }
        />

        <AdminField
          label="GST"
          value={
            snapshot.gstPercentage != null ? `${snapshot.gstPercentage}%` : "-"
          }
        />

        <AdminField
          label="Allowed amount"
          value={formatCurrencyRange(snapshot.minAmount, snapshot.maxAmount)}
        />

        <AdminField
          label="Allowed tenure"
          value={
            snapshot.minTenure != null && snapshot.maxTenure != null
              ? `${snapshot.minTenure} – ${snapshot.maxTenure} months`
              : "-"
          }
        />

        <AdminField
          label="Late penalty"
          value={formatCurrency(snapshot.latePenalty)}
        />

        <AdminField
          label="Foreclosure charge"
          value={formatCurrency(snapshot.foreclosureCharge)}
        />

        <AdminField
          label="Configuration version"
          value={snapshot.configurationId || "-"}
          hint="Pricing version used for this loan"
        />

        <AdminField
          label="Effective from"
          value={
            snapshot.effectiveFrom
              ? new Date(snapshot.effectiveFrom).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "-"
          }
        />

        <AdminField
          label="Captured at"
          value={
            snapshot.capturedAt
              ? new Date(snapshot.capturedAt).toLocaleString("en-IN")
              : "-"
          }
        />
      </div>
    </div>
  );
}

export default LoanSnapshot;
