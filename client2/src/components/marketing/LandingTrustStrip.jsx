import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Secure account",
    text: "Protected access",
  },
  {
    icon: FileCheck2,
    title: "Digital documents",
    text: "Simple online submission",
  },
  {
    icon: Clock3,
    title: "Clear progress",
    text: "Track what's next",
  },
  {
    icon: CheckCircle2,
    title: "Transparent journey",
    text: "Clear estimates",
  },
];

function LandingTrustStrip() {
  return (
    <section className="border-b border-border bg-[#f8fbfd] px-3 py-3 sm:px-6 sm:py-3.5 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  flex
                  min-w-[185px]
                  shrink-0
                  items-center
                  gap-2.5
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  py-2.5
                  sm:min-w-0
                  sm:rounded-none
                  sm:border-0
                  sm:bg-transparent
                  sm:px-3
                  lg:border-r
                  lg:border-slate-200
                  lg:last:border-r-0
                "
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eaf4fb] text-primary">
                  <Icon className="h-4 w-4" strokeWidth={1.9} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold text-slate-900 sm:text-xs">
                    {item.title}
                  </p>

                  <p className="mt-0.5 truncate text-[9px] text-muted-foreground sm:text-[10px]">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LandingTrustStrip;