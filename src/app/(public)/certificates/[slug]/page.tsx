'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCertificateBySlug } from '@/lib/certificate-types';
import { getCertificateDescription } from '@/lib/certificate-descriptions';
import { CertificateHero } from '@/components/public/certificates/certificate-hero';
import { CertificateSample } from '@/components/public/certificates/certificate-sample';
import { CertificateBenefits } from '@/components/public/certificates/certificate-benefits';
import { CertificateFAQ } from '@/components/public/certificates/certificate-faq';
import { RelatedCertificates } from '@/components/public/certificates/related-certificates';

/**
 * Certificate Detail Page
 *
 * Based on research of medical certificate service websites,
 * the optimal structure for certificate pages includes:
 *
 * 1. HERO SECTION (✓ Implemented)
 *    - Clear certificate title
 *    - Detailed description with benefits
 *    - Primary CTA button (Apply Now)
 *    - Trust signals (stats, ratings, floating elements)
 *
 * 2. SAMPLE CERTIFICATE PREVIEW (✓ Implemented)
 *    - Shows actual certificate format
 *    - Builds trust and transparency
 *    - Reduces user hesitation
 *
 * 3. KEY BENEFITS (✓ Implemented)
 *    - Doctor verified
 *    - Quick delivery
 *    - Valid nationwide
 *    - 24/7 availability
 *
 * 4. FAQ SECTION (✓ Implemented)
 *    - Common questions about this certificate type
 *    - Reduces support inquiries
 *    - Improves SEO
 *
 * 5. RELATED CERTIFICATES (✓ Implemented)
 *    - Other certificates users might need
 *    - Cross-sell opportunity
 *
 * Side Content Separated into Components:
 * - CertificateSidebar: Floating elements, doctor image, badges
 * - Each section is now in its own file for better maintainability
 */

export default function CertificatePage() {
  const params = useParams();
  const slug = params.slug as string;

  const certificate = getCertificateBySlug(slug);
  const certInfo = getCertificateDescription(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Certificate Not Found</h1>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Uses CertificateSidebar for right-side content */}
      <CertificateHero certInfo={certInfo} />

      {/* Sample Certificate Preview - Shows certificate format */}
      <CertificateSample slug={slug} title={certInfo.title} />

      {/* Key Benefits Section */}
      <CertificateBenefits features={certInfo.features} />

      {/* FAQ Section - Certificate-specific questions */}
      <CertificateFAQ slug={slug} />

      {/* Related Certificates - Cross-sell other certificate types */}
      <RelatedCertificates currentSlug={slug} />
    </div>
  );
}
