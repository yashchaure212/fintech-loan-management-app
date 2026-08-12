import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What information do I need before starting an application?",
    answer:
      "The application will guide you through the information and documents required for the selected loan product.",
  },
  {
    question: "Can I continue an application later?",
    answer:
      "Draft applications can be continued later when you sign back into your customer account.",
  },
  {
    question: "How do I know what is happening with my application?",
    answer:
      "Your customer account provides application status and the next required action when applicable.",
  },
  {
    question: "Can I calculate my EMI before applying?",
    answer:
      "Yes. Use the EMI calculator to estimate a monthly repayment using the amount, interest rate, and tenure you provide.",
  },
  {
    question: "Are the displayed EMI and interest terms final?",
    answer:
      "No. Calculator values are estimates. Final terms depend on the applicable loan configuration, eligibility, and approval process.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-semibold text-primary">
            Frequently asked questions
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Answers before you begin.
          </h2>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
          {faqs.map((faq, index) => {
            const open = openIndex === index;

            return (
              <div
                key={faq.question}
                className="border-b border-border last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-medium sm:px-5"
                  aria-expanded={open}
                >
                  <span>{faq.question}</span>

                  <ChevronDown
                    className={[
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                      open ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </button>

                {open ? (
                  <div className="px-4 pb-5 text-sm leading-6 text-muted-foreground sm:px-5">
                    {faq.answer}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
