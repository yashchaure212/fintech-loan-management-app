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
    image:
      "https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
  },
  {
    label: "Car Finance",
    text: "New & used cars",
    icon: CarFront,
    image:
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
  },
  {
    label: "Home & Property",
    text: "Property goals",
    icon: Home,
    image:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
  },
  {
    label: "Business",
    text: "Business funding",
    icon: BriefcaseBusiness,
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
  },
  {
    label: "Mobiles & Electronics",
    text: "Consumer purchases",
    icon: Smartphone,
    image:
      "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
  },
  {
    label: "Laptops",
    text: "Work & study",
    icon: Laptop,
    image:
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
  },
  {
    label: "Travel",
    text: "Planned journeys",
    icon: Plane,
    image:
      "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
  },
  {
    label: "Shop & Equipment",
    text: "Business equipment",
    icon: Store,
    image:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
  },
];

function LandingFinanceCategories() {
  return (
    <section className="border-b border-border bg-[#fbfaf8] px-3 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        {/* Heading */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
                More to explore
              </p>
            </div>

            <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Financing for the things that matter
            </h2>

            <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground sm:text-sm">
              Explore financing options for everyday purchases, mobility,
              business and future plans.
            </p>
          </div>

          <span className="hidden shrink-0 text-xs font-bold text-primary sm:block">
            Explore categories →
          </span>
        </div>

        {/* Categories */}
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-4 lg:grid-cols-4">
          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="
                  group
                  min-w-[190px]
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  shadow-[0_2px_8px_rgba(15,23,42,0.04)]
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]
                  sm:min-w-0
                "
              >
                {/* Image */}
                <div className="relative h-[120px] overflow-hidden bg-slate-100 sm:h-[135px]">
                  <img
                    src={item.image}
                    alt={item.label}
                    loading="lazy"
                    draggable="false"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition
                      duration-500
                      group-hover:scale-105
                    "
                  />

                  {/* Image gradient */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

                  {/* Category icon */}
                  <div className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/70 bg-white text-primary shadow-md">
                    <Icon
                      className="h-[17px] w-[17px]"
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* Coming soon */}
                  <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2 py-1 text-[9px] font-semibold text-white backdrop-blur-sm">
                    Coming soon
                  </span>
                </div>

                {/* Content */}
                <div className="px-3 py-3">
                  <p className="truncate text-xs font-bold text-slate-900 sm:text-sm">
                    {item.label}
                  </p>

                  <p className="mt-1 truncate text-[10px] text-muted-foreground sm:text-xs">
                    {item.text}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                      Financing option
                    </span>

                    <span className="text-sm font-bold text-primary transition-transform duration-200 group-hover:translate-x-0.5">
                      →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LandingFinanceCategories;