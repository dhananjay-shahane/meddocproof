import { Metadata } from "next";
import {
  Shield,
  Heart,
  Globe,
  Lock,
  FileCheck,
  CheckCircle,
  Users,
  Briefcase,
  GraduationCap,
  Plane,
  UserPlus,
} from "lucide-react";
import { ABOUT_SECTIONS } from "@/lib/certificate-types";
import { CTASection } from "@/components/public/home/cta-section";
import { CertificatesOffered } from "@/components/public/about/certificates-offered";

export const metadata: Metadata = {
  title: "About Us | MediProofDocs - Trusted Online Medical Certificates India",
  description:
    "Learn about MediProofDocs — India's trusted online platform for genuine medical certificates. Get sick leave certificates, fitness certificates & medical documents issued by registered MBBS doctors through compliant telemedicine consultations.",
  keywords: [
    "online medical certificate India",
    "sick leave certificate online",
    "medical certificate for office",
    "telemedicine consultation India",
    "registered doctor consultation",
    "fitness certificate online",
    "work from home medical certificate",
    "travel fitness certificate",
    "medical leave certificate",
    "MBBS doctor online consultation",
    "verified medical documents",
    "healthcare documentation India",
  ],
  openGraph: {
    title: "About MediProofDocs - Trusted Online Medical Certificates",
    description:
      "India's trusted platform for genuine medical certificates issued by registered MBBS doctors through compliant digital consultations.",
    type: "website",
  },
};

const WHO_CAN_USE_ICONS = [Briefcase, GraduationCap, UserPlus, Plane, Users];

function getWhoCanUseGridPositionClass(index: number, total: number): string {
  const remainder = total % 3;

  // On large screens (3 columns), center the final incomplete row.
  if (remainder === 1 && index === total - 1) {
    return "lg:col-start-2";
  }

  if (remainder === 2 && index === total - 2) {
    return "lg:col-start-2";
  }

  return "";
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-32 pb-20 sm:pt-36 sm:pb-16">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-brand-light/40 to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            About <span className="text-primary">MediProofDocs</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Your <strong>trusted online destination</strong> for obtaining{" "}
            <strong>genuine medical certificates</strong> quickly, securely, and
            conveniently. We are committed to simplifying{" "}
            <strong>healthcare documentation</strong> by connecting patients with{" "}
            <strong>registered doctors</strong> through safe and compliant{" "}
            <strong>digital consultations</strong>.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="border-t bg-gradient-to-b from-slate-50 to-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Our Mission Card */}
            <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">Our Mission</h2>
              <p className="mt-4 leading-relaxed text-gray-600">
                Our mission is to make <strong>medical certification accessible</strong>,{" "}
                <strong>ethical</strong>, and <strong>reliable</strong> for everyone across India.
                We aim to reduce unnecessary clinic visits while ensuring that every certificate
                issued meets <strong>legal</strong>, <strong>medical</strong>, and{" "}
                <strong>professional standards</strong>.
              </p>
            </div>
            {/* What We Do Card */}
            <div className="rounded-2xl border border-green-100 bg-white p-8 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-md">
                <FileCheck className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">What We Do</h2>
              <p className="mt-4 leading-relaxed text-gray-600">
                MediProofDocs provides a <strong>secure platform</strong> where individuals can
                consult <strong>registered doctors online</strong> and receive{" "}
                <strong>valid medical certificates</strong> for various purposes. Each request is
                carefully reviewed, and certificates are issued only after a{" "}
                <strong>genuine tele-consultation</strong> with a registered doctor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate types list */}
      <CertificatesOffered />

      {/* Trust & Authenticity */}
      <section className="border-t bg-gradient-to-b from-white to-slate-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-extrabold text-gray-900">
            How We Ensure Trust & Authenticity
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Your health and privacy are our top priorities. We follow strict guidelines to ensure every certificate is <strong>legally valid</strong> and <strong>medically authentic</strong>.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
              <p className="text-sm leading-relaxed text-gray-600">
                <strong>Consultations conducted by registered MBBS doctors</strong> verified with Medical Council of India
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
              <p className="text-sm leading-relaxed text-gray-600">
                <strong>Medical certificates issued in approved formats</strong> accepted by employers, institutions & authorities
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
              <p className="text-sm leading-relaxed text-gray-600">
                Full compliance with <strong>Telemedicine Practice Guidelines 2020</strong> and <strong>National Medical Commission (NMC) guidelines</strong>
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
              <p className="text-sm leading-relaxed text-gray-600">
                <strong>Strict doctor–patient confidentiality</strong> maintained at all times
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
              <p className="text-sm leading-relaxed text-gray-600">
                <strong>Secure handling of personal and medical data</strong> with industry-standard encryption
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-4">
            Why Choose MediProofDocs?
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Trusted by thousands of patients across India for <strong>fast, reliable, and secure</strong> medical certificate services.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {ABOUT_SECTIONS.whyChooseUs.map((item, idx) => {
              const icons = [Shield, Heart, Globe, Lock, FileCheck];
              const Icon = icons[idx % icons.length];
              return (
                <div key={idx} className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow min-w-[250px] max-w-[300px]">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-5 shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who Can Use */}
      <section className="border-t bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-extrabold text-gray-900">
            Who Can Use Our Services?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Our <strong>online medical certificate services</strong> are available to everyone across India.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {ABOUT_SECTIONS.whoCanUse.map((item, idx) => {
              const Icon = WHO_CAN_USE_ICONS[idx % WHO_CAN_USE_ICONS.length];
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 rounded-lg border bg-slate-50 p-4 transition-all hover:shadow-md hover:border-primary/30 lg:col-span-2 ${getWhoCanUseGridPositionClass(idx, ABOUT_SECTIONS.whoCanUse.length)}`}
                >
                  <Icon className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-semibold text-gray-800">{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="px-4 py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-extrabold text-gray-900">Our Commitment to You</h2>
          <p className="mt-4 leading-relaxed text-gray-600">
            We believe <strong>healthcare documentation</strong> should be{" "}
            <strong>simple</strong>, <strong>ethical</strong>, and <strong>transparent</strong>.
            We continuously improve our services to ensure <strong>timely support</strong>,{" "}
            <strong>professional consultations</strong>, and{" "}
            <strong>medical certificates you can trust</strong>. Your health, privacy, and
            peace of mind remain our top priorities.
          </p>
        </div>
      </section>

      <CTASection
        title="Need A Verified Medical Certificate?"
        description="Complete a short online consultation and receive a professionally formatted medical certificate issued by a registered doctor."
        buttonPrimary={{
          label: "Apply For Certificate",
          href: "/certificates/apply",
        }}
      />
    </>
  );
}
