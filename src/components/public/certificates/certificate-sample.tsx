'use client';

import { motion } from 'framer-motion';
import { FileText, Shield, CheckCircle, User, Calendar, Stethoscope } from 'lucide-react';

/**
 * Certificate Sample Component
 * 
 * Based on online research of medical certificate websites, showing a sample:
 * 1. Builds trust through transparency
 * 2. Shows actual certificate format users will receive
 * 3. Reduces user hesitation about quality
 * 4. Demonstrates professionalism
 * 
 * This component displays a visual preview of what the certificate looks like,
 * including key elements like doctor details, signatures, and official stamps.
 */

interface CertificateSampleProps {
  slug?: string;
  title?: string;
}

export function CertificateSample({ slug, title }: CertificateSampleProps) {
  const certificateTitle = title || 'Medical Certificate';

  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FileText className="w-4 h-4" />
              Sample Preview
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Your Certificate Will Look Like
            </h2>
            
            <p className="text-lg text-gray-600 mb-6">
              Every certificate we issue follows official medical documentation standards and includes all necessary verification details.
            </p>

            {/* Features List */}
            <ul className="space-y-4">
              {[
                { icon: Shield, text: 'Official letterhead with doctor registration' },
                { icon: CheckCircle, text: 'Digital signature and medical stamp' },
                { icon: User, text: 'Patient details and medical information' },
                { icon: Calendar, text: 'Issue date and validity period' },
                { icon: Stethoscope, text: 'Doctor contact for verification' },
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-teal-600" />
                  </div>
                  <span className="text-gray-700">{feature.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Content - Certificate Preview (hidden on small screens) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            {/* Certificate Card Mockup */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 lg:p-8 max-w-md mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-teal-500 rounded-full opacity-10" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-emerald-500 rounded-full opacity-10" />
              
              {/* Certificate Header */}
              <div className="border-b-2 border-teal-500 pb-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">MediDoc Proof</p>
                      <p className="text-sm font-bold text-gray-900">Medical Certificate</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Cert. No:</p>
                    <p className="text-sm font-mono text-teal-600">MDP-2024-XXXXX</p>
                  </div>
                </div>
              </div>

              {/* Certificate Body */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Patient Name</p>
                    <p className="text-sm font-medium text-gray-900">[Your Name]</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date of Issue</p>
                    <p className="text-sm font-medium text-gray-900">[Current Date]</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Certificate Type</p>
                  <p className="text-base font-semibold text-teal-700">{certificateTitle}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Medical Details</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                    This is to certify that the patient has been examined and requires medical certification as per the consultation findings.
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Validity Period</p>
                  <p className="text-sm font-medium text-gray-900">[As recommended by doctor]</p>
                </div>
              </div>

              {/* Certificate Footer */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Issuing Doctor</p>
                    <p className="text-sm font-semibold text-gray-900">Dr. [Doctor Name]</p>
                    <p className="text-xs text-teal-600">MBBS, Reg. No: XXXXX</p>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-16 rounded-full border-2 border-teal-500 border-dashed flex items-center justify-center">
                      <Shield className="w-8 h-8 text-teal-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Official Seal</p>
                  </div>
                </div>
              </div>

              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                <Shield className="w-48 h-48 text-teal-900" />
              </div>
            </div>

            {/* Verification Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg px-4 py-3 border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Verified</p>
                  <p className="text-xs text-gray-500">NMC Compliant</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
