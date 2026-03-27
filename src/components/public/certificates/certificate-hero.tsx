'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import type { CertificateInfo } from '@/lib/certificate-descriptions';
import { CertificateSidebar } from './certificate-sidebar';

interface CertificateHeroProps {
  certInfo: CertificateInfo;
}

/**
 * Certificate Hero Component
 *
 * Displays the main hero section for certificate pages with:
 * - Certificate title and description
 * - Primary CTA button
 * - Sidebar with visual trust elements
 *
 * The sidebar has been extracted to CertificateSidebar component
 * for better code organization and reusability.
 */
export function CertificateHero({ certInfo }: CertificateHeroProps) {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,#e0f7fa_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,#f3e8ff_0%,transparent_50%)]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Shield className="w-4 h-4" />
              Medical Certificate
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6"
            >
              {certInfo.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <ul className="space-y-3">
                {certInfo.bulletPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed">
                    <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-teal-500" />
                    <span
                      className="text-base"
                      dangerouslySetInnerHTML={{ __html: point }}
                    />
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <Link
                href="/certificates/apply"
                className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
              >
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Using extracted CertificateSidebar component */}
          <CertificateSidebar />
        </div>
      </div>
    </section>
  );
}
