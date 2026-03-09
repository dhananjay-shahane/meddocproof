"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
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
  Bandage,
  CalendarDays,
  Sparkles,
  Activity,
  Thermometer,
  Pill,
  Syringe,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import { TestimonialsSection } from "@/components/public/home/testimonials-section";
import { HeroSection } from "@/components/public/home/hero-section";
import { CTASection } from "@/components/public/home/cta-section";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "dotlottie-wc": any;
    }
  }
}

const DotLottieWC = "dotlottie-wc" as any;

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
  "Consult Experienced Doctors",
  "Get online consultation from qualified MBBS / MD / MS doctors.",
  "Affordable Consultation",
  "Online doctor consultation available starting from ₹599.",
  "Video, Audio, or Chat Consultation",
  "Choose your preferred way to talk with a doctor online.",
  "Digital Prescription Provided",
  "Receive a doctor-issued digital prescription after consultation.",
  "Government-Registered Doctors",
  "Consult doctors registered with the National Medical Commission (NMC).",
  "Telemedicine Guideline Compliant",
  "Our consultation process follows Indian telemedicine and healthcare standards."
];

const DOCTOR_CONSULTATION_TOPICS = [
  "General health concerns",
  "Fever, cold, and cough",
  "Women's health issues",
  "Headache or body pain",
  "Stomach and digestion problems",
  "Skin and allergy issues",
  "Medical certificate consultation",
  "Follow-up medical advice",
  "Minor infections",
  "Stress, sleep, or fatigue issues",
  "Diet and nutrition advice",
  "Medication guidance or prescription clarification",
  "Cold, flu, or seasonal illness symptoms",
  "Basic health check advice",
];

const MILAN_HIGHLIGHTS = [
  "Every completed consultation contributes to community healthcare access.",
  "Your purchase helps fund care support for families with limited reach.",
  "Join Milan and become part of a practical health impact network.",
  "Clear and transparent contribution model linked to each successful request.",
];

const CONSULTATION_STEPS = [
  {
    id: "01",
    title: "Fill the form",
    icon: () => (
      <div style={{ transform: "translateY(-18px)" }}>
        <DotLottieWC
          src="https://lottie.host/c7d0d300-084f-4c4a-a11e-c558a4905f71/r8QNFYcARL.lottie"
          style={{ width: "130px", height: "130px" }}
          autoplay
          loop
        />
      </div>
    ),
  },
  {
    id: "02",
    title: "Consult with doctor",
    icon: () => (
      <DotLottieWC
        src="https://lottie.host/2c669a53-7e4f-4b24-8fcb-ed3830471bf3/0m0Al1PXP4.lottie"
        style={{ width: "220px", height: "220px" }}
        autoplay
        loop
      />
    ),
  },
  {
    id: "03",
    title: "Recieve your priscption",
    icon: () => (
      <DotLottieWC
        src="https://lottie.host/c0935007-58e3-45e2-af17-c898ef07b002/m7BvS6VlNw.lottie"
        style={{ width: "220px", height: "220px" }}
        autoplay
        loop
      />
    ),
  },
];

// Common Conditions for Doctor Consultation with Icon Cards
const COMMON_CONDITIONS = [
  {
    number: "01",
    title: "Fever",
    description: "A high body temperature is a sign of infection, and a certificate confirms you need to rest and recover.",
    svg: "/svg/fever-male-svgrepo-com.svg",
    tint: "from-rose-100 via-orange-50 to-white",
  },
  {
    number: "02",
    title: "Cold",
    description: "Symptoms like a cough and sore throat can make it hard to work, and a certificate also helps prevent spreading the illness.",
    svg: "/svg/cold-coughing-svgrepo-com.svg",
    tint: "from-sky-100 via-cyan-50 to-white",
  },
  {
    number: "03",
    title: "Stomach Ache",
    description: "This can be due to a stomach virus or food poisoning, and a certificate confirms the need for rest.",
    svg: "/svg/stomach-ache-svgrepo-com.svg",
    tint: "from-amber-100 via-yellow-50 to-white",
  },
  {
    number: "04",
    title: "Periods",
    description: "Severe cramps and other symptoms can be debilitating, and a certificate validates the need for time off to manage the pain.",
    svg: "/svg/femaleHealth(periods)-svgrepo-com.svg",
    tint: "from-pink-100 via-rose-50 to-white",
  },
  {
    number: "05",
    title: "Back Pain",
    description: "This can limit your ability to sit or move, and a certificate explains the physical restrictions you have.",
    svg: "/svg/back-pain-svgrepo-com.svg",
    tint: "from-emerald-100 via-teal-50 to-white",
  },
  {
    number: "06",
    title: "Injury",
    description: "For a sprain or wound, a certificate documents the injury and the necessary time for healing.",
    svg: "/svg/Injury-svgrepo-com.svg",
    tint: "from-indigo-100 via-blue-50 to-white",
  },
  {
    number: "07",
    title: "Stress",
    description: "High stress can cause physical and mental symptoms, and a certificate can justify a leave to prevent burnout.",
    svg: "/svg/stress-svgrepo-com.svg",
    tint: "from-violet-100 via-purple-50 to-white",
  },
  {
    number: "08",
    title: "Migraine",
    description: "A migraine is more than a headache; a certificate confirms a severe attack that makes it impossible to work or study.",
    svg: "/svg/Migraine -svgrepo-com.svg",
    tint: "from-fuchsia-100 via-pink-50 to-white",
  },
  {
    number: "09",
    title: "Dengue, Malaria, etc",
    description: "A blood test report is required to confirm the diagnosis, as symptoms alone aren't enough.",
    svg: "/svg/Dengue-Malaria-svgrepo-com.svg",
    tint: "from-lime-100 via-green-50 to-white",
  },
  {
    number: "10",
    title: "Fracture",
    description: "An X-ray report is required to prove the injury and determine the recovery time.",
    svg: "/svg/Fracture-svgrepo-com.svg",
    tint: "from-teal-100 via-cyan-50 to-white",
  },
  {
    number: "11",
    title: "Chicken Pox",
    description: "While a visual diagnosis is made, the certificate often confirms that the patient is no longer contagious, based on the doctor's observation of the blisters.",
    svg: "/svg/ChickenPox-svgrepo-com.svg",
    tint: "from-red-100 via-orange-50 to-white",
  },
  {
    number: "12",
    title: "Any Surgery",
    description: "When it comes to any surgery, a medical certificate is crucial for justifying a prolonged absence from work or school. The key document is the hospital discharge summary.",
    svg: "/svg/surgery-svgrepo-com.svg",
    tint: "from-blue-100 via-indigo-50 to-white",
  },
];

const CONSULTATION_SPECIALTIES: Array<{
  title: string;
  price: string;
  svg: string;
}> = [
  {
    title: "Sexology",
    price: "Rs 499",
    svg: "/svg/medical-svgs/1-skin-hair.svg",
  },
  {
    title: "General physician",
    price: "Rs 399",
    svg: "/svg/medical-svgs/2-brain-mental.svg",
  },
  {
    title: "Dermatology",
    price: "Rs 449",
    svg: "/svg/medical-svgs/3-stomach-digestive.svg",
  },
  {
    title: "Psychiatry",
    price: "Rs 499",
    svg: "/svg/medical-svgs/4-pediatrics-child.svg",
  },
  {
    title: "Stomach and digestion",
    price: "Rs 399",
    svg: "/svg/medical-svgs/5-bone-orthopedic.svg",
  },
  {
    title: "Pediatrics",
    price: "Rs 499",
    svg: "/svg/medical-svgs/6-eye-vision.svg",
  },
];

export default function DoctorConsultationPage() {
  const [specialtyStart, setSpecialtyStart] = useState(0);
  const visibleSpecialties = CONSULTATION_SPECIALTIES.slice(
    specialtyStart,
    specialtyStart + 6
  );

  const shiftSpecialties = (direction: "prev" | "next") => {
    const maxStart = Math.max(CONSULTATION_SPECIALTIES.length - 6, 0);
    setSpecialtyStart((current) => {
      if (direction === "next") {
        return current >= maxStart ? 0 : current + 1;
      }

      return current <= 0 ? maxStart : current - 1;
    });
  };

  return (
    <>
      <Script
        src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.3/dist/dotlottie-wc.js"
        type="module"
        strategy="afterInteractive"
      />

      <HeroSection
        headingPrefix="Online Doctor"
        headingHighlight="Consultation"
        typewriterPrefix="For"
        rotatingWords={DOCTOR_CONSULTATION_TOPICS}
        trustBadges={[
          "General health concerns",
          "Fever, cold, and cough",
          "Women's health issues",
          "Headache or body pain",
          "Stomach and digestion problems",
          "Skin and allergy issues",
          "Medical certificate consultation",
          "Follow-up medical advice",
          "Minor infections",
          "Stress, sleep, or fatigue issues",
          "Diet and nutrition advice",
          "Medication guidance or prescription clarification",
          "Cold, flu, or seasonal illness symptoms",
          "Basic health check advice",
        ]}
        primaryCta={{
          label: "Book consultation",
          href: "/certificates/apply",
        }}
        secondaryCta={{
          label: "Talk to Support",
          href: "/contact",
        }}
        usePrimaryIconTheme
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
            
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight mb-4">
                Online Doctor Consultation
                <span className="text-primary"> Simple. Fast. Reliable.</span>
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-7 max-w-2xl">
                Consult a Doctor Online from Anywhere, Anytime
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
                  Consult Now
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
                    Complete online process - From consultation to Certificate Delivery 
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 absolute -top-5 -right-4 bg-card rounded-full px-4 py-2.5 shadow-lg border border-border">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Quick Delivery: 30 to 60 mins</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 absolute -bottom-4 -left-3 bg-primary text-primary-foreground rounded-full px-4 py-2.5 shadow-lg">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-semibold">Doctor verified: reviewed and approved by NMC registered doctors</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      
      <section className="relative overflow-hidden bg-primary/40 py-16 sm:py-20">
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 lg:mb-12 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                25+ Specialities
              </h2>
              <p className="mt-2 text-base text-muted-foreground sm:text-lg">
                Consult with top doctors across specialities
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-zinc-50 sm:self-start"
            >
              See all Specialities
            </Link>
          </div>

          <div className="relative">
            <button
              type="button"
              aria-label="Previous specialties"
              onClick={() => shiftSpecialties("prev")}
              className="absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 shadow-md transition hover:text-foreground lg:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Next specialties"
              onClick={() => shiftSpecialties("next")}
              className="absolute right-0 top-1/2 z-20 hidden h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 shadow-md transition hover:text-foreground lg:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
              {visibleSpecialties.map((specialty, index) => {
                return (
                  <motion.div
                    key={`${specialty.title}-${specialtyStart}`}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="group rounded-md border border-zinc-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div
                      className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-[#d8dfef]"
                    >
                      <Image
                        src={specialty.svg}
                        alt={specialty.title}
                        width={76}
                        height={76}
                        className="h-[4.5rem] w-[4.5rem] object-contain"
                      />
                    </div>

                    <h3 className="min-h-[56px] text-[1.05rem] font-bold leading-tight text-foreground">
                      {specialty.title}
                    </h3>

                    <p className="mt-3 text-base font-medium text-muted-foreground">
                      {specialty.price}
                    </p>

                    <Link
                      href="/certificates/apply"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-500 transition-colors hover:text-sky-600"
                    >
                      Consult now
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => shiftSpecialties("prev")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 shadow-sm transition hover:text-foreground"
                aria-label="Previous specialties"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => shiftSpecialties("next")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 shadow-sm transition hover:text-foreground"
                aria-label="Next specialties"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Three-step process section */}
      {/* <section className="relative overflow-hidden bg-primary/40 py-20">
        <div
          className="absolute left-0 right-0 -bottom-6 h-6 bg-muted/20"
          style={{
            clipPath:
              "polygon(0 100%, 4% 0, 8% 100%, 12% 0, 16% 100%, 20% 0, 24% 100%, 28% 0, 32% 100%, 36% 0, 40% 100%, 44% 0, 48% 100%, 52% 0, 56% 100%, 60% 0, 64% 100%, 68% 0, 72% 100%, 76% 0, 80% 100%, 84% 0, 88% 100%, 92% 0, 96% 100%, 100% 0, 100% 100%)",
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Three Easy Steps To Get Your <span className="text-primary">Medical Priscption</span>
            </h2>
          </div>

          <div className="relative mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-7 md:grid-cols-3 md:gap-8">
              {CONSULTATION_STEPS.map((step, index) => {
                const StepIcon = step.icon;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    {index < CONSULTATION_STEPS.length - 1 && (
                      <div className="pointer-events-none absolute -right-10 top-12 z-0 hidden h-0.5 w-20 border-t-2 border-dashed border-primary/35 md:block" />
                    )}

                    <div className="relative z-10 min-h-[320px] overflow-hidden rounded-[22px] border border-green-400/20 bg-green-400/40 px-6 pb-8 pt-48 text-center shadow-[0_10px_24px_rgba(0,0,0,0.09)]">
                      <div className="pointer-events-none absolute left-1/2 top-0 flex h-48 w-[90%] -translate-x-1/2 items-end justify-center overflow-hidden rounded-b-[130px] bg-card pb-2" />

                      <div className="absolute left-1/2 top-10 z-10 flex h-40 w-40 -translate-x-1/2 items-center justify-center overflow-hidden text-primary">
                        <StepIcon />
                      </div>

                      <p className="mb-2 text-4xl font-extrabold text-primary">{step.id}</p>
                      <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section> */}

      {/* Common Conditions for a Medical Certificate Section */}
      <section className="relative py-20 bg-linear-to-b from-background via-primary/5 to-background overflow-hidden">
          {/* Top ZigZak Border */}
        <div
          className="absolute left-0 right-0 -top-1 h-8 bg-primary/40"
          style={{
            clipPath:
              "polygon(0 0, 4% 100%, 8% 0, 12% 100%, 16% 0, 20% 100%, 24% 0, 28% 100%, 32% 0, 36% 100%, 40% 0, 44% 100%, 48% 0, 52% 100%, 56% 0, 60% 100%, 64% 0, 68% 100%, 72% 0, 76% 100%, 80% 0, 84% 100%, 88% 0, 92% 100%, 96% 0, 100% 100%, 100% 0)",
          }}
        />
        <div className="pointer-events-none absolute -top-24 -left-12 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3 leading-tight">
              Common Conditions for a <span className="text-primary">Medical Certificate</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Our doctors provide expert consultation for a wide range of health conditions
            </p>
          </div>

          {/* Common Conditions Grid */}
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
              {COMMON_CONDITIONS.map((condition, index) => {
                return (
                  <motion.div
                    key={condition.number}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.35 }}
                    viewport={{ once: true }}
                    className="group relative overflow-hidden rounded-[26px] border border-primary/15 bg-white/90 p-5 sm:p-6 text-center shadow-[0_8px_26px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(15,23,42,0.16)] hover:border-primary/35"
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/8 to-transparent" />

                    <div className="absolute top-3 right-3 flex h-8 min-w-8 items-center justify-center rounded-full bg-primary text-primary-foreground px-2 text-[11px] font-extrabold tracking-wide shadow-md">
                      {condition.number}
                    </div>

                    <div className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border border-primary/15 bg-gradient-to-br ${condition.tint} shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-transform duration-300 group-hover:scale-105`}>
                      <Image
                        src={condition.svg}
                        alt={condition.title}
                        width={56}
                        height={56}
                        className="h-14 w-14 object-contain"
                      />
                    </div>

                    <h3 className="text-lg sm:text-[1.15rem] font-extrabold text-foreground mb-2 leading-tight">
                      {condition.title}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed min-h-[88px]">
                      {condition.description}
                    </p>

                    <div className="mt-4 h-1.5 w-14 mx-auto rounded-full bg-linear-to-r from-primary/70 via-primary/30 to-transparent opacity-80 group-hover:w-20 transition-all duration-300" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />


      <CTASection
        title="Connect With a Licensed Doctor Online"
        description="Book a guided online consultation, speak to a registered doctor, and move ahead with the right next step from home."
        buttonPrimary={{
          label: "Start consultation",
          href: "/certificates/apply",
        }}
      />
    </>
  );
}
