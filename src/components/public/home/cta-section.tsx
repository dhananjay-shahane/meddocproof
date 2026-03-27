"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { AnimatedLinkButton } from "@/components/ui/ripple-button";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  title?: string;
  description?: string;
  doctorImage?: string;
  imageWrapperClassName?: string;
  imageClassName?: string;
  buttonPrimary?: {
    label: string;
    href: string;
  };
}

export const CTASection = ({
  title = "Get Verified Medical Certificates Online - Fast & Secure",
  description = "All certificates are issued after a licensed doctor's online consultation, in compliance with Indian telemedicine guidelines.",
  doctorImage = "/cta.png",
  imageWrapperClassName,
  imageClassName,
  buttonPrimary = {
    label: "Apply for Certificate",
    href: "/certificates/apply",
  },
}: CTASectionProps) => {
  return (
    <section className="relative overflow-hidden bg-linear-to-t from-primary/40 via-primary/40 to-green-500/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex min-h-80 items-center lg:min-h-105 xl:min-h-120">
          <div className="grid w-full items-center gap-6 lg:grid-cols-2">
            <FadeIn direction="left">
              <div className="max-w-xl py-10 text-center sm:py-12 sm:text-left lg:py-16">
                <h2 className="text-2xl font-bold leading-tight text-black drop-shadow-sm sm:text-3xl lg:text-4xl xl:text-5xl">
                  {title}
                </h2>
                <p className="mt-3 text-base text-gray-600 sm:mt-4 sm:text-lg">
                  {description}
                </p>
                <div className="mt-6 flex justify-center sm:mt-8 sm:justify-start">
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

          <div
            className={cn(
              "absolute -right-4 bottom-0 z-10 hidden h-120 w-105 lg:block xl:h-112.5 xl:w-120 2xl:h-125 2xl:w-135",
              imageWrapperClassName
            )}
          >
            <Image
              src={doctorImage}
              alt="Medical professional"
              fill
              className={cn("object-contain object-bottom", imageClassName)}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
