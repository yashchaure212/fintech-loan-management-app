import { Link } from "react-router-dom";

const items = [
  {
    label: "Education Loan",
    href: "/school-student-loan",
    image:
      "https://images.pexels.com/photos/8199133/pexels-photo-8199133.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    label: "Student Loan",
    href: "#loan-products",
    image:
      "https://images.pexels.com/photos/5212335/pexels-photo-5212335.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    label: "School Loan",
    href: "#loan-products",
    image:
      "https://images.pexels.com/photos/8613311/pexels-photo-8613311.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    label: "Personal Loan",
    href: "#loan-products",
    image:
      "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    label: "Business Loan",
    href: "#loan-products",
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    label: "Home Loan",
    href: "#loan-products",
    image:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    label: "Vehicle Loan",
    href: "#loan-products",
    image:
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    label: "Loan Against Property",
    href: "#loan-products",
    image:
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    label: "EMI Calculator",
    href: "/emi-calculator",
    image:
      "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    label: "Check Eligibility",
    href: "#eligibility",
    image:
      "https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
];

function LandingQuickLinks() {
  return (
    <section className="border-b border-[#eadfca] bg-[#fff8e9]">
      <div
        className="
          mx-auto
          max-w-[1280px]
          overflow-x-auto
          scroll-smooth
          px-1
          py-2
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          sm:px-2
          sm:py-2.5
          lg:px-3
        "
      >
        <div
          className="
            flex
            min-w-max
            items-center
            justify-start
            gap-1
            sm:gap-1.5
            lg:justify-center
            lg:gap-2
          "
        >
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="
                group
                flex
                w-[80px]
                min-w-[80px]
                flex-col
                items-center
                justify-center
                px-0.5
                text-center
                sm:w-[88px]
                sm:min-w-[88px]
                lg:w-[104px]
                lg:min-w-[104px]
              "
            >
              {/* Product Image */}
              <div
                className="
                  h-[44px]
                  w-[44px]
                  overflow-hidden
                  rounded-lg
                  border-2
                  border-[#e4c56f]
                  bg-white
                  shadow-sm
                  transition
                  duration-200
                  group-hover:-translate-y-0.5
                  group-hover:shadow-md
                  sm:h-[54px]
                  sm:w-[54px]
                  lg:h-[62px]
                  lg:w-[62px]
                "
              >
                <img
                  src={item.image}
                  alt=""
                  draggable="false"
                  className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-300
                    group-hover:scale-105
                  "
                />
              </div>

              {/* Product Label */}
              <span
                className="
                  mt-1
                  line-clamp-2
                  min-h-[30px]
                  max-w-[80px]
                  text-[11px]
                  font-semibold
                  leading-[1.25]
                  text-slate-800
                  sm:mt-1.5
                  sm:min-h-[28px]
                  sm:max-w-[88px]
                  sm:text-[11px]
                  lg:max-w-[104px]
                  lg:text-[12px]
                "
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingQuickLinks;