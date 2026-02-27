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
    <section className="relative overflow-visiable bg-linear-to-b from-primary/40 via-primary/40 to-teal-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex min-h-[280px] items-center lg:min-h-[350px]">
          <div className="grid w-full items-center gap-6 lg:grid-cols-2">
            {/* Left Content */}
            <FadeIn direction="left">
              <div className="max-w-xl py-10 sm:py-12 lg:py-16 text-center sm:text-left">
                <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-5xl">
                  {title}
                </h2>
                <p className="mt-3 text-base text-white/90 sm:mt-4 sm:text-lg">
                  {description}
                </p>
                <div className="mt-6 sm:mt-8 flex justify-center sm:justify-start">
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

          {/* Right Image - Hidden on mobile, positioned absolute on desktop */}
          <div className="hidden lg:block absolute -right-20 -top-60 bottom-0 z-10 w-[500px]">
              <Image
                src={doctorImage}
                alt="Medical professional"
                fill
                className="object-contain object-bottom"
                priority
              />
            </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;