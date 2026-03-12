"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  FileBadge,
  HeartPulse,
  PlaneTakeoff,
  HandHeart,
  Laptop,
  ShieldCheck,
  FileX,
  CircleSlash,
  ScanLine,
  Check,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

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
    description: "Official medical confirmation for work, school, or college.",
    features: ["Employer accepted", "24-48hr delivery", "Doctor verified", "Digital & print"],
    icon: FileBadge,
    category: "Professional",
    href: "/certificates/apply?type=sick-leave",
  },
  {
    key: "FITNESS",
    title: "Medical Fitness Certificate",
    description: "Required for job joining, academic programs, or sports.",
    features: ["Thorough evaluation", "Pan-India valid", "Quick processing", "Official format"],
    icon: HeartPulse,
    category: "Health",
    href: "/certificates/apply?type=fitness",
  },
  {
    key: "FIT_TO_FLY",
    title: "Fit-to-Fly Certificate",
    description: "Safe travel confirmation for airlines and international travel.",
    features: ["Airline accepted", "Immigration valid", "Quick consultation", "Travel ready"],
    icon: PlaneTakeoff,
    category: "Travel",
    href: "/certificates/apply?type=fit-to-fly",
  },
  {
    key: "CARETAKER",
    title: "Caretaker Certificate",
    description: "Supports leave requests for family caregiving duties.",
    features: ["Leave support", "Family care proof", "HR accepted", "Quick issuance"],
    icon: HandHeart,
    category: "Family",
    href: "/certificates/apply?type=caretaker",
  },
  {
    key: "WORK_FROM_HOME",
    title: "Work From Home Certificate",
    description: "Medical recommendation for remote work arrangements.",
    features: ["WFH support", "Health based", "Employer valid", "Flexible period"],
    icon: Laptop,
    category: "Employment",
    href: "/certificates/apply?type=work-from-home",
  },
  {
    key: "RECOVERY",
    title: "Recovery Certificate",
    description: "Confirms recovery and fitness to resume activities.",
    features: ["Fitness clearance", "Return to work", "Health verified", "Official stamp"],
    icon: ShieldCheck,
    category: "Health",
    href: "/certificates/apply?type=recovery",
  },
  {
    key: "UNFIT_TO_WORK",
    title: "Unfit to Work",
    description: "Medical documentation when illness prevents work.",
    features: ["Work exemption", "Medical proof", "Legal validity", "Dated record"],
    icon: FileX,
    category: "Medical",
    href: "/certificates/apply?type=unfit-to-work",
  },
  {
    key: "UNFIT_TO_TRAVEL",
    title: "Unfit to Travel",
    description: "Documentation for travel postponements due to health.",
    features: ["Travel exemption", "Refund support", "Insurance valid", "Medical basis"],
    icon: CircleSlash,
    category: "Travel",
    href: "/certificates/apply?type=unfit-to-travel",
  },
  {
    key: "MEDICAL_DIAGNOSIS",
    title: "Diagnosis Record",
    description: "Official record of medical assessment and findings.",
    features: ["Clinical findings", "Official record", "Insurance ready", "Detailed report"],
    icon: ScanLine,
    category: "Record",
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
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6"
        >
          {certificates.map((cert) => (
            <CertificateCard key={cert.key} certificate={cert} />
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

// Modern Split Card Component - Left light colored section, Right white section
function CertificateCard({ certificate }: { certificate: typeof certificates[0] }) {
  const { title, description, features, icon: Icon, category, href } = certificate;

  return (
    <motion.div 
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link href={href} className="group block h-full">
        <div className="relative h-full overflow-hidden rounded-3xl shadow-lg shadow-primary/10 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/25">
          
          {/* Split Layout Container */}
          <div className="flex h-full">
            
            {/* Left Light Primary Section */}
            <div className="relative flex w-1/3 flex-col items-center justify-between bg-primary/10 p-4">
              {/* Background decoration */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_60%)]" />
              
              {/* Top Badge */}
              <motion.div 
                className="relative z-10 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {category}
              </motion.div>

              {/* Center Icon - No circle, larger size */}
              <motion.div 
                className="relative z-10 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
              >
                <Icon className="h-28 w-28 text-primary" strokeWidth={0.75} />
              </motion.div>

              {/* Bottom Info */}
              <motion.div 
                className="relative z-10 text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-[10px] font-medium uppercase tracking-wider text-primary/60">Verified</div>
                <div className="text-xs font-bold text-primary">Doctor Signed</div>
              </motion.div>
            </div>

            {/* Right White Section */}
            <div className="flex flex-1 flex-col bg-white p-5">
              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-primary">
                {title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {description}
              </p>

              {/* Feature Points */}
              <ul className="mt-4 flex-1 space-y-1.5">
                {features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex items-center gap-2 text-xs text-gray-600"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-2.5 w-2.5 text-primary" strokeWidth={3} />
                    </span>
                    {feature}
                  </motion.li>
                ))}
              </ul>

              {/* Bottom Button */}
              <motion.div 
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/20 transition-all duration-300 group-hover:gap-3 group-hover:shadow-lg"
                whileHover={{ scale: 1.03 }}
              >
                Get Certificate
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </motion.div>

              {/* Hover info text */}
              <p className="mt-2 text-center text-[10px] text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Click for more info
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
