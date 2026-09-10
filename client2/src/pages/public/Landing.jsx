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
import LandingServicesStrip from "@/components/marketing/LandingServicesStrip";
import LoanDraftResumeCard from "@/components/marketing/LoanDraftResumeCard";

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        {/* Quick product navigation */}
        <LandingQuickLinks />

        <LoanDraftResumeCard />

        {/* Promotional announcement */}
        <section className="border-b border-[#eadfca] bg-[#fff8e9] px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6">
          <div className="mx-auto max-w-[1440px]">
            <div className="relative flex items-center justify-between gap-3 overflow-hidden rounded-lg border border-[#f0d9a6] bg-white px-3 py-2.5 shadow-sm sm:px-4">
              <div className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-orange-100/70" />
              <div className="pointer-events-none absolute -bottom-10 right-20 h-16 w-16 rounded-full bg-yellow-100/60" />

              <div className="relative flex min-w-0 items-center gap-2.5 sm:gap-3">
                <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm sm:px-3 sm:text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  Featured
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold text-slate-800 sm:text-xs">
                    Education loan applications are now available online
                  </p>

                  <p className="hidden text-[10px] text-slate-500 sm:block">
                    Start your application and manage your journey digitally.
                  </p>
                </div>
              </div>

              <a
                href="#loan-products"
                className="relative flex shrink-0 items-center gap-1 rounded-full bg-[hsl(var(--brand-navy))] px-3 py-1.5 text-[10px] font-bold text-white transition hover:opacity-90 sm:px-4 sm:py-2 sm:text-xs"
              >
                Explore
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Main promotional hero */}
        <LandingHero />

        {/* Bills and recharges */}
        <LandingServicesStrip />

        {/* Consumer finance categories */}
        <LandingFinanceCategories />

        {/* Loan marketplace */}
        <LandingLoanShowcase />

        {/* Promotional offers */}
        <LandingOffers />

        {/* Trust / reassurance */}
        <LandingTrustStrip />

        {/* EMI utility */}
        <EMICalculatorPreview />

        {/* Loan journey */}
        <HowItWorksSection />

        {/* Eligibility / application readiness */}
        <EligibilitySection />

        {/* Final CTA */}
        <section className="border-y border-border bg-surface-secondary px-3 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col gap-4 border border-white/10 bg-[hsl(var(--brand-navy))] px-5 py-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-7">
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

        {/* Help */}
        <FAQSection />
      </main>

      <PublicFooter />
    </div>
  );
}

export default Landing;