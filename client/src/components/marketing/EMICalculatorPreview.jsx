import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function formatCurrency(value) {
  return `₹${Math.max(0, Math.round(value || 0)).toLocaleString("en-IN")}`;
}

function calculateEmi(amount, rate, tenure) {
  if (!amount || !rate || !tenure) return 0;

  const monthlyRate = rate / 12 / 100;

  if (monthlyRate === 0) {
    return amount / tenure;
  }

  return (
    (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );
}

function EMICalculatorPreview() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(36);

  const emi = useMemo(
    () => calculateEmi(amount, rate, tenure),
    [amount, rate, tenure],
  );

  const totalPayment = emi * tenure;
  const totalInterest = Math.max(0, totalPayment - amount);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 overflow-hidden rounded-2xl border border-border bg-card shadow-card lg:grid-cols-[0.95fr_1.05fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-semibold text-primary">EMI calculator</p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Understand your estimated monthly repayment.
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Adjust the loan amount, rate, and tenure to explore an estimated
              EMI before you apply.
            </p>

            <div className="mt-8 grid gap-5">
              <div>
                <label htmlFor="emi-amount" className="text-sm font-medium">
                  Loan amount
                </label>

                <Input
                  id="emi-amount"
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(event) => setAmount(Number(event.target.value))}
                  className="mt-2 h-11"
                />
              </div>

              <div>
                <label htmlFor="emi-rate" className="text-sm font-medium">
                  Interest rate (% p.a.)
                </label>

                <Input
                  id="emi-rate"
                  type="number"
                  min="0"
                  step="0.1"
                  value={rate}
                  onChange={(event) => setRate(Number(event.target.value))}
                  className="mt-2 h-11"
                />
              </div>

              <div>
                <label htmlFor="emi-tenure" className="text-sm font-medium">
                  Tenure (months)
                </label>

                <Input
                  id="emi-tenure"
                  type="number"
                  min="1"
                  value={tenure}
                  onChange={(event) => setTenure(Number(event.target.value))}
                  className="mt-2 h-11"
                />
              </div>
            </div>

            <Link to="/emi-calculator" className="mt-6 inline-block">
              <Button variant="outline">
                Open full EMI calculator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="bg-surface-blue p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-medium text-muted-foreground">
              Estimated monthly EMI
            </p>

            <p className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {formatCurrency(emi)}
            </p>

            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              This is an estimate. Final pricing, eligibility, and repayment
              terms depend on the applicable loan configuration.
            </p>

            <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
              <SummaryRow label="Principal" value={formatCurrency(amount)} />
              <SummaryRow label="Estimated interest" value={formatCurrency(totalInterest)} />
              <SummaryRow label="Estimated repayment" value={formatCurrency(totalPayment)} />
              <SummaryRow label="Tenure" value={`${tenure || 0} months`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums text-foreground">
        {value}
      </span>
    </div>
  );
}

export default EMICalculatorPreview;
