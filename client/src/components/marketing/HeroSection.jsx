import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import ApplyNowButton from "./ApplyNowButton";
import PromoSlider from "./PromoSlider";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[hsl(var(--surface-blue))]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-160px] top-20 h-80 w-80 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-[-140px] bottom-[-100px] h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
        <PromoSlider />
      </div>

      <div className="relative mx-auto flex max-w-[1440px] flex-wrap gap-x-8 gap-y-3 border-t border-border/70 px-4 py-4 sm:px-6 lg:px-8">
        <HeroBenefit>Digital application</HeroBenefit>
        <HeroBenefit>Online document submission</HeroBenefit>
        <HeroBenefit>Application status tracking</HeroBenefit>

        <Link
          to="/emi-calculator"
          className="group ml-auto hidden items-center gap-1 text-sm font-semibold text-primary sm:inline-flex"
        >
          Plan your estimated EMI
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}

function HeroBenefit({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
      <CheckCircle2 className="h-4 w-4 text-success" />
      {children}
    </span>
  );
}

export default HeroSection;
