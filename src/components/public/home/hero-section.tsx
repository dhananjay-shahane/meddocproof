"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, CheckCircle, Phone, MessageCircle, Heart, Star, Stethoscope, ShieldCheck } from "lucide-react";
import { FadeIn, Float } from "@/components/ui/fade-in";
import { GridPattern } from "@/components/ui/grid-pattern";
import { TypewriterEffect } from "@/components/ui/typewriter";
import { HeroSectionLayout } from "@/components/public/shared/hero-section-layout";

const defaultCertificateTypes = [
  "Sick Leave",
  "Fitness",
  "Work From Home",
  "Fit-to-Fly",
  "Recovery",
  "Caretaker",
  "Medical Diagnosis",
  "Unfit to Work",
  "Unfit to Travel",
];

const defaultTrustBadges = [
  "Handwritten certificate with courier option available",
  "Issued by registered Indian MBBS / MD / MS doctors",
  "Digital copy delivered within 30–60 minutes*",
  "Accepted by airlines, banks, colleges & corporate offices (as per their policies)",
  "Aligned with NMC and Indian telemedicine guidelines",
  "Signed by a licensed Indian practitioner",
  "Fully online process — no clinic visit required",
];

interface HeroSectionProps {
  headingPrefix?: string;
  headingHighlight?: string;
  typewriterPrefix?: string;
  rotatingWords?: string[];
  trustBadges?: string[];
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  heroImageSrc?: string;
  heroImageAlt?: string;
}

export function HeroSection({
  headingPrefix = "Get Your Medical",
  headingHighlight = "Certificate",
  typewriterPrefix = "For",
  rotatingWords = defaultCertificateTypes,
  trustBadges = defaultTrustBadges,
  primaryCta = {
    label: "Get Certificate Now",
    href: "/certificates/apply",
  },
  secondaryCta = {
    label: "How It Works",
    href: "#how-it-works",
  },
  heroImageSrc = "/images/hero/doctor-team-hero.png",
  heroImageAlt = "Professional Doctor Team",
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] xl:min-h-screen flex items-center overflow-hidden bg-linear-to-t from-primary/40 via-primary/40 to-green-500/40">
      {/* Modern Gradient Background */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-100/50 to-teal-100/40" /> */}
      
      {/* Animated Mesh Gradient Orbs */}
      {/* <div className="absolute top-0 left-1/5 w-[800px] h-[800px] bg-gradient-to-r from-blue-400 to-cyan-400 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-teal-400/30 to-emerald-400/30 rounded-full blur-3xl animate-pulse delay-1000" /> */}
      
      {/* Subtle Grid Pattern */}
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className="absolute inset-0 opacity-[0.02]"
      />

      {/* Bottom Right Wave Shape */}
      <div className="absolute bottom-0 right-0 w-full h-[400px] pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 400"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            initial={{ d: "M0,200 C360,100 720,300 1080,200 C1260,150 1380,250 1440,200 L1440,400 L0,400 Z" }}
            animate={{ 
              d: [
                "M0,200 C360,100 720,300 1080,200 C1260,150 1380,250 1440,200 L1440,400 L0,400 Z",
                "M0,250 C360,150 720,350 1080,250 C1260,200 1380,300 1440,250 L1440,400 L0,400 Z",
                "M0,200 C360,100 720,300 1080,200 C1260,150 1380,250 1440,200 L1440,400 L0,400 Z"
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            fill="url(#gradient3)"
            opacity="0.15"
          />
          <motion.path
            initial={{ d: "M0,300 C480,200 960,400 1440,300 L1440,400 L0,400 Z" }}
            animate={{ 
              d: [
                "M0,300 C480,200 960,400 1440,300 L1440,400 L0,400 Z",
                "M0,350 C480,250 960,450 1440,350 L1440,400 L0,400 Z",
                "M0,300 C480,200 960,400 1440,300 L1440,400 L0,400 Z"
              ]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            fill="url(#gradient4)"
            opacity="0.1"
          />
          <defs>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
            <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Decorative Circles */}
      <motion.div
        className="absolute top-40 right-1/3 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-200/20 to-blue-200/20 blur-xl"
        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-40 left-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-teal-200/20 to-cyan-200/20 blur-xl"
        animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <HeroSectionLayout
        containerClassName="pt-24 sm:pt-28 lg:pt-24 py-16 lg:py-0"
        gridClassName="lg:grid-cols-[5fr_7fr] gap-8 lg:gap-8 xl:gap-12"
      >
          {/* Left Content */}
          <FadeIn direction="up" className="max-w-2xl">
            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 leading-[1.15] tracking-tight mb-3 lg:mb-4">
              {headingPrefix}{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500">
                  {headingHighlight}
                </span>
                <svg
                  className="absolute -bottom-1.5 left-0 w-full h-2.5 text-cyan-200/50 -z-0"
                  viewBox="0 0 200 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2.00025 6.99997C25.7509 3.49998 55.375 -0.500029 100 2.49998C144.625 5.49998 174.251 6.99997 198 6.99997"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              <span className="text-slate-600 font-medium text-xl sm:text-2xl lg:text-3xl xl:text-4xl">
                {typewriterPrefix}{" "}
                <TypewriterEffect
                  words={rotatingWords}
                  className="text-blue-600 font-semibold"
                  typingSpeed={120}
                  deletingSpeed={60}
                  delayBetweenWords={3000}
                />
              </span>
            </h1>

            {/* Checklist Points */}
            <ul className="space-y-2 mb-6 lg:mb-8 max-w-lg">
              {trustBadges.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.08 }}
                  className="flex items-start gap-2 text-slate-600 text-sm sm:text-base"
                >
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mt-0.5 shrink-0 fill-emerald-500/20" />
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 mb-6 lg:mb-8">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold text-sm sm:text-base shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:bg-blue-700 transition-all duration-300"
                href={primaryCta.href}
              >
                {primaryCta.label}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              
              <motion.a
                href={secondaryCta.href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-slate-700 border border-slate-200 rounded-lg font-semibold text-sm sm:text-base hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
              >
                {secondaryCta.label}
              </motion.a>
            </div>
          </FadeIn>

          {/* Right Content - Doctor Image with Responsive Cards */}
          <FadeIn direction="left" delay={0.2} className="relative">
            <div className="flex justify-center lg:block">
              <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-none mx-auto lg:mx-0">
                
                {/* Decorative Rings - Responsive sizing */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[360px] md:h-[360px] lg:w-[560px] lg:h-[560px] border border-slate-200/50 rounded-full bg-slate-100/40" />
                  <div className="absolute w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px] lg:w-[450px] lg:h-[450px] border border-slate-200/30 rounded-full bg-slate-50/60" />
                </div>

                {/* Floating Phone Icon - Top Left */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="absolute -top-2 -left-2 sm:top-0 sm:left-0 md:top-2 md:left-2 lg:top-8 lg:left-2 z-20"
                >
                  <Float duration={5} distance={8}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                      <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                    </div>
                  </Float>
                </motion.div>

                {/* Floating Chat Icon - Top Right */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="absolute -top-1 right-0 sm:top-1 sm:right-1 md:top-2 md:right-2 lg:top-4 lg:right-4 z-20"
                >
                  <Float duration={4} distance={6}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-11 lg:h-11 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                      <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                    </div>
                  </Float>
                </motion.div>

                {/* Small Floating Stethoscope Icon - Left Middle */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="absolute top-[15%] -left-3 sm:top-[50%] sm:-left-2 md:top-[1%] md:-left-1 lg:top-1/3 lg:-left-4 z-20"
                >
                  <Float duration={6} distance={10}>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-slate-100 border-2 border-white shadow-lg flex items-center justify-center">
                      <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 text-orange-500" />
                    </div>
                  </Float>
                </motion.div>

                {/* 2500+ Happy Patients Badge - Right Side */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="absolute bottom-[20%] -right-2 sm:bottom-[22%] sm:right-0 md:bottom-[24%] md:right-1 lg:bottom-28 lg:-right-2 z-20"
                >
                  <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl lg:rounded-2xl px-2 py-1.5 sm:px-2.5 sm:py-2 md:px-3 md:py-2.5 lg:px-4 lg:py-3 shadow-xl border border-white/50">
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-red-500 fill-red-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-[10px] sm:text-xs md:text-sm lg:text-base leading-tight">2500+</p>
                        <p className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs text-slate-500 leading-tight">Happy Patients</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Doctor Image */}
                <Float duration={6} distance={12}>
                  <Image
                    src={heroImageSrc}
                    alt={heroImageAlt}
                    width={1200}
                    height={1200}
                    priority
                    quality={95}
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, (max-width: 1024px) 400px, 680px"
                    className="relative z-10 w-full h-auto max-h-[280px] sm:max-h-[340px] md:max-h-[400px] lg:max-h-[680px] object-contain drop-shadow-2xl"
                  />
                </Float>

                {/* Star Rating Badge - Bottom Left */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="absolute bottom-[20%] -left-2 sm:bottom-[22%] sm:left-0 md:bottom-[24%] md:left-1 lg:bottom-28 lg:-left-2 z-20"
                >
                  <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl lg:rounded-2xl px-2 py-1.5 sm:px-2.5 sm:py-2 md:px-3 md:py-2.5 lg:px-4 lg:py-3 shadow-xl border border-white/50">
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                      <div className="flex -space-x-1 sm:-space-x-1.5 lg:-space-x-2">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-bold">R</div>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white flex items-center justify-center text-white text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-bold">S</div>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-2 border-white flex items-center justify-center text-white text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-bold">M</div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-3.5 lg:h-3.5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Small Floating Shield Icon - Bottom Right */}
                {/* <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.4 }}
                  className="absolute bottom-[10%] right-2 sm:bottom-[10%] sm:right-3 md:bottom-[20%] md:right-4 lg:bottom-16 lg:right-8 z-20"
                >
                  <Float duration={5} distance={7}>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full bg-slate-100 border-2 border-white shadow-md flex items-center justify-center">
                      <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4 text-cyan-500" />
                    </div>
                  </Float>
                </motion.div> */}

              </div>
            </div>
          </FadeIn>
      </HeroSectionLayout>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          className="w-full h-24 sm:h-32"
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,30 1440,60 L1440,120 L0,120 Z"
            fill="white"
            opacity="0.9"
          />
          <path
            d="M0,80 C480,40 960,100 1440,80 L1440,120 L0,120 Z"
            fill="white"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}