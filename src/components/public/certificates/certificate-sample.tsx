'use client';

import { motion } from 'framer-motion';
import { Shield, CheckCircle, User, Calendar, Stethoscope, BadgeCheck } from 'lucide-react';

/**
 * Certificate Sample Component
 *
 * Shows what the certificate looks like with key features
 */

interface CertificateSampleProps {
  slug?: string;
  title?: string;
}

const features = [
  { icon: Shield, text: 'Official letterhead with doctor registration' },
  { icon: CheckCircle, text: 'Digital signature and medical stamp' },
  { icon: User, text: 'Patient details and medical information' },
  { icon: Calendar, text: 'Issue date and validity period' },
  { icon: Stethoscope, text: 'Doctor contact and verification details' },
];

export function CertificateSample({ slug, title }: CertificateSampleProps) {
  const certificateTitle = title || 'Medical Certificate';

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: Heading & Description */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-lg"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-teal-600 mb-4">
              <BadgeCheck className="w-4 h-4" />
              Certificate Format
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-snug mb-5">
              What Your Certificate{' '}
              <span className="text-teal-600">Will Look Like</span>
            </h2>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              Every certificate we issue follows{' '}
              <strong className="text-gray-800 font-semibold">official medical documentation standards</strong>{' '}
              and includes all necessary verification details — making it{' '}
              <strong className="text-gray-800 font-semibold">legally valid</strong> and accepted nationwide.
            </p>
          </motion.div>

          {/* Right: Card with Features + Trust Badge */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/60 p-7 lg:p-8"
          >
            {/* Features List */}
            <ul className="space-y-4 mb-6">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.07 }}
                  className="group flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:bg-teal-100 group-hover:scale-105 group-hover:shadow-sm">
                    <feature.icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="text-sm lg:text-base text-gray-700 font-medium leading-snug group-hover:text-teal-700 transition-colors duration-200">
                    {feature.text}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-5">
              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 tracking-wide"
              >
                <Shield className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                Doctor Verified &bull; Legally Valid &bull; Instant Delivery
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
