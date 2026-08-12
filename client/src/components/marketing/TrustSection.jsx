import {
  CheckCircle2,
  FileText,
  LayoutDashboard,
  WalletCards,
} from "lucide-react";

const items = [
  {
    icon: LayoutDashboard,
    title: "One account",
    text: "Keep your loan applications and related information connected to your customer account.",
    tone: "blue",
  },
  {
    icon: FileText,
    title: "Clear documents",
    text: "Understand what has been submitted and which document steps still need attention.",
    tone: "violet",
  },
  {
    icon: CheckCircle2,
    title: "Visible progress",
    text: "Follow application status instead of relying on an unclear hand-off between steps.",
    tone: "green",
  },
  {
    icon: WalletCards,
    title: "Repayment context",
    text: "View repayment information in the customer journey when it becomes available.",
    tone: "orange",
  },
];

const toneStyles = {
  blue: "bg-blue-50 text-blue-700",
  violet: "bg-violet-50 text-violet-700",
  green: "bg-emerald-50 text-emerald-700",
  orange: "bg-orange-50 text-orange-700",
};

function TrustSection() {
  return (
    <section className="bg-surface-blue px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-primary">
              Designed for confidence
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              The important parts of your loan journey stay visible.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              LoanPro brings the application, document, status, and repayment
              experience into a connected customer journey.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneStyles[item.tone]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <h3 className="mt-4 text-base font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
