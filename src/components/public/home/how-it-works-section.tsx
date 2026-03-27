"use client";

import Link from "next/link";
import { ArrowRight, FileText, Video, Award } from "lucide-react";
import { FadeIn, SectionReveal } from "@/components/ui/fade-in";
import { GridPattern } from "@/components/ui/grid-pattern";

const steps = [
  {
    number: 1,
    icon: FileText,
    title: "Submit Your Request",
    description:
      "Fill out our easy online form with accurate personal and medical details. The process is quick, secure, and designed to save your time.",
    iconSvg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="60" cy="60" r="55" fill="var(--color-brand-primary-light)" />
        <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="8 4">
          <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="20s" repeatCount="indefinite" />
        </circle>
        <g transform="translate(35, 35)">
          <rect x="0" y="0" width="50" height="60" rx="4" fill="white" stroke="var(--color-primary)" strokeWidth="2">
            <animate attributeName="height" values="60;65;60" dur="2s" repeatCount="indefinite" />
          </rect>
          <line x1="10" y1="15" x2="40" y2="15" stroke="var(--color-primary)" strokeWidth="2">
            <animate attributeName="x2" values="40;35;40" dur="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="10" y1="25" x2="40" y2="25" stroke="var(--color-primary)" strokeWidth="2" />
          <line x1="10" y1="35" x2="35" y2="35" stroke="var(--color-primary)" strokeWidth="2" />
          <circle cx="25" cy="48" r="8" fill="var(--color-success)" />
          <path d="M21 48 L24 51 L30 45" stroke="white" strokeWidth="2" fill="none">
            <animate attributeName="stroke-dasharray" values="0 20;20 20" dur="1s" begin="0.5s" fill="freeze" />
          </path>
        </g>
        <circle cx="100" cy="20" r="15" fill="var(--color-primary)" />
        <text x="100" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">1</text>
      </svg>
    ),
  },
  {
    number: 2,
    icon: Video,
    title: "Online Doctor Consultation",
    description:
      "A certified doctor will review your request and connect with you through an online consultation.",
    iconSvg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="60" cy="60" r="55" fill="var(--color-brand-primary-light)" />
        <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="8 4">
          <animateTransform attributeName="transform" type="rotate" from="360 60 60" to="0 60 60" dur="20s" repeatCount="indefinite" />
        </circle>
        <g transform="translate(35, 30)">
          <circle cx="25" cy="15" r="12" fill="white" stroke="var(--color-primary)" strokeWidth="2" />
          <rect x="10" y="28" width="30" height="35" rx="4" fill="white" stroke="var(--color-primary)" strokeWidth="2" />
          <rect x="20" y="35" width="10" height="15" fill="var(--color-primary)" />
          <path d="M10 45 Q5 55 15 55 Q25 55 20 45" fill="none" stroke="var(--color-primary)" strokeWidth="2">
            <animate attributeName="d" values="M10 45 Q5 55 15 55 Q25 55 20 45;M10 45 Q3 58 15 58 Q27 58 20 45;M10 45 Q5 55 15 55 Q25 55 20 45" dur="2s" repeatCount="indefinite" />
          </path>
          <polyline points="28,40 32,40 34,35 36,45 38,40" fill="none" stroke="var(--color-cert-red)" strokeWidth="2">
            <animate attributeName="opacity" values="1;0.5;1" dur="0.8s" repeatCount="indefinite" />
          </polyline>
        </g>
        <circle cx="100" cy="20" r="15" fill="var(--color-primary)" />
        <text x="100" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">2</text>
      </svg>
    ),
  },
  {
    number: 3,
    icon: Award,
    title: "Receive Your Medical Certificate",
    description: "After approval, your medical certificate is issued promptly:",
    bullets: [
      {
        text: "Digital copy via ",
        bold: "WhatsApp or Email within 30 minutes",
        suffix: "*",
      },
      {
        text: "Physical copy via ",
        bold: "post in 8–10 business days",
        suffix: "",
      },
    ],
    iconSvg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="60" cy="60" r="55" fill="var(--color-brand-primary-light)" />
        <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="8 4">
          <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="20s" repeatCount="indefinite" />
        </circle>
        <g transform="translate(30, 25)">
          <rect x="0" y="0" width="60" height="70" rx="4" fill="white" stroke="var(--color-primary)" strokeWidth="2" />
          <rect x="0" y="0" width="60" height="15" fill="var(--color-primary)" />
          <text x="30" y="11" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">CERTIFICATE</text>
          <line x1="10" y1="25" x2="50" y2="25" stroke="var(--color-border)" strokeWidth="2" />
          <line x1="10" y1="32" x2="50" y2="32" stroke="var(--color-border)" strokeWidth="2" />
          <line x1="10" y1="39" x2="40" y2="39" stroke="var(--color-border)" strokeWidth="2" />
          <path d="M25 50 L20 70 L30 65 L40 70 L35 50 Z" fill="var(--color-primary)">
            <animate attributeName="opacity" values="1;0.8;1" dur="1.5s" repeatCount="indefinite" />
          </path>
          <circle cx="30" cy="50" r="6" fill="var(--color-brand-primary-light)" stroke="var(--color-primary)" strokeWidth="2" />
        </g>
        <circle cx="100" cy="20" r="15" fill="var(--color-primary)" />
        <text x="100" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">3</text>
      </svg>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-14 lg:py-20 xl:py-24 bg-gradient-to-br from-slate-50 via-white to-rose-50/30 relative overflow-hidden">
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className="opacity-[0.03]"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionReveal blur={true} scale={true}>
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight mb-3">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              A Simple 3-Step Online Process:
            </p>
          </div>
        </SectionReveal>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12 xl:gap-16">
            {steps.map((step, index) => (
              <FadeIn key={step.number} delay={index * 0.1} direction="up">
                <div className="relative text-center">
                  {/* Animated SVG Icon */}
                  <div className="relative w-28 h-28 lg:w-32 lg:h-32 mx-auto mb-5">
                    {step.iconSvg}
                  </div>

                  {/* Step Title */}
                  <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2">
                    {step.number}. {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                    {step.description}
                  </p>

                  {/* Bullet Points (for step 3) */}
                  {step.bullets && (
                    <ul className="text-sm text-muted-foreground space-y-1.5 mt-2 text-left max-w-xs mx-auto">
                      {step.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-1 shrink-0">○</span>
                          <span>
                            {bullet.text}
                            <strong className="font-bold text-foreground">
                              {bullet.bold}
                            </strong>
                            {bullet.suffix}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Arrows between steps (desktop only) */}
          <div className="hidden lg:block absolute top-16 left-[30%]">
            <svg width="80" height="24" viewBox="0 0 80 24" className="overflow-visible">
              <defs>
                <marker id="arrowhead1" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-primary)" />
                </marker>
              </defs>
              <line x1="0" y1="12" x2="70" y2="12" stroke="var(--color-primary)" strokeWidth="3" strokeDasharray="8 4" markerEnd="url(#arrowhead1)">
                <animate attributeName="stroke-dashoffset" values="0;24" dur="1s" repeatCount="indefinite" />
              </line>
            </svg>
          </div>
          <div className="hidden lg:block absolute top-16 left-[63%]">
            <svg width="80" height="24" viewBox="0 0 80 24" className="overflow-visible">
              <defs>
                <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-primary)" />
                </marker>
              </defs>
              <line x1="0" y1="12" x2="70" y2="12" stroke="var(--color-primary)" strokeWidth="3" strokeDasharray="8 4" markerEnd="url(#arrowhead2)">
                <animate attributeName="stroke-dashoffset" values="0;24" dur="1s" repeatCount="indefinite" />
              </line>
            </svg>
          </div>
        </div>

        {/* CTA Button */}
        <FadeIn delay={0.4}>
          <div className="text-center mt-10 lg:mt-12">
            <Link
              href="/certificates/apply"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-brand-primary-hover text-primary-foreground font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
