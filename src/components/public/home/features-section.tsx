"use client";

import { Sparkles, ShieldCheck, Lock } from "lucide-react";
import {
  SectionReveal,
  CardReveal,
} from "@/components/ui/fade-in";
import { GridPattern } from "@/components/ui/grid-pattern";

const features = [
  {
    icon: Sparkles,
    title: "Easy And Convenient Process",
    description: "Complete the entire process from the comfort of your home without clinic visits or long waits",
  },
  {
    icon: ShieldCheck,
    title: "Genuine And Verified Certificates",
    description: "All certificates are issued by registered medical practitioners following proper protocols",
  },
  {
    icon: Lock,
    title: "Data Privacy and Protection",
    description: "Your personal and medical information is encrypted and kept completely confidential",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 bg-linear-to-b from-primary/30 via-primary/30 to-secondary/30 relative overflow-hidden">
      <GridPattern
        width={32}
        height={32}
        x={-1}
        y={-1}
        className="opacity-[0.02]"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionReveal blur={true} scale={true}>
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Get Reliable Online Medical Certificates Conveniently
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fast, secure, and hassle-free medical certificates from registered
              doctors
            </p>
          </div>
        </SectionReveal>

        <div className="grid md:grid-cols-3 gap-8">
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
