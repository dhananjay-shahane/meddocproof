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
import { ABOUT_SECTIONS, ALL_CERTIFICATE_TYPES } from "@/lib/certificate-types";
import { CTASection } from "@/components/public/home/cta-section";

export const metadata: Metadata = {
  title: "About Us | MediProofDocs",
  description:
    "Learn about MediProofDocs — your trusted online platform for genuine medical certificates issued by registered doctors through compliant digital consultations.",
};

const WHO_CAN_USE_ICONS = [Briefcase, GraduationCap, UserPlus, Plane, Users];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-brand-light/40 to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            About <span className="text-primary">MediProofDocs</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {ABOUT_SECTIONS.intro}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="border-t bg-card px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {ABOUT_SECTIONS.mission}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">What We Do</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {ABOUT_SECTIONS.whatWeDo}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate types list */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold">
            Certificates We Offer
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_CERTIFICATE_TYPES.map((cert) => (
              <div
                key={cert.slug}
                className="flex items-center gap-3 rounded-lg border bg-card p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <cert.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{cert.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Authenticity */}
      <section className="border-t bg-card px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold">
            How We Ensure Trust & Authenticity
          </h2>
          <div className="mt-8 space-y-4">
            {ABOUT_SECTIONS.trustPoints.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-lg border p-4"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
            Why Choose Us
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {ABOUT_SECTIONS.whyChooseUs.map((item, idx) => {
              const icons = [Shield, Heart, Globe, Lock, FileCheck];
              const Icon = icons[idx % icons.length];
              return (
                <div key={idx} className="flex flex-col items-center text-center p-6">
                  <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mb-5 shadow-lg">
                    <Icon className="h-9 w-9 text-white" />
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
      <section className="border-t bg-card px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold">
            Who Can Use Our Services?
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ABOUT_SECTIONS.whoCanUse.map((item, idx) => {
              const Icon = WHO_CAN_USE_ICONS[idx % WHO_CAN_USE_ICONS.length];
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-lg border p-4"
                >
                  <Icon className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold">Our Commitment</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {ABOUT_SECTIONS.commitment}
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
