import {
  FileCheck2,
  Headphones,
  ListChecks,
  SearchCheck,
} from "lucide-react";

const features = [
  {
    icon: SearchCheck,
    title: "Clear application journey",
    description:
      "See the stage you are in and understand what action is required next.",
    tone: "blue",
  },
  {
    icon: FileCheck2,
    title: "Digital document handling",
    description:
      "Submit required documents online and keep their status visible in your account.",
    tone: "violet",
  },
  {
    icon: ListChecks,
    title: "Information in one place",
    description:
      "Keep application, loan, and repayment information close to the journey it belongs to.",
    tone: "green",
  },
  {
    icon: Headphones,
    title: "Support when needed",
    description:
      "Access help when you have questions about the application or account experience.",
    tone: "orange",
  },
];

const toneStyles = {
  blue: "bg-blue-50 text-blue-700",
  violet: "bg-violet-50 text-violet-700",
  green: "bg-emerald-50 text-emerald-700",
  orange: "bg-orange-50 text-orange-700",
};

function WhyChooseUs() {
  return (
    <section className="border-y border-border bg-card px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-primary">Why LoanPro</p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Built around clarity, not complexity.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              The product experience is organized around the information and
              actions that matter during a digital loan journey.
            </p>
          </div>

          <div className="rounded-2xl bg-surface-blue p-5 sm:p-6">
            <p className="text-sm font-semibold text-foreground">
              One connected experience
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
              {["Discover", "Apply", "Documents", "Review", "Track"].map(
                (item, index, items) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="rounded-full border border-border bg-card px-3 py-1.5">
                      {item}
                    </span>
                    {index < items.length - 1 ? (
                      <span className="text-border">→</span>
                    ) : null}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-background p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneStyles[item.tone]}`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <h3 className="mt-5 text-base font-semibold">{item.title}</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
