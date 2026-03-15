"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, type Variants, AnimatePresence } from "framer-motion";

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

const certificates = [
  {
    key: "SICK_LEAVE",
    title: "Sick Leave Certificate",
    description: "When health issues prevent you from attending work, school, or college, a Sick Leave Medical Certificate provides official medical confirmation of your condition.",
    svgSrc: "/svg/Certificatesvg/Sickleave-svgrepo-com.svg",
    href: "/certificates/apply?type=sick-leave",
  },
  {
    key: "FITNESS",
    title: "Medical Fitness Certificate",
    description: "A Medical Fitness Certificate is often required before starting a job, academic program, sports activity, or travel plan. Our doctors review your health details and issue a fitness certificate.",
    svgSrc: "/svg/Certificatesvg/MedicalFitness-svgrepo-com.svg",
    href: "/certificates/apply?type=fitness",
  },
  {
    key: "FIT_TO_FLY",
    title: "Fit-to-Fly Certificate",
    description: "A Fit-to-Fly Medical Certificate confirms that an individual is medically safe to travel by air. Accepted by airlines, travel authorities, and immigration officials.",
    svgSrc: "/svg/Certificatesvg/FittoFly-svgrepo-com.svg",
    href: "/certificates/apply?type=fit-to-fly",
  },
  {
    key: "CARETAKER",
    title: "Caretaker Certificate",
    description: "When a family member requires medical care, a Caretaker Medical Certificate confirms the need for your presence as a caregiver during their recovery.",
    svgSrc: "/svg/Certificatesvg/caretaker-svgrepo-com.svg",
    href: "/certificates/apply?type=caretaker",
  },
  {
    key: "WORK_FROM_HOME",
    title: "Work From Home Certificate",
    description: "Certain medical conditions may allow you to work but make office attendance difficult. A Work from Home Medical Certificate supports remote working arrangements based on medical advice.",
    svgSrc: "/svg/Certificatesvg/WorkfromHome-svgrepo-com.svg",
    href: "/certificates/apply?type=work-from-home",
  },
  {
    key: "RECOVERY",
    title: "Recovery Certificate",
    description: "A Recovery Medical Certificate confirms that an individual has recovered from a medical condition and is fit to resume regular activities such as work, studies, or travel.",
    svgSrc: "/svg/Certificatesvg/Recovery-svgrepo-com.svg",
    href: "/certificates/apply?type=recovery",
  },
  {
    key: "UNFIT_TO_WORK",
    title: "Unfit to Work Certificate",
    description: "When illness or injury affects your ability to perform work duties safely, an Unfit To Work Medical Certificate provides clear medical documentation of your condition.",
    svgSrc: "/svg/Certificatesvg/Unfitforwork-svgrepo-com.svg",
    href: "/certificates/apply?type=unfit-to-work",
  },
  {
    key: "UNFIT_TO_TRAVEL",
    title: "Unfit to Travel Certificate",
    description: "Medical conditions or recovery phases may make travel unsafe or inadvisable. An Unfit To Travel Medical Certificate formally states that travel should be avoided for a defined duration.",
    svgSrc: "/svg/Certificatesvg/Unfitfortravel-svgrepo-com.svg",
    href: "/certificates/apply?type=unfit-to-travel",
  },
  {
    key: "MEDICAL_DIAGNOSIS",
    title: "Medical Diagnosis Certificate",
    description: "A Medical Diagnosis Certificate serves as official documentation of a diagnosed medical condition for insurance or workplace records. Provides verified medical information.",
    svgSrc: "/svg/Certificatesvg/DagnosisRecord-svgrepo-com.svg",
    href: "/certificates/apply?type=medical-diagnosis",
  },
];

export function CertificateTypesSection() {
  return (
    <section id="certificates" className="relative overflow-hidden bg-slate-50 py-24 lg:py-32">

      {/* Modern Background Decorations */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Gradient Orbs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5 }}
        className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-primary/20 to-blue-400/20 blur-[120px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="pointer-events-none absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-cyan-400/20 to-primary/20 blur-[120px]"
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center lg:mb-20"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Our Services
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Types of Certificates{" "}
            <span className="text-primary">We Offer</span>
          </h2>

          <p className="mt-4 text-base leading-relaxed text-slate-600 lg:text-lg">
            Professionally issued medical documents by registered practitioners,
            tailored to your specific needs.
          </p>
        </motion.div>

        {/* Certificate Grid with Stagger Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {certificates.map((cert, index) => (
            <CertificateCard 
              key={cert.key} 
              certificate={cert} 
              isMiddle={index === 1 || index === 4 || index === 7}
            />
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 text-center lg:mt-20"
        >
          <Link
            href="/certificates"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
          >
            Explore All Formats
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Service Card Component matching the design image with hover animation
function CertificateCard({ 
  certificate, 
  isMiddle
}: { 
  certificate: typeof certificates[0];
  isMiddle: boolean;
}) {
  const { title, description, svgSrc, href } = certificate;
  const [isHovered, setIsHovered] = useState(false);
  
  // Card is active (blue) if it's the middle card OR if it's being hovered
  const isActive = isMiddle || isHovered;

  return (
    <motion.div 
      variants={cardVariants}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href} className="block h-full">
        <div 
          className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border-b-4 border-b-primary bg-white shadow-lg"
        >
          {/* Animated Blue Background - slides up from bottom */}
          <motion.div
            className="absolute inset-0 bg-primary"
            initial={isMiddle ? { y: 0 } : { y: "100%" }}
            animate={{ 
              y: isActive ? 0 : "100%"
            }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15,
              duration: 0.4
            }}
          />

          {/* Card Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center p-6 pt-8 text-center">
            
            {/* Icon in Circle - White circle on blue card, icon keeps original color */}
            <motion.div 
              className={`
                mb-5 flex h-20 w-20 items-center justify-center rounded-full 
                transition-all duration-300
                ${isActive 
                  ? 'bg-white shadow-lg' 
                  : 'bg-primary/10 ring-2 ring-primary/20'
                }
              `}
              animate={{
                scale: isHovered ? 1.05 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={svgSrc}
                alt={title}
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
              />
            </motion.div>

            {/* Title */}
            <h3 
              className={`
                mb-3 text-lg font-bold transition-colors duration-300
                ${isActive ? 'text-white' : 'text-gray-900'}
              `}
            >
              {title}
            </h3>

            {/* Description */}
            <p 
              className={`
                mb-6 flex-1 text-sm leading-relaxed transition-colors duration-300
                ${isActive ? 'text-white/90' : 'text-gray-600'}
              `}
            >
              {description}
            </p>

            {/* Apply Button */}
            <motion.div
              className={`
                inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 
                text-sm font-semibold transition-all duration-300
                ${isActive 
                  ? 'bg-white text-primary hover:bg-white/90' 
                  : 'bg-primary text-white hover:bg-primary/90'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Apply Now
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>

          {/* Bottom Gradient Bar */}
          <div 
            className={`
              relative z-10 h-1 w-full bg-gradient-to-r transition-all duration-300
              ${isActive 
                ? 'from-blue-300 via-blue-400 to-blue-300' 
                : 'from-primary via-blue-500 to-primary'
              }
            `}
          />
        </div>
      </Link>
    </motion.div>
  );
}
