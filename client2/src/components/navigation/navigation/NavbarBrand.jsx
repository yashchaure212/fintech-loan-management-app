import { Link } from "react-router-dom";

function NavbarBrand({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="flex shrink-0 items-center gap-2.5"
    >
      <span className="bg-primary-foreground text-primary flex h-9 w-9 items-center justify-center rounded-md text-sm font-black sm:h-10 sm:w-10">
        L
      </span>

      <div className="hidden sm:block">
        <span className="text-primary-foreground block text-base font-bold tracking-tight">
          LoanPro
        </span>

        <span className="text-primary-foreground/60 hidden text-[10px] font-medium md:block">
          Digital Lending
        </span>
      </div>
    </Link>
  );
}

export default NavbarBrand;