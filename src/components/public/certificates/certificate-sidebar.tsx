'use client';

import { motion } from 'framer-motion';
import {
  Stethoscope,
  ShieldCheck,
  Phone,
  MessageCircle,
  Star,
  Heart,
} from 'lucide-react';
import { Float } from '@/components/ui/fade-in';

/**
 * Certificate Sidebar Component
 * 
 * Contains the right-side visual elements for certificate pages:
 * - Doctor image with floating animation
 * - Floating icons (Phone, Chat, Stethoscope, Shield)
 * - Trust badges (Happy Patients, Star Rating)
 * - Decorative rings
 * 
 * This component is used in the hero section and provides
 * visual trust signals to increase conversion rates.
 */

export function CertificateSidebar() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="hidden lg:block relative"
    >
      <div className="flex justify-center lg:block">
        <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-none mx-auto lg:mx-0">
          
          {/* Decorative Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[360px] md:h-[360px] lg:w-[560px] lg:h-[560px] border border-teal-200/50 rounded-full bg-teal-50/40" />
            <div className="absolute w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px] lg:w-[450px] lg:h-[450px] border border-teal-200/30 rounded-full bg-teal-50/60" />
          </div>

          {/* Floating Phone Icon - Top Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute -top-2 -left-2 sm:top-0 sm:left-0 md:top-2 md:left-2 lg:top-8 lg:left-2 z-20"
          >
            <Float duration={5} distance={8}>
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
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
            className="absolute top-[25%] -left-3 sm:top-[28%] sm:-left-2 md:top-[30%] md:-left-1 lg:top-1/3 lg:-left-4 z-20"
          >
            <Float duration={6} distance={10}>
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white border-2 border-teal-100 shadow-lg flex items-center justify-center">
                <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 text-teal-500" />
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
            <img
              src="/images/hero/doctor-team-hero.png"
              alt="Professional Doctor Team"
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
                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-2 border-white flex items-center justify-center text-white text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-bold">R</div>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-white flex items-center justify-center text-white text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-bold">S</div>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white flex items-center justify-center text-white text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-bold">M</div>
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
            className="absolute bottom-[15%] right-2 sm:bottom-[18%] sm:right-3 md:bottom-[20%] md:right-4 lg:bottom-16 lg:right-8 z-20"
          >
            <Float duration={5} distance={8}>
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white border-2 border-teal-100 shadow-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-teal-500" />
              </div>
            </Float>
          </motion.div> */}
        </div>
      </div>
    </motion.div>
  );
}
