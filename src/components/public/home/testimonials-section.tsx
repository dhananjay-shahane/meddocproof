"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/fade-in";

interface Review {
  name: string;
  initial: string;
  color: string;
  rating: number;
  date: string;
  text: string;
}

const GOOGLE_REVIEWS: Review[] = [
  {
    name: "Venkatesh Rao",
    initial: "V",
    color: "bg-blue-600",
    rating: 5,
    date: "February 11",
    text: "My organization required a fitness certificate during onboarding. After submitting my details, a doctor consulted me and issued the certificate within 30 minutes. The service was professional and well-organized.",
  },
  {
    name: "Ayesha Khan",
    initial: "A",
    color: "bg-emerald-600",
    rating: 5,
    date: "January 25",
    text: "I needed a medical certificate for college attendance due to illness. The online consultation was quick, and the certificate format was accepted by my institution. Very helpful platform for students.",
  },
  {
    name: "Harish Kulkarni",
    initial: "H",
    color: "bg-purple-600",
    rating: 5,
    date: "January 8",
    text: "I usually prefer visiting hospitals, but this online medical certificate service changed my perspective. The doctor understood my health condition and guided me properly. The experience was smooth and trustworthy.",
  },
  {
    name: "Sneha Patil",
    initial: "S",
    color: "bg-orange-600",
    rating: 5,
    date: "December 20, 2025",
    text: "I applied for a work-from-home medical certificate. The process was easy, and the response time was impressive. The certificate was delivered digitally and accepted by my company.",
  },
  {
    name: "Suresh Reddy",
    initial: "S",
    color: "bg-pink-600",
    rating: 5,
    date: "December 5, 2025",
    text: "I had viral fever and was unable to attend office. My HR team asked for a sick leave medical certificate, and I received it quickly through this platform. The doctor consultation was smooth, and the certificate was accepted without any questions.",
  },
  {
    name: "Ananya Mehta",
    initial: "A",
    color: "bg-cyan-600",
    rating: 5,
    date: "November 28, 2025",
    text: "I needed a medical fitness certificate for joining a new company. The entire process was online and extremely convenient. The doctor was polite and professional, and I got my certificate within minutes.",
  },
  {
    name: "Pooja Nair",
    initial: "P",
    color: "bg-rose-600",
    rating: 5,
    date: "November 15, 2025",
    text: "I needed an international medical certificate for an overseas business trip. The consultation was prompt, and the documentation was delivered on time. The process was transparent and efficient.",
  },
  {
    name: "Divya Agarwal",
    initial: "D",
    color: "bg-indigo-600",
    rating: 5,
    date: "October 30, 2025",
    text: "I needed a medical fitness certificate for employment verification. The platform was easy to use, and the doctor consultation was very smooth. The certificate was issued promptly in the correct format.",
  },
  {
    name: "Srinivas Ch",
    initial: "S",
    color: "bg-teal-600",
    rating: 5,
    date: "October 12, 2025",
    text: "My employer requested a fitness certificate during onboarding. The medical consultation happened quickly, and I received the certificate within 30 minutes. Professional and trustworthy service.",
  },
  {
    name: "Nusrat Begum",
    initial: "N",
    color: "bg-amber-600",
    rating: 5,
    date: "September 25, 2025",
    text: "I needed a medical leave certificate for work. The doctor asked relevant questions and issued the certificate in the proper format. Very helpful support team.",
  },
  {
    name: "Manoj Tiwari",
    initial: "M",
    color: "bg-green-600",
    rating: 5,
    date: "September 8, 2025",
    text: "Getting a medical certificate online saved me a lot of time. The process was straightforward, and the certificate was accepted by my HR department without issues.",
  },
];

function GoogleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function GoogleLogo({ className = "h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" />
      <path fill="#EA4335" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" />
      <path fill="#FBBC05" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" />
      <path fill="#4285F4" d="M225 3v65h-9.5V3h9.5z" />
      <path fill="#34A853" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" />
      <path fill="#EA4335" d="M35.29 41.19V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49-.01z" />
    </svg>
  );
}

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>(GOOGLE_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const totalReviews = reviews.length;

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (data.success && data.reviews && data.reviews.length >= 4) {
          setReviews(
            data.reviews.map(
              (
                r: { title: string; message: string; rating: number },
                i: number
              ) => ({
                name: r.title,
                initial: r.title.charAt(0).toUpperCase(),
                color: GOOGLE_REVIEWS[i % GOOGLE_REVIEWS.length].color,
                rating: r.rating,
                date: "Recent",
                text: r.message,
              })
            )
          );
        }
      } catch {
        // Keep static reviews
      }
    }
    fetchReviews();
  }, []);

  const getVisibleCount = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, totalReviews - visibleCount);

  useEffect(() => {
    if (isPaused) {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
      return;
    }

    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [isPaused, maxIndex]);

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  return (
    <section className="py-14 lg:py-20 xl:py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <SectionReveal blur={true} scale={true}>
          <div className="text-center mb-8 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              The Trust We&apos;ve Earned
            </h2>
            <p className="text-base lg:text-lg font-semibold text-gray-700">
              MedDocProof Google Reviews
            </p>
          </div>
        </SectionReveal>

        {/* Google Rating Bar */}
        <div className="max-w-6xl mx-auto mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-white p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <GoogleLogo className="h-6 sm:h-8 w-auto shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm text-gray-500 font-medium">Rating</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">5.0</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">{totalReviews} reviews</span>
                </div>
              </div>
            </div>
            <a
              href="/leave-review"
              className="rounded-lg bg-blue-600 px-5 py-2 sm:px-6 sm:py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap"
            >
              Write a Review
            </a>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="hidden sm:flex shrink-0 w-9 h-9 lg:w-10 lg:h-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 disabled:opacity-30 transition-colors z-10"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Carousel Track */}
            <div className="overflow-hidden flex-1">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                }}
              >
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="shrink-0 px-2"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 h-full flex flex-col transition-shadow hover:shadow-md">
                      {/* User Info - Top */}
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-sm font-bold text-white ${review.color}`}
                        >
                          {review.initial}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {review.name}
                          </p>
                        </div>
                      </div>

                      {/* Stars + Date */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>

                      {/* Review Text */}
                      <p className="text-sm leading-relaxed text-gray-600 line-clamp-3 grow mb-3">
                        {review.text}
                      </p>

                      {/* Read More */}
                      <button className="text-xs text-gray-500 hover:text-gray-700 text-left mb-3 self-start">
                        Read more
                      </button>

                      {/* Posted on Google */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
                        <GoogleIcon className="h-4 w-4 shrink-0" />
                        <span className="text-xs text-gray-500">Posted on</span>
                        <span className="text-xs font-medium text-blue-600">Google</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="hidden sm:flex shrink-0 w-9 h-9 lg:w-10 lg:h-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 disabled:opacity-30 transition-colors z-10"
              aria-label="Next reviews"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Mobile arrows */}
          <div className="flex sm:hidden justify-center gap-4 mt-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm disabled:opacity-30"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm disabled:opacity-30"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-5">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-6 bg-blue-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to review group ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
