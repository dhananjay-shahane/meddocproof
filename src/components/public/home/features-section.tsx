"use client";

import { Lock, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { SectionReveal, CardReveal } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Lock,
    eyebrow: "Privacy First",
    title: "Data Privacy and Protection",
    description:
      "We respect your privacy and treat your personal and medical details with care. All information is securely handled and used only for doctor consultation and issuing your medical certificate. Our system is built to protect your details at every step.",
    supportText: "Encrypted handling across the workflow",
    accentClass: "from-primary to-primary/60",
    iconBgClass: "bg-primary/10 text-primary",
    eyebrowClass: "border-primary/20 bg-primary/8 text-primary",
    dotClass: "bg-primary",
    glowClass: "bg-primary/6",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Verified Doctors",
    title: "Genuine And Verified Certificates",
    description:
      "Medical certificates are provided only after consultation with a registered Indian medical practitioner. Each certificate carries the doctor's name and registration number, ensuring it is genuine and acceptable for official and professional use across India.",
    supportText: "Issued only after doctor review",
    accentClass: "from-cyan-500 to-sky-400",
    iconBgClass: "bg-cyan-50 text-cyan-700",
    eyebrowClass: "border-cyan-200 bg-cyan-50 text-cyan-700",
    dotClass: "bg-cyan-500",
    glowClass: "bg-cyan-400/6",
  },
  {
    icon: Sparkles,
    eyebrow: "Smooth Process",
    title: "Easy And Convenient Process",
    description:
      "Our online service is designed to be simple and easy to use. You can submit your request, speak with a doctor, and receive your medical certificate smoothly, without delays or complicated steps.",
    supportText: "Built for a fast online experience",
    accentClass: "from-emerald-500 to-green-400",
    iconBgClass: "bg-emerald-50 text-emerald-700",
    eyebrowClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClass: "bg-emerald-500",
    glowClass: "bg-emerald-400/6",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(var(--primary-rgb),0.06),transparent)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border/50 to-transparent" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionReveal blur={true} scale={true}>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/6 px-4 py-1.5 text-sm font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Doctor-reviewed support
            </span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Why{" "}
              <span className="relative inline-block text-primary">
                Trust Us?
                <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-primary/25" />
              </span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Trusted by patients across India for secure, doctor-verified, and hassle-free certificate support.
            </p>
          </div>
        </SectionReveal>

        {/* Cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <CardReveal key={feature.title} delay={index * 0.12}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-[0_4px_24px_-8px_rgba(15,23,42,0.1)] transition-all duration-300 hover:-translate-y-1.5 hover:border-border hover:shadow-[0_16px_40px_-12px_rgba(15,23,42,0.18)]">
                {/* Top accent bar */}
                <div className={cn("h-1 w-full bg-linear-to-r", feature.accentClass)} />

                {/* Subtle glow bg on hover */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                    feature.glowClass
                  )}
                />

                <div className="relative flex flex-1 flex-col p-7">
                  {/* Icon row with step number */}
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-2xl",
                        feature.iconBgClass
                      )}
                    >
                      <feature.icon className="h-7 w-7" strokeWidth={1.75} />
                    </div>
                    <span className="text-5xl font-black leading-none tabular-nums text-border/30 select-none">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Eyebrow badge */}
                  <span
                    className={cn(
                      "mt-6 inline-flex w-fit rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                      feature.eyebrowClass
                    )}
                  >
                    {feature.eyebrow}
                  </span>

                  {/* Title */}
                  <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>

                  {/* Support text */}
                  <div className="mt-6 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                        feature.iconBgClass
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", feature.dotClass)} />
                    </span>
                    {feature.supportText}
                  </div>
                </div>
              </article>
            </CardReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
