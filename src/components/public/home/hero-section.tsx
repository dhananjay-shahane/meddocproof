"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Phone, MessageCircle, Heart, Star, Stethoscope, ShieldCheck } from "lucide-react";
import { FadeIn, Float } from "@/components/ui/fade-in";
import { GridPattern } from "@/components/ui/grid-pattern";
import { TypewriterEffect } from "@/components/ui/typewriter";

const certificateTypes = [
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

const trustBadges = [
  "Handwritten certificate with courier option available",
  "Issued by registered Indian MBBS / MD / MS doctors",
  "Digital copy delivered within 30–60 minutes*",
  "Accepted by airlines, banks, colleges & corporate offices (as per their policies)",
  "Aligned with NMC and Indian telemedicine guidelines",
  "Signed by a licensed Indian practitioner",
  "Fully online process — no clinic visit required",
];

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] xl:min-h-screen flex items-center overflow-hidden bg-secondary/30">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20" />
      
      {/* Animated Mesh Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-teal-200/20 to-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Subtle Grid Pattern */}
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className="absolute inset-0 opacity-[0.02]"
      />

      {/* Top Left Wave Shape */}
   

   

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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-0">
        <div className="grid lg:grid-cols-[5fr_7fr] gap-8 lg:gap-8 xl:gap-12 items-center">
          {/* Left Content */}
          <FadeIn direction="up" className="max-w-2xl">
            

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 leading-[1.15] tracking-tight mb-3 lg:mb-4">
              Get Your Medical{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500">
                  Certificate
                </span>
                <svg
                  className="absolute -bottom-1.5 left-0 w-full h-2.5 text-cyan-200/50 -z-0"
                  viewBox="0 0 200 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg "
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
                For{" "}
                <TypewriterEffect
                  words={certificateTypes}
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
                href="/certificates/apply"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-slate-900 text-white rounded-lg font-semibold text-sm sm:text-base shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 transition-all duration-300"
              >
                Get Certificate Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              
              <motion.a
                href="#how-it-works"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-slate-700 border border-slate-200 rounded-lg font-semibold text-sm sm:text-base hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
              >
                How It Works
              </motion.a>
            </div>
          </FadeIn>

          {/* Right Content - Doctor Image */}
          <FadeIn direction="left" delay={0.2} className="relative">
            {/* Mobile: Simple image without decorations */}
            <div className="lg:hidden flex justify-center">
              <img
                src="/images/hero/doctor-team-hero.png"
                alt="Professional Doctor Team"
                className="w-full max-w-sm h-auto object-contain drop-shadow-xl"
              />
            </div>

            {/* Desktop: Full decorations */}
            <div className="hidden lg:block relative">
              {/* Decorative Rings - filled with light gray */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[560px] h-[560px] border border-slate-200/50 rounded-full bg-slate-100/40" />
                <div className="absolute w-[450px] h-[450px] border border-slate-200/30 rounded-full bg-slate-50/60" />
              </div>

              {/* Floating Phone Icon - Top Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute top-8 left-2 z-20"
              >
                <Float duration={5} distance={8}>
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <Phone className="w-5 h-5" />
                  </div>
                </Float>
              </motion.div>

              {/* Floating Chat Icon - Top Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute top-4 right-4 z-20"
              >
                <Float duration={4} distance={6}>
                  <div className="w-11 h-11 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                </Float>
              </motion.div>

              {/* Small Floating Avatar - Left Middle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="absolute top-1/3 -left-4 z-20"
              >
                <Float duration={6} distance={10}>
                  <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-lg flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-orange-500" />
                  </div>
                </Float>
              </motion.div>

              {/* 2500+ Happy Patients Badge - Right Side */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute top-1/4 -right-4 z-20 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl border border-white/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-base leading-tight">2500+</p>
                    <p className="text-xs text-slate-500 leading-tight">Happy Patients</p>
                  </div>
                </div>
              </motion.div>

              <Float duration={6} distance={12}>
                <img
                  src="/images/hero/doctor-team-hero.png"
                  alt="Professional Doctor Team"
                  className="relative z-10 w-full h-auto max-h-[680px] object-contain drop-shadow-2xl"
                />
              </Float>

              {/* Star Rating Badge - Bottom Left */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute bottom-28 -left-2 z-20 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl border border-white/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">R</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">S</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">M</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Small Floating Avatar - Bottom Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
                className="absolute bottom-16 right-8 z-20"
              >
                <Float duration={5} distance={7}>
                  <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-md flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-cyan-500" />
                  </div>
                </Float>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </div>

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