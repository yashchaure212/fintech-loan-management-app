import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgePercent,
  Banknote,
  BriefcaseBusiness,
  Calculator,
  CarFront,
  ChevronRight,
  CreditCard,
  FileText,
  GraduationCap,
  Headphones,
  HeartPulse,
  Home,
  Landmark,
  Plane,
  Receipt,
  ShieldCheck,
  Smartphone,
  WalletCards,
} from "lucide-react";

const featured = [
  {
    title: "EMI Calculator",
    description: "Plan your monthly repayment",
    icon: Calculator,
    to: "/emi-calculator",
    tone: "blue",
  },
  {
    title: "Loan Products",
    description: "Explore available financing",
    icon: Landmark,
    to: "/services",
    tone: "orange",
  },
  {
    title: "Education Loan",
    description: "Plan your higher education",
    icon: GraduationCap,
    to: "/login?redirect=/customer/loans/apply",
    tone: "green",
  },
];

const services = [
  {
    label: "Personal Loan",
    description: "For personal expenses",
    icon: Banknote,
    image:
      "https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
    to: "/services",
  },
  {
    label: "Home Loan",
    description: "For your property plans",
    icon: Home,
    image:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
    to: "/services",
  },
  {
    label: "Car Loan",
    description: "New & used car finance",
    icon: CarFront,
    image:
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
    to: "/services",
  },
  {
    label: "Business Loan",
    description: "Finance your business needs",
    icon: BriefcaseBusiness,
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
    to: "/services",
  },
];

const everydayServices = [
  {
    label: "Payments & EMIs",
    description: "Manage your repayments",
    icon: CreditCard,
    to: "/customer/payments",
  },
  {
    label: "Payment History",
    description: "View previous payments",
    icon: Receipt,
    to: "/customer/payments",
  },
  {
    label: "Digital Documents",
    description: "Manage your loan documents",
    icon: FileText,
    to: "/customer/loans",
  },
  {
    label: "Mobile Services",
    description: "Explore digital services",
    icon: Smartphone,
    to: "/services",
  },
];

const planningServices = [
  {
    label: "Travel Finance",
    description: "Plan your next journey",
    icon: Plane,
    to: "/services",
  },
  {
    label: "Medical Finance",
    description: "Plan healthcare expenses",
    icon: HeartPulse,
    to: "/services",
  },
  {
    label: "Protection",
    description: "Explore protection options",
    icon: ShieldCheck,
    to: "/services",
  },
  {
    label: "Financial Planning",
    description: "Useful finance tools",
    icon: BadgePercent,
    to: "/emi-calculator",
  },
];

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />

        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
          {eyebrow}
        </p>
      </div>

      <h2 className="mt-1.5 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-[10px] leading-5 text-muted-foreground sm:text-xs">
          {description}
        </p>
      )}
    </div>
  );
}

function FeaturedCard({ item }) {
  const Icon = item.icon;

  const toneClasses = {
    blue: "bg-[#eef6ff] text-[#1767d5]",
    orange: "bg-[#fff4e8] text-[#c86c08]",
    green: "bg-[#eefaf6] text-[#16845a]",
  };

  return (
    <Link
      to={item.to}
      className="group min-w-[220px] rounded-xl border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)] sm:min-w-0"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneClasses[item.tone]}`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>

      <h3 className="mt-3 text-sm font-bold text-slate-900">
        {item.title}
      </h3>

      <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
        {item.description}
      </p>

      <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-primary sm:text-xs">
        Explore
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function More() {
  return (
    <div className="min-h-screen bg-[#f7fafc] pb-8">
      {/* Header */}
      <section className="border-b border-border bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
            Explore LoanPro
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            More ways to manage your finances
          </h1>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm">
            Discover useful tools, financing options, payment services and
            support in one place.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-[1200px]">
        {/* Featured */}
        <section className="px-4 py-6 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Quick access"
            title="Popular with our customers"
            description="Jump directly to the tools and services you may need."
          />

          <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3">
            {featured.map((item) => (
              <FeaturedCard
                key={item.title}
                item={item}
              />
            ))}
          </div>
        </section>

        {/* Financing */}
        <section className="border-y border-border bg-white px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeader
              eyebrow="Financing"
              title="Explore finance for your goals"
              description="Browse products for education, mobility, home and business needs."
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <Link
                    key={service.label}
                    to={service.to}
                    className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
                  >
                    <div className="relative h-[120px] overflow-hidden bg-slate-100">
                      <img
                        src={service.image}
                        alt={service.label}
                        loading="lazy"
                        draggable="false"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                      <div className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/70 bg-white text-primary shadow-md">
                        <Icon className="h-4 w-4" strokeWidth={1.8} />
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="text-xs font-bold text-slate-900 sm:text-sm">
                        {service.label}
                      </h3>

                      <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                        {service.description}
                      </p>

                      <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-primary">
                        Explore
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Everyday */}
        <section className="px-4 py-6 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Everyday services"
            title="Manage your payments and services"
            description="Keep useful account and payment actions close at hand."
          />

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            {everydayServices.map((service, index) => {
              const Icon = service.icon;

              return (
                <Link
                  key={service.label}
                  to={service.to}
                  className={`group flex items-center gap-3 px-3 py-3.5 transition hover:bg-slate-50 sm:px-4 ${
                    index !== everydayServices.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef6fb] text-primary">
                    <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-slate-900 sm:text-sm">
                      {service.label}
                    </span>

                    <span className="mt-0.5 block text-[10px] text-muted-foreground sm:text-xs">
                      {service.description}
                    </span>
                  </span>

                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Planning */}
        <section className="border-y border-border bg-white px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeader
              eyebrow="Plan ahead"
              title="More ways to prepare"
              description="Useful mockup services that can grow as LoanPro expands."
            />

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {planningServices.map((service) => {
                const Icon = service.icon;

                return (
                  <Link
                    key={service.label}
                    to={service.to}
                    className="group rounded-xl border border-slate-200 bg-[#f8fbfd] p-3 transition hover:border-primary/20 hover:bg-white hover:shadow-sm"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary shadow-sm ring-1 ring-slate-200">
                      <Icon
                        className="h-[17px] w-[17px]"
                        strokeWidth={1.8}
                      />
                    </span>

                    <h3 className="mt-2.5 text-[11px] font-bold text-slate-900 sm:text-xs">
                      {service.label}
                    </h3>

                    <p className="mt-1 text-[9px] leading-4 text-muted-foreground sm:text-[10px]">
                      {service.description}
                    </p>

                    <ArrowRight className="mt-2 h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-[hsl(var(--brand-navy))] p-5 text-white shadow-sm sm:p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />

            <div className="relative max-w-2xl">
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-blue-200" />

                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200">
                  Customer support
                </p>
              </div>

              <h2 className="mt-2 text-lg font-bold sm:text-xl">
                Need help with your LoanPro journey?
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-white/65 sm:text-sm">
                Find answers to common questions or get help with your loan,
                payments and application journey.
              </p>

              <Link
                to="/#faq"
                className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-white px-3.5 py-2.5 text-[10px] font-bold text-[hsl(var(--brand-navy))] sm:text-xs"
              >
                Visit Help Centre
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default More;