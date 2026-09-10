import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Grid2x2,
  House,
  LayoutGrid,
  Wallet,
} from "lucide-react";

const items = [
  {
    to: "/",
    label: "Home",
    icon: House,
  },
  {
    to: "/services",
    label: "Services",
    icon: Grid2x2,
  },
  {
    to: "/more",
    label: "More",
    icon: LayoutGrid,
  },
  {
    to: "/customer/payments",
    loginTo: "/login",
    label: "Pay EMIs",
    icon: Wallet,
    emphasis: true,
  },
  {
    to: "/menu",
    label: "Menu",
    icon: LayoutGrid,
  },
];

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated,
  );

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

const handleNavigation = (destination) => {
  navigate(destination);

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

  return (
    <nav
      aria-label="Primary navigation"
      className="
        fixed inset-x-0 bottom-0 z-40
        border-t border-border
        bg-card
        shadow-lg
        md:hidden
      "
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {items.map(
          ({
            to,
            loginTo,
            label,
            icon: Icon,
            emphasis,
          }) => {
            const destination =
              loginTo && !isAuthenticated
                ? loginTo
                : to;

            const active = isActive(destination);

            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => handleNavigation(destination)}
                  className={[
                    "group flex h-14 w-full flex-col items-center justify-center gap-1",
                    "transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "grid size-7 place-items-center rounded-md",
                      emphasis
                        ? active
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-accent-foreground"
                        : active
                          ? "bg-primary/10"
                          : "",
                    ].join(" ")}
                  >
                    <Icon className="size-[18px]" />
                  </span>

                  <span className="text-[11px] font-medium leading-none">
                    {label}
                  </span>
                </button>
              </li>
            );
          },
        )}
      </ul>
    </nav>
  );
}

export default BottomNav;