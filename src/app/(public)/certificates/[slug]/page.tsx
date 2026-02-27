'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  FileText, Home, Users, Activity, Heart, PlaneTakeoff, BriefcaseMedical, Plane,
  ClipboardList, CheckCircle, Clock, Shield, ArrowRight, Award, MessageCircle,
  Building, GraduationCap, Briefcase, HeartPulse, ChevronDown, TruckIcon,
  HeadphonesIcon, Stethoscope, FileCheck, Timer, Globe, Laptop, UserCheck,
  CalendarCheck, BadgeCheck, Fingerprint, ShieldCheck, Zap, MapPin, IndianRupee,
  CircleCheck, Star, Phone, Sparkles, ArrowUpRight, Play,
} from 'lucide-react';
import { getCertificateBySlug, TESTIMONIALS } from '@/lib/certificate-types';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { TestimonialScroll } from '@/components/ui/testimonial-scroll';
import { WordRotate } from '@/components/ui/word-rotate';
import { Marquee } from '@/components/ui/marquee';
import { InView } from '@/components/ui/in-view';

/* ============================================================
   MODERN DATA & CONFIGURATION
   ============================================================ */

const certificateImages: Record<string, { hero: string; card: string }> = {
  'sick-leave': {
    hero: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=1080&fit=crop',
    card: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
  },
  'work-from-home': {
    hero: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1920&h=1080&fit=crop',
    card: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=600&fit=crop',
  },
  caretaker: {
    hero: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1920&h=1080&fit=crop',
    card: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop',
  },
  recovery: {
    hero: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop',
    card: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
  },
  fitness: {
    hero: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&h=1080&fit=crop',
    card: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
  },
  'fit-to-fly': {
    hero: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=1080&fit=crop',
    card: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop',
  },
  'unfit-to-work': {
    hero: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1920&h=1080&fit=crop',
    card: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop',
  },
  'unfit-to-travel': {
    hero: 'https://images.unsplash.com/photo-1522098635833-216c03d81fbe?w=1920&h=1080&fit=crop',
    card: 'https://images.unsplash.com/photo-1522098635833-216c03d81fbe?w=800&h=600&fit=crop',
  },
  'medical-diagnosis': {
    hero: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=1080&fit=crop',
    card: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
  },
};

const iconMap: Record<string, React.ElementType> = {
  'sick-leave': FileText, 'work-from-home': Home, caretaker: Users,
  recovery: Activity, fitness: Heart, 'fit-to-fly': PlaneTakeoff,
  'unfit-to-work': BriefcaseMedical, 'unfit-to-travel': Plane,
  'medical-diagnosis': ClipboardList,
};

const heroAccents: Record<string, { badge: string; gradient: string }> = {
  'sick-leave': { badge: 'bg-blue-500/10 text-blue-700 border-blue-200/50', gradient: 'from-blue-600 to-cyan-500' },
  'work-from-home': { badge: 'bg-violet-500/10 text-violet-700 border-violet-200/50', gradient: 'from-violet-600 to-purple-500' },
  caretaker: { badge: 'bg-rose-500/10 text-rose-700 border-rose-200/50', gradient: 'from-rose-600 to-pink-500' },
  recovery: { badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-200/50', gradient: 'from-emerald-600 to-teal-500' },
  fitness: { badge: 'bg-orange-500/10 text-orange-700 border-orange-200/50', gradient: 'from-orange-600 to-amber-500' },
  'fit-to-fly': { badge: 'bg-sky-500/10 text-sky-700 border-sky-200/50', gradient: 'from-sky-600 to-blue-500' },
  'unfit-to-work': { badge: 'bg-red-500/10 text-red-700 border-red-200/50', gradient: 'from-red-600 to-rose-500' },
  'unfit-to-travel': { badge: 'bg-amber-500/10 text-amber-700 border-amber-200/50', gradient: 'from-amber-600 to-yellow-500' },
  'medical-diagnosis': { badge: 'bg-teal-500/10 text-teal-700 border-teal-200/50', gradient: 'from-teal-600 to-cyan-500' },
};

const uniqueSections: Record<string, {
  sectionTitle: string;
  sectionSubtitle: string;
  layout: 'timeline' | 'bento' | 'checklist' | 'compare' | 'scenarios' | 'process-cards' | 'feature-grid' | 'accordion-faq';
  items: { icon: React.ElementType; title: string; description: string }[];
}> = {
  'sick-leave': {
    sectionTitle: 'Why Choose Our Sick Leave Certificate?',
    sectionSubtitle: 'Trusted documentation accepted by employers and institutions',
    layout: 'timeline',
    items: [
      { icon: Timer, title: 'Quick Turnaround', description: 'Receive your certificate within 30-90 minutes of application' },
      { icon: Briefcase, title: 'Employer Ready', description: 'Formatted to meet standard HR documentation requirements' },
      { icon: GraduationCap, title: 'College Accepted', description: 'Valid for educational institution absence records' },
      { icon: Shield, title: 'Doctor Verified', description: 'Every certificate is reviewed and signed by a registered doctor' },
    ],
  },
  'work-from-home': {
    sectionTitle: 'Work From Home Made Official',
    sectionSubtitle: 'Professional medical justification for remote work',
    layout: 'bento',
    items: [
      { icon: Laptop, title: 'Remote Work Support', description: 'Medical documentation that justifies your need to work from home' },
      { icon: HeartPulse, title: 'Health-First Approach', description: 'Prioritize your recovery while staying productive from home' },
      { icon: Building, title: 'Corporate Compliant', description: 'Meets corporate HR policies for remote work authorization' },
      { icon: FileCheck, title: 'Detailed Documentation', description: 'Includes medical reasoning and recommended duration' },
    ],
  },
  caretaker: {
    sectionTitle: 'Supporting Family Caregivers',
    sectionSubtitle: 'Proper documentation for your caregiving responsibilities',
    layout: 'scenarios',
    items: [
      { icon: Users, title: 'Elderly Parent Care', description: 'Documentation for caring for aging parents who need medical attention' },
      { icon: Heart, title: 'Child Healthcare', description: 'When your child needs medical care and parental supervision' },
      { icon: UserCheck, title: 'Spouse Support', description: 'Supporting your spouse through medical treatment or recovery' },
      { icon: CalendarCheck, title: 'Extended Leave', description: 'Justification for prolonged absence from work due to caregiving' },
    ],
  },
  recovery: {
    sectionTitle: 'Your Recovery Journey',
    sectionSubtitle: 'Official clearance to resume your daily activities',
    layout: 'process-cards',
    items: [
      { icon: Stethoscope, title: 'Medical Assessment', description: 'Doctor evaluates your recovery progress and current health status' },
      { icon: Activity, title: 'Fitness Evaluation', description: 'Comprehensive check to confirm you are fit to resume activities' },
      { icon: FileCheck, title: 'Clearance Issued', description: 'Official certificate stating you have recovered and are cleared' },
      { icon: CheckCircle, title: 'Return Confidently', description: 'Go back to work or studies with proper documentation' },
    ],
  },
  fitness: {
    sectionTitle: 'Fitness Certificate Overview',
    sectionSubtitle: 'Comprehensive health clearance for any purpose',
    layout: 'feature-grid',
    items: [
      { icon: Award, title: 'Employment', description: 'Pre-employment health screenings and job fitness requirements' },
      { icon: GraduationCap, title: 'Education', description: 'College admissions and sports team health clearances' },
      { icon: Heart, title: 'Sports & Gym', description: 'Fitness clearance for gym memberships and athletic events' },
      { icon: Globe, title: 'Travel & Visa', description: 'Health fitness documentation for visa and immigration' },
    ],
  },
  'fit-to-fly': {
    sectionTitle: 'Travel Ready Documentation',
    sectionSubtitle: 'Medical clearance for safe air travel',
    layout: 'feature-grid',
    items: [
      { icon: Plane, title: 'Airline Accepted', description: 'Recognized by major domestic and international airlines' },
      { icon: Globe, title: 'International Valid', description: 'Meets international aviation medical standards' },
      { icon: Clock, title: 'Express Processing', description: 'Urgent same-day certificates available for last-minute travel' },
      { icon: Shield, title: 'Comprehensive Check', description: 'Covers respiratory, cardiac, and general fitness for altitude' },
      { icon: FileCheck, title: 'Multi-language', description: 'Certificate available in English with medical terminology' },
      { icon: HeadphonesIcon, title: 'Travel Support', description: 'Assistance with airline-specific medical form requirements' },
    ],
  },
  'unfit-to-work': {
    sectionTitle: 'Protecting Your Health & Rights',
    sectionSubtitle: 'When your health requires a break from work',
    layout: 'checklist',
    items: [
      { icon: Shield, title: 'Legal Protection', description: 'Proper medical documentation protects your employment rights' },
      { icon: Clock, title: 'Define Recovery Period', description: 'Doctor specifies the recommended time away from work' },
      { icon: Briefcase, title: 'Employer Communication', description: 'Professional format for HR and management submission' },
      { icon: HeartPulse, title: 'Health Priority', description: 'Focus on recovery knowing your absence is properly documented' },
    ],
  },
  'unfit-to-travel': {
    sectionTitle: 'Travel Postponement Support',
    sectionSubtitle: 'Medical grounds for rescheduling your travel plans',
    layout: 'compare',
    items: [
      { icon: Plane, title: 'Flight Rebooking', description: 'Medical certificate helps waive airline change fees in most cases' },
      { icon: Award, title: 'Insurance Support', description: 'Valid documentation for travel insurance medical claims' },
      { icon: MessageCircle, title: 'Hotel Cancellation', description: 'Medical proof for hotel and accommodation cancellation policies' },
      { icon: FileCheck, title: 'Tour Operator', description: 'Documentation for tour package refunds and rescheduling' },
    ],
  },
  'medical-diagnosis': {
    sectionTitle: 'Comprehensive Medical Documentation',
    sectionSubtitle: 'Official diagnosis records for your needs',
    layout: 'accordion-faq',
    items: [
      { icon: ClipboardList, title: 'Detailed Records', description: 'Complete medical diagnosis with clinical notes and observations' },
      { icon: Award, title: 'Insurance Claims', description: 'Formatted to meet health insurance documentation requirements' },
      { icon: Shield, title: 'Legal Evidence', description: 'Admissible medical documentation for legal proceedings' },
      { icon: Building, title: 'Institutional Use', description: 'Accepted by educational institutions and corporate organizations' },
    ],
  },
};

const useCases: Record<string, { icon: React.ElementType; title: string; description: string }[]> = {
  'sick-leave': [
    { icon: Briefcase, title: 'Workplace Leave', description: 'Official documentation for employer-required sick leave' },
    { icon: GraduationCap, title: 'Academic Absence', description: 'Valid excuse for school or college attendance' },
    { icon: Building, title: 'Corporate Compliance', description: 'Meets HR documentation requirements' },
  ],
  'work-from-home': [
    { icon: Home, title: 'Remote Work Setup', description: 'Medical justification for working from home' },
    { icon: HeartPulse, title: 'Health Recovery', description: 'Support for recovery while maintaining productivity' },
    { icon: Briefcase, title: 'Employer Approval', description: 'Documentation for HR approval process' },
  ],
  caretaker: [
    { icon: Users, title: 'Family Care', description: 'Official documentation for caregiving responsibilities' },
    { icon: Heart, title: 'Medical Support', description: 'Support for family member medical needs' },
    { icon: Clock, title: 'Extended Leave', description: 'Justification for extended time off' },
  ],
  recovery: [
    { icon: Activity, title: 'Return to Work', description: 'Medical clearance for workplace return' },
    { icon: Shield, title: 'Fitness Confirmation', description: 'Official confirmation of recovery status' },
    { icon: CheckCircle, title: 'Health Clearance', description: 'Documentation for resumed activities' },
  ],
  fitness: [
    { icon: Award, title: 'Employment Requirements', description: 'Pre-employment health clearance' },
    { icon: GraduationCap, title: 'Academic Programs', description: 'Admission fitness requirements' },
    { icon: Heart, title: 'Sports Participation', description: 'Medical clearance for athletic activities' },
  ],
  'fit-to-fly': [
    { icon: Plane, title: 'Air Travel Clearance', description: 'Medical approval for airline travel' },
    { icon: Shield, title: 'Immigration Requirements', description: 'Documentation for travel authorities' },
    { icon: CheckCircle, title: 'Health Declaration', description: 'Official health status for travel' },
  ],
  'unfit-to-work': [
    { icon: Briefcase, title: 'Workplace Safety', description: 'Medical documentation for work inability' },
    { icon: Shield, title: 'Health Protection', description: 'Protection for personal and workplace safety' },
    { icon: Clock, title: 'Recovery Period', description: 'Documented recovery timeline' },
  ],
  'unfit-to-travel': [
    { icon: Plane, title: 'Travel Postponement', description: 'Medical grounds for travel delay' },
    { icon: Award, title: 'Insurance Claims', description: 'Documentation for travel insurance' },
    { icon: MessageCircle, title: 'Official Communication', description: 'Medical advisory documentation' },
  ],
  'medical-diagnosis': [
    { icon: ClipboardList, title: 'Medical Records', description: 'Official diagnosis documentation' },
    { icon: Award, title: 'Insurance Purposes', description: 'Support for insurance claims' },
    { icon: Shield, title: 'Legal Documentation', description: 'Official medical evidence' },
  ],
};

const trustBadges = [
  { icon: BadgeCheck, text: 'Registered Doctors' },
  { icon: Shield, text: '100% Genuine Certificates' },
  { icon: TruckIcon, text: '30-90 Min Delivery' },
  { icon: HeadphonesIcon, text: '24/7 Support' },
];

const heroRotatingWords: Record<string, string[]> = {
  'sick-leave': ['Employers', 'Colleges', 'Universities', 'HR Teams', 'Institutions'],
  'work-from-home': ['Remote Work', 'Home Office', 'Hybrid Setup', 'Flexible Work', 'Work-Life Balance'],
  caretaker: ['Family Care', 'Parent Support', 'Child Care', 'Spouse Care', 'Elder Care'],
  recovery: ['Return to Work', 'Resume Studies', 'Sports Clearance', 'Full Recovery', 'Active Lifestyle'],
  fitness: ['Pre-Employment', 'Sports Events', 'Gym Membership', 'Visa Applications', 'College Admission'],
  'fit-to-fly': ['Airlines', 'International Travel', 'Immigration', 'Visa Process', 'Flight Boarding'],
  'unfit-to-work': ['Health Leave', 'Medical Rest', 'Recovery Time', 'Job Protection', 'Workplace Safety'],
  'unfit-to-travel': ['Flight Rebooking', 'Hotel Refunds', 'Insurance Claims', 'Tour Cancellation', 'Travel Safety'],
  'medical-diagnosis': ['Insurance Claims', 'Legal Records', 'Medical History', 'Hospital Transfer', 'Second Opinion'],
};

const whyUsData = [
  { feature: 'Doctor Consultation', us: true, others: false, icon: Stethoscope },
  { feature: 'Digital Verification', us: true, others: false, icon: Fingerprint },
  { feature: '30-90 Min Delivery', us: true, others: false, icon: Timer },
  { feature: '24/7 Availability', us: true, others: false, icon: Clock },
  { feature: 'Money-back Guarantee', us: true, others: false, icon: IndianRupee },
  { feature: 'Pan-India Validity', us: true, others: true, icon: MapPin },
];

/* ============================================================
   MODERN REUSABLE COMPONENTS
   ============================================================ */

function SectionTitle({ title, subtitle, align = 'center' }: { title: string; subtitle?: string; align?: 'center' | 'left' }) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  return (
    <div className={`${alignClass} mb-12 md:mb-16`}>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

function GlassCard({ children, className = '', hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-black/5 ${hover ? 'hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1' : ''} transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, index }: { icon: React.ElementType; title: string; description: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 p-6 sm:p-8 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   UNIQUE SECTION RENDERERS - MODERNIZED
   ============================================================ */

function TimelineSection({ data }: { data: typeof uniqueSections['sick-leave'] }) {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-transparent via-slate-50/50 to-transparent">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle title={data.sectionTitle} subtitle={data.sectionSubtitle} />
        
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/20 to-transparent md:-translate-x-px" />
          
          {data.items.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                className={`relative flex items-start mb-12 md:mb-16 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
              >
                <div className="hidden md:block md:w-1/2" />
                
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center z-10 shadow-lg shadow-primary/10">
                  <div className="w-4 h-4 rounded-full bg-primary" />
                </div>
                
                <div className="ml-14 md:ml-0 md:w-1/2 md:px-12">
                  <GlassCard className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BentoSection({ data }: { data: typeof uniqueSections['sick-leave'] }) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle title={data.sectionTitle} subtitle={data.sectionSubtitle} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`${i === 0 ? 'md:col-span-2' : ''}`}
            >
              <GlassCard className="h-full p-8 group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChecklistSection({ data }: { data: typeof uniqueSections['sick-leave'] }) {
  return (
    <section className="py-20 md:py-28 bg-slate-50/50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionTitle title={data.sectionTitle} subtitle={data.sectionSubtitle} />
        
        <div className="space-y-4">
          {data.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-6 flex items-start gap-4 hover:border-primary/20">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompareSection({ data }: { data: typeof uniqueSections['sick-leave'] }) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionTitle title={data.sectionTitle} subtitle={data.sectionSubtitle} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-8 h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>Supported with our certificate</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScenariosSection({ data }: { data: typeof uniqueSections['sick-leave'] }) {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50/50 via-transparent to-slate-50/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle title={data.sectionTitle} subtitle={data.sectionSubtitle} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-8 h-full group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessCardsSection({ data }: { data: typeof uniqueSections['sick-leave'] }) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle title={data.sectionTitle} subtitle={data.sectionSubtitle} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <GlassCard className="p-6 h-full text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mb-3 mx-auto">
                  {i + 1}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </GlassCard>
              
              {i < data.items.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-primary/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureGridSection({ data }: { data: typeof uniqueSections['sick-leave'] }) {
  return (
    <section className="py-20 md:py-28 bg-slate-50/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle title={data.sectionTitle} subtitle={data.sectionSubtitle} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item, i) => (
            <FeatureCard 
              key={i} 
              icon={item.icon} 
              title={item.title} 
              description={item.description} 
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AccordionFAQSection({ data }: { data: typeof uniqueSections['sick-leave'] }) {
  const [open, setOpen] = useState<number | null>(0);
  
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionTitle title={data.sectionTitle} subtitle={data.sectionSubtitle} />
        
        <div className="space-y-3">
          {data.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard className="overflow-hidden" hover={false}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className={`flex items-center justify-between w-full p-5 text-left transition-colors duration-200 ${open === i ? 'bg-primary/5' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${open === i ? 'bg-primary text-white' : 'bg-primary/10'}`}>
                      <item.icon className={`w-5 h-5 ${open === i ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-0">
                        <p className="text-muted-foreground pl-14">{item.description}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderUniqueSection(slug: string) {
  const data = uniqueSections[slug];
  if (!data) return null;
  switch (data.layout) {
    case 'timeline':       return <TimelineSection data={data} />;
    case 'bento':          return <BentoSection data={data} />;
    case 'checklist':      return <ChecklistSection data={data} />;
    case 'compare':        return <CompareSection data={data} />;
    case 'scenarios':      return <ScenariosSection data={data} />;
    case 'process-cards':  return <ProcessCardsSection data={data} />;
    case 'feature-grid':   return <FeatureGridSection data={data} />;
    case 'accordion-faq':  return <AccordionFAQSection data={data} />;
    default:               return null;
  }
}

/* ============================================================
   MAIN PAGE COMPONENT - MODERNIZED
   ============================================================ */

export default function CertificatePage() {
  const params = useParams();
  const slug = params.slug as string;

  const certificate = getCertificateBySlug(slug);
  const images = certificateImages[slug] || certificateImages['sick-leave'];
  const Icon = iconMap[slug] || FileText;
  const certificateUseCases = useCases[slug] || useCases['sick-leave'];
  const accent = heroAccents[slug] || heroAccents['sick-leave'];

  const [testimonials, setTestimonials] = useState(
    TESTIMONIALS.map((t) => ({ name: t.name, role: t.title, text: t.text, rating: 5 }))
  );

  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        if (data.success && data.reviews && data.reviews.length >= 4) {
          setTestimonials(
            data.reviews.map((r: { title: string; message: string; rating: number }) => ({
              name: r.title,
              role: 'Verified User',
              text: r.message,
              rating: r.rating,
            }))
          );
        }
      } catch {
        // Keep static testimonials
      }
    }
    fetchReviews();
  }, []);

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Certificate Not Found</h1>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ═══════════════ MODERN HERO SECTION ═══════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Modern Background with Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 w-full py-24 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              {/* Modern Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm ${accent.badge}`}>
                  <Sparkles className="w-4 h-4" />
                  Medical Certificate
                </span>
              </motion.div>

              {/* Modern Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
              >
                <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                  {certificate.name}
                </span>
              </motion.h1>

              {/* Modern Word Rotate */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 flex items-center gap-2 text-lg sm:text-xl text-muted-foreground"
              >
                <span>Accepted by</span>
                <WordRotate
                  words={heroRotatingWords[slug] || heroRotatingWords['sick-leave']}
                  className="text-primary font-semibold"
                  duration={2500}
                />
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl"
              >
                {certificate.shortDescription}
              </motion.p>

              {/* Modern CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-start gap-4"
              >
                <Button
                  asChild
                  size="lg"
                  className={`h-14 rounded-full px-8 text-base shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all bg-gradient-to-r ${accent.gradient}`}
                >
                  <Link href="/certificates/apply">
                    Get Certificate Now
                    <ArrowUpRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-full px-8 text-base border-2 hover:bg-slate-50"
                >
                  <Link href="#how-it-works">
                    <Play className="mr-2 w-4 h-4" />
                    How It Works
                  </Link>
                </Button>
              </motion.div>

              {/* Modern Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10 flex flex-wrap items-center gap-6"
              >
                {[
                  { icon: ShieldCheck, text: 'Doctor Verified' },
                  { icon: Timer, text: '30-90 Min Delivery' },
                  { icon: CircleCheck, text: '100% Genuine' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Content - Modern Image Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-2xl" />
                
                <GlassCard className="relative overflow-hidden rounded-3xl aspect-[4/3]">
                  <Image
                    src={images.hero}
                    alt={certificate.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Floating badge */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent.gradient} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{certificate.name}</p>
                          <p className="text-xs text-muted-foreground">Instant Digital Delivery</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ MODERN TRUST BAR ═══════════════ */}
      <section className="py-6 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative">
            <InfiniteSlider gap={48} duration={40}>
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-3 px-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <badge.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">{badge.text}</span>
                </div>
              ))}
            </InfiniteSlider>
          </div>
        </div>
      </section>

      {/* ═══════════════ MODERN SERVICE CARDS ═══════════════ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle 
            title="Why Choose Our Service" 
            subtitle="Professional medical certificates with unmatched convenience and reliability"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Stethoscope, title: 'Qualified Doctors', description: 'All certificates issued by registered medical practitioners with valid credentials and extensive experience.' },
              { icon: Clock, title: 'Lightning Fast', description: 'Receive your verified certificate within 30-90 minutes via email and WhatsApp, ready for immediate use.' },
              { icon: Shield, title: '100% Authentic', description: 'Every certificate includes doctor registration details, digital signature, and QR code for instant verification.' },
              { icon: HeadphonesIcon, title: '24/7 Support', description: 'Round-the-clock assistance from our dedicated support team for all your queries and urgent needs.' },
            ].map((item, index) => (
              <FeatureCard 
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MODERN ABOUT SECTION ═══════════════ */}
      <section className="py-24 md:py-32 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              className="lg:sticky lg:top-24"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
                <Sparkles className="w-4 h-4" />
                About This Certificate
              </span>
              
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                {certificate.name}
                <span className="block text-muted-foreground mt-2 text-2xl sm:text-3xl">Professional Medical Documentation</span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {certificate.description}
              </p>
              
              <div className="space-y-4 mb-8">
                {certificate.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Button
                asChild
                className={`rounded-full px-8 h-12 bg-gradient-to-r ${accent.gradient}`}
              >
                <Link href="/certificates/apply">
                  Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Right: Modern Info Cards */}
            <div className="space-y-6">
              <GlassCard className="p-8">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Service Availability
                </h3>
                <div className="space-y-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-muted-foreground">{day}</span>
                      <span className="text-sm font-medium text-primary">24/7 Available</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Certificate Includes
                </h3>
                <ul className="space-y-3">
                  {[
                    "Doctor's registration details & signature",
                    "QR code for instant verification",
                    "Official medical letterhead",
                    "Digital delivery within 30-90 mins"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ UNIQUE SECTION PER CERTIFICATE ═══════════════ */}
      {renderUniqueSection(slug)}

      {/* ═══════════════ MODERN WHAT'S INCLUDED ═══════════════ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle 
            title="What's Included" 
            subtitle="Every certificate is professionally prepared with all essential verification details"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Stethoscope, title: "Doctor's Credentials", description: 'Complete details including name, registration number, and medical qualifications' },
              { icon: UserCheck, title: 'Patient Information', description: 'Your full details professionally formatted with relevant medical context' },
              { icon: Fingerprint, title: 'QR Verification', description: 'Unique QR code enabling instant online verification by any third party' },
              { icon: FileCheck, title: 'Digital Signature', description: 'Authenticated digital signature ensuring document integrity and authenticity' },
              { icon: CalendarCheck, title: 'Validity Period', description: 'Clear dates specifying the medical condition duration and recommendations' },
              { icon: BadgeCheck, title: 'Official Letterhead', description: 'Issued on verified medical practice letterhead with official stamp' },
            ].map((item, i) => (
              <FeatureCard 
                key={i}
                icon={item.icon}
                title={item.title}
                description={item.description}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MODERN CTA SECTION ═══════════════ */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <SectionTitle 
            title="Ready to Get Your Certificate?" 
            subtitle="Join thousands of satisfied customers who trust us for their medical documentation needs"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10"
          >
            {[
              { icon: FileText, title: 'Fill Application', description: 'Complete our simple online form in just 2 minutes' },
              { icon: Stethoscope, title: 'Doctor Review', description: 'Registered doctor reviews and approves your request' },
              { icon: CheckCircle, title: 'Instant Delivery', description: 'Receive your certificate via email and WhatsApp' },
            ].map((step, i) => (
              <GlassCard key={i} className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </GlassCard>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Button
              asChild
              size="lg"
              className={`h-14 rounded-full px-10 text-base shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all bg-gradient-to-r ${accent.gradient}`}
            >
              <Link href="/certificates/apply">
                Get Started Now
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* REMOVED: Our Verified Medical Professionals Section */}
      {/* REMOVED: Our Medical Services / Gallery Section */}
      {/* REMOVED: Stats Counter Section */}

      {/* ═══════════════ MODERN WHY CHOOSE US ═══════════════ */}
      <section className="py-24 md:py-32 bg-slate-50/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionTitle 
            title="Why Choose MediProofDocs?" 
            subtitle="See how we compare to other certificate providers"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xl shadow-black/5"
          >
            <div className="grid grid-cols-[1fr_100px_100px] bg-slate-50/80 p-4 border-b border-slate-200">
              <span className="text-sm font-semibold text-muted-foreground">Features</span>
              <span className="text-sm font-bold text-primary text-center">MediProofDocs</span>
              <span className="text-sm font-semibold text-muted-foreground text-center">Others</span>
            </div>
            {whyUsData.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`grid grid-cols-[1fr_100px_100px] p-4 items-center ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} ${i < whyUsData.length - 1 ? 'border-b border-slate-100' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <row.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium">{row.feature}</span>
                </div>
                <div className="flex justify-center">
                  {row.us ? (
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                      <span className="text-red-400 text-sm">✗</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  {row.others ? (
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                      <span className="text-red-400 text-sm">✗</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ MODERN USE CASES ═══════════════ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle 
            title="When You Need This Certificate" 
            subtitle="Common scenarios where this certificate is required"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {certificateUseCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-8 text-center h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
                    <useCase.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{useCase.title}</h4>
                  <p className="text-sm text-muted-foreground">{useCase.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MODERN PRIVACY & SECURITY ═══════════════ */}
      <section className="py-24 md:py-32 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle 
            title="Privacy & Security First" 
            subtitle="Your medical information is treated with the highest level of confidentiality"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'End-to-End Encryption',
                description: 'All personal data and medical details are encrypted with 256-bit SSL during transfer and at rest.',
              },
              {
                icon: Fingerprint,
                title: 'No Data Sharing',
                description: 'We never share your medical records with any third party. Your information stays strictly between you and the doctor.',
              },
              {
                icon: Timer,
                title: 'Auto-Delete Policy',
                description: 'Personal data is automatically purged from our servers within 30 days of certificate delivery.',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-8 h-full text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
                    <card.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MODERN HOW IT WORKS ═══════════════ */}
      <section id="how-it-works" className="py-24 md:py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-slate-900 to-slate-900" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">A simple 3-step online process to get your medical certificate</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Submit Your Request', description: 'Fill out our easy online form with accurate personal and medical details. The process is quick, secure, and designed to save your time.', icon: FileText },
              { step: 2, title: 'Online Doctor Consultation', description: 'A certified doctor will review your request and connect with you through an online consultation.', icon: Stethoscope },
              { step: 3, title: 'Receive Your Certificate', description: 'After approval, your medical certificate is issued promptly — digital copy via WhatsApp or Email within 30 minutes.', icon: CheckCircle },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 h-full border border-white/10 hover:bg-white/15 transition-colors">
                  <div className="w-12 h-12 bg-white text-slate-900 rounded-xl flex items-center justify-center text-lg font-bold mb-6">
                    {step.step}
                  </div>
                  <step.icon className="w-8 h-8 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-white/20" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MODERN WHY TRUST US ═══════════════ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle 
            title="Why Trust Us?" 
            subtitle="We are committed to providing genuine, verified medical certificates"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                badge: 'Privacy',
                title: 'Data Privacy & Protection',
                description: 'We respect your privacy and treat your personal and medical details with care. All information is securely handled and used only for doctor consultation and issuing your medical certificate.',
                icon: ShieldCheck,
              },
              {
                badge: 'Verified',
                title: 'Genuine & Verified Certificates',
                description: "Medical certificates are provided only after consultation with a registered Indian medical practitioner. Each certificate carries the doctor's name and registration number, ensuring it is genuine and acceptable.",
                icon: BadgeCheck,
              },
              {
                badge: 'Convenient',
                title: 'Easy & Convenient Process',
                description: 'Our online service is designed to be simple and easy to use. Submit your request, speak with a doctor, and receive your medical certificate smoothly without delays or complicated steps.',
                icon: Zap,
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <GlassCard className="p-8 h-full">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                    {card.badge}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                    <card.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MODERN TESTIMONIALS ═══════════════ */}
      <section className="py-24 md:py-32 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle 
            title="What Our Users Say" 
            subtitle="Trusted by thousands of users across India for their medical certification needs"
          />
          <TestimonialScroll testimonials={testimonials} />
        </div>
      </section>

      {/* ═══════════════ MODERN FAQ SECTION ═══════════════ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionTitle 
            title="Frequently Asked Questions" 
            subtitle="Everything you need to know about our medical certificates"
          />

          <div className="space-y-3">
            {[
              { q: 'When will I receive my medical certificate?', a: 'You will receive your digital medical certificate within 30–90 minutes after completing the online doctor consultation. If you choose a physical copy, it will be delivered within 8–10 business days.' },
              { q: 'Are online medical certificates valid in India?', a: 'Yes, all our medical certificates are issued as per NMC & WHO guidelines by registered Indian medical practitioners. They are 100% genuine and legally valid.' },
              { q: 'Will my employer or institution accept this certificate?', a: 'Yes, all our certificates adhere to NMC and WHO guidelines and are accepted by most organizations. For any clarifications, they can contact the doctor whose details are on the certificate.' },
              { q: 'Do I need to visit a doctor physically?', a: 'No. The entire process is online — from application to doctor consultation to certificate delivery. A physical visit may be required only if the doctor feels in-person examination is necessary.' },
              { q: 'Can a doctor from another state issue my certificate?', a: 'Yes. A doctor registered with a recognized Medical Council in India can issue a medical certificate even if the patient is in another state, as permitted under the Telemedicine Practice Guidelines.' },
              { q: 'How can I verify my certificate?', a: "Every certificate includes the doctor's registration number, signature, date, and medical details. Your employer or institution can contact the issuing doctor directly using the contact details provided on the certificate." },
              { q: 'What is a medical certificate?', a: "A medical certificate is a document issued by a registered medical doctor after confirming the patient's health condition. It serves as an official statement for various legal, professional, and personal purposes." },
              { q: 'What services are non-refundable?', a: 'Consultation and medical review services are non-refundable once the doctor consultation has started. Please review the refund policy before applying.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="overflow-hidden" hover={false}>
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className={`flex items-center justify-between w-full p-5 text-left transition-colors duration-200 ${activeFaq === i ? 'bg-primary/5' : 'hover:bg-slate-50'}`}
                  >
                    <span className="font-semibold pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${activeFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="p-5 pt-0 text-muted-foreground leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MODERN SOCIAL PROOF MARQUEE ═══════════════ */}
      <section className="py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-8">
            Trusted & Accepted By Organizations Nationwide
          </p>
          <Marquee pauseOnHover className="[--duration:30s]">
            {[
              'Corporate HR Departments', 'Educational Institutions', 'Government Offices',
              'Travel Agencies', 'Insurance Companies', 'Legal Firms', 'IT Companies',
              'Hospital Referrals', 'Multinational Corporations', 'Sports Associations',
            ].map((name, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border bg-white px-6 py-3 shadow-sm">
                <Building className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium whitespace-nowrap">{name}</span>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

    </div>
  );
}