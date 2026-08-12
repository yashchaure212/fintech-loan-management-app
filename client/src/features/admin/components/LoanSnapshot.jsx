import AdminField from "./AdminField";
import { formatCurrency, formatCurrencyRange } from "@/features/loan/utils/loanFormatters";

function LoanSnapshot({ snapshot, loanType, loanTypeName }) {
  if (!snapshot) return null;

  const typeName = loanType?.name || loanTypeName || "N/A";

  return (
    <section className="space-y-4 border-t pt-6">
      <h2 className="subsection-title">Loan configuration snapshot</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminField label="Loan type" value={typeName} />
        <AdminField
          label="Interest rate"
          value={
            snapshot.interestRate != null ? `${snapshot.interestRate}% p.a.` : "-"
          }
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
      </div>
    </section>
  );
}

export default LoanSnapshot;
