import { BadgeCheck, LockKeyhole, ShieldCheck } from "lucide-react";

const items = [
  {
    icon: LockKeyhole,
    title: "Secure account access",
    description:
      "Your loan journey is managed through an authenticated customer account.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent loan process",
    description:
      "Application status and required actions are surfaced throughout the journey.",
  },
  {
    icon: BadgeCheck,
    title: "Clear document status",
    description:
      "See which documents are pending, verified, or require attention.",
  },
];

function SecuritySection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-border bg-surface-secondary p-6 sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">
              Trust & security
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Important information stays easy to understand.
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              LoanPro is designed to make the digital loan journey easier to
              follow, from account access through application and repayment.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <Icon className="h-6 w-6 text-primary" />

                  <h3 className="mt-4 font-semibold">{item.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SecuritySection;
