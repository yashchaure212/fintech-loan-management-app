import { CheckCircle2, Clock3, FileCheck2, ShieldCheck } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Secure experience",
    text: "Built around protected account access",
  },
  {
    icon: FileCheck2,
    title: "Digital documents",
    text: "Submit and follow required documents",
  },
  {
    icon: Clock3,
    title: "Clear progress",
    text: "Know what happens next",
  },
  {
    icon: CheckCircle2,
    title: "Transparent journey",
    text: "Understand estimates before applying",
  },
];

function LandingTrustStrip() {
  return (
    <section className="border-y border-border bg-white px-3 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-1 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                flex
                items-center
                gap-3
                px-3
                py-2.5
                sm:justify-center
                lg:border-r
                lg:border-border
                lg:last:border-r-0
              "
            >
              <Icon className="h-5 w-5 shrink-0 text-primary" />

              <div>
                <p className="text-xs font-bold">{item.title}</p>

                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default LandingTrustStrip;
