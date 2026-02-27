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
    title: "Sick Leave Certificate",
    description:
      "When health issues prevent you from attending work, school, or college, a Sick Leave Medical Certificate provides official medical confirmation of your condition. Consult a certified doctor online and receive the required certificate.",
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
    title: "Work From Home Certificate",
    description:
      "Certain medical conditions may allow you to work but make office attendance difficult. A Work from Home Medical Certificate supports remote working arrangements based on medical advice.",
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
    title: "Caretaker Certificate",
    description:
      "When a family member requires medical care, a Caretaker Medical Certificate confirms the need for your presence as a caregiver during their recovery. This document supports leave or work-from-home requests.",
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
    title: "Recovery Certificate",
    description:
      "A Recovery Medical Certificate confirms that an individual has recovered from a medical condition and is fit to resume regular activities such as work, studies, or travel.",
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
    title: "Fitness Certificate",
    description:
      "A Medical Fitness Certificate is often required before starting a job, academic program, sports activity, or travel plan. Our doctors review your health details and issue a fitness certificate.",
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
    title: "Fit to Fly Certificate",
    description:
      "A Fit-to-Fly Certificate is medical clearance for air travel, required by airlines and immigration authorities for certain health conditions. Our doctors assess your fitness to travel safely.",
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
    title: "Unfit to Work Certificate",
    description:
      "When illness or injury affects your ability to perform work duties safely, an Unfit To Work Medical Certificate provides clear medical documentation. Issued only when medically necessary.",
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
    title: "Unfit to Travel Certificate",
    description:
      "Medical conditions or recovery phases may make travel unsafe or inadvisable. An Unfit To Travel Medical Certificate formally states that travel should be avoided.",
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
      "A Medical Diagnosis Certificate serves as official documentation of a diagnosed medical condition. Commonly required for insurance purposes, academic submissions, or workplace records.",
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
    <section className="py-24 lg:py-32 bg-gradient-to-b from-background via-background to-muted/20 relative overflow-hidden">
      {/* Modern geometric background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionReveal blur={true} scale={true}>
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 tracking-wide backdrop-blur-sm border border-primary/20">
              Wide Range of Options
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Types of Certificates We Offer
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We provide a variety of medical certificates, including Sick Leave, Fitness, Work From Home (WFH), Fit-to-Fly, and custom certificates. All certificates are issued by certified doctors through a quick and convenient online consultation.
            </p>
          </div>
        </SectionReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
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
          <div className="text-center mt-16 lg:mt-20">
            <Link
              href="/certificates"
              className="group inline-flex items-center justify-center gap-3 bg-foreground text-background hover:bg-foreground/90 font-semibold py-4 px-10 rounded-full transition-all duration-300 shadow-2xl hover:shadow-foreground/25 hover:-translate-y-1"
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