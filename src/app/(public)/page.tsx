import { HeroSection } from "@/components/public/home/hero-section";
import { CertificateTypesSection } from "@/components/public/home/certificate-types-section";
import { FeaturesSection } from "@/components/public/home/features-section";
import { HowItWorksSection } from "@/components/public/home/how-it-works-section";
import { TestimonialsSection } from "@/components/public/home/testimonials-section";
import { FAQSection } from "@/components/public/home/faq-section";
import { GoogleReviewsSection } from "@/components/public/home/google-reviews-section";
import { CTASection } from "@/components/public/home/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CertificateTypesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <GoogleReviewsSection />
      <CTASection />
    </>
  );
}
