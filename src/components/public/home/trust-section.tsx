"use client";

import { ArrowLeft, ArrowRight, Shield, Clock, IndianRupee, BadgeCheck, Lock, Headphones } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { GridPattern } from "@/components/ui/grid-pattern";
import { InView } from "@/components/ui/in-view";

const TRUST_ITEMS = [
  {
    id: "verified",
    icon: Shield,
    title: "Verified & Authentic",
    description:
      "Every certificate is reviewed and signed by a registered MBBS practitioner with valid credentials. Our doctors are verified and comply with all medical council regulations.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "quick",
    icon: Clock,
    title: "Quick Turnaround",
    description:
      "Receive your certificate within 30 minutes to 24 hours through a fully digital, hassle-free workflow. No hospital visits or long waiting queues.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "pricing",
    icon: IndianRupee,
    title: "Transparent Pricing",
    description:
      "Clear pricing with no hidden fees. Starting from just ₹599 for digital certificates. Multiple payment options available including UPI, cards, and net banking.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "compliant",
    icon: BadgeCheck,
    title: "NMC & WHO Compliant",
    description:
      "All certificates adhere to National Medical Commission and WHO guidelines for validity. Accepted by employers, institutions, and travel authorities across India.",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "privacy",
    icon: Lock,
    title: "Privacy & Security",
    description:
      "Your personal and medical information is handled with strict confidentiality and encryption. We follow HIPAA-compliant data protection practices.",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "support",
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "Our support team is available to assist you through the entire process, from application to delivery. Get help via WhatsApp, email, or phone.",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80",
  },
];

export function TrustSection() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className="relative border-t bg-background px-4 py-20 overflow-hidden">
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray="4 2"
        className="mask-[radial-gradient(ellipse_at_center,white,transparent_70%)]"
      />
      <div className="mx-auto max-w-6xl">
        <InView>
          <div className="mb-8 flex flex-col items-center justify-between gap-4 md:mb-14 lg:mb-16 lg:flex-row">
            <div className="text-center lg:text-left">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                Our Promise
              </span>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                Why Choose MediProofDocs?
              </h2>
              <p className="mt-3 max-w-lg text-muted-foreground">
                We&apos;re committed to providing authentic, timely, and
                confidential medical certification services.
              </p>
            </div>
            <div className="hidden shrink-0 gap-2 md:flex">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  carouselApi?.scrollPrev();
                }}
                disabled={!canScrollPrev}
                className="disabled:pointer-events-auto"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  carouselApi?.scrollNext();
                }}
                disabled={!canScrollNext}
                className="disabled:pointer-events-auto"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </InView>
      </div>

      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
            {TRUST_ITEMS.map((item) => (
              <CarouselItem
                key={item.id}
                className="max-w-80 pl-5 lg:max-w-100"
              >
                <div className="group h-full rounded-2xl">
                    <div className="relative h-full min-h-88 overflow-hidden rounded-2xl border">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 h-full bg-linear-to-t from-primary/90 via-primary/40 to-transparent mix-blend-multiply" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-white/90">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-8 flex justify-center gap-2">
          {TRUST_ITEMS.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-primary" : "bg-primary/20"
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
