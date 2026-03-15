"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, CheckCircle, Phone, MessageCircle, Heart, Star, Stethoscope, Video } from "lucide-react";
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
  hideTrustBadges?: boolean;
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
  usePrimaryIconTheme?: boolean;
  heroFloatingIconStyle?: "default" | "consultation";
}

export function HeroSection({
  headingPrefix = "Get Your Medical",
  headingHighlight = "Certificate",
  typewriterPrefix = "For",
  rotatingWords = defaultCertificateTypes,
  trustBadges = defaultTrustBadges,
  hideTrustBadges = false,
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
  usePrimaryIconTheme = false,
  heroFloatingIconStyle = "default",
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
      <div className="absolute bottom-0 right-0 w-full h-100 pointer-events-none">
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
        className="absolute top-40 right-1/3 h-32 w-32 rounded-full bg-linear-to-br from-cyan-200/20 to-blue-200/20 blur-xl"
        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-40 left-1/3 h-24 w-24 rounded-full bg-linear-to-br from-teal-200/20 to-cyan-200/20 blur-xl"
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
                <span className="relative z-10 inline-block text-primary">
                  {headingHighlight}
                </span>
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
            {!hideTrustBadges && (
              <ul className="space-y-2 mb-6 lg:mb-8 max-w-lg">
                {trustBadges.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.08 }}
                    className="flex items-start gap-2 text-slate-600 text-sm sm:text-base"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 shrink-0 fill-primary/20" />
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>
            )}

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
              <div className="relative mx-auto w-full max-w-70 sm:max-w-85 md:max-w-100 lg:mx-0 lg:max-w-none">
                
                {/* Decorative Rings - Responsive sizing */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-60 w-60 rounded-full border border-slate-200/50 bg-slate-100/40 sm:h-75 sm:w-75 md:h-90 md:w-90 lg:h-140 lg:w-140" />
                  <div className="absolute h-45 w-45 rounded-full border border-slate-200/30 bg-slate-50/60 sm:h-60 sm:w-60 md:h-70 md:w-70 lg:h-112.5 lg:w-112.5" />
                </div>

                {heroFloatingIconStyle === "consultation" ? (
                  <>
                    {/* Phone Icon - 3D Style with Ringing Effect */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="absolute top-6 left-0 z-20 sm:top-8 sm:left-2 lg:top-10 lg:-left-2"
                    >
                      <Float duration={5} distance={8}>
                        {/* <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-white via-white to-slate-50 shadow-[0_8px_32px_rgba(59,130,246,0.25),0_4px_16px_rgba(0,0,0,0.1)] sm:h-16 sm:w-16 lg:h-20 lg:w-20"> */}
                          {/* Ringing waves */}
                          {/* <div className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5">
                            <svg className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-amber-400" viewBox="0 0 24 24" fill="none">
                              <path d="M12 3C16.97 3 21 7.03 21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
                              <path d="M12 7C14.76 7 17 9.24 17 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
                            </svg>
                          </div> */}
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-sky-400 via-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                            <Phone className="h-4 w-4 text-white drop-shadow-sm sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                          </div>
                        {/* </div> */}
                      </Float>
                    </motion.div>

                    {/* Video Icon - 3D Style Rounded Square */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                      className="absolute top-8 right-1 z-20 sm:top-10 sm:right-2 lg:top-10 lg:right-6"
                    >
                      <Float duration={4} distance={6}>
                         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                            <Video className="h-4 w-4 text-white drop-shadow-sm sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                          </div>
                      </Float>
                    </motion.div>

                    {/* WhatsApp Icon - 3D Style */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7, duration: 0.4 }}
                      className="absolute top-[62%] left-1 z-20 sm:left-2 lg:left-0"
                    >
                      <Float duration={6} distance={10}>
                        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-green-400 via-green-500 to-green-600 shadow-lg shadow-green-500/30 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                            {/* WhatsApp Icon */}
                            <svg className="h-5 w-5 text-white drop-shadow-sm sm:h-6 sm:w-6 lg:h-7 lg:w-7" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                        </div>
                      </Float>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="absolute -top-2 -left-2 z-20 sm:top-0 sm:left-0 md:top-2 md:left-2 lg:top-8 lg:left-2"
                    >
                      <Float duration={5} distance={8}>
                        {/* <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full shadow-lg sm:h-10 sm:w-10 md:h-11 md:w-11 lg:h-12 lg:w-12 ${
                            usePrimaryIconTheme
                              ? "bg-primary text-primary-foreground shadow-primary/30"
                              : "bg-blue-500 text-white shadow-blue-500/30"
                          }`}
                        > */}
                          <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                        {/* </div> */}
                      </Float>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                      className="absolute -top-1 right-0 z-20 sm:top-1 sm:right-1 md:top-2 md:right-2 lg:top-4 lg:right-4"
                    >
                      <Float duration={4} distance={6}>
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg shadow-lg sm:h-10 sm:w-10 md:h-11 md:w-11 lg:h-11 lg:w-11 ${
                            usePrimaryIconTheme
                              ? "bg-primary text-primary-foreground shadow-primary/30"
                              : "bg-emerald-500 text-white shadow-emerald-500/30"
                          }`}
                        >
                          <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                        </div>
                      </Float>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7, duration: 0.4 }}
                      className="absolute top-[15%] -left-3 z-20 sm:top-[50%] sm:-left-2 md:top-[1%] md:-left-1 lg:top-1/3 lg:-left-4"
                    >
                      <Float duration={6} distance={10}>
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-lg sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-12 lg:w-12 ${
                            usePrimaryIconTheme
                              ? "bg-primary/10 border-primary/20"
                              : "bg-slate-100 border-white"
                          }`}
                        >
                          <Stethoscope
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 ${
                              usePrimaryIconTheme ? "text-primary" : "text-orange-500"
                            }`}
                          />
                        </div>
                      </Float>
                    </motion.div>
                  </>
                )}

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
                    className="relative z-10 h-auto w-full max-h-70 object-contain drop-shadow-2xl sm:max-h-85 md:max-h-100 lg:max-h-170"
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
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-linear-to-br from-blue-400 to-blue-600 text-[7px] font-bold text-white sm:h-6 sm:w-6 sm:text-[8px] md:h-7 md:w-7 md:text-[9px] lg:h-8 lg:w-8 lg:text-[10px]">R</div>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-linear-to-br from-purple-400 to-purple-600 text-[7px] font-bold text-white sm:h-6 sm:w-6 sm:text-[8px] md:h-7 md:w-7 md:text-[9px] lg:h-8 lg:w-8 lg:text-[10px]">S</div>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-linear-to-br from-teal-400 to-teal-600 text-[7px] font-bold text-white sm:h-6 sm:w-6 sm:text-[8px] md:h-7 md:w-7 md:text-[9px] lg:h-8 lg:w-8 lg:text-[10px]">M</div>
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
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent" />
    </section>
  );
}
