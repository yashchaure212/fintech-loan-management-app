import { useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CarFront,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  Landmark,
  Plane,
  Search,
  Smartphone,
  Store,
} from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  {
    id: "education-loan",
    category: "Loans",
    label: "Education Loan",
    description: "Finance higher education in India and abroad.",
    amount: "Up to ₹20 Lakhs",
    image:
      "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&fit=crop",
    icon: GraduationCap,
  },
  {
    id: "personal-loan",
    category: "Loans",
    label: "Personal Loan",
    description: "Flexible financing for your personal needs.",
    amount: "Quick access to funds",
    image:
      "https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&fit=crop",
    icon: Landmark,
  },
  {
    id: "car-loan",
    category: "Loans",
    label: "Car Loan",
    description: "Finance a new or pre-owned car.",
    amount: "New & used cars",
    image:
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&fit=crop",
    icon: CarFront,
  },
  {
    id: "two-wheeler",
    category: "Loans",
    label: "Two Wheeler Loan",
    description: "Get financing for your bike or scooter.",
    amount: "Bike & scooter finance",
    image:
      "https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&fit=crop",
    icon: CarFront,
  },
  {
    id: "home-loan",
    category: "Loans",
    label: "Home Loan",
    description: "Plan your next home or property purchase.",
    amount: "Home purchase finance",
    image:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&fit=crop",
    icon: Home,
  },
  {
    id: "business-loan",
    category: "Business",
    label: "Business Loan",
    description: "Support business expansion and working capital.",
    amount: "Business funding",
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&fit=crop",
    icon: BriefcaseBusiness,
  },
  {
    id: "shop-finance",
    category: "Business",
    label: "Shop & Equipment Finance",
    description: "Finance equipment and upgrades for your business.",
    amount: "Equipment financing",
    image:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&fit=crop",
    icon: Store,
  },
  {
    id: "mobile-finance",
    category: "Shopping",
    label: "Mobile Finance",
    description: "Upgrade to the smartphone you want.",
    amount: "Easy monthly payments",
    image:
      "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&fit=crop",
    icon: Smartphone,
  },
  {
    id: "laptop-finance",
    category: "Shopping",
    label: "Laptop Finance",
    description: "Buy a laptop for work, study or business.",
    amount: "Work & study finance",
    image:
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=900&h=650&fit=crop",
    icon: Laptop,
  },
  {
    id: "medical-finance",
    category: "Protection",
    label: "Medical Finance",
    description: "Manage planned healthcare expenses.",
    amount: "Healthcare expenses",
    image:
      "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&fit=crop",
    icon: HeartPulse,
  },
  {
    id: "travel-finance",
    category: "Lifestyle",
    label: "Travel Finance",
    description: "Plan your next journey with flexible financing.",
    amount: "Planned travel",
    image:
      "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&fit=crop",
    icon: Plane,
  },
  {
    id: "property-loan",
    category: "Loans",
    label: "Loan Against Property",
    description: "Unlock funding against eligible property.",
    amount: "Property-backed funding",
    image:
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&fit=crop",
    icon: Building2,
  },
];

const categories = [
  "All",
  "Loans",
  "Education",
  "Business",
  "Shopping",
  "Lifestyle",
  "Protection",
];

function Services() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatch =
        activeCategory === "All" ||
        product.category === activeCategory ||
        (activeCategory === "Education" &&
          product.label.toLowerCase().includes("education"));

      const searchMatch =
        !query ||
        product.label.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-[#f7fafc] pb-8">
      {/* Header */}
      <section className="border-b border-border bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
              LoanPro services
            </p>
          </div>

          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Find financing for your needs
          </h1>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm">
            Explore loans, financing options and services designed for
            different goals.
          </p>

          {/* Search */}
          <div className="relative mt-5 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>
      </section>

      {/* Category filter */}
      <div className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-[1200px] overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6 lg:px-8">
          <div className="flex min-w-max gap-2">
            {categories.map((category) => {
              const active = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`
                    rounded-full
                    border
                    px-3.5
                    py-1.5
                    text-[10px]
                    font-bold
                    transition
                    sm:px-4
                    sm:text-xs
                    ${
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }
                  `}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Popular */}
        {activeCategory === "All" && !search && (
          <section className="pt-6">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                  Popular
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                  Explore our products
                </h2>

                <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
                  Browse financing options for different goals.
                </p>
              </div>

              <span className="text-[10px] font-semibold text-slate-400 sm:text-xs">
                {products.length} products
              </span>
            </div>
          </section>
        )}

        {/* Results */}
        <section className={`${activeCategory === "All" && !search ? "mt-4" : "pt-6"}`}>
          {visibleProducts.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-12 text-center">
              <Search className="mx-auto h-7 w-7 text-slate-300" />

              <h2 className="mt-3 text-sm font-bold text-slate-900">
                No products found
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Try a different product name or category.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => {
                const Icon = product.icon;

                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
                  >
                    {/* Image */}
                    <div className="relative h-[145px] overflow-hidden bg-slate-100 sm:h-[165px]">
                      <img
                        src={product.image}
                        alt={product.label}
                        loading="lazy"
                        draggable="false"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

                      {/* Icon */}
                      <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-lg border border-white/80 bg-white text-primary shadow-md">
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </div>

                      {/* Demo badge */}
                      <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold text-slate-600 shadow-sm backdrop-blur-sm">
                        Demo
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-primary">
                        {product.category}
                      </p>

                      <h3 className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                        {product.label}
                      </h3>

                      <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
                        {product.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                        <span className="min-w-0 truncate text-[10px] font-semibold text-slate-500">
                          {product.amount}
                        </span>

                        <Link
                          to="/login?redirect=/customer/loans/apply"
                          className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold text-primary sm:text-xs"
                        >
                          Explore
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Bottom promotional block */}
        <section className="mt-8">
          <div className="overflow-hidden rounded-xl bg-[hsl(var(--brand-navy))] p-5 text-white sm:p-7">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200">
                LoanPro
              </p>

              <h2 className="mt-1.5 text-xl font-bold tracking-tight sm:text-2xl">
                Not sure which option fits your needs?
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-white/70 sm:text-sm">
                Explore our products and use the EMI calculator to understand
                your estimated monthly repayment.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/emi-calculator"
                  className="inline-flex items-center gap-1.5 rounded-md bg-white px-3.5 py-2 text-[10px] font-bold text-[hsl(var(--brand-navy))] sm:text-xs"
                >
                  EMI Calculator
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3.5 py-2 text-[10px] font-bold text-white sm:text-xs"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Services;