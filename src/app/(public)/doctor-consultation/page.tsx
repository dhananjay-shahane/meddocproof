"use client";

import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowRight,
  Stethoscope,
  Phone,
  MessageCircle,
  Star,
  Heart,
  Clock,
  IndianRupee,
  BadgeCheck,
  Lock,
  Headphones,
  Brain,
  Baby,
  Bone,
  Sparkles,
  Activity,
  Thermometer,
  Pill,
  Syringe,
  Eye,
  Check,
} from "lucide-react";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { TestimonialsSection } from "@/components/public/home/testimonials-section";
import { HeroSection } from "@/components/public/home/hero-section";

// Trust Items from Home Page
const TRUST_ITEMS = [
  {
    id: "verified",
    icon: Shield,
    title: "Verified & Authentic",
    description:
      "Every certificate is reviewed and signed by a registered MBBS practitioner with valid credentials. Our doctors are verified and comply with all medical council regulations.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80 ",
  },
  {
    id: "quick",
    icon: Clock,
    title: "Quick Turnaround",
    description:
      "Receive your certificate within 30 minutes to 24 hours through a fully digital, hassle-free workflow. No hospital visits or long waiting queues.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80 ",
  },
  {
    id: "pricing",
    icon: IndianRupee,
    title: "Transparent Pricing",
    description:
      "Clear pricing with no hidden fees. Starting from just ₹599 for digital certificates. Multiple payment options available including UPI, cards, and net banking.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80 ",
  },
  {
    id: "compliant",
    icon: BadgeCheck,
    title: "NMC & WHO Compliant",
    description:
      "All certificates adhere to National Medical Commission and WHO guidelines for validity. Accepted by employers, institutions, and travel authorities across India.",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80 ",
  },
  {
    id: "privacy",
    icon: Lock,
    title: "Privacy & Security",
    description:
      "Your personal and medical information is handled with strict confidentiality and encryption. We follow HIPAA-compliant data protection practices.",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80 ",
  },
  {
    id: "support",
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "Our support team is available to assist you through the entire process, from application to delivery. Get help via WhatsApp, email, or phone.",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80 ",
  },
];

const CONSULTATION_HIGHLIGHTS = [
  "Book online consultation with verified MBBS/MD doctors from anywhere.",
  "Request sick leave, fitness, recovery, and fit-to-travel certificates.",
  "Receive doctor-signed digital documentation with verification fields.",
  "Transparent fees, secure payment flow, and fast status updates.",
  "Dedicated support on call and WhatsApp during the full process.",
  "Workflow aligned with NMC Act, Telemedicine, and WHO care standards.",
];

const MILAN_HIGHLIGHTS = [
  "Every completed consultation contributes to community healthcare access.",
  "Your purchase helps fund care support for families with limited reach.",
  "Join Milan and become part of a practical health impact network.",
  "Clear and transparent contribution model linked to each successful request.",
];

// Expert Care Categories with SVG Icons
const EXPERT_CARE_ITEMS = [
  {
    title: "Mental Health",
    icon: (
      <svg viewBox="0 0 64 64" className="w-16 h-16">
        <circle cx="32" cy="32" r="28" fill="#e0f7fa" />
        <circle cx="22" cy="24" r="4" fill="#00acc1" />
        <circle cx="42" cy="24" r="4" fill="#00acc1" />
        <path d="M20 36 Q32 48 44 36" stroke="#00acc1" strokeWidth="3" fill="none" />
        <circle cx="16" cy="20" r="3" fill="#80deea" />
        <circle cx="48" cy="20" r="3" fill="#80deea" />
        <circle cx="32" cy="14" r="3" fill="#80deea" />
      </svg>
    ),
  },
  {
    title: "Allergy",
    icon: (
      <svg viewBox="0 0 64 64" className="w-16 h-16">
        <circle cx="32" cy="32" r="28" fill="#e0f7fa" />
        <circle cx="32" cy="28" r="12" fill="#ffccbc" />
        <path d="M28 24 L32 28 L36 24" stroke="#ff7043" strokeWidth="2" fill="none" />
        <circle cx="26" cy="30" r="2" fill="#5d4037" />
        <circle cx="38" cy="30" r="2" fill="#5d4037" />
        <ellipse cx="32" cy="36" rx="3" ry="2" fill="#ffab91" />
      </svg>
    ),
  },
  {
    title: "Pregnancy Related Queries",
    icon: (
      <svg viewBox="0 0 64 64" className="w-16 h-16">
        <circle cx="32" cy="32" r="28" fill="#e0f7fa" />
        <ellipse cx="32" cy="38" rx="10" ry="12" fill="#ffccbc" />
        <circle cx="32" cy="22" r="8" fill="#ffccbc" />
        <path d="M24 18 Q32 14 40 18" stroke="#8d6e63" strokeWidth="2" fill="none" />
        <circle cx="40" cy="16" r="4" fill="#ff8a80" />
      </svg>
    ),
  },
  {
    title: "Menstrual Health",
    icon: (
      <svg viewBox="0 0 64 64" className="w-16 h-16">
        <circle cx="32" cy="32" r="28" fill="#e0f7fa" />
        <ellipse cx="32" cy="34" rx="8" ry="12" fill="none" stroke="#00acc1" strokeWidth="3" />
        <ellipse cx="32" cy="34" rx="4" ry="8" fill="#ff8a80" />
        <circle cx="32" cy="20" r="3" fill="#00acc1" />
        <circle cx="20" cy="34" r="3" fill="#00acc1" />
        <circle cx="44" cy="34" r="3" fill="#00acc1" />
      </svg>
    ),
  },
  {
    title: "General Medicine",
    icon: (
      <svg viewBox="0 0 64 64" className="w-16 h-16">
        <circle cx="32" cy="32" r="28" fill="#e0f7fa" />
        <rect x="28" y="16" width="8" height="32" rx="2" fill="#00acc1" />
        <rect x="16" y="28" width="32" height="8" rx="2" fill="#00acc1" />
        <circle cx="32" cy="32" r="4" fill="#fff" />
      </svg>
    ),
  },
  {
    title: "Pediatrics",
    icon: (
      <svg viewBox="0 0 64 64" className="w-16 h-16">
        <circle cx="32" cy="32" r="28" fill="#e0f7fa" />
        <circle cx="32" cy="24" r="8" fill="#ffccbc" />
        <ellipse cx="32" cy="44" rx="10" ry="8" fill="#ffccbc" />
        <circle cx="28" cy="22" r="2" fill="#5d4037" />
        <circle cx="36" cy="22" r="2" fill="#5d4037" />
        <path d="M28 28 Q32 32 36 28" stroke="#ff7043" strokeWidth="2" fill="none" />
        <circle cx="48" cy="20" r="4" fill="#ff8a80" />
      </svg>
    ),
  },
  {
    title: "Dermatology",
    icon: (
      <svg viewBox="0 0 64 64" className="w-16 h-16">
        <circle cx="32" cy="32" r="28" fill="#e0f7fa" />
        <circle cx="32" cy="32" r="12" fill="#ffccbc" />
        <circle cx="26" cy="30" r="2" fill="#5d4037" />
        <circle cx="38" cy="30" r="2" fill="#5d4037" />
        <ellipse cx="32" cy="36" rx="3" ry="2" fill="#ffab91" />
        <circle cx="48" cy="20" r="3" fill="#80deea" />
        <circle cx="16" cy="20" r="3" fill="#80deea" />
      </svg>
    ),
  },
  {
    title: "Orthopedics",
    icon: (
      <svg viewBox="0 0 64 64" className="w-16 h-16">
        <circle cx="32" cy="32" r="28" fill="#e0f7fa" />
        <path d="M20 20 L28 28 L20 36" stroke="#00acc1" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M44 20 L36 28 L44 36" stroke="#00acc1" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="32" cy="28" r="6" fill="#00acc1" />
      </svg>
    ),
  },
];

// Common Conditions for Doctor Consultation with SVG Icons
const COMMON_CONDITIONS = [
  {
    number: "01",
    title: "Fever",
    description: "A high body temperature is a sign of infection, and a certificate confirms you need to rest and recover.",
    icon: () => (
      <svg viewBox="0 0 80 80" className="w-16 h-16">
        {/* Person with thermometer */}
        <circle cx="40" cy="25" r="12" fill="#f5d0c5" />
        <path d="M28 35 Q40 32 52 35 L52 55 Q40 58 28 55 Z" fill="#8b5cf6" />
        <rect x="35" y="38" width="10" height="15" fill="#f5d0c5" />
        {/* Thermometer */}
        <rect x="52" y="20" width="4" height="20" rx="2" fill="#ef4444" />
        <circle cx="54" cy="42" r="5" fill="#ef4444" />
        <line x1="54" y1="22" x2="54" y2="35" stroke="white" strokeWidth="1.5" />
        {/* Sweat drops */}
        <circle cx="25" cy="30" r="2" fill="#60a5fa" opacity="0.6" />
        <circle cx="22" cy="38" r="1.5" fill="#60a5fa" opacity="0.6" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Cold",
    description: "Symptoms like a cough and sore throat can make it hard to work, and a certificate also helps prevent spreading the illness.",
    icon: () => (
      <svg viewBox="0 0 80 80" className="w-16 h-16">
        {/* Person */}
        <circle cx="35" cy="28" r="12" fill="#f5d0c5" />
        <path d="M23 38 Q35 35 47 38 L47 58 Q35 61 23 58 Z" fill="#3b82f6" />
        {/* Tissue */}
        <rect x="45" y="35" width="15" height="20" rx="2" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
        <path d="M48 40 L52 48" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        {/* Virus symbol */}
        <circle cx="60" cy="25" r="6" fill="#10b981" />
        <circle cx="60" cy="25" r="3" fill="#065f46" />
        <line x1="60" y1="17" x2="60" y2="13" stroke="#10b981" strokeWidth="2" />
        <line x1="60" y1="33" x2="60" y2="37" stroke="#10b981" strokeWidth="2" />
        <line x1="52" y1="25" x2="48" y2="25" stroke="#10b981" strokeWidth="2" />
        <line x1="68" y1="25" x2="72" y2="25" stroke="#10b981" strokeWidth="2" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Stomach Ache",
    description: "This can be due to a stomach virus or food poisoning, and a certificate confirms the need for rest.",
    icon: () => (
      <svg viewBox="0 0 80 80" className="w-16 h-16">
        {/* Person holding stomach */}
        <circle cx="40" cy="25" r="12" fill="#f5d0c5" />
        <path d="M28 35 Q40 32 52 35 L52 55 Q40 58 28 55 Z" fill="#f59e0b" />
        {/* Arms holding stomach */}
        <ellipse cx="32" cy="48" rx="8" ry="4" fill="#f5d0c5" />
        <ellipse cx="48" cy="48" rx="8" ry="4" fill="#f5d0c5" />
        {/* Pain symbol */}
        <circle cx="55" cy="22" r="5" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
        <text x="55" y="25" textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="bold">!</text>
      </svg>
    ),
  },
  {
    number: "04",
    title: "Periods",
    description: "Severe cramps and other symptoms can be debilitating, and a certificate validates the need for time off to manage the pain.",
    icon: () => (
      <svg viewBox="0 0 80 80" className="w-16 h-16">
        {/* Sanitary pad */}
        <ellipse cx="40" cy="40" rx="20" ry="28" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
        <ellipse cx="40" cy="40" rx="12" ry="20" fill="#fecaca" />
        {/* Drops */}
        <ellipse cx="40" cy="35" rx="4" ry="6" fill="#ef4444" />
        <ellipse cx="35" cy="45" rx="3" ry="5" fill="#ef4444" opacity="0.7" />
        <ellipse cx="45" cy="45" rx="3" ry="5" fill="#ef4444" opacity="0.7" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Back Pain",
    description: "This can limit your ability to sit or move, and a certificate explains the physical restrictions you have.",
    icon: () => (
      <svg viewBox="0 0 80 80" className="w-16 h-16">
        {/* Person with back pain */}
        <circle cx="40" cy="25" r="10" fill="#f5d0c5" />
        <path d="M30 35 L35 55 L45 55 L50 35" fill="#10b981" />
        {/* Bent posture */}
        <path d="M30 35 Q25 45 30 55" fill="none" stroke="#f5d0c5" strokeWidth="6" strokeLinecap="round" />
        <path d="M50 35 Q55 45 50 55" fill="none" stroke="#f5d0c5" strokeWidth="6" strokeLinecap="round" />
        {/* Pain indicators */}
        <path d="M55 40 L62 35" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        <path d="M57 45 L65 42" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        <path d="M55 50 L62 50" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Injury",
    description: "For a sprain or wound, a certificate documents the injury and the necessary time for healing.",
    icon: () => (
      <svg viewBox="0 0 80 80" className="w-16 h-16">
        {/* Person with bandage */}
        <circle cx="40" cy="25" r="12" fill="#f5d0c5" />
        <path d="M28 35 Q40 32 52 35 L52 55 Q40 58 28 55 Z" fill="#6366f1" />
        {/* Bandage on head */}
        <rect x="32" y="18" width="16" height="8" rx="2" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
        <line x1="36" y1="22" x2="44" y2="22" stroke="#ef4444" strokeWidth="1.5" />
        {/* Arm sling */}
        <path d="M28 45 Q35 50 42 45" fill="none" stroke="#f3f4f6" strokeWidth="8" strokeLinecap="round" />
        <path d="M28 45 Q35 50 42 45" fill="none" stroke="#d1d5db" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "07",
    title: "Stress",
    description: "High stress can cause physical and mental symptoms, and a certificate can justify a leave to prevent burnout.",
    icon: () => (
      <svg viewBox="0 0 80 80" className="w-16 h-16">
        {/* Stressed person */}
        <circle cx="40" cy="28" r="12" fill="#f5d0c5" />
        <path d="M28 38 Q40 35 52 38 L52 58 Q40 61 28 58 Z" fill="#f59e0b" />
        {/* Hands on head */}
        <ellipse cx="26" cy="32" rx="6" ry="4" fill="#f5d0c5" />
        <ellipse cx="54" cy="32" rx="6" ry="4" fill="#f5d0c5" />
        {/* Stress symbols */}
        <text x="60" y="25" fontSize="10" fill="#ef4444">!</text>
        <text x="65" y="30" fontSize="8" fill="#ef4444">!</text>
        <circle cx="18" cy="35" r="3" fill="#fbbf24" />
        <circle cx="62" cy="45" r="2" fill="#fbbf24" />
      </svg>
    ),
  },
  {
    number: "08",
    title: "Migraine",
    description: "A migraine is more than a headache; a certificate confirms a severe attack that makes it impossible to work or study.",
    icon: () => (
      <svg viewBox="0 0 80 80" className="w-16 h-16">
        {/* Person with migraine */}
        <circle cx="40" cy="28" r="12" fill="#f5d0c5" />
        <path d="M28 38 Q40 35 52 38 L52 58 Q40 61 28 58 Z" fill="#8b5cf6" />
        {/* Pain waves */}
        <path d="M20 25 Q15 28 20 31" fill="none" stroke="#ef4444" strokeWidth="2" />
        <path d="M16 22 Q10 28 16 34" fill="none" stroke="#ef4444" strokeWidth="2" />
        <path d="M60 25 Q65 28 60 31" fill="none" stroke="#ef4444" strokeWidth="2" />
        <path d="M64 22 Q70 28 64 34" fill="none" stroke="#ef4444" strokeWidth="2" />
        {/* Hand on head */}
        <ellipse cx="55" cy="28" rx="5" ry="3" fill="#f5d0c5" />
      </svg>
    ),
  },
  {
    number: "09",
    title: "Dengue, Malaria, etc",
    description: "A blood test report is required to confirm the diagnosis, as symptoms alone aren't enough.",
    icon: () => (
      <svg viewBox="0 0 80 80" className="w-16 h-16">
        {/* Mosquito */}
        <ellipse cx="40" cy="35" rx="8" ry="12" fill="#6b7280" />
        <circle cx="40" cy="25" r="5" fill="#6b7280" />
        {/* Wings */}
        <ellipse cx="28" cy="30" rx="8" ry="4" fill="#9ca3af" opacity="0.5" />
        <ellipse cx="52" cy="30" rx="8" ry="4" fill="#9ca3af" opacity="0.5" />
        {/* Legs */}
        <line x1="35" y1="45" x2="30" y2="55" stroke="#6b7280" strokeWidth="1.5" />
        <line x1="40" y1="47" x2="40" y2="58" stroke="#6b7280" strokeWidth="1.5" />
        <line x1="45" y1="45" x2="50" y2="55" stroke="#6b7280" strokeWidth="1.5" />
        {/* No symbol */}
        <circle cx="55" cy="50" r="10" fill="none" stroke="#ef4444" strokeWidth="2" />
        <line x1="48" y1="43" x2="62" y2="57" stroke="#ef4444" strokeWidth="2" />
      </svg>
    ),
  },
  {
    number: "10",
    title: "Fracture",
    description: "An X-ray report is required to prove the injury and determine the recovery time.",
    icon: () => (
      <svg viewBox="0 0 80 80" className="w-16 h-16">
        {/* Person with cast */}
        <circle cx="40" cy="25" r="12" fill="#f5d0c5" />
        <path d="M28 35 Q40 32 52 35 L52 55 Q40 58 28 55 Z" fill="#14b8a6" />
        {/* Leg cast */}
        <rect x="32" y="55" width="8" height="18" rx="2" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
        <line x1="34" y1="60" x2="38" y2="60" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="34" y1="65" x2="38" y2="65" stroke="#ef4444" strokeWidth="1.5" />
        {/* Crutch */}
        <line x1="50" y1="45" x2="55" y2="70" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
        <line x1="48" y1="50" x2="52" y2="50" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "11",
    title: "Chicken Pox",
    description: "While a visual diagnosis is made, the certificate often confirms that the patient is no longer contagious, based on the doctor's observation of the blisters.",
    icon: () => (
      <svg viewBox="0 0 80 80" className="w-16 h-16">
        {/* Person with spots */}
        <circle cx="40" cy="25" r="12" fill="#f5d0c5" />
        <path d="M28 35 Q40 32 52 35 L52 55 Q40 58 28 55 Z" fill="#3b82f6" />
        {/* Chicken pox spots */}
        <circle cx="35" cy="22" r="2" fill="#ef4444" />
        <circle cx="45" cy="28" r="1.5" fill="#ef4444" />
        <circle cx="38" cy="32" r="1.8" fill="#ef4444" />
        <circle cx="42" cy="20" r="1.5" fill="#ef4444" />
        <circle cx="32" cy="40" r="2" fill="#ef4444" />
        <circle cx="48" cy="45" r="1.8" fill="#ef4444" />
        <circle cx="40" cy="50" r="2" fill="#ef4444" />
      </svg>
    ),
  },
  {
    number: "12",
    title: "Any Surgery",
    description: "When it comes to any surgery, a medical certificate is crucial for justifying a prolonged absence from work or school. The key document is the hospital discharge summary.",
    icon: () => (
      <svg viewBox="0 0 80 80" className="w-16 h-16">
        {/* Hospital scene */}
        <rect x="25" y="30" width="30" height="25" rx="3" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1.5" />
        <rect x="35" y="35" width="10" height="15" fill="#3b82f6" />
        <rect x="38" y="38" width="4" height="9" fill="white" />
        <rect x="36" y="40" width="8" height="3" fill="white" />
        {/* Person */}
        <circle cx="55" cy="35" r="8" fill="#f5d0c5" />
        <path d="M50 42 L55 52 L60 42" fill="#10b981" />
        {/* Medical cross */}
        <rect x="28" y="48" width="6" height="2" fill="#ef4444" />
        <rect x="30" y="46" width="2" height="6" fill="#ef4444" />
      </svg>
    ),
  },
];

export default function DoctorConsultationPage() {
  const [expertCarouselApi, setExpertCarouselApi] = React.useState<CarouselApi>();
  const [expertCurrentSnap, setExpertCurrentSnap] = React.useState(0);
  const [expertSnapCount, setExpertSnapCount] = React.useState(0);

  React.useEffect(() => {
    if (!expertCarouselApi) {
      return;
    }

    const onSelect = () => {
      setExpertCurrentSnap(expertCarouselApi.selectedScrollSnap());
      setExpertSnapCount(expertCarouselApi.scrollSnapList().length);
    };

    onSelect();
    expertCarouselApi.on("select", onSelect);
    expertCarouselApi.on("reInit", onSelect);

    return () => {
      expertCarouselApi.off("select", onSelect);
      expertCarouselApi.off("reInit", onSelect);
    };
  }, [expertCarouselApi]);

  return (
    <>
      <HeroSection
        headingPrefix="Expert Medical Consultation"
        headingHighlight="From Home"
        typewriterPrefix="For"
        rotatingWords={[
          "Sick Leave",
          "Fitness",
          "Recovery",
          "Fit-to-Travel",
          "General Consultation",
          "Women Health Queries",
        ]}
        trustBadges={[
          "Verified MBBS/MD doctors available online",
          "Doctor-reviewed consultation from your home",
          "Secure digital documentation with verification fields",
          "Fast delivery updates via WhatsApp and email",
          "Aligned with Indian telemedicine and care standards",
        ]}
        primaryCta={{
          label: "Start Consultation",
          href: "/certificates/apply",
        }}
        secondaryCta={{
          label: "Talk to Support",
          href: "/contact",
        }}
        heroImageSrc="/images/hero/docter.png"
        heroImageAlt="Online doctor consultation team"
      />

      {/* Certificate Benefits Section */}
      <section className="relative py-16 sm:py-20 overflow-hidden bg-muted/30">
        <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <p className="inline-flex items-center gap-2 rounded-full bg-card border border-border text-primary px-4 py-2 text-sm font-semibold mb-5 shadow-sm">
                <Sparkles className="w-4 h-4" />
                Medical Certificate Support
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight mb-4">
                Certification That Fits
                <span className="text-primary"> Real Life Timelines</span>
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-7 max-w-2xl">
                Built for employees, students, and frequent travelers who need a legitimate medical
                certificate process without delay, confusion, or repeated follow-ups.
              </p>

              <div className="grid gap-3 mb-8">
                {CONSULTATION_HIGHLIGHTS.map((item) => (
                  <div
                    key={item}
                    className="group flex items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-foreground shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="mt-0.5 shrink-0 rounded-full bg-primary/10 p-1.5">
                      <Check className="w-4 h-4 text-primary" />
                    </span>
                    <span className="text-sm sm:text-base font-semibold leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <Link
                  href="/certificates/apply"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground px-7 sm:px-8 py-3.5 sm:py-4 text-lg sm:text-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Apply For Certificate
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-2xl border border-primary bg-card px-6 py-3.5 text-base font-semibold text-primary hover:bg-primary/5 transition-colors"
                >
                  Talk to Support
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[2.25rem] bg-gradient-to-br from-primary/20 to-secondary/30 blur-xl opacity-80" />

              <div className="relative rounded-[2.25rem] overflow-hidden border border-border shadow-2xl bg-card">
                <Image
                  src="/images/hero/doctor-nurses-special-equipment.jpg"
                  alt="Doctor consultation team"
                  width={1440}
                  height={900}
                  quality={95}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 700px"
                  className="w-full h-[360px] sm:h-[430px] object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 via-foreground/45 to-transparent px-6 py-6">
                  <p className="text-background font-semibold text-sm sm:text-base leading-relaxed">
                    End-to-end digital flow: case review, doctor approval, and certificate sharing in one place.
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 absolute -top-5 -right-4 bg-card rounded-full px-4 py-2.5 shadow-lg border border-border">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Average delivery window: 30 min to 24 hrs</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 absolute -bottom-4 -left-3 bg-primary text-primary-foreground rounded-full px-4 py-2.5 shadow-lg">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-semibold">Doctor-verified documentation</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Milan Campaign Section */}
      {/* <section className="relative py-16 sm:py-20 bg-primary overflow-hidden">
        <div
          className="absolute left-0 right-0 -top-6 h-6 bg-muted/30"
          style={{
            clipPath:
              "polygon(0 0, 4% 100%, 8% 0, 12% 100%, 16% 0, 20% 100%, 24% 0, 28% 100%, 32% 0, 36% 100%, 40% 0, 44% 100%, 48% 0, 52% 100%, 56% 0, 60% 100%, 64% 0, 68% 100%, 72% 0, 76% 100%, 80% 0, 84% 100%, 88% 0, 92% 100%, 96% 0, 100% 100%, 100% 0)",
          }}
        />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="order-2 lg:order-1"
            >
              <div className="relative rounded-4xl overflow-hidden border border-primary-foreground/20 bg-card shadow-2xl">
                <img
                  src="/images/auth/user-hero.jpg"
                  alt="Community healthcare support"
                  className="w-full h-72 sm:h-96 object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary-foreground leading-tight mb-3">
                Milan Program by <span className="text-accent">MediProofDocs</span>
              </h2>

              <p className="text-primary-foreground/80 text-base sm:text-lg leading-relaxed mb-6 max-w-xl">
                MediProofDocs consultations do more than documentation delivery. Each successful request
                helps support practical healthcare access through our Milan community initiative.
              </p>

              <div className="space-y-3 mb-7">
                {MILAN_HIGHLIGHTS.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 rounded-full bg-primary-foreground/20 p-1">
                      <Check className="w-4 h-4 text-accent" />
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-primary-foreground leading-snug">{item}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/certificates/apply"
                className="inline-flex items-center justify-center rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-7 sm:px-9 py-3.5 text-lg sm:text-xl font-extrabold shadow-lg transition-all hover:-translate-y-0.5"
              >
                Discover Milan With MediProofDocs
              </Link>
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* Expert Care For Your Health Section - Dark Theme with ZigZak */}
      <section className="relative py-20 bg-primary/40  overflow-hidden">
       
        {/* Bottom ZigZak Border */}
        <div
          className="absolute left-0 right-0 -bottom-6 h-6 bg-muted/30"
          style={{
            clipPath:
              "polygon(0 100%, 4% 0, 8% 100%, 12% 0, 16% 100%, 20% 0, 24% 100%, 28% 0, 32% 100%, 36% 0, 40% 100%, 44% 0, 48% 100%, 52% 0, 56% 100%, 60% 0, 64% 100%, 68% 0, 72% 100%, 76% 0, 80% 100%, 84% 0, 88% 100%, 92% 0, 96% 100%, 100% 0, 100% 100%)",
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-2 sm:mb-3 leading-tight">
              Expert Care For{" "}
              <span className="text-primary">Your Health</span>
            </h2>
            <p className="text-lg sm:text-2xl text-muted-foreground max-w-4xl mx-auto">
              Consult our verified doctors for medical certificates across all health conditions
            </p>
          </div>

          <div className="relative max-w-[1500px] mx-auto">
            <Carousel
              setApi={setExpertCarouselApi}
              opts={{
                align: "start",
                loop: true,
                slidesToScroll: 2,
              }}
              className="px-4 sm:px-10 lg:px-16"
            >
              <button
                type="button"
                onClick={() => expertCarouselApi?.scrollPrev()}
                className="flex absolute left-0 sm:left-1 lg:left-0 top-[43%] -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-card text-primary items-center justify-center shadow-lg border border-border hover:bg-muted transition-colors"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => expertCarouselApi?.scrollNext()}
                className="flex absolute right-0 sm:right-1 lg:right-0 top-[43%] -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-card text-primary items-center justify-center shadow-lg border border-border hover:bg-muted transition-colors"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <CarouselContent className="py-2">
                {EXPERT_CARE_ITEMS.map((item, index) => (
                  <CarouselItem
                    key={item.title}
                    className="basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      viewport={{ once: true }}
                      className="flex items-center justify-center"
                    >
                      <div className="w-[180px] sm:w-[190px] md:w-[200px] min-h-[205px] rounded-[18px] border border-border bg-card shadow-md px-4 py-5 flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
                        <div className="w-[122px] h-[122px] rounded-full border-[10px] border-primary/20 bg-primary/5 flex items-center justify-center mb-4">
                          <div className="w-[74px] h-[74px] flex items-center justify-center">
                            {item.icon}
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground text-center leading-snug">
                          {item.title}
                        </h3>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="flex justify-center gap-5 mt-7">
              {Array.from({ length: Math.max(expertSnapCount, 4) }).map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  type="button"
                  onClick={() => expertCarouselApi?.scrollTo(dotIndex)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${dotIndex === expertCurrentSnap ? "bg-primary" : "bg-muted-foreground/30"}`}
                  aria-label={`Go to slide ${dotIndex + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Common Conditions for a Medical Certificate Section - Dark Theme with ZigZak */}
      <section className="relative py-20 bg-background overflow-hidden">
          {/* Top ZigZak Border */}
        <div
          className="absolute left-0 right-0 -top-1 h-8 bg-primary/40"
          style={{
            clipPath:
              "polygon(0 0, 4% 100%, 8% 0, 12% 100%, 16% 0, 20% 100%, 24% 0, 28% 100%, 32% 0, 36% 100%, 40% 0, 44% 100%, 48% 0, 52% 100%, 56% 0, 60% 100%, 64% 0, 68% 100%, 72% 0, 76% 100%, 80% 0, 84% 100%, 88% 0, 92% 100%, 96% 0, 100% 100%, 100% 0)",
          }}
        />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3 leading-tight">
              Common Conditions for a <span className="text-primary">Medical Certificate</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Our doctors provide expert consultation for a wide range of health conditions
            </p>
          </div>

          {/* Common Conditions Grid with Connecting Arrows */}
          <div className="relative max-w-6xl mx-auto">
            {/* Row 1: 01-04 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {COMMON_CONDITIONS.slice(0, 4).map((condition, index) => (
                <div key={index} className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Hexagon Container */}
                    <div className="relative mb-4">
                      {/* Hexagon Shape with Dashed Border */}
                      <div className="w-24 h-28 relative">
                        <svg viewBox="0 0 100 110" className="w-full h-full">
                          <polygon
                            points="50,5 95,27.5 95,82.5 50,105 5,82.5 5,27.5"
                            fill="hsl(var(--card))"
                            stroke="hsl(var(--primary))"
                            strokeWidth="1.5"
                            strokeDasharray="6,4"
                          />
                        </svg>
                        {/* SVG Icon inside hexagon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <condition.icon />
                        </div>
                      </div>
                      {/* Teal Number Badge */}
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-extrabold shadow-md animate-bounce border border-background">
                        {condition.number}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-foreground mb-2">
                      {condition.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-xs leading-relaxed max-w-[180px]">
                      {condition.description}
                    </p>
                  </motion.div>
                  
                  {/* Curved Arrow - Downward curve for odd positions (01→02, 03→04) */}
                  {index < 3 && index % 2 === 0 && (
                    <div className="hidden lg:block absolute top-16 -right-8 w-16 h-12 z-10">
                      <svg viewBox="0 0 60 40" className="w-full h-full">
                        <path
                          d="M5,5 Q30,35 55,20"
                          fill="none"
                          stroke="hsl(var(--border))"
                          strokeWidth="2"
                          strokeDasharray="4,3"
                          className="animate-pulse"
                        />
                        <polygon points="52,17 58,22 52,25" fill="hsl(var(--border))" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Curved Arrow - Upward curve for even positions (02→03) */}
                  {index < 3 && index % 2 === 1 && (
                    <div className="hidden lg:block absolute top-16 -right-8 w-16 h-12 z-10">
                      <svg viewBox="0 0 60 40" className="w-full h-full">
                        <path
                          d="M5,25 Q30,-5 55,10"
                          fill="none"
                          stroke="hsl(var(--border))"
                          strokeWidth="2"
                          strokeDasharray="4,3"
                          className="animate-pulse"
                        />
                        <polygon points="52,7 58,12 52,15" fill="hsl(var(--border))" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Row 2: 05-08 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {COMMON_CONDITIONS.slice(4, 8).map((condition, index) => (
                <div key={index} className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 4) * 0.05 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Hexagon Container */}
                    <div className="relative mb-4">
                      {/* Hexagon Shape with Dashed Border */}
                      <div className="w-24 h-28 relative">
                        <svg viewBox="0 0 100 110" className="w-full h-full">
                          <polygon
                            points="50,5 95,27.5 95,82.5 50,105 5,82.5 5,27.5"
                            fill="hsl(var(--card))"
                            stroke="hsl(var(--primary))"
                            strokeWidth="1.5"
                            strokeDasharray="6,4"
                          />
                        </svg>
                        {/* SVG Icon inside hexagon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <condition.icon />
                        </div>
                      </div>
                      {/* Teal Number Badge */}
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-extrabold shadow-md animate-bounce border border-background">
                        {condition.number}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-foreground mb-2">
                      {condition.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-xs leading-relaxed max-w-[180px]">
                      {condition.description}
                    </p>
                  </motion.div>
                  
                  {/* Curved Arrow - Downward curve for odd positions */}
                  {index < 3 && index % 2 === 0 && (
                    <div className="hidden lg:block absolute top-16 -right-8 w-16 h-12 z-10">
                      <svg viewBox="0 0 60 40" className="w-full h-full">
                        <path
                          d="M5,5 Q30,35 55,20"
                          fill="none"
                          stroke="hsl(var(--border))"
                          strokeWidth="2"
                          strokeDasharray="4,3"
                          className="animate-pulse"
                        />
                        <polygon points="52,17 58,22 52,25" fill="hsl(var(--border))" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Curved Arrow - Upward curve for even positions */}
                  {index < 3 && index % 2 === 1 && (
                    <div className="hidden lg:block absolute top-16 -right-8 w-16 h-12 z-10">
                      <svg viewBox="0 0 60 40" className="w-full h-full">
                        <path
                          d="M5,25 Q30,-5 55,10"
                          fill="none"
                          stroke="hsl(var(--border))"
                          strokeWidth="2"
                          strokeDasharray="4,3"
                          className="animate-pulse"
                        />
                        <polygon points="52,7 58,12 52,15" fill="hsl(var(--border))" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Row 3: 09-12 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COMMON_CONDITIONS.slice(8, 12).map((condition, index) => (
                <div key={index} className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 8) * 0.05 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Hexagon Container */}
                    <div className="relative mb-4">
                      {/* Hexagon Shape with Dashed Border */}
                      <div className="w-24 h-28 relative">
                        <svg viewBox="0 0 100 110" className="w-full h-full">
                          <polygon
                            points="50,5 95,27.5 95,82.5 50,105 5,82.5 5,27.5"
                            fill="hsl(var(--card))"
                            stroke="hsl(var(--primary))"
                            strokeWidth="1.5"
                            strokeDasharray="6,4"
                          />
                        </svg>
                        {/* SVG Icon inside hexagon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <condition.icon />
                        </div>
                      </div>
                      {/* Teal Number Badge */}
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-extrabold shadow-md animate-bounce border border-background">
                        {condition.number}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-foreground mb-2">
                      {condition.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-xs leading-relaxed max-w-[180px]">
                      {condition.description}
                    </p>
                  </motion.div>
                  
                  {/* Curved Arrow - Downward curve for odd positions */}
                  {index < 3 && index % 2 === 0 && (
                    <div className="hidden lg:block absolute top-16 -right-8 w-16 h-12 z-10">
                      <svg viewBox="0 0 60 40" className="w-full h-full">
                        <path
                          d="M5,5 Q30,35 55,20"
                          fill="none"
                          stroke="hsl(var(--border))"
                          strokeWidth="2"
                          strokeDasharray="4,3"
                          className="animate-pulse"
                        />
                        <polygon points="52,17 58,22 52,25" fill="hsl(var(--border))" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Curved Arrow - Upward curve for even positions */}
                  {index < 3 && index % 2 === 1 && (
                    <div className="hidden lg:block absolute top-16 -right-8 w-16 h-12 z-10">
                      <svg viewBox="0 0 60 40" className="w-full h-full">
                        <path
                          d="M5,25 Q30,-5 55,10"
                          fill="none"
                          stroke="hsl(var(--border))"
                          strokeWidth="2"
                          strokeDasharray="4,3"
                          className="animate-pulse"
                        />
                        <polygon points="52,7 58,12 52,15" fill="hsl(var(--border))" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />
    </>
  );
}