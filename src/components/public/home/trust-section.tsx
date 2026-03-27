"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/fade-in";

const TRUST_STEPS = [
  {
    title: "Data Privacy & Protection",
    text: "Your personal & medical details are encrypted & secure. We only use your information for doctor consultation & certificate issuance.",
    bgColor: "bg-yellow-100",
    rotate: -2,
    shadowColor: "shadow-yellow-400/30",
    pinColor: "#f59e0b",
  },
  {
    title: "Verified Certificates",
    text: "Every certificate is issued by registered Indian doctors (MBBS/MD/MS) with valid NMC registration numbers for authenticity.",
    bgColor: "bg-pink-100",
    rotate: 3,
    shadowColor: "shadow-pink-400/30",
    pinColor: "#ec4899",
  },
  {
    title: "Quick Process",
    text: "Apply online in minutes, consult a doctor, & receive your digital certificate within 30-60 minutes. No queue, no waiting!",
    bgColor: "bg-blue-100",
    rotate: -1,
    shadowColor: "shadow-blue-400/30",
    pinColor: "#3b82f6",
  },
  {
    title: "Trusted by Thousands",
    text: "2500+ happy patients & 500+ verified certificates issued. Accepted by airlines, banks, colleges & corporate offices.",
    bgColor: "bg-green-100",
    rotate: 2,
    shadowColor: "shadow-green-400/30",
    pinColor: "#22c55e",
  },
];

const noteIcons = [
  (index: number) => (
    <svg viewBox="0 0 100 100" className="w-full h-full" key={index}>
      <defs>
        <filter id={`glow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 3" opacity="0.3">
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="20s" repeatCount="indefinite"/>
      </circle>
      <path d="M30 50 Q50 30 70 50 Q50 70 30 50" fill="currentColor" opacity="0.6" filter={`url(#glow-${index})`}>
        <animate attributeName="opacity" values="0.6;0.8;0.6" dur="2s" repeatCount="indefinite"/>
      </path>
      <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.8"/>
    </svg>
  ),
  (index: number) => (
    <svg viewBox="0 0 100 100" className="w-full h-full" key={index}>
      <path d="M30 20 L70 20 L70 60 L30 60 Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      <path d="M30 30 L70 30" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <path d="M30 40 L60 40" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <path d="M30 50 L50 50" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <circle cx="70" cy="60" r="12" fill="currentColor" opacity="0.6">
        <animate attributeName="r" values="12;14;12" dur="1.5s" repeatCount="indefinite"/>
      </circle>
    </svg>
  ),
  (index: number) => (
    <svg viewBox="0 0 100 100" className="w-full h-full" key={index}>
      <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      <path d="M50 30 L50 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M50 55 L50 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M30 50 L45 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M55 50 L70 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="50" cy="50" r="4" fill="currentColor" opacity="0.6"/>
    </svg>
  ),
  (index: number) => (
    <svg viewBox="0 0 100 100" className="w-full h-full" key={index}>
      <path d="M30 25 Q50 15 70 25 L75 50 Q85 75 70 80 Q50 90 30 80 Q15 75 25 50 Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      <path d="M35 35 L65 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M35 50 L60 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M35 65 L50 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="65" cy="65" r="6" fill="currentColor" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="1s" repeatCount="indefinite"/>
      </circle>
    </svg>
  ),
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const noteVariants = {
  hidden: { opacity: 0, rotate: 0, y: 20 },
  visible: (rotate: number) => ({ 
    opacity: 1, 
    rotate: rotate,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    }
  }),
};

export function TrustSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-24 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 relative overflow-hidden">
      {/* Cork board background pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <pattern id="cork" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1" fill="#a855f7" opacity="0.3"/>
            <circle cx="15" cy="12" r="0.8" fill="#a855f7" opacity="0.2"/>
            <circle cx="8" cy="18" r="1.2" fill="#a855f7" opacity="0.25"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#cork)"/>
        </svg>
      </div>

      <div className="mx-auto max-w-[1600px] relative z-10 px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Trust <span className="text-primary">Us?</span>
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12 text-base md:text-lg">
            Here's what makes us your best choice for medical certificates
          </p>
        </FadeIn>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-wrap justify-center items-stretch gap-4 sm:gap-6 lg:gap-8 xl:gap-10"
        >
          {TRUST_STEPS.map((step, index) => (
            <motion.div
              key={index}
              custom={step.rotate}
              variants={noteVariants}
              whileHover={{ 
                rotate: 0,
                scale: 1.05,
                zIndex: 10,
                transition: { type: "spring", stiffness: 300, damping: 15 }
              }}
              className={`relative w-[280px] sm:w-72 md:w-76 lg:w-80 xl:w-84 p-5 sm:p-6 ${step.bgColor} ${step.shadowColor} shadow-xl rounded-sm cursor-pointer`}
              style={{ transform: `rotate(${step.rotate}deg)` }}
            >
              {/* Push pin */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                <motion.div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: step.pinColor }}
                  whileHover={{ scale: 1.2 }}
                  animate={{ 
                    y: [0, -2, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/60 rounded-full"/>
                </motion.div>
                <div className="w-0.5 h-3 bg-gray-400 mx-auto" style={{ backgroundColor: step.pinColor, opacity: 0.5 }}/>
              </div>

              {/* SVG Icon */}
              <div className="w-14 h-14 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-700">
                {noteIcons[index](index)}
              </div>

              {/* Title with underline */}
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3 text-center relative">
                {step.title}
                <motion.span 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gray-400/50"
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />
              </h3>

              {/* Content */}
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-center font-medium">
                {step.text}
              </p>

              {/* Corner fold effect */}
              <div className="absolute bottom-0 right-0 w-6 h-6 overflow-hidden">
                <div className="absolute bottom-0 right-0 w-full h-full bg-white/30 transform rotate-45 translate-y-3 translate-x-3" style={{ backgroundColor: step.bgColor.replace('100', '200') }}/>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
