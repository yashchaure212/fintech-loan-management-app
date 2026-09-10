import { Bot } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function AssistantFloatingButton() {
  const location = useLocation();

  // Hide while already on the assistant page
  if (location.pathname === "/assistant") {
    return null;
  }

  return (
    <Link
      to="/assistant"
      aria-label="Open LoanPro Assistant"
      className="
        fixed
        bottom-20
        right-4
        z-30
        grid
        size-12
        place-items-center
        rounded-full
        border
        border-border
        bg-card
        text-foreground
        shadow-lg
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-xl
        md:bottom-6
        md:right-6
        md:flex
        md:size-auto
        md:items-center
        md:gap-2
        md:px-3
        md:py-2.5
      "
    >
      <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
        <Bot className="size-[18px]" />
      </span>

      {/* Desktop only */}
      <span className="hidden pr-1 text-xs font-semibold md:block">
        Ask LoanPro
      </span>
    </Link>
  );
}

export default AssistantFloatingButton;