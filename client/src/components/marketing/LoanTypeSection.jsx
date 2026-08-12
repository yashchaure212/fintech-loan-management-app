import { ArrowRight, GraduationCap } from "lucide-react";
import { useGetPublicLoanTypesQuery } from "@/features/loan/api/loanApi";

function LoanTypeSection() {
  const { data, isLoading, isError } = useGetPublicLoanTypesQuery();

  const loans = data?.data || [];

  return (
    <section id="loan-products" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">Loan products</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Choose the financing that fits your goal.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Explore the loan products currently available through the
              platform.
            </p>
          </div>

          <span className="text-sm text-muted-foreground">
            Products are configured by the lending team
          </span>
        </div>

        {isLoading && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-xl border border-border bg-muted/30"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="mt-8 rounded-xl border border-danger-border bg-danger-soft p-5">
            <p className="font-medium text-foreground">
              Unable to load loan products.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please try again later.
            </p>
          </div>
        )}

        {!isLoading && !isError && loans.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <p className="font-medium">No loan products are currently available.</p>
          </div>
        )}

        {!isLoading && !isError && loans.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loans.map((loan) => (
              <article
                key={loan.id}
                className="group rounded-xl border border-border bg-card p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </span>

                  {loan.category ? (
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      {loan.category}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {loan.name}
                </h3>

                {loan.description ? (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {loan.description}
                  </p>
                ) : null}

                <div className="mt-6 flex items-center text-sm font-semibold text-primary">
                  Explore loan
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default LoanTypeSection;
