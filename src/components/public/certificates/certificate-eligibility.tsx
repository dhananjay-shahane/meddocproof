'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  FileCheck,
  Building2,
  GraduationCap,
  School,
  Landmark,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface CertificateEligibilityProps {
  slug: string;
  certTitle: string;
}

const acceptedBy = [
  { icon: Building2, label: 'Private & Government Employers' },
  { icon: GraduationCap, label: 'Colleges & Universities' },
  { icon: School, label: 'Schools & Institutions' },
  { icon: Landmark, label: 'Banks & Finance' },
];

const validityPoints = [
  'Issued as per NMC & WHO telemedicine guidelines',
  'Includes doctor name, registration number & signature',
  'Accepted by employers, colleges & institutions nationwide',
  'Duration determined by licensed doctor after consultation',
];

export function CertificateEligibility({ slug, certTitle }: CertificateEligibilityProps) {
  const whoCanApply = [
    `Working professionals & employees needing a valid ${certTitle}`,
    'Students requiring medical leave from college, university, or school',
    'Self-employed individuals needing official proof of illness',
    'Anyone requiring legally accepted online medical documentation',
  ];

  const requirements = [
    'Valid government-issued ID (Aadhaar / PAN / Passport)',
    'Personal details: full name, date of birth, contact number',
    'Description of symptoms or medical condition',
    'Required leave start date and duration',
  ];
  return (
    <section className="py-16 lg:py-24 bg-section-light-blue">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-theme-cyan-border text-theme-primary px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-sm">
            <FileCheck className="w-4 h-4 text-theme-cyan" />
            Eligibility & Requirements
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Who Can Apply for a{' '}
            <span className="text-theme-cyan">{certTitle}</span>?
          </h2>
          <p className="text-lg text-gray-600">
            Requirements to get a valid online {certTitle} from a registered doctor — fast, secure &
            NMC-compliant.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Who Can Apply */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-theme-cyan-light flex items-center justify-center">
                  <Users className="w-4 h-4 text-theme-cyan" />
                </div>
                Who Can Apply
              </h3>
              <ul className="space-y-3">
                {whoCanApply.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-theme-cyan shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Documents Required */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-theme-primary" />
                </div>
                Documents Required
              </h3>
              <ul className="space-y-3">
                {requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-theme-primary shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Accepted By */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-5">Accepted By</h3>
              <div className="grid grid-cols-2 gap-3">
                {acceptedBy.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-section-light-blue rounded-xl border border-theme-cyan-border"
                    >
                      <div className="w-10 h-10 bg-theme-cyan-light rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-theme-cyan" />
                      </div>
                      <span className="text-sm text-gray-700 font-medium leading-tight">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Certificate Validity — gradient card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl p-6 lg:p-8 text-white"
              style={{ background: 'linear-gradient(135deg, #0d2f85 0%, #1fb8c9 100%)' }}
            >
              <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-white/80" />
                Certificate Validity
              </h3>
              <ul className="space-y-3">
                {validityPoints.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
                    <span className="text-white/90 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 bg-white rounded-2xl border border-theme-cyan-border p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="font-semibold text-gray-900 text-lg">Ready to apply for your {certTitle}?</p>
            <p className="text-sm text-gray-500 mt-1">
              Online doctor consultation • NMC-compliant • Digital delivery in 30–60 minutes
            </p>
          </div>
          <Link
            href="/certificates/apply"
            className="shrink-0 inline-flex items-center justify-center gap-2 text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 hover:opacity-90"
            style={{ background: 'linear-gradient(90deg, #0d2f85, #1fb8c9)' }}
          >
            Apply Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}