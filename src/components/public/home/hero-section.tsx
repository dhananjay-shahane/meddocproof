"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Award } from "lucide-react";
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
  { icon: Shield, label: "Verified Doctors" },
  { icon: Clock, label: "30 Min Delivery" },
  { icon: Award, label: "100% Valid" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-secondary/30">
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <FadeIn direction="up" className="max-w-2xl">
            

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
              Get Your Medical{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500">
                  Certificate
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-cyan-200/50 -z-0"
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
              <span className="text-slate-600 font-medium text-3xl sm:text-4xl lg:text-5xl">
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

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
              Skip the waiting rooms. Connect with certified doctors online and receive your legally valid medical certificate in minutes, not hours.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <motion.a
                href="/certificates/apply"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold text-lg shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 transition-all duration-300"
              >
                Get Certificate Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              
              <motion.a
                href="/faq"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
              >
                How It Works
              </motion.a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6">
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-2 text-slate-600"
                >
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                    <badge.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-sm">{badge.label}</span>
                </motion.div>
              ))}
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
              {/* Decorative Rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] border border-slate-200/50 rounded-full" />
                <div className="absolute w-[400px] h-[400px] border border-slate-200/30 rounded-full" />
              </div>
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute top-10 -left-10 z-20 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                    30
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Minutes</p>
                    <p className="text-sm text-slate-500">Average delivery time</p>
                  </div>
                </div>
              </motion.div>

              <Float duration={6} distance={12}>
                <img
                  src="/images/hero/doctor-team-hero.png"
                  alt="Professional Doctor Team"
                  className="relative z-10 w-full h-auto max-h-[600px] object-contain drop-shadow-2xl"
                />
              </Float>

              {/* Second Floating Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute bottom-20 -right-5 z-20 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Verified</p>
                    <p className="text-xs text-slate-500">Licensed Doctors</p>
                  </div>
                </div>
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