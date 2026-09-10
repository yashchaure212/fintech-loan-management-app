import {
  Smartphone,
  Lightbulb,
  IndianRupee,
  Tv,
  Flame,
  CarFront,
  Phone,
  PlaySquare,
  ShieldCheck,
  Gamepad2,
  Droplets,
  Wifi,
} from "lucide-react";

const services = [
  {
    label: "Mobile Recharge",
    icon: Smartphone,
    href: "#",
  },
  {
    label: "Electricity",
    icon: Lightbulb,
    href: "#",
  },
  {
    label: "Loan Repayment",
    icon: IndianRupee,
    href: "/customer/payments",
  },
  {
    label: "DTH Recharge",
    icon: Tv,
    href: "#",
  },
  {
    label: "LPG Cylinder",
    icon: Flame,
    href: "#",
  },
  {
    label: "FASTag Recharge",
    icon: CarFront,
    href: "#",
  },
  {
    label: "Mobile Postpaid",
    icon: Phone,
    href: "#",
  },
  {
    label: "Subscriptions",
    icon: PlaySquare,
    href: "#",
  },
  {
    label: "Insurance",
    icon: ShieldCheck,
    href: "#",
  },
  {
    label: "Google Play Recharge",
    icon: Gamepad2,
    href: "#",
  },
  {
    label: "Water Bill",
    icon: Droplets,
    href: "#",
  },
  {
    label: "Broadband",
    icon: Wifi,
    href: "#",
  },
];

function LandingServicesStrip() {
  return (
    <section className="border-b border-[#dce7ed] bg-[#eef8fc]">
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-2 flex items-center gap-3">
          <h2 className="text-base font-bold text-foreground sm:text-lg">
            Bills and recharges
          </h2>

          <a
            href="#"
            className="text-sm font-semibold text-primary hover:underline"
          >
            My Bills
          </a>
        </div>

        {/* Services */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <a
                key={service.label}
                href={service.href}
                className="group flex w-[82px] shrink-0 flex-col items-center"
              >
                {/* Icon */}
                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-sky-300
                    bg-white
                    shadow-sm
                    transition
                    duration-200
                    group-hover:-translate-y-0.5
                    group-hover:shadow-md
                    sm:h-16
                    sm:w-16
                  "
                >
                  <Icon
                    strokeWidth={1.8}
                    className="
                      h-7
                      w-7
                      text-primary
                      transition-transform
                      duration-200
                      group-hover:scale-110
                      sm:h-8
                      sm:w-8
                    "
                  />
                </div>

                {/* Label */}
                <span
                  className="
                    mt-1.5
                    line-clamp-2
                    text-center
                    text-[11px]
                    font-medium
                    leading-[14px]
                    text-foreground
                    sm:text-xs
                  "
                >
                  {service.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LandingServicesStrip;