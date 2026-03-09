"use client";

import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InView } from "@/components/ui/in-view";
import { CTASection } from "@/components/public/home/cta-section";
import { FAQ_ITEMS } from "@/lib/certificate-types";

// Parse **bold** markers into <strong> elements
function renderBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-brand-light/40 to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            Got Questions?
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Frequently Asked{" "}
            <span className="text-primary">Questions</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Find answers to the most common questions about our medical
            certificate services.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="border-t bg-card px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <InView>
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{renderBoldText(item.answer)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </InView>
        </div>
      </section>

      <CTASection
        title="Still Have Questions?"
        description="If you need a certificate, start your online consultation and get a professionally formatted document issued by a registered doctor."
        buttonPrimary={{
          label: "Apply For Certificate",
          href: "/certificates/apply",
        }}
      />
    </>
  );
}
