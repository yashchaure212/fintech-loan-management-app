import {
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";

import LoanMegaMenu from "./LoanMegaMenu";
import ResourcesMenu from "./ResourcesMenu";

import { publicResources } from "@/features/navigation/data/navigationData";

function PublicNavigation({
  menuRef,
  desktopMenu,
  setDesktopMenu,
  activeLoan,
  setActiveLoanId,
  navigateToHash,
  closeMenus,
}) {
  return (
    <nav
      ref={menuRef}
      className="ml-4 hidden items-center gap-0.5 lg:flex"
    >
      {/* LOANS */}

      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setDesktopMenu(
              desktopMenu === "loans"
                ? null
                : "loans",
            );
          }}
          className="text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors"
        >
          Loans

          <ChevronDown
            className={[
              "h-4 w-4 transition-transform",
              desktopMenu === "loans"
                ? "rotate-180"
                : "",
            ].join(" ")}
          />
        </button>

        {desktopMenu === "loans" && (
          <LoanMegaMenu
            activeLoan={activeLoan}
            setActiveLoanId={setActiveLoanId}
            closeMenus={closeMenus}
          />
        )}
      </div>

      {/* EMI CALCULATOR */}

      <Link
        to="/emi-calculator"
        onClick={closeMenus}
        className="text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
      >
        EMI Calculator
      </Link>

      {/* HOW IT WORKS */}

      <button
        type="button"
        onClick={() =>
          navigateToHash("#how-it-works")
        }
        className="text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
      >
        How It Works
      </button>

      {/* RESOURCES */}

      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setDesktopMenu(
              desktopMenu === "resources"
                ? null
                : "resources",
            );
          }}
          className="text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors"
        >
          Resources

          <ChevronDown
            className={[
              "h-4 w-4 transition-transform",
              desktopMenu === "resources"
                ? "rotate-180"
                : "",
            ].join(" ")}
          />
        </button>

        {desktopMenu === "resources" && (
          <ResourcesMenu
            resources={publicResources}
            navigateToHash={navigateToHash}
          />
        )}
      </div>
    </nav>
  );
}

export default PublicNavigation;