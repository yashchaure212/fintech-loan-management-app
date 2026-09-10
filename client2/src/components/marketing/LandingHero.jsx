import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import ApplyNowButton from "@/components/marketing/ApplyNowButton";

const slides = [
  {
    id: 1,
    eyebrow: "Education Loan",
    title: "Make your education plans a reality",
    description:
      "Explore education financing designed to help you move forward with confidence.",
    image:
      "https://images.pexels.com/photos/8199133/pexels-photo-8199133.jpeg?auto=compress&cs=tinysrgb&w=1600",
    href: "#loan-products",
  },
  {
    id: 2,
    eyebrow: "Plan Your Future",
    title: "Invest in the education you believe in",
    description:
      "Choose a financing option that fits your education journey and plans.",
    image:
      "https://images.pexels.com/photos/4622108/pexels-photo-4622108.jpeg?auto=compress&cs=tinysrgb&w=1600",
    href: "#loan-products",
  },
  {
    id: 3,
    eyebrow: "Digital Application",
    title: "Apply online. Track every step.",
    description:
      "Start your application online and stay informed throughout your loan journey.",
    image:
      "https://images.pexels.com/photos/6549856/pexels-photo-6549856.jpeg?auto=compress&cs=tinysrgb&w=1600",
    href: "#loan-products",
  },
  {
    id: 4,
    eyebrow: "For Students & Families",
    title: "Take the next step with confidence",
    description:
      "A simpler digital experience for students and families planning ahead.",
    image:
      "https://images.pexels.com/photos/4560083/pexels-photo-4560083.jpeg?auto=compress&cs=tinysrgb&w=1600",
    href: "#loan-products",
  },
  {
    id: 5,
    eyebrow: "LoanPro",
    title: "A simpler way to manage your loan journey",
    description:
      "Explore products, apply online and manage your application in one place.",
    image:
      "https://images.pexels.com/photos/7976775/pexels-photo-7976775.jpeg?auto=compress&cs=tinysrgb&w=1600",
    href: "#loan-products",
  },
];

function LandingHero() {
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 6500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
    [],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      duration: 18,
      dragThreshold: 8,
    },
    [autoplay],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    onSelect();

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => {
    emblaApi?.scrollPrev();
  };

  const scrollNext = () => {
    emblaApi?.scrollNext();
  };

  const scrollTo = (index) => {
    emblaApi?.scrollTo(index);
  };

  return (
    <section className="bg-background">
      <div
        ref={emblaRef}
        className="overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="LoanPro promotions"
      >
        <div className="flex touch-pan-y">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="min-w-0 flex-[0_0_100%]"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
            >
              {/* Banner */}
              <div className="relative h-[190px] overflow-hidden sm:h-[270px] lg:h-[350px]">
                <img
                  src={slide.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index === 0 ? "high" : "low"}
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <div className="relative z-10 flex h-full items-center">
                  <div className="max-w-xl px-5 sm:px-10 lg:px-16">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/80 sm:text-xs">
                      {slide.eyebrow}
                    </p>

                    <h1 className="max-w-lg text-xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-3xl lg:text-5xl">
                      {slide.title}
                    </h1>

                    <p className="mt-2 max-w-md text-[10px] leading-4 text-white/85 sm:mt-3 sm:text-sm sm:leading-5">
                      {slide.description}
                    </p>

                    <div className="mt-3 sm:mt-5">
                      <ApplyNowButton />
                    </div>
                  </div>
                </div>

                {/* Desktop arrows */}
                <button
                  type="button"
                  onClick={scrollPrev}
                  aria-label="Previous slide"
                  className="absolute left-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 md:flex"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="Next slide"
                  className="absolute right-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 md:flex"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => scrollTo(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      aria-current={
                        selectedIndex === index ? "true" : undefined
                      }
                      className={`h-1.5 rounded-full transition-all ${
                        selectedIndex === index
                          ? "w-5 bg-white"
                          : "w-1.5 bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingHero;