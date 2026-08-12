import PublicNavbar from "@/components/marketing/PublicNavbar";
import ProductNavigationRail from "@/components/marketing/ProductNavigationRail";
import PromotionStrip from "@/components/marketing/PromotionStrip";
import HeroSection from "@/components/marketing/HeroSection";
import StatsSection from "@/components/marketing/StatsSection";
import LoanTypeSection from "@/components/marketing/LoanTypeSection";
import HowItWorksSection from "@/components/marketing/HowItWorksSection";
import EligibilitySection from "@/components/marketing/EligibilitySection";
import EMICalculatorPreview from "@/components/marketing/EMICalculatorPreview";
import WhyChooseUs from "@/components/marketing/WhyChooseUs";
import SecuritySection from "@/components/marketing/SecuritySection";
import TrustSection from "@/components/marketing/TrustSection";
import FAQSection from "@/components/marketing/FAQSection";
import PublicFooter from "@/components/marketing/PublicFooter";

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      <ProductNavigationRail />

      <PromotionStrip />

      <main>
        <HeroSection />
        <StatsSection />
        <LoanTypeSection />
        <HowItWorksSection />
        <EligibilitySection />
        <EMICalculatorPreview />
        <WhyChooseUs />
        <SecuritySection />
        <TrustSection />
        <FAQSection />

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-2xl bg-navy-gradient px-6 py-10 text-white shadow-floating sm:px-10 lg:px-12">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-medium text-white/70">
                    Ready to get started?
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Take the next step toward your education goals.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/75 sm:text-base">
                    Start your application online and track your loan journey
                    from one secure account.
                  </p>
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
