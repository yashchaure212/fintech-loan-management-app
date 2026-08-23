import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Percent, CalendarDays, IndianRupee } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  },
  {
    key: "rate",
    label: "Interest rate (% p.a.)",
    icon: Percent,
    min: 0,
    step: 0.1,
  },
  {
    key: "tenure",
    label: "Tenure (months)",
    icon: CalendarDays,
    min: 1,
    step: 1,
  },
];

function EMICalculatorPreview() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(36);

  const values = { amount, rate, tenure };

  const emi = useMemo(
    () => calculateEmi(amount, rate, tenure),
    [amount, rate, tenure],
  );

  const totalPayment = emi * Math.max(0, tenure || 0);
  const totalInterest = Math.max(0, totalPayment - Math.max(0, amount || 0));

  const setters = {
    amount: setAmount,
    rate: setRate,
    tenure: setTenure,
  };

  return (
    <section id="emi-preview" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative overflow-hidden bg-brand-gradient p-6 text-white sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

              <div className="relative">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Calculator className="h-5 w-5" />
                </span>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-sky-100">
                  EMI calculator
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Plan the repayment before you apply.
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-6 text-white/72 sm:text-base">
                  Adjust the amount, interest rate, and tenure to explore an
                  estimated monthly repayment.
                </p>

                <div className="mt-8 space-y-4">
                  {inputs.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.key}>
                        <label
                          htmlFor={`emi-${item.key}`}
                          className="text-xs font-medium text-white/75"
                        >
                          {item.label}
                        </label>

                        <div className="relative mt-1.5">
                          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />

                          <Input
                            id={`emi-${item.key}`}
                            type="number"
                            min={item.min}
                            step={item.step}
                            value={values[item.key]}
                            onChange={(event) =>
                              setters[item.key](Number(event.target.value))
                            }
                            className="h-11 border-white/15 bg-white/10 pl-9 text-white placeholder:text-white/40 focus-visible:ring-white/30"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link to="/emi-calculator" className="mt-7 inline-block">
                  <Button className="bg-white text-[hsl(var(--brand-navy))] hover:bg-white/90">
                    Open full EMI calculator
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-surface-blue p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Estimated monthly EMI
                  </p>

                  <p className="mt-1 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                    {formatCurrency(emi)}
                  </p>
                </div>

                <span className="inline-flex w-fit rounded-full border border-primary/15 bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
                  Example estimate
                </span>
              </div>

              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                Calculator values are illustrative. Final pricing, eligibility,
                fees, and repayment terms depend on the applicable loan
                configuration.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <SummaryCard label="Principal" value={formatCurrency(amount)} />
                <SummaryCard label="Estimated interest" value={formatCurrency(totalInterest)} />
                <SummaryCard label="Estimated repayment" value={formatCurrency(totalPayment)} />
              </div>

              <div className="mt-6 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Tenure</span>
                  <span className="text-sm font-semibold tabular-nums">
                    {Math.max(0, tenure || 0)} months
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-brand-gradient"
                    style={{
                      width: `${Math.min(100, Math.max(4, (Math.max(0, tenure || 0) / 84) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-base font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export default EMICalculatorPreview;
