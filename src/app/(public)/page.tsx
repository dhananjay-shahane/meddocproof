import { HeroSection } from "@/components/public/home/hero-section";
import { CertificateTypesSection } from "@/components/public/home/certificate-types-section";
import { HowItWorksSection } from "@/components/public/home/how-it-works-section";
import { TrustSection } from "@/components/public/home/trust-section";
import { TestimonialsSection } from "@/components/public/home/testimonials-section";
import { FAQSection } from "@/components/public/home/faq-section";
import { CTASection } from "@/components/public/home/cta-section";
import { InfoSection } from "@/components/public/home/info-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CertificateTypesSection />
      <TrustSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <InfoSection />
      <CTASection />
    </>
  );
}
