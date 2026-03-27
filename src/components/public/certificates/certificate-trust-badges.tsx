'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Award, CheckCircle, Verified, FileBadge } from 'lucide-react';

/**
 * Trust & Security Badges Component
 * 
 * Based on research, trust badges are critical for healthcare services:
 * - Doctor registration verification
 * - Privacy/security compliance
 * - Legal compliance (Telemedicine Act)
 * - Certificate verification capability
 */

const trustBadges = [
  {
    icon: ShieldCheck,
    title: 'NMC Registered Doctors',
    description: 'All certificates are issued by doctors registered with National Medical Commission',
    color: 'teal',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected as per data privacy guidelines',
    color: 'blue',
  },
  {
    icon: Award,
    title: 'ABDM Compliant',
    description: 'Ayushman Bharat Digital Mission compliant platform',
    color: 'emerald',
  },
  {
    icon: CheckCircle,
    title: 'Telemedicine Act 2019',
    description: 'Fully compliant with Indian telemedicine regulations',
    color: 'violet',
  },
  {
    icon: Verified,
    title: 'Certificate Verification',
    description: 'Every certificate can be verified by employers/institutions',
    color: 'amber',
  },
  {
    icon: FileBadge,
    title: 'Legally Valid',
    description: 'Accepted by employers, colleges, banks, and government offices',
    color: 'cyan',
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    text: 'text-teal-600',
    iconBg: 'bg-teal-100',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    text: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    text: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
  },
  violet: {
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    text: 'text-violet-600',
    iconBg: 'bg-violet-100',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    text: 'text-amber-600',
    iconBg: 'bg-amber-100',
  },
  cyan: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
    text: 'text-cyan-600',
    iconBg: 'bg-cyan-100',
  },
};

export function CertificateTrustBadges() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <ShieldCheck className="w-4 h-4" />
            Trust & Security
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Trust MediProofDocs?
          </h2>
          <p className="text-lg text-gray-600">
            We prioritize your trust and security in every certificate we issue
          </p>
        </motion.div>

        {/* Trust Badges Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustBadges.map((badge, index) => {
            const colors = colorClasses[badge.color];
            const Icon = badge.icon;

            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className={`${colors.bg} ${colors.border} border rounded-2xl p-6 h-full hover:shadow-lg transition-shadow`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {badge.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Verification CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 lg:p-8 text-center"
        >
          <h3 className="text-xl font-bold text-white mb-3">
            Verify Any Certificate
          </h3>
          <p className="text-gray-300 text-sm mb-6 max-w-xl mx-auto">
            Employers and institutions can verify the authenticity of any certificate by contacting the doctor or using our online verification system.
          </p>
          <a
            href="/verify-certificate"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Verify a Certificate
          </a>
        </motion.div>
      </div>
    </section>
  );
}
