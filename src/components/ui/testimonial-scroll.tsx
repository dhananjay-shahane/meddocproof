"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
  text: string;
  name: string;
  role: string;
  rating?: number;
}

interface TestimonialsColumnProps {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}

const TestimonialCard = ({
  text,
  name,
  role,
  rating = 5,
}: Testimonial) => {
  return (
    <motion.li
      whileHover={{
        scale: 1.02,
        y: -4,
      }}
      whileFocus={{
        scale: 1.02,
        y: -4,
      }}
      className="w-full max-w-xs cursor-default rounded-2xl border bg-card p-6 shadow-sm transition-shadow select-none focus:outline-none focus:ring-2 focus:ring-primary/30 group"
    >
      <blockquote className="m-0 p-0">
        <div className="flex gap-0.5">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
        </div>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          &ldquo;{text}&rdquo;
        </p>
        <footer className="mt-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary ring-2 ring-transparent transition-all group-hover:ring-primary/30">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="flex flex-col">
            <cite className="not-italic font-semibold tracking-tight text-foreground">
              {name}
            </cite>
            <span className="text-sm text-muted-foreground">{role}</span>
          </div>
        </footer>
      </blockquote>
    </motion.li>
  );
};

const TestimonialsColumn = ({
  className,
  testimonials,
  duration = 15,
}: TestimonialsColumnProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const columnRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={columnRef}
      className={className}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <motion.ul
        animate={{
          translateY: isPaused ? 0 : "-50%",
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="m-0 flex flex-col gap-6 list-none p-0 pb-6"
      >
        {[...Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map((testimonial, i) => (
              <TestimonialCard
                key={`${index}-${i}`}
                text={testimonial.text}
                name={testimonial.name}
                role={testimonial.role}
                rating={testimonial.rating}
              />
            ))}
          </React.Fragment>
        ))}
      </motion.ul>
    </div>
  );
};

interface TestimonialScrollProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  badgeText?: string;
}

export function TestimonialScroll({
  testimonials,
}: TestimonialScrollProps) {
  const firstColumn = testimonials.slice(0, Math.ceil(testimonials.length / 3));
  const secondColumn = testimonials.slice(
    Math.ceil(testimonials.length / 3),
    Math.ceil((2 * testimonials.length) / 3)
  );
  const thirdColumn = testimonials.slice(Math.ceil((2 * testimonials.length) / 3));

  return (
    <div className="relative">
      <div
        className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[740px] overflow-hidden"
        role="region"
        aria-label="Scrolling Testimonials"
      >
        <TestimonialsColumn testimonials={firstColumn} duration={20} />
        <TestimonialsColumn
          testimonials={secondColumn}
          className="hidden md:block"
          duration={25}
        />
        <TestimonialsColumn
          testimonials={thirdColumn}
          className="hidden lg:block"
          duration={22}
        />
      </div>
    </div>
  );
}

export default TestimonialScroll;
