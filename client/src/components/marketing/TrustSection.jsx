import { CheckCircle2 } from "lucide-react";

const items = [
  "Digital application workflow",
  "Application status tracking",
  "Online document submission",
  "Clear repayment information",
];

function TrustSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-primary">A clearer experience</p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Everything important stays close to the application.
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              From your first application step to your repayment schedule, the
              platform is designed around the information customers actually
              need.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
