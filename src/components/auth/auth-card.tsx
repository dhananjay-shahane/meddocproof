"use client";

import Image from "next/image";
import Link from "next/link";
import { type LucideIcon, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

interface AuthCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  brandLabel: string;
  heroImageSrc: string;
  testimonial?: Testimonial;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const DEFAULT_TESTIMONIAL: Testimonial = {
  quote:
    "Got my sick leave certificate within 30 minutes. The process was seamless and the doctor was very professional.",
  name: "Priya Sharma",
  title: "Verified User",
};

export function AuthCard({
  title,
  subtitle,
  icon: Icon,
  brandLabel,
  heroImageSrc,
  testimonial = DEFAULT_TESTIMONIAL,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-2xl lg:min-h-[640px]">
      {/* Left Panel — Hero Image (hidden on mobile) */}
      <div className="relative hidden w-[45%] overflow-hidden lg:block">
        {/* Background image */}
        <Image
          src={heroImageSrc}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="(min-width: 1024px) 45vw, 0vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Content overlay */}
        <div className="relative flex h-full flex-col justify-between p-8">
          {/* Top — Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                MediProof<span className="text-white/80">Docs</span>
              </span>
            </Link>
          </div>

          {/* Middle — Trust badge */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-white">
                Verified by MBBS Doctors
              </span>
            </div>
            <h2 className="text-2xl font-bold leading-tight text-white">
              Your Health Documents,
              <br />
              <span className="text-white/80">Simplified & Verified</span>
            </h2>
          </div>

          {/* Bottom — Testimonial */}
          {testimonial && (
            <div className="rounded-xl bg-white/10 p-5 backdrop-blur-md">
              <p className="text-sm leading-relaxed text-white/90">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-white/60">{testimonial.title}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel — Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex w-full flex-col justify-center px-6 py-8 sm:px-10 lg:w-[55%] lg:px-12 lg:py-10"
      >
        {/* Mobile logo */}
        <div className="mb-6 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <span className="text-base font-bold">
            MediProof<span className="text-muted-foreground">Docs</span>
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {/* Form content */}
        <div className="flex-1">{children}</div>

        {/* Footer links */}
        {footer && (
          <div className="mt-8 border-t pt-5">{footer}</div>
        )}

        {/* Brand label */}
        <p className="mt-6 text-center text-xs text-muted-foreground/60">
          {brandLabel}
        </p>
      </motion.div>
    </div>
  );
}
