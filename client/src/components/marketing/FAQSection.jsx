import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What information do I need before starting an application?",
    answer:
      "The application flow guides you through the information and documents required for the selected loan product. Reviewing the product and the application steps first can help you prepare.",
  },
  {
    question: "Can I continue an application later?",
    answer:
      "Draft applications can be continued after you sign back into your customer account, subject to the application's current state.",
  },
  {
    question: "How do I know what is happening with my application?",
    answer:
      "Your customer account is designed to show application status and the next required action when one is available.",
  },
  {
    question: "Can I calculate my EMI before applying?",
    answer:
      "Yes. Use the EMI calculator to explore an estimated monthly repayment using the amount, interest rate, and tenure you provide.",
  },
  {
    question: "Are the displayed EMI and interest terms final?",
    answer:
      "No. Calculator values are estimates. Final pricing, eligibility, fees, and repayment terms depend on the applicable loan configuration and review process.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <HelpCircle className="h-5 w-5" />
            </span>

            <p className="mt-6 text-sm font-semibold text-primary">
              Frequently asked questions
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Answers before you begin.
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              A few practical answers about applications, documents, status,
              and repayment estimates.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
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
                    className="flex min-h-16 w-full items-center justify-between gap-5 px-5 py-4 text-left text-sm font-semibold transition hover:bg-muted/50 sm:px-6"
                    aria-expanded={open}
                  >
                    <span>{faq.question}</span>

                    <span
                      className={[
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-transform",
                        open ? "rotate-180 bg-primary-soft text-primary" : "",
                      ].join(" ")}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  {open ? (
                    <div className="px-5 pb-5 pr-14 text-sm leading-6 text-muted-foreground sm:px-6 sm:pr-16">
                      {faq.answer}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
