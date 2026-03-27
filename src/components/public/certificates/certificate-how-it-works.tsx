'use client';

import { motion } from 'framer-motion';
import { FileText, Stethoscope, Download, Clock } from 'lucide-react';

/**
 * How It Works Component
 * 
 * Based on research of competitor websites (medicalcertificate.in, theonlinegp.com,
 * Prime Medic, Abby Health), the 3-step process is standard across all medical
 * certificate service providers:
 * 
 * Step 1: Fill medical questionnaire
 * Step 2: Doctor consultation
 * Step 3: Receive certificate
 */

const steps = [
  {
    number: 1,
    icon: FileText,
    title: 'Fill Medical Questionnaire',
    description: 'Complete our brief form with your symptoms, medical history, and required leave dates.',
    time: '2-3 minutes',
  },
  {
    number: 2,
    icon: Stethoscope,
    title: 'Doctor Consultation',
    description: 'A certified doctor will review your information and connect with you via phone or video call.',
    time: '5-10 minutes',
  },
  {
    number: 3,
    icon: Download,
    title: 'Receive Certificate',
    description: 'Get your official medical certificate delivered via WhatsApp and email.',
    time: '30-90 minutes',
  },
];

const colorClasses = [
  { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', ring: 'ring-blue-100' },
  { bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-600', ring: 'ring-teal-100' },
  { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', ring: 'ring-emerald-100' },
];

export function CertificateHowItWorks() {
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
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Clock className="w-4 h-4" />
            Simple Process
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Get your medical certificate in just 3 simple steps
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const colors = colorClasses[index];
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 -z-10" />
                )}

                {/* Step Card */}
                <div className="text-center">
                  {/* Step Number Circle */}
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
                    className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${colors.bg} ${colors.border} border-2 mb-6 shadow-sm`}
                  >
                    <Icon className={`w-10 h-10 ${colors.text}`} />
                  </motion.div>

                  {/* Step Content */}
                  <div className="bg-gray-50 rounded-2xl p-6 lg:p-8">
                    <span className="inline-block text-sm font-semibold text-gray-500 mb-2">
                      Step {step.number}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                      <Clock className="w-3.5 h-3.5" />
                      {step.time}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Need help?</span> Our support team is available 24/7 to assist you.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
