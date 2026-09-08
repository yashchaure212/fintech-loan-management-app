import {
  ArrowRight,
  Calculator,
  CalendarDays,
  IndianRupee,
  Percent,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function formatCurrency(value) {
  return `₹${Math.max(0, Math.round(value || 0)).toLocaleString("en-IN")}`;
}

function calculateEmi(amount, rate, tenure) {
  if (!amount || !tenure) return 0;

  const monthlyRate = rate / 12 / 100;

  if (monthlyRate === 0) {
    return amount / tenure;
  }

  return (
    (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );
}

const inputs = [
  {
    key: "amount",
    label: "Loan amount",
    icon: IndianRupee,
    min: 0,
    step: 10000,
    placeholder: "Enter amount",
  },
  {
    key: "rate",
    label: "Interest rate (% p.a.)",
    icon: Percent,
    min: 0,
    step: 0.1,
    placeholder: "Enter rate",
  },
  {
    key: "tenure",
    label: "Tenure (months)",
    icon: CalendarDays,
    min: 1,
    step: 1,
    placeholder: "Enter tenure",
  },
];

function EMICalculatorPreview() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(36);

  const values = {
    amount,
    rate,
    tenure,
  };

  const setters = {
    amount: setAmount,
    rate: setRate,
    tenure: setTenure,
  };

  const emi = useMemo(
    () => calculateEmi(amount, rate, tenure),
    [amount, rate, tenure],
  );

  const totalPayment = emi * Math.max(0, tenure || 0);

  const totalInterest = Math.max(
    0,
    totalPayment - Math.max(0, amount || 0),
  );

  const tenureProgress = Math.min(
    100,
    Math.max(4, (Math.max(0, tenure || 0) / 84) * 100),
  );

  return (
    <section
      id="emi-preview"
      className="scroll-mt-24 border-b border-border bg-[#f7fafc] px-3 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
              EMI calculator
            </p>
          </div>

          <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
            Plan your monthly repayment
          </h2>

          <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">
            Adjust the loan amount, rate and tenure to see an estimated EMI
            before you apply.
          </p>
        </div>

        {/* Calculator */}
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            {/* Left - inputs */}
            <div className="border-b border-slate-200 p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf3f9] text-primary">
                  <Calculator className="h-5 w-5" strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    EMI calculator
                  </p>

                  <p className="text-[10px] text-muted-foreground sm:text-xs">
                    Enter your preferred loan details
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {inputs.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.key}>
                      <label
                        htmlFor={`emi-${item.key}`}
                        className="text-[11px] font-semibold text-slate-700 sm:text-xs"
                      >
                        {item.label}
                      </label>

                      <div className="relative mt-1.5">
                        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <Input
                          id={`emi-${item.key}`}
                          type="number"
                          min={item.min}
                          step={item.step}
                          value={values[item.key]}
                          placeholder={item.placeholder}
                          onChange={(event) =>
                            setters[item.key](Number(event.target.value))
                          }
                          className="h-11 border-slate-200 bg-white pl-9 text-sm font-medium text-slate-900 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-start">
                <Link to="/emi-calculator">
                  <Button className="h-10 bg-primary px-4 text-xs font-bold text-primary-foreground hover:bg-primary-hover">
                    Open full calculator
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>

                <p className="text-[10px] leading-4 text-muted-foreground">
                  Estimates are illustrative and may differ from the final
                  applicable terms.
                </p>
              </div>
            </div>

            {/* Right - result */}
            <div className="bg-[#edf7fc] p-4 sm:p-6 lg:p-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground sm:text-xs">
                    Estimated monthly EMI
                  </p>

                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                    {formatCurrency(emi)}
                  </p>
                </div>

                <span className="shrink-0 rounded-full border border-primary/15 bg-white px-2.5 py-1 text-[9px] font-bold text-primary sm:text-[10px]">
                  Estimate
                </span>
              </div>

              {/* Summary */}
              <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
                <SummaryCard
                  label="Principal"
                  value={formatCurrency(amount)}
                />

                <SummaryCard
                  label="Interest"
                  value={formatCurrency(totalInterest)}
                />

                <SummaryCard
                  label="Total repayment"
                  value={formatCurrency(totalPayment)}
                />
              </div>

              {/* Tenure */}
              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3.5 sm:p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Tenure
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-slate-900">
                      {Math.max(0, tenure || 0)} months
                    </p>
                  </div>

                  <CalendarDays className="h-4 w-4 text-primary" />
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-gradient transition-all duration-300"
                    style={{
                      width: `${tenureProgress}%`,
                    }}
                  />
                </div>

                <div className="mt-1.5 flex justify-between text-[9px] text-muted-foreground">
                  <span>1 month</span>
                  <span>84 months</span>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="mt-4 text-[9px] leading-4 text-muted-foreground sm:text-[10px]">
                Final interest rates, fees, eligibility and repayment terms
                depend on the applicable loan product and review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3 sm:p-3.5">
      <p className="truncate text-[9px] font-medium text-muted-foreground sm:text-[10px]">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold tabular-nums text-slate-900 sm:text-sm">
        {value}
      </p>
    </div>
  );
}

export default EMICalculatorPreview;