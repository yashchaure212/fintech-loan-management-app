import PublicNavbar from "@/components/marketing/PublicNavbar";
import EMICalculatorPreview from "@/components/marketing/EMICalculatorPreview";
import PublicFooter from "@/components/marketing/PublicFooter";

function EmiCalculator() {
  return (
    <div>
      <PublicNavbar />

      <main className="pt-6">
        <EMICalculatorPreview />
      </main>

      <PublicFooter />
    </div>
  );
}

export default EmiCalculator;
