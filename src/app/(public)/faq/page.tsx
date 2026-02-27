"use client";

import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InView } from "@/components/ui/in-view";
import { FAQ_ITEMS } from "@/lib/certificate-types";

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
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </InView>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold">Still Have Questions?</h2>
          <p className="mt-3 text-muted-foreground">
            Can&apos;t find what you&apos;re looking for? Our support team is
            here to help.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/certificates/apply"
              className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold hover:bg-muted"
            >
              Apply for Certificate
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
