import {
  BadgeCheck,
  Eye,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

const items = [
  {
    icon: LockKeyhole,
    title: "Authenticated access",
    description:
      "The customer journey is managed through an authenticated account rather than a public application workspace.",
  },
  {
    icon: Eye,
    title: "Visible application status",
    description:
      "Application stages and required actions are surfaced so you can understand where the journey stands.",
  },
  {
    icon: BadgeCheck,
    title: "Clear document status",
    description:
      "Required documents can be tracked through the application instead of being hidden behind separate steps.",
  },
];

function SecuritySection() {
  return (
    <section
      id="security"
      className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="overflow-hidden rounded-[1.5rem] border border-border bg-surface-secondary">
          <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:p-10">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <ShieldCheck className="h-6 w-6" />
              </span>

              <p className="mt-6 text-sm font-semibold text-primary">
                Trust & security
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                Important information stays easy to understand.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                LoanPro focuses on a transparent digital journey: secure
                account access, visible application progress, and clear
                document information.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {items.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-border bg-card p-5 shadow-card"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-blue text-primary">
                      <Icon className="h-5 w-5" />
                    </span>

                    <h3 className="mt-5 text-base font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-border bg-card px-6 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <span>LoanPro is a digital loan-management experience.</span>
            <span>Product terms and eligibility remain subject to applicable configuration.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SecuritySection;
