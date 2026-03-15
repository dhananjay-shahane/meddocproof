"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, Zap } from "lucide-react";

const TRUST_STEPS = [
  {
    icon: ShieldCheck,
    title: "Data Privacy and Protection",
    text: "We respect your privacy and treat your personal and medical details with care. All information is securely handled and used only for doctor consultation and issuing your medical certificate. Our system is built to protect your details at every step.",
  },
  {
    icon: BadgeCheck,
    title: "Genuine And Verified Certificates",
    text: "Medical certificates are provided only after consultation with a registered Indian medical practitioner. Each certificate carries the doctor's name and registration number, ensuring it is genuine and acceptable for official and professional use across India.",
  },
  {
    icon: Zap,
    title: "Easy And Convenient Process",
    text: "Our online service is designed to be simple and easy to use. You can submit your request, speak with a doctor, and receive your medical certificate smoothly, without delays or complicated steps.",
  },
];

export function TrustSection() {
  return (
    <section className="px-4 py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
          Why Trust Us?
        </h2>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_STEPS.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mb-5 shadow-lg">
                <step.icon className="w-9 h-9 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
