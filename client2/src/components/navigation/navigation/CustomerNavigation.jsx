import { Link, useLocation } from "react-router-dom";

import { customerNavigation } from "@/features/navigation/data/navigationData";
import { isPathActive } from "@/features/navigation/utils/navigationUtils";

function CustomerNavigation({ closeMenus }) {
  const location = useLocation();

  return (
    <nav className="ml-4 hidden items-center gap-0.5 lg:flex">
      {customerNavigation.map((item) => {
        const active = isPathActive(
          location.pathname,
          item.path,
        );

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={closeMenus}
            className={[
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary-foreground/15 text-primary-foreground"
                : "text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default CustomerNavigation;