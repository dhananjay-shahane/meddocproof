"use client";

import Link from "next/link";
import { CertificateCard } from "@/components/ui/certificate-card";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  SectionReveal,
} from "@/components/ui/fade-in";
import {
  FileText,
  Home,
  Heart,
  Activity,
  Dumbbell,
  Plane,
  Briefcase,
  Car,
  Stethoscope,
} from "lucide-react";

const certificates = [
  {
    key: "SICK_LEAVE",
    title: "Sick Leave Medical Certificate",
    description:
      "When health issues prevent you from attending work, school, or college, a Sick Leave Medical Certificate provides official medical confirmation of your condition. You can consult a certified doctor online and receive the required certificate without the need to visit a clinic.\n\nThis certificate helps organizations and institutions understand that your absence is medically advised. Our efficient process ensures timely delivery, allowing you to rest and recover without added pressure or formal hassles.",
    icon: <FileText className="w-full h-full" />,
    category: "Medical",
    bestFor: "Employees & Students",
    borderColor: "#ec4899",
    iconBgColor: "#fce7f3",
    iconColor: "#ec4899",
    badgeBgColor: "#fce7f3",
    badgeTextColor: "#be185d",
    buttonBgColor: "#fce7f3",
    buttonTextColor: "#be185d",
    href: "/certificates/apply?type=sick-leave",
  },
  {
    key: "WORK_FROM_HOME",
    title: "Work From Home Medical Certificate",
    description:
      "Certain medical conditions may allow you to work but make office attendance difficult. A Work from Home Medical Certificate supports remote working arrangements based on medical advice.\n\nAfter an online consultation, the doctor may recommend work from home for a specified period, helping you continue your responsibilities while prioritizing your health and recovery.",
    icon: <Home className="w-full h-full" />,
    category: "Employment",
    bestFor: "Remote Workers",
    borderColor: "#10b981",
    iconBgColor: "#d1fae5",
    iconColor: "#10b981",
    badgeBgColor: "#d1fae5",
    badgeTextColor: "#047857",
    buttonBgColor: "#d1fae5",
    buttonTextColor: "#047857",
    href: "/certificates/apply?type=work-from-home",
  },
  {
    key: "CARETAKER",
    title: "Caretaker Medical Certificate",
    description:
      "When a family member requires medical care, a Caretaker Medical Certificate confirms the need for your presence as a caregiver during their recovery.\n\nThis document supports leave or work-from-home requests and helps employers or institutions understand your caregiving responsibility during the specified period.",
    icon: <Heart className="w-full h-full" />,
    category: "Family",
    bestFor: "Family Caregivers",
    borderColor: "#f97316",
    iconBgColor: "#ffedd5",
    iconColor: "#f97316",
    badgeBgColor: "#ffedd5",
    badgeTextColor: "#c2410c",
    buttonBgColor: "#ffedd5",
    buttonTextColor: "#c2410c",
    href: "/certificates/apply?type=caretaker",
  },
  {
    key: "RECOVERY",
    title: "Recovery Medical Certificate",
    description:
      "A Recovery Medical Certificate confirms that an individual has recovered from a medical condition and is fit to resume regular activities such as work, studies, or travel.\n\nDoctors issue this certificate after reviewing the current health status to ensure a safe and appropriate return to daily routines.",
    icon: <Activity className="w-full h-full" />,
    category: "Medical Clearance",
    bestFor: "Post Recovery",
    borderColor: "#14b8a6",
    iconBgColor: "#ccfbf1",
    iconColor: "#14b8a6",
    badgeBgColor: "#ccfbf1",
    badgeTextColor: "#0f766e",
    buttonBgColor: "#ccfbf1",
    buttonTextColor: "#0f766e",
    href: "/certificates/apply?type=recovery",
  },
  {
    key: "FITNESS",
    title: "Medical Fitness Certificate",
    description:
      "A Medical Fitness Certificate is often required before starting a job, academic program, sports activity, or travel plan. Through an online consultation, our doctors review your health details and issue a fitness certificate where appropriate.\n\nThe certificate confirms that you are medically fit to carry out specific responsibilities. Each assessment is handled carefully to ensure the document meets standard professional and institutional expectations.",
    icon: <Dumbbell className="w-full h-full" />,
    category: "Health & Lifestyle",
    bestFor: "Employment & Sports",
    borderColor: "#a855f7",
    iconBgColor: "#f3e8ff",
    iconColor: "#a855f7",
    badgeBgColor: "#f3e8ff",
    badgeTextColor: "#7c3aed",
    buttonBgColor: "#f3e8ff",
    buttonTextColor: "#7c3aed",
    href: "/certificates/apply?type=fitness",
  },
  {
    key: "FIT_TO_FLY",
    title: "Fit-to-Fly Medical Certificate",
    description:
      "A Fit-to-Fly Medical Certificate confirms that an individual is medically safe to travel by air. Doctors assess your current health condition to ensure that flying will not pose any risk to you or others during the journey.\n\nThe certificate is issued after an online consultation and is accepted by airlines, travel authorities, and immigration officials.",
    icon: <Plane className="w-full h-full" />,
    category: "Travel",
    bestFor: "Air Travelers",
    borderColor: "#3b82f6",
    iconBgColor: "#dbeafe",
    iconColor: "#3b82f6",
    badgeBgColor: "#dbeafe",
    badgeTextColor: "#2563eb",
    buttonBgColor: "#dbeafe",
    buttonTextColor: "#2563eb",
    href: "/certificates/apply?type=fit-to-fly",
  },
  {
    key: "UNFIT_TO_WORK",
    title: "Unfit To Work Medical Certificate",
    description:
      "When illness or injury affects your ability to perform work duties safely, an Unfit To Work Medical Certificate provides clear medical documentation of your condition.\n\nDoctors assess your health status and issue the certificate only when medically necessary, helping ensure personal well-being and workplace safety.",
    icon: <Briefcase className="w-full h-full" />,
    category: "Medical",
    bestFor: "Medical Leave",
    borderColor: "#f43f5e",
    iconBgColor: "#ffe4e6",
    iconColor: "#f43f5e",
    badgeBgColor: "#ffe4e6",
    badgeTextColor: "#e11d48",
    buttonBgColor: "#ffe4e6",
    buttonTextColor: "#e11d48",
    href: "/certificates/apply?type=unfit-to-work",
  },
  {
    key: "UNFIT_TO_TRAVEL",
    title: "Unfit To Travel Medical Certificate",
    description:
      "Medical conditions or recovery phases may make travel unsafe or inadvisable. An Unfit To Travel Medical Certificate formally states that travel should be avoided for a defined duration.\n\nThis certificate is commonly used for travel postponements, cancellations, or official communication with employers and travel authorities and is issued only after medical evaluation.",
    icon: <Car className="w-full h-full" />,
    category: "Travel",
    bestFor: "Travel Postponement",
    borderColor: "#f59e0b",
    iconBgColor: "#fef3c7",
    iconColor: "#f59e0b",
    badgeBgColor: "#fef3c7",
    badgeTextColor: "#d97706",
    buttonBgColor: "#fef3c7",
    buttonTextColor: "#d97706",
    href: "/certificates/apply?type=unfit-to-travel",
  },
  {
    key: "MEDICAL_DIAGNOSIS",
    title: "Medical Diagnosis Certificate",
    description:
      "A Medical Diagnosis Certificate serves as official documentation of a diagnosed medical condition following professional medical assessment.\n\nIt is commonly required for insurance purposes, academic submissions, workplace records, or administrative and legal documentation. Each certificate is issued responsibly based on clinical findings.",
    icon: <Stethoscope className="w-full h-full" />,
    category: "Personal Record",
    bestFor: "Documentation",
    borderColor: "#6366f1",
    iconBgColor: "#e0e7ff",
    iconColor: "#6366f1",
    badgeBgColor: "#e0e7ff",
    badgeTextColor: "#4f46e5",
    buttonBgColor: "#e0e7ff",
    buttonTextColor: "#4f46e5",
    href: "/certificates/apply?type=medical-diagnosis",
  },
];

export function CertificateTypesSection() {
  return (
    <section id="certificates" className="py-16 lg:py-20 xl:py-28 bg-gradient-to-b from-background via-background to-muted/20 relative overflow-hidden">
      {/* Modern geometric background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionReveal blur={true} scale={true}>
          <div className="text-center mb-10 lg:mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight mb-3">
              Types of <span className="text-primary">Certificates</span> We Offer
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We provide a variety of medical certificates, including Sick Leave, Fitness, Work From Home (WFH), Fit-to-Fly, and custom certificates. All certificates are issued by certified doctors through a quick and convenient online consultation.
            </p>
          </div>
        </SectionReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto">
          {certificates.map((cert) => (
            <StaggerItem key={cert.key}>
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
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.2}>
          <div className="text-center mt-10 lg:mt-14">
            <Link
              href="/certificates"
              className="group inline-flex items-center justify-center gap-3 bg-primary text-white hover:bg-primary/90 font-semibold py-4 px-10 rounded-full transition-all duration-300 shadow-2xl hover:shadow-primary/25 hover:-translate-y-1"
            >
              View All Certificate Types
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}