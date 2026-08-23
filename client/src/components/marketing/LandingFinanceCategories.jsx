import {
  Plane,
  Bike,
  BriefcaseBusiness,
  CarFront,
  Home,
  Laptop,
  Smartphone,
  Store,
} from "lucide-react";

const categories = [
  {
    label: "Two Wheeler",
    text: "Bikes & scooters",
    icon: Bike,
  },
  {
    label: "Car Finance",
    text: "New & used cars",
    icon: CarFront,
  },
  {
    label: "Home & Property",
    text: "Property goals",
    icon: Home,
  },
  {
    label: "Business",
    text: "Business funding",
    icon: BriefcaseBusiness,
  },
  {
    label: "Mobiles & Electronics",
    text: "Consumer purchases",
    icon: Smartphone,
  },
  {
    label: "Laptops",
    text: "Work & study",
    icon: Laptop,
  },
  {
    label: "Travel",
    text: "Planned journeys",
    icon: Plane,
  },
  {
    label: "Shop & Equipment",
    text: "Business equipment",
    icon: Store,
  },
];

function LandingFinanceCategories() {
  return (
    <section className="border-b border-border bg-[#fbfaf8] px-3 py-7 sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-end justify-between gap-4 px-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-primary">
              More to explore
            </p>

            <h2 className="mt-1 text-xl font-bold sm:text-2xl">
              Financing for the things that matter
            </h2>
          </div>

          <span className="hidden text-xs font-semibold text-primary sm:block">
            Explore categories →
          </span>
        </div>

        <div
          className="
            mt-5
            flex
            gap-3
            overflow-x-auto
            pb-2
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
            sm:grid
            sm:grid-cols-4
            lg:grid-cols-8
          "
        >
          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="
                  min-w-[132px]
                  rounded-lg
                  border
                  border-[#e2dcd3]
                  bg-white
                  px-3
                  py-4
                  text-center
                  shadow-[0_1px_2px_rgba(18,48,74,0.03)]
                  sm:min-w-0
                "
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f5f8] text-primary">
                  <Icon className="h-6 w-6" strokeWidth={1.7} />
                </span>

                <p className="mt-3 truncate text-xs font-bold">{item.label}</p>

                <p className="mt-1 truncate text-[10px] text-muted-foreground">
                  {item.text}
                </p>

                <span className="mt-2 inline-block text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                  Coming soon
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LandingFinanceCategories;
