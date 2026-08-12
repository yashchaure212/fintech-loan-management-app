import {
  CheckCircle2,
  FileCheck2,
  MousePointerClick,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    value: "Digital",
    label: "Application journey",
    icon: MousePointerClick,
    tone: "blue",
  },
  {
    value: "Online",
    label: "Document submission",
    icon: FileCheck2,
    tone: "green",
  },
  {
    value: "1 account",
    label: "Loan tracking",
    icon: CheckCircle2,
    tone: "violet",
  },
  {
    value: "Secure",
    label: "Customer portal",
    icon: ShieldCheck,
    tone: "orange",
  },
];

const tones = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-700",
  violet: "bg-violet-100 text-violet-700",
  orange: "bg-orange-100 text-orange-700",
};

function StatsSection() {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-border sm:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center gap-3 px-4 py-5 sm:px-6 sm:py-6"
            >
              <span
                className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:flex ${tones[item.tone]}`}
              >
                <Icon className="h-5 w-5" />
              </span>

              <div>
                <p className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  {item.value}
                </p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground sm:text-sm">
                  {item.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default StatsSection;
