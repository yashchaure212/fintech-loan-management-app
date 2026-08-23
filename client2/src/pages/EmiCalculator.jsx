import EMICalculatorPreview from "@/components/marketing/EMICalculatorPreview";
import PublicFooter from "@/components/marketing/PublicFooter";

function EmiCalculator() {
  return (
    <div className="app-shell">
      <main className="public-section pt-6">
        <EMICalculatorPreview />
      </main>

      <PublicFooter />
    </div>
  );
}

export default EmiCalculator;
