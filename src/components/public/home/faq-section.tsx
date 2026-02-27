"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  SectionReveal,
} from "@/components/ui/fade-in";
import { GridPattern } from "@/components/ui/grid-pattern";
import { FAQ_ITEMS } from "@/lib/certificate-types";

export function FAQSection() {
  // Show first 10 items on home page
  const displayItems = FAQ_ITEMS.slice(0, 10);

  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className="opacity-[0.03]"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionReveal blur={true} scale={true}>
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our service
            </p>
          </div>
        </SectionReveal>

        <div className="max-w-3xl mx-auto">
          <StaggerContainer className="space-y-4">
            {displayItems.map((faq, index) => (
              <StaggerItem key={index}>
                <details className="group bg-card rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-brand-primary-light/30 transition-colors">
                    <span className="font-semibold text-foreground pr-4">
                      {faq.question}
                    </span>
                    <span className="text-primary text-2xl transition-transform duration-300 group-open:rotate-45 shrink-0">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.2}>
            <div className="mt-8 text-center">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                View all FAQs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
