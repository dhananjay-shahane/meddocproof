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
  title = "Get Verified Medical Certificates Online — Fast & Secure",
  description = "All certificates are issued after a licensed doctor's online consultation, in compliance with Indian telemedicine guidelines.",
  doctorImage = "/cta.png",
  buttonPrimary = {
    label: "Apply for Certificate",
    href: "/certificates/apply",
  },
}: CTASectionProps) => {
  return (
    <section className="relative overflow-visiable bg-linear-to-b from-primary/30 via-primary/30 to-secondary/30 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex min-h-[280px] items-center lg:min-h-[350px]">
          <div className="grid w-full items-center gap-6 lg:grid-cols-2">
            {/* Left Content */}
            <FadeIn direction="left">
              <div className="max-w-xl py-10 sm:py-12 lg:py-16 text-center sm:text-left">
                <h2 className="text-2xl font-bold leading-tight text-black sm:text-3xl lg:text-4xl xl:text-5xl drop-shadow-sm">
                  Get Verified Medical Certificates Online —{" "}
                   <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500">
                  Fast & Secure
                </span>
                <svg
                  className="absolute -bottom-1.5 left-0 w-full h-2.5 text-cyan-200/50 -z-0"
                  viewBox="0 0 200 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg "
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2.00025 6.99997C25.7509 3.49998 55.375 -0.500029 100 2.49998C144.625 5.49998 174.251 6.99997 198 6.99997"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
                </h2>
                <p className="mt-3 text-base text-gray-600 sm:mt-4 sm:text-lg">
                  {description}
                </p>
                <div className="mt-6 sm:mt-8 flex justify-center sm:justify-start">
                  <AnimatedLinkButton
                    href={buttonPrimary.href}
                    variant="outline-white"
                    className="bg-primary text-white hover:bg-teal-400"
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