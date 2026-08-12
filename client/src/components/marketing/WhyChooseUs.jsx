import { FileCheck2, Headphones, SearchCheck, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: SearchCheck,
    title: "Clear application journey",
    description:
      "Know which step you are on and what action is required next.",
  },
  {
    icon: FileCheck2,
    title: "Digital document handling",
    description:
      "Submit required documents online and review their status from your account.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent information",
    description:
      "Keep important loan, application, and repayment information visible.",
  },
  {
    icon: Headphones,
    title: "Support when you need it",
    description:
      "Get guidance when you have questions about your application journey.",
  },
];

function WhyChooseUs() {
  return (
    <section className="border-y border-border bg-card px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Why LoanPro</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Built around clarity, not complexity.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-background p-5 shadow-card"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </span>

                <h3 className="mt-5 text-base font-semibold">{item.title}</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
