"use client";

import { MarqueeAnimation } from "@/components/ui/marquee-effect";
import { ALL_CERTIFICATE_TYPES } from "@/lib/certificate-types";

export function MarqueeCertificatesSection() {
  const certificateNames = ALL_CERTIFICATE_TYPES.map(cert => cert.name.toUpperCase()).join(" • ") + " • ";

  return (
    <section className="py-4 bg-primary overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-primary z-10 pointer-events-none" />
        <div className="transform -rotate-1 origin-center">
          <MarqueeAnimation
            direction="left"
            baseVelocity={0.5}
            className="text-white py-2 text-3xl md:text-4xl tracking-wider"
          >
            {certificateNames}
          </MarqueeAnimation>
        </div>
      </div>
    </section>
  );
}
