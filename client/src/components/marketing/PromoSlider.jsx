import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import ApplyNowButton from "./ApplyNowButton";

const slides = [
  {
    id: "education",
    eyebrow: "Education Loan",
    title: "A more structured way to finance higher education.",
    description:
      "Start online, submit the required documents, and track what happens next from your account.",
    badge: "Digital application",
    accent: "from-[#0a3c82] via-[#1256ad] to-[#1d76d2]",
  },
  {
    id: "planning",
    eyebrow: "Plan Before You Apply",
    title: "Understand your estimated EMI before starting.",
    description:
      "Use the EMI calculator to compare loan amount, rate, and tenure scenarios.",
    badge: "EMI planning",
    accent: "from-[#083567] via-[#0c4b91] to-[#1971c6]",
  },
  {
    id: "tracking",
    eyebrow: "Application Tracking",
    title: "Know where your application stands.",
    description:
      "See your application status, document progress, and next required action in one place.",
    badge: "Transparent journey",
    accent: "from-[#0b355f] via-[#0a4c85] to-[#1680aa]",
  },
];

function PromoSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = slides[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const previous = () => {
    setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setActiveIndex((index) => (index + 1) % slides.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-lg">
      <div className={`relative min-h-[360px] bg-gradient-to-br ${current.accent}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(255,255,255,0.22),transparent_33%),radial-gradient(circle_at_95%_90%,rgba(255,255,255,0.14),transparent_28%)]" />

        <div className="absolute right-[-70px] top-[-60px] h-56 w-56 rounded-full border border-white/15" />
        <div className="absolute bottom-[-100px] right-[-30px] h-64 w-64 rounded-full border border-white/10" />

        <div className="relative z-10 flex min-h-[360px] flex-col justify-between p-6 text-white sm:p-8 lg:p-10">
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
              {current.badge}
            </span>

            <p className="mt-8 text-sm font-medium text-white/70">
              {current.eyebrow}
            </p>

            <h2 className="mt-2 max-w-lg text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              {current.title}
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-6 text-white/75 sm:text-base">
              {current.description}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <ApplyNowButton
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
            />

            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Show slide ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={[
                    "h-1.5 rounded-full transition-all",
                    index === activeIndex
                      ? "w-7 bg-white"
                      : "w-2 bg-white/45",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute right-4 top-4 z-20 flex gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={previous}
            className="h-8 w-8 rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            aria-label="Previous promotion"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={next}
            className="h-8 w-8 rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            aria-label="Next promotion"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute bottom-20 right-8 hidden w-44 rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:block">
          <div className="flex items-center gap-2 text-xs font-medium text-white/80">
            <CheckCircle2 className="h-4 w-4" />
            Loan journey
          </div>

          <div className="mt-3 space-y-2">
            {["Application", "Documents", "Review"].map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-[10px]">
                  {index + 1}
                </span>
                <span className="text-xs text-white/75">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromoSlider;
