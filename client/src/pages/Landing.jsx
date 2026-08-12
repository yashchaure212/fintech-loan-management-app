import PublicNavbar from "@/components/marketing/PublicNavbar";
import ProductNavigationRail from "@/components/marketing/ProductNavigationRail";
import PromotionStrip from "@/components/marketing/PromotionStrip";
import HeroSection from "@/components/marketing/HeroSection";
import StatsSection from "@/components/marketing/StatsSection";
import FeaturedServices from "@/components/marketing/FeaturedServices";
import LoanTypeSection from "@/components/marketing/LoanTypeSection";
import OfferCards from "@/components/marketing/OfferCards";
import HowItWorksSection from "@/components/marketing/HowItWorksSection";
import EligibilitySection from "@/components/marketing/EligibilitySection";
import EMICalculatorPreview from "@/components/marketing/EMICalculatorPreview";
import WhyChooseUs from "@/components/marketing/WhyChooseUs";
import SecuritySection from "@/components/marketing/SecuritySection";
import TrustSection from "@/components/marketing/TrustSection";
import FAQSection from "@/components/marketing/FAQSection";
import PublicFooter from "@/components/marketing/PublicFooter";
import ApplyNowButton from "@/components/marketing/ApplyNowButton";

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicNavbar />
      <ProductNavigationRail />
      <PromotionStrip />

      <main>
        <HeroSection />
        <StatsSection />
        <FeaturedServices />
        <LoanTypeSection />
        <OfferCards />
        <HowItWorksSection />
        <EligibilitySection />
        <EMICalculatorPreview />
        <WhyChooseUs />
        <SecuritySection />
        <TrustSection />
        <FAQSection />

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-[1.5rem] bg-navy-gradient px-6 py-10 text-white shadow-floating sm:px-10 lg:px-12 lg:py-12">
              <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
                    Ready when you are
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Take the next step toward your education goals.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/75 sm:text-base">
                    Start your application online and keep your loan journey
                    organized from one secure account.
                  </p>
                </div>

                <div className="shrink-0">
                  <div className="flex flex-wrap gap-2">
                    <ApplyNowButton className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[hsl(var(--brand-navy))] shadow-lg transition hover:-translate-y-px hover:bg-white/90" />
                    <a
                      href="#loan-products"
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                    >
                      Explore products
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

export default Landing;
