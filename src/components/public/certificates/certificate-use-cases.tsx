'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, School, Landmark, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CertificateUseCasesProps {
  slug: string;
  certTitle: string;
}

const useCases = [
  {
    icon: Building2,
    title: 'Office / Company',
    subtitle: 'For Working Professionals',
    description:
      'Most corporate policies require medical documentation to approve sick leave, protect pay continuity, and update HR records. A valid online medical certificate is the fastest way to comply.',
    color: 'cyan',
    scenarios: [
      'Casual sick leave (1–3 days)',
      'Extended illness recovery',
      'Medical emergency leave',
      'Post-surgery rest period',
    ],
  },
  {
    icon: GraduationCap,
    title: 'College / University',
    subtitle: 'For Students & Scholars',
    description:
      'Universities require documented proof of illness for attendance exemptions, exam deferrals, and leave of absence approvals from the academic department.',
    color: 'primary',
    scenarios: [
      'Semester medical leave',
      'Exam absence due to illness',
      'Internship medical break',
      'Hostel leave with documentation',
    ],
  },
  {
    icon: School,
    title: 'School',
    subtitle: 'For Students & Parents',
    description:
      'Schools require medical certificates for extended or repeated absences to maintain proper academic records and ensure child well-being is documented.',
    color: 'teal',
    scenarios: [
      'Long-term illness absence',
      'Contagious disease (flu, pox)',
      'Injury recovery period',
      'Planned medical treatment break',
    ],
  },
  {
    icon: Landmark,
    title: 'Bank / Government',
    subtitle: 'For Official Purposes',
    description:
      'Government agencies and financial institutions may request medical proof for official leave applications, loan processes, or government job leave regularization.',
    color: 'blue',
    scenarios: [
      'Official leave applications',
      'Loan or credit processing',
      'Government job documentation',
      'Legal & administrative needs',
    ],
  },
];

type ColorKey = 'cyan' | 'primary' | 'teal' | 'blue';

const colorConfig: Record<
  ColorKey,
  { bg: string; border: string; iconBg: string; iconColor: string; badgeBg: string; badgeText: string }
> = {
  cyan: {
    bg: 'bg-theme-cyan-light',
    border: 'border-theme-cyan-border',
    iconBg: 'bg-theme-cyan/10',
    iconColor: 'text-theme-cyan',
    badgeBg: 'bg-theme-cyan/10',
    badgeText: 'text-[#0e7490]',
  },
  primary: {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconBg: 'bg-theme-primary/10',
    iconColor: 'text-theme-primary',
    badgeBg: 'bg-theme-primary/10',
    badgeText: 'text-theme-primary',
  },
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-700',
  },
  blue: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-700',
  },
};

export function CertificateUseCases({ slug, certTitle }: CertificateUseCasesProps) {
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
          <div className="inline-flex items-center gap-2 bg-theme-cyan-light border border-theme-cyan-border text-theme-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Briefcase className="w-4 h-4 text-theme-cyan" />
            When Do You Need It?
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Common Use Cases for a{' '}
            <span className="text-theme-cyan">{certTitle}</span>
          </h2>
          <p className="text-lg text-gray-600">
            Understand when a valid online {certTitle} is required — accepted by employers, colleges,
            schools & government offices across India.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {useCases.map((useCase, index) => {
            const colors = colorConfig[useCase.color as ColorKey];
            const Icon = useCase.icon;

            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${colors.bg} ${colors.border} border rounded-2xl p-6 lg:p-8 hover:shadow-md transition-shadow duration-200`}
              >
                {/* Card Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className={`w-14 h-14 ${colors.iconBg} rounded-xl flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`w-7 h-7 ${colors.iconColor}`} />
                  </div>
                  <div>
                    <span
                      className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badgeBg} ${colors.badgeText} mb-1`}
                    >
                      {useCase.subtitle}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">{useCase.title}</h3>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-5">{useCase.description}</p>

                {/* Scenarios */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Common Scenarios
                  </h4>
                  <ul className="grid grid-cols-2 gap-y-2 gap-x-3">
                    {useCase.scenarios.map((scenario, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${colors.iconColor}`} />
                        {scenario}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 rounded-2xl p-6 lg:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, #0d2f85 0%, #1fb8c9 100%)' }}
        >
          <div>
            <p className="text-xl font-bold">Need a {certTitle} Today?</p>
            <p className="text-white/80 text-sm mt-1">
              Consult a certified doctor online &amp; get your certificate in 30–60 minutes.
            </p>
          </div>
          <Link
            href="/certificates/apply"
            className="shrink-0 inline-flex items-center gap-2 bg-white text-theme-primary font-semibold px-7 py-3 rounded-xl transition-all duration-200 hover:bg-white/90 whitespace-nowrap"
          >
            Get Certificate Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
