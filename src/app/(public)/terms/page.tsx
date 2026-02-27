import { Metadata } from "next";
import { Scale, ArrowRight } from "lucide-react";
import Link from "next/link";
import { GridPattern } from "@/components/ui/grid-pattern";

export const metadata: Metadata = {
  title: "Terms & Conditions | MediProofDocs",
  description:
    "Read the terms and conditions for using MediProofDocs medical certificate services.",
};

const SECTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "our-service", label: "Our Service" },
  { id: "doctor-responsibility", label: "Doctor Responsibility" },
  { id: "user-responsibility", label: "User Responsibility" },
  { id: "certificate-acceptance", label: "Certificate Acceptance" },
  { id: "refund-policy", label: "Refund Policy" },
  { id: "misuse", label: "Misuse & Restricted Activities" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "website-availability", label: "Website Availability" },
  { id: "changes", label: "Changes to Services" },
  { id: "disclaimer", label: "Disclaimer" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "governing-law", label: "Governing Law" },
  { id: "contact", label: "Contact Us" },
];

export default function TermsPage() {
  return (
    <>
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b bg-primary/5">
        <GridPattern
          width={30}
          height={30}
          x={-1}
          y={-1}
          strokeDasharray="4 2"
          className="mask-[radial-gradient(ellipse_at_center,white,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:py-20 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <Scale className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Terms &amp; Conditions
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Please read these terms carefully before using MediProofDocs services.
          </p>
          <p className="mt-3 text-sm text-muted-foreground/70">Last updated: February 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          {/* Table of Contents - Desktop sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24">
            <h2 id="introduction">1. Introduction</h2>
            <p>
              Welcome to MediProofDocs. By using our website and services, you agree
              to these Terms &amp; Conditions. If you do not agree, please do not
              use our website.
            </p>

            <h2 id="our-service">2. Our Service</h2>
            <p>
              MediProofDocs provides an online consultation platform where users can
              connect with registered medical doctors.
            </p>
            <ul>
              <li>We help users request medical certificates after doctor consultation.</li>
              <li>Final approval and issuance depend only on the doctor&apos;s decision.</li>
              <li>We do not guarantee that a certificate will be issued.</li>
              <li>Certificates are provided for genuine medical reasons only.</li>
            </ul>

            <h2 id="doctor-responsibility">3. Doctor Responsibility</h2>
            <ul>
              <li>All medical consultations are handled by registered doctors.</li>
              <li>Doctors may approve or reject requests based on medical evaluation.</li>
              <li>The website is not responsible for doctor decisions.</li>
              <li>
                Certificates may include digital or handwritten signatures/seals as
                decided by the doctor.
              </li>
            </ul>

            <h2 id="user-responsibility">4. User Responsibility</h2>
            <p>By using our service, you agree that:</p>
            <ul>
              <li>You will provide true and correct information.</li>
              <li>You will not submit fake, misleading, or false details.</li>
              <li>
                You understand that wrong information may lead to rejection without
                refund.
              </li>
              <li>You will attend the consultation properly if required.</li>
            </ul>

            <h2 id="certificate-acceptance">5. Medical Certificate Acceptance</h2>
            <ul>
              <li>
                We do not guarantee acceptance of certificates by employers,
                colleges, companies, or authorities.
              </li>
              <li>
                Acceptance depends on the organization requesting the certificate.
              </li>
              <li>We are not liable for rejection by any third party.</li>
            </ul>

            <h2 id="refund-policy">6. Refund Policy</h2>
            <p>Refunds are not applicable if:</p>
            <ul>
              <li>Consultation is completed.</li>
              <li>Doctor has reviewed your case.</li>
              <li>Certificate is issued or rejected after consultation.</li>
              <li>Incorrect or incomplete information is provided.</li>
              <li>Refund is requested after service processing.</li>
            </ul>
            <p>
              If any refund is approved, service or convenience charges may be
              deducted. See our{" "}
              <Link href="/refund-policy" className="text-primary hover:text-primary/80">
                full Refund Policy
              </Link>{" "}
              for details.
            </p>

            <h2 id="misuse">7. Misuse &amp; Restricted Activities</h2>
            <p>Users must not:</p>
            <ul>
              <li>Use the website for illegal purposes.</li>
              <li>Upload fake reports or documents.</li>
              <li>Misuse doctor identity or certificates.</li>
              <li>Attempt hacking, spamming, or system abuse.</li>
              <li>Copy or misuse website content.</li>
            </ul>
            <p>Violation may result in permanent access ban.</p>

            <h2 id="intellectual-property">8. Intellectual Property</h2>
            <p>
              All website content including text, design, logos, and structure
              belongs to MediProofDocs. You may not copy, reuse, or distribute
              content without permission.
            </p>

            <h2 id="website-availability">9. Website Availability</h2>
            <ul>
              <li>We try to keep services running smoothly.</li>
              <li>
                We are not responsible for delays due to technical issues, internet
                problems, or doctor availability.
              </li>
            </ul>

            <h2 id="changes">10. Changes to Services</h2>
            <p>
              MediProofDocs may update, modify, or stop services anytime without
              prior notice.
            </p>

            <h2 id="disclaimer">11. Disclaimer</h2>
            <ul>
              <li>We do not provide emergency medical services.</li>
              <li>
                Our platform is for online consultation and documentation only.
              </li>
              <li>
                Medical certificates are valid only for the mentioned duration.
              </li>
              <li>Once issued, certificates cannot be changed.</li>
            </ul>

            <h2 id="liability">12. Limitation of Liability</h2>
            <p>MediProofDocs is not responsible for:</p>
            <ul>
              <li>Loss due to certificate rejection.</li>
              <li>Misuse of certificate by user.</li>
              <li>Any indirect or third-party damages.</li>
            </ul>

            <h2 id="governing-law">13. Governing Law</h2>
            <p>
              These Terms are governed by Indian law. Any disputes will be handled
              under Indian jurisdiction.
            </p>

            <h2 id="contact">14. Contact Us</h2>
            <p>
              For support or questions:{" "}
              <a href="mailto:support@medproofdocs.com">
                support@medproofdocs.com
              </a>
            </p>

            {/* Cross-link */}
            <div className="not-prose mt-10 flex flex-wrap gap-3">
              <Link href="/privacy" className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                Privacy Policy <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/refund-policy" className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                Refund Policy <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
