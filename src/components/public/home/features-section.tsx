"use client";

import { Sparkles, ShieldCheck, Lock } from "lucide-react";
import {
  SectionReveal,
  CardReveal,
} from "@/components/ui/fade-in";
import { GridPattern } from "@/components/ui/grid-pattern";

const features = [
  {
    icon: Lock,
    title: "Data Privacy and Protection",
    description: "We respect your privacy and treat your personal and medical details with care. All information is securely handled and used only for doctor consultation and issuing your medical certificate. Our system is built to protect your details at every step.",
  },
  {
    icon: ShieldCheck,
    title: "Genuine And Verified Certificates",
    description: "Medical certificates are provided only after consultation with a registered Indian medical practitioner. Each certificate carries the doctor\u2019s name and registration number, ensuring it is genuine and acceptable for official and professional use across India.",
  },
  {
    icon: Sparkles,
    title: "Easy And Convenient Process",
    description: "Our online service is designed to be simple and easy to use. You can submit your request, speak with a doctor, and receive your medical certificate smoothly, without delays or complicated steps.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-14 lg:py-20 xl:py-24 bg-linear-to-t from-primary/40 via-primary/40 to-green-500/40 relative overflow-hidden">
      <GridPattern
        width={32}
        height={32}
        x={-1}
        y={-1}
        className="opacity-[0.02]"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionReveal blur={true} scale={true}>
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight mb-3">
              Why <span className="text-primary">Trust Us?</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Trusted by patients across India for secure, doctor-verified, and hassle-free certificate support.
            </p>
          </div>
        </SectionReveal>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {features.map((feature, index) => (
            <CardReveal key={index} delay={index * 0.1}>
              <div className="bg-linear-to-br from-brand-primary-light to-card p-8 rounded-3xl border border-brand-primary-light hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </CardReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
