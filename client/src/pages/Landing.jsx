import LandingHero from "@/components/marketing/LandingHero";
import LandingQuickLinks from "@/components/marketing/LandingQuickLinks";
import LandingLoanShowcase from "@/components/marketing/LandingLoanShowcase";
import LandingOffers from "@/components/marketing/LandingOffers";
import LandingFinanceCategories from "@/components/marketing/LandingFinanceCategories";
import LandingTrustStrip from "@/components/marketing/LandingTrustStrip";
import EMICalculatorPreview from "@/components/marketing/EMICalculatorPreview";
import HowItWorksSection from "@/components/marketing/HowItWorksSection";
import EligibilitySection from "@/components/marketing/EligibilitySection";
import FAQSection from "@/components/marketing/FAQSection";
import PublicFooter from "@/components/marketing/PublicFooter";

import LoanDraftResumeCard from "@/components/marketing/LoanDraftResumeCard";

function Landing() {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-foreground">
      <main>
        <LandingQuickLinks />

        {/* =====================================================
            RESUME SAVED LOAN APPLICATION
        ===================================================== */}

        <LoanDraftResumeCard />

        <LandingHero />

        {/* Promotional announcement */}
        <section className="border-b border-border bg-[#fffaf2] px-3 py-2.5 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 border border-[#eadfca] bg-white px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="shrink-0 rounded-sm bg-orange-500 px-1.5 py-1 text-[9px] font-bold uppercase text-white">
                Featured
              </span>

              <p className="truncate text-xs font-semibold">
                Education loan applications are available online.
              </p>
            </div>

            <a
              href="#loan-products"
              className="shrink-0 text-xs font-bold text-primary"
            >
              Explore
            </a>
          </div>
        </section>

        <LandingLoanShowcase />

        <LandingOffers />

        <LandingFinanceCategories />

        <LandingTrustStrip />

        <EMICalculatorPreview />

        <HowItWorksSection />

        <EligibilitySection />

        {/* Final CTA */}
        <section className="border-y border-border bg-[#f8fafc] px-3 py-7 sm:px-6 sm:py-9 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col gap-4 rounded-lg bg-[hsl(var(--brand-navy))] px-5 py-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-blue-200">
                  Ready to begin?
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Start with the loan journey that fits your goal.
                </h2>

                <p className="mt-1 text-xs text-white/65">
                  Product availability and final terms depend on configured
                  eligibility and review.
                </p>
              </div>

              <a
                href="#loan-products"
                className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-md bg-white px-4 py-2.5 text-sm font-bold text-[hsl(var(--brand-navy))]"
              >
                Explore loans
              </a>
            </div>
          </div>
        </section>

        <FAQSection />
      </main>

      <PublicFooter />
    </div>
  );
}

export default Landing;
