import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { loanCatalog } from "@/features/loan/data/loanCatalog";

function LoanMegaMenu({
  activeLoan,
  setActiveLoanId,
  closeMenus,
}) {
  return (
    <div className="border-border bg-background absolute top-[calc(100%+8px)] left-0 z-[100] w-[560px] overflow-hidden rounded-lg border shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
      <div className="grid grid-cols-[185px_1fr]">
        {/* PRODUCT LIST */}

        <div className="border-border bg-muted/30 border-r p-2">
          <p className="text-muted-foreground px-3 py-2 text-[10px] font-bold tracking-[0.14em] uppercase">
            Loan Products
          </p>

          <div className="space-y-1">
            {loanCatalog.map((loan) => {
              const Icon = loan.icon;
              const active = loan.id === activeLoan?.id;

              return (
                <button
                  key={loan.id}
                  type="button"
                  onClick={() =>
                    setActiveLoanId(loan.id)
                  }
                  className={[
                    "flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-xs font-semibold transition",
                    active
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-background hover:text-foreground",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4 shrink-0" />

                  <span className="truncate">
                    {loan.shortName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PRODUCT DETAIL */}

        <div className="p-5">
          {activeLoan && (
            <>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-md">
                  {(() => {
                    const Icon = activeLoan.icon;
                    return <Icon className="h-5 w-5" />;
                  })()}
                </div>

                <div className="min-w-0">
                  <h3 className="text-foreground text-base font-semibold">
                    {activeLoan.name}
                  </h3>

                  <p className="text-muted-foreground mt-1 text-xs leading-5">
                    {activeLoan.description}
                  </p>
                </div>
              </div>

              <div className="border-border bg-muted/30 mt-5 rounded-md border p-4">
                <p className="text-foreground text-sm font-semibold">
                  {activeLoan.detail}
                </p>

                <p className="text-muted-foreground mt-1 text-xs">
                  {activeLoan.status === "available"
                    ? "Apply online in a few simple steps."
                    : "This product is coming soon."}
                </p>

                <div className="mt-4">
                  {activeLoan.status === "available" ? (
                    <Link
                      to="/login?redirect=/customer/loans/apply"
                      onClick={closeMenus}
                      className="bg-primary text-primary-foreground inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold transition hover:opacity-90"
                    >
                      Apply Now

                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="bg-muted text-muted-foreground inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold">
                      Coming soon
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoanMegaMenu;