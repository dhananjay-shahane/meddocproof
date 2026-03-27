"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CertificateCard } from "@/components/ui/certificate-card";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/fade-in";
import {
  Stethoscope,
  Shield,
  Clock,
  Award,
  CheckCircle,
  ArrowRight,
  FileText,
  Users,
  Headphones,
} from "lucide-react";

const certificates = [
  {
    key: "SICK_LEAVE",
    title: "Sick Leave Certificate",
    description: "Official medical confirmation for work, school, or college absence due to health issues.",
    icon: <Image src="/svg/CertificatesIcons/SickLeavecertificatesvg.svg" alt="Sick Leave Certificate" width={48} height={48} />,
    category: "Medical",
    bestFor: "Employees & Students",
    borderColor: "#ec4899",
    iconBgColor: "#fce7f3",
    iconColor: "#ec4899",
    badgeBgColor: "#fce7f3",
    badgeTextColor: "#be185d",
    buttonBgColor: "#fce7f3",
    buttonTextColor: "#be185d",
    href: "/certificates/sick-leave",
  },
  {
    key: "WORK_FROM_HOME",
    title: "Work From Home Certificate",
    description: "Medical documentation supporting remote working arrangements.",
    icon: <Image src="/svg/CertificatesIcons/WorkfromHomecertificate.svg" alt="Work From Home Certificate" width={48} height={48} />,
    category: "Employment",
    bestFor: "Remote Workers",
    borderColor: "#10b981",
    iconBgColor: "#d1fae5",
    iconColor: "#10b981",
    badgeBgColor: "#d1fae5",
    badgeTextColor: "#047857",
    buttonBgColor: "#d1fae5",
    buttonTextColor: "#047857",
    href: "/certificates/work-from-home",
  },
  {
    key: "CARETAKER",
    title: "Caretaker Certificate",
    description: "Confirms your need to care for a family member during their recovery.",
    icon: <Image src="/svg/CertificatesIcons/CareTakerCertificate.svg" alt="Caretaker Certificate" width={48} height={48} />,
    category: "Family",
    bestFor: "Family Caregivers",
    borderColor: "#f97316",
    iconBgColor: "#ffedd5",
    iconColor: "#f97316",
    badgeBgColor: "#ffedd5",
    badgeTextColor: "#c2410c",
    buttonBgColor: "#ffedd5",
    buttonTextColor: "#c2410c",
    href: "/certificates/caretaker",
  },
  {
    key: "RECOVERY",
    title: "Recovery Certificate",
    description: "Official confirmation that you've recovered and are fit to resume activities.",
    icon: <Image src="/svg/CertificatesIcons/Recoverycertificate.svg" alt="Recovery Certificate" width={48} height={48} />,
    category: "Medical Clearance",
    bestFor: "Post Recovery",
    borderColor: "#14b8a6",
    iconBgColor: "#ccfbf1",
    iconColor: "#14b8a6",
    badgeBgColor: "#ccfbf1",
    badgeTextColor: "#0f766e",
    buttonBgColor: "#ccfbf1",
    buttonTextColor: "#0f766e",
    href: "/certificates/recovery",
  },
  {
    key: "FITNESS",
    title: "Fitness Certificate",
    description: "Required for jobs, academics, sports, or travel. Quick health assessment.",
    icon: <Image src="/svg/CertificatesIcons/MedicalFitnessCertificate.svg" alt="Fitness Certificate" width={48} height={48} />,
    category: "Health & Lifestyle",
    bestFor: "Employment & Sports",
    borderColor: "#a855f7",
    iconBgColor: "#f3e8ff",
    iconColor: "#a855f7",
    badgeBgColor: "#f3e8ff",
    badgeTextColor: "#7c3aed",
    buttonBgColor: "#f3e8ff",
    buttonTextColor: "#7c3aed",
    href: "/certificates/fitness",
  },
  {
    key: "FIT_TO_FLY",
    title: "Fit to Fly Certificate",
    description: "Medical clearance for air travel required by airlines and immigration.",
    icon: <Image src="/svg/CertificatesIcons/FittoFly.svg" alt="Fit to Fly Certificate" width={48} height={48} />,
    category: "Travel",
    bestFor: "Air Travelers",
    borderColor: "#3b82f6",
    iconBgColor: "#dbeafe",
    iconColor: "#3b82f6",
    badgeBgColor: "#dbeafe",
    badgeTextColor: "#2563eb",
    buttonBgColor: "#dbeafe",
    buttonTextColor: "#2563eb",
    href: "/certificates/fit-to-fly",
  },
  {
    key: "UNFIT_TO_WORK",
    title: "Unfit to Work Certificate",
    description: "Clear medical documentation when illness affects work ability.",
    icon: <Image src="/svg/CertificatesIcons/Unfit%20to%20WorkCertificate.svg" alt="Unfit to Work Certificate" width={48} height={48} />,
    category: "Medical",
    bestFor: "Medical Leave",
    borderColor: "#f43f5e",
    iconBgColor: "#ffe4e6",
    iconColor: "#f43f5e",
    badgeBgColor: "#ffe4e6",
    badgeTextColor: "#e11d48",
    buttonBgColor: "#ffe4e6",
    buttonTextColor: "#e11d48",
    href: "/certificates/unfit-to-work",
  },
  {
    key: "UNFIT_TO_TRAVEL",
    title: "Unfit to Travel Certificate",
    description: "Formal statement that travel should be avoided due to medical conditions.",
    icon: <Image src="/svg/CertificatesIcons/UnfittiTravel.svg" alt="Unfit to Travel Certificate" width={48} height={48} />,
    category: "Travel",
    bestFor: "Travel Postponement",
    borderColor: "#f59e0b",
    iconBgColor: "#fef3c7",
    iconColor: "#f59e0b",
    badgeBgColor: "#fef3c7",
    badgeTextColor: "#d97706",
    buttonBgColor: "#fef3c7",
    buttonTextColor: "#d97706",
    href: "/certificates/unfit-to-travel",
  },
  {
    key: "MEDICAL_DIAGNOSIS",
    title: "Medical Diagnosis Certificate",
    description: "Official documentation of diagnosed conditions for insurance or records.",
    icon: <Image src="/svg/CertificatesIcons/DiagnosisCertificate.svg" alt="Medical Diagnosis Certificate" width={48} height={48} />,
    category: "Personal Record",
    bestFor: "Documentation",
    borderColor: "#6366f1",
    iconBgColor: "#e0e7ff",
    iconColor: "#6366f1",
    badgeBgColor: "#e0e7ff",
    badgeTextColor: "#4f46e5",
    buttonBgColor: "#e0e7ff",
    buttonTextColor: "#4f46e5",
    href: "/certificates/medical-diagnosis",
  },
];

const stats = [
  { value: "50K+", label: "Certificates Issued" },
  { value: "4.9/5", label: "Customer Rating" },
  { value: "30-90", label: "Minutes Delivery" },
  { value: "100%", label: "Genuine & Verified" },
];

export function CertificatesIndex() {
  return (
    <div className="min-h-screen bg-white">
      {/* Clean Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,#e0f7fa_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,#f3e8ff_0%,transparent_50%)]" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-8"
            >
              <Shield className="w-4 h-4" />
              Trusted by 50,000+ Customers Nationwide
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Get Your Medical Certificate
              <span className="text-teal-600"> in 30-90 Minutes</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto"
            >
              Legally valid medical certificates from certified doctors.
              Accepted by employers, colleges, and institutions across India.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Link
                href="/certificates/apply"
                className="group inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-200 w-full sm:w-auto"
              >
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#certificates"
                className="group inline-flex items-center justify-center bg-white border-2 border-gray-200 hover:border-teal-600 text-gray-700 hover:text-teal-600 font-semibold px-8 py-4 rounded-lg transition-all duration-200 w-full sm:w-auto"
              >
                View Certificates
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal-600" />
                <span>Doctor Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                <span>30-90 Min Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600" />
                <span>100% Genuine</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-teal-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get your medical certificate in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Fill Application",
                description: "Complete our simple online form with your details and requirements.",
                icon: FileText,
              },
              {
                step: "02",
                title: "Doctor Review",
                description: "A certified doctor reviews your application and connects with you.",
                icon: Stethoscope,
              },
              {
                step: "03",
                title: "Get Certificate",
                description: "Receive your verified certificate via email and WhatsApp within 30-90 minutes.",
                icon: Award,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="text-5xl font-bold text-teal-100 mb-4">{item.step}</div>
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Grid Section */}
      <section id="certificates" className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Medical Certificates
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our complete range of medical certificates. Each certificate type has its own dedicated page with detailed information.
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {certificates.map((cert) => (
              <StaggerItem key={cert.key}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CertificateCard
                    title={cert.title}
                    description={cert.description}
                    icon={cert.icon}
                    category={cert.category}
                    bestFor={cert.bestFor}
                    borderColor={cert.borderColor}
                    iconBgColor={cert.iconBgColor}
                    iconColor={cert.iconColor}
                    badgeBgColor={cert.badgeBgColor}
                    badgeTextColor={cert.badgeTextColor}
                    buttonBgColor={cert.buttonBgColor}
                    buttonTextColor={cert.buttonTextColor}
                    href={cert.href}
                  />
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/certificates/apply"
              className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Apply for Certificate
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose Us
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Users,
                title: "Qualified Doctors",
                description: "All certificates issued by registered medical practitioners with valid credentials.",
              },
              {
                icon: Clock,
                title: "Lightning Fast",
                description: "Receive your verified certificate within 30-90 minutes via email and WhatsApp.",
              },
              {
                icon: Shield,
                title: "100% Authentic",
                description: "Every certificate includes doctor registration details and QR code verification.",
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description: "Round-the-clock assistance from our dedicated support team.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mb-5 shadow-lg">
                  <feature.icon className="w-9 h-9 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
