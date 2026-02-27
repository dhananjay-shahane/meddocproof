"use client";

import React from "react";
import { ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export interface Testimonial {
  name: string;
  handle: string;
  text: string;
}

interface SignInPageProps {
  title: React.ReactNode;
  description: string;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  children?: React.ReactNode;
  footer?: React.ReactNode;
  brandLabel?: string;
}

const TestimonialCard = ({
  testimonial,
  delay,
}: {
  testimonial: Testimonial;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl"
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">
      {testimonial.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)}
    </div>
    <div className="text-sm leading-snug text-white">
      <p className="font-medium">{testimonial.name}</p>
      <p className="text-white/60">{testimonial.handle}</p>
      <p className="mt-1 line-clamp-2 text-white/80">{testimonial.text}</p>
    </div>
  </motion.div>
);

export const SignInPage: React.FC<SignInPageProps> = ({
  title,
  description,
  heroImageSrc,
  testimonials = [],
  children,
  footer,
  brandLabel: _brandLabel = "MediProofDocs",
}) => {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col md:flex-row bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Left column: form */}
      <section className="flex flex-1 items-center justify-center p-6 sm:p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-teal-500">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                MediProofDocs
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
              {title}
            </h1>
            <p className="mt-2 text-gray-600">{description}</p>
          </div>

          {children}

          {footer}
        </motion.div>
      </section>

      {/* Right column: hero image */}
      {heroImageSrc && (
        <section className="relative hidden w-full flex-1 md:block lg:w-[50%]">
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="absolute inset-0 m-4 overflow-hidden rounded-3xl"
          >
            <Image
              src={heroImageSrc}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="(min-width: 768px) 50vw, 0vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-800/50 to-teal-900/70" />

            {/* Brand */}
            <div className="absolute left-8 top-8 z-10">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">
                  MediProof<span className="text-teal-300">Docs</span>
                </span>
              </Link>
            </div>

            {/* Trust badge */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10 max-w-xs">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
                <Star className="h-4 w-4 fill-teal-400 text-teal-400" />
                <span className="text-sm font-medium text-white">
                  Verified by MBBS Doctors
                </span>
              </div>
              <h2 className="text-2xl font-bold leading-tight text-white lg:text-3xl">
                Your Health Documents,
                <br />
                <span className="text-teal-200">Simplified & Verified</span>
              </h2>
            </div>

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <div className="absolute bottom-8 left-8 right-8 z-10 flex gap-4 overflow-x-auto pb-2">
                <TestimonialCard testimonial={testimonials[0]} delay={0.4} />
                {testimonials[1] && (
                  <div className="hidden xl:block">
                    <TestimonialCard testimonial={testimonials[1]} delay={0.5} />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </section>
      )}
    </div>
  );
};

export const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-input bg-background shadow-sm transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
    {children}
  </div>
);
