"use client";

import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { AnimatedLinkButton } from "@/components/ui/ripple-button";
import Image from "next/image";

interface CTASectionProps {
  title?: string;
  description?: string;
  doctorImage?: string;
  buttonPrimary?: {
    label: string;
    href: string;
  };
}

export const CTASection = ({
  title = "It's Time Change Your Life Today",
  description = "Get your medical certificate quickly and easily from certified doctors.",
  doctorImage = "/cta.png",
  buttonPrimary = {
    label: "Get Appy Now",
    href: "/certificates/apply",
  },
}: CTASectionProps) => {
  return (
    <section className="relative overflow-visible bg-primary/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex min-h-[300px] items-center lg:min-h-[350px]">
          <div className="grid w-full items-center gap-8 lg:grid-cols-2">
            {/* Left Content */}
            <FadeIn direction="left">
              <div className="max-w-xl py-12 lg:py-16">
                <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                  {title}
                </h2>
                <p className="mt-4 text-lg text-white/90">
                  {description}
                </p>
                <div className="mt-8">
                  <AnimatedLinkButton
                    href={buttonPrimary.href}
                    variant="outline-white"
                    className="bg-white text-[#4A90E2] hover:bg-white/90"
                  >
                    {buttonPrimary.label}
                    <ArrowRight className="h-5 w-5" />
                  </AnimatedLinkButton>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Image - Positioned Absolute to overflow */}
          <FadeIn direction="right" className="hidden lg:block">
            <div className="absolute -right-20 -top-60 bottom-0 z-10 w-[500px]">
              <Image
                src={doctorImage}
                alt="Medical professional"
                fill
                className="object-contain object-bottom"
                priority
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default CTASection;