'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Globe, Headphones } from 'lucide-react';

/**
 * Certificate Benefits Component
 */

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Doctor Verified',
    description: 'All certificates are issued by registered MBBS doctors after proper medical consultation.',
    color: 'teal',
  },
  {
    icon: Clock,
    title: 'Quick Delivery',
    description: 'Receive your certificate within 30-90 minutes after doctor consultation.',
    color: 'emerald',
  },
  {
    icon: Globe,
    title: 'Valid Nationwide',
    description: 'Our certificates are accepted by employers, schools, and institutions across India.',
    color: 'cyan',
  },
  {
    icon: Headphones,
    title: '24/7 Availability',
    description: 'Get your medical certificate anytime, day or night, including weekends and holidays.',
    color: 'violet',
  },
];

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  teal: {
    bg: 'bg-teal-50',
    text: 'text-teal-600',
    border: 'border-teal-100',
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
  },
  cyan: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    border: 'border-cyan-100',
  },
  violet: {
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    border: 'border-violet-100',
  },
};

interface CertificateBenefitsProps {
  features?: string[];
}

export function CertificateBenefits({ features }: CertificateBenefitsProps) {
  const displayBenefits = features && features.length > 0
    ? benefits.slice(0, 4).map((b, i) => ({
        ...b,
        description: features[i] || b.description,
      }))
    : benefits;

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Service?
          </h2>
          <p className="text-lg text-gray-600">
            Trusted by thousands for fast, reliable medical certificates
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayBenefits.map((benefit, index) => {
            const colors = colorClasses[benefit.color];
            const Icon = benefit.icon;
            
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow h-full">
                  <div className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${colors.text}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
