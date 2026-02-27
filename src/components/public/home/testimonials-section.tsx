"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { FadeIn, SectionReveal } from "@/components/ui/fade-in";
import { GridPattern } from "@/components/ui/grid-pattern";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
}

// Client-provided testimonials from page3.md
const CLIENT_TESTIMONIALS: Testimonial[] = [
  {
    name: "Venkatesh Rao",
    role: "Operations Manager",
    text: "My organization required a fitness certificate during onboarding. After submitting my details, a doctor consulted me and issued the certificate within 30 minutes. The service was professional and well-organized.",
    rating: 5,
    avatar: "VR",
  },
  {
    name: "Ayesha Khan",
    role: "MBA Student",
    text: "I needed a medical certificate for college attendance due to illness. The online consultation was quick, and the certificate format was accepted by my institution. Very helpful platform for students.",
    rating: 5,
    avatar: "AK",
  },
  {
    name: "Harish Kulkarni",
    role: "Site Engineer",
    text: "I usually prefer visiting hospitals, but this online medical certificate service changed my perspective. The doctor understood my health condition and guided me properly. The experience was smooth and trustworthy.",
    rating: 5,
    avatar: "HK",
  },
  {
    name: "Sneha Patil",
    role: "Digital Marketing Executive",
    text: "I applied for a work-from-home medical certificate. The process was easy, and the response time was impressive. The certificate was delivered digitally and accepted by my company.",
    rating: 5,
    avatar: "SP",
  },
  {
    name: "Suresh Reddy",
    role: "IT Support Executive",
    text: "I had viral fever and was unable to attend office. My HR team asked for a sick leave medical certificate, and I received it quickly through this platform. The doctor consultation was smooth, and the certificate was accepted without any questions.",
    rating: 5,
    avatar: "SR",
  },
  {
    name: "Ananya Mehta",
    role: "HR Coordinator",
    text: "I needed a medical fitness certificate for joining a new company. The entire process was online and extremely convenient. The doctor was polite and professional, and I got my certificate within minutes.",
    rating: 5,
    avatar: "AM",
  },
  {
    name: "Pooja Nair",
    role: "Financial Analyst",
    text: "I needed an international medical certificate for an overseas business trip. The consultation was prompt, and the documentation was delivered on time. The process was transparent and efficient.",
    rating: 5,
    avatar: "PN",
  },
  {
    name: "Divya Agarwal",
    role: "Accounts Executive",
    text: "I needed a medical fitness certificate for employment verification. The platform was easy to use, and the doctor consultation was very smooth. The certificate was issued promptly in the correct format.",
    rating: 5,
    avatar: "DA",
  },
  {
    name: "Srinivas Ch",
    role: "Production Supervisor",
    text: "My employer requested a fitness certificate during onboarding. The medical consultation happened quickly, and I received the certificate within 30 minutes. Professional and trustworthy service.",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "Nusrat Begum",
    role: "BPO Team Lead",
    text: "I needed a medical leave certificate for work. The doctor asked relevant questions and issued the certificate in the proper format. Very helpful support team.",
    rating: 5,
    avatar: "NB",
  },
  {
    name: "Manoj Tiwari",
    role: "Warehouse Manager",
    text: "Getting a medical certificate online saved me a lot of time. The process was straightforward, and the certificate was accepted by my HR department without issues.",
    rating: 5,
    avatar: "MT",
  },
];

const AVATAR_COLORS = [
  "from-primary to-brand-primary-dark",
  "from-cert-blue to-cert-blue-dark",
  "from-cert-purple to-cert-purple-dark",
  "from-cert-emerald to-cert-emerald-dark",
  "from-cert-amber to-cert-amber-dark",
  "from-cert-indigo to-cert-indigo-dark",
  "from-cert-pink to-cert-pink-dark",
  "from-cert-red to-cert-red-dark",
  "from-cert-cyan to-cert-cyan-dark",
  "from-cert-orange to-cert-orange-dark",
  "from-cert-green to-cert-green-dark",
];

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(CLIENT_TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (data.success && data.reviews && data.reviews.length >= 4) {
          setTestimonials(
            data.reviews.map(
              (
                r: { title: string; message: string; rating: number },
                i: number
              ) => ({
                name: r.title,
                role: "Verified User",
                text: r.message,
                rating: r.rating,
                avatar: r.title
                  .split(" ")
                  .map((w: string) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase(),
              })
            )
          );
        }
      } catch {
        // Keep static testimonials
      }
    }
    fetchReviews();
  }, []);

  const visibleCount = 3;
  const maxIndex = Math.max(0, testimonials.length - visibleCount);

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused) {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
      return;
    }

    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) {
          return 0; // Loop back to start
        }
        return prev + 1;
      });
    }, 5000); // Auto-scroll every 5 seconds (60s total for full cycle)

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <section className="py-20 lg:py-28 bg-linear-to-b from-primary/30 via-primary/30 to-secondary/30 relative overflow-hidden">
      <GridPattern
        width={32}
        height={32}
        x={-1}
        y={-1}
        className="opacity-[0.02]"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionReveal blur={true} scale={true}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-warning-light text-warning-dark px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Star className="w-4 h-4 fill-current" />
              Customer Testimonials
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Read reviews from satisfied customers who trust our service
            </p>
          </div>
        </SectionReveal>

        {/* Carousel with auto-scroll */}
        <div 
          className="relative max-w-6xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="hidden md:flex shrink-0 w-10 h-10 items-center justify-center rounded-full border bg-card shadow-sm hover:bg-muted disabled:opacity-30 transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="overflow-hidden flex-1" ref={scrollRef}>
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                }}
              >
                {testimonials.map((t, index) => (
                  <div
                    key={index}
                    className="w-full md:w-1/3 shrink-0 px-3"
                  >
                    <div className="bg-card rounded-2xl shadow-sm border p-6 h-full flex flex-col transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-warning fill-warning"
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed grow mb-6">
                        &ldquo;{t.text}&rdquo;
                      </p>
                      <div className="flex items-center gap-3 mt-auto">
                        <div
                          className={`w-10 h-10 rounded-full bg-linear-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold`}
                        >
                          {t.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {t.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {t.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="hidden md:flex shrink-0 w-10 h-10 items-center justify-center rounded-full border bg-card shadow-sm hover:bg-muted disabled:opacity-30 transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex ? "bg-primary" : "bg-primary/20"
                }`}
              />
            ))}
          </div>

          {/* Auto-scroll indicator */}
          <div className="flex justify-center mt-4">
            <span className="text-xs text-muted-foreground">
              {isPaused ? "Paused" : "Auto-scrolling"} • Hover to pause
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
