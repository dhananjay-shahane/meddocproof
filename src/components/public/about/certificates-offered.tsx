"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { ALL_CERTIFICATE_TYPES } from "@/lib/certificate-types";

// Map certificate slugs to SVG icons
const CERTIFICATE_ICONS: Record<string, string> = {
  "sick-leave": "/svg/CertificatesIcons/SickLeavecertificatesvg.svg",
  "work-from-home": "/svg/CertificatesIcons/WorkfromHomecertificate.svg",
  "caretaker": "/svg/CertificatesIcons/CareTakerCertificate.svg",
  "recovery": "/svg/CertificatesIcons/Recoverycertificate.svg",
  "fitness": "/svg/CertificatesIcons/MedicalFitnessCertificate.svg",
  "fit-to-fly": "/svg/CertificatesIcons/FittoFly.svg",
  "unfit-to-work": "/svg/CertificatesIcons/Unfit%20to%20WorkCertificate.svg",
  "unfit-to-travel": "/svg/CertificatesIcons/UnfittiTravel.svg",
  "medical-diagnosis": "/svg/CertificatesIcons/DiagnosisCertificate.svg",
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

export function CertificatesOffered() {
  return (
    <section className="px-4 py-16 bg-white">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-2xl font-extrabold text-gray-900"
        >
          Medical Certificates We Offer
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground"
        >
          We provide a wide range of <strong>verified medical certificates</strong> for various purposes including work, education, and travel.
        </motion.p>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ALL_CERTIFICATE_TYPES.map((cert) => (
            <motion.div
              key={cert.slug}
              variants={cardVariants}
              whileHover={{
                scale: 1.03,
                y: -4,
                boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.15)",
              }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 cursor-pointer transition-colors hover:border-primary/40"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                transition={{ duration: 0.5 }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-2"
              >
                <Image
                  src={CERTIFICATE_ICONS[cert.slug] || "/svg/CertificatesIcons/MedicalFitnessCertificate.svg"}
                  alt={cert.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
              </motion.div>
              <span className="text-sm font-semibold text-gray-800">{cert.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
