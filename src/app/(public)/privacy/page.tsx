import { Metadata } from "next";
import { Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { GridPattern } from "@/components/ui/grid-pattern";
import { CTASection } from "@/components/public/home/cta-section";

export const metadata: Metadata = {
  title: "Privacy Policy | MediProofDocs",
  description:
    "Read how MediProofDocs collects, uses, stores, and protects your personal information.",
};

const SECTIONS = [
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use", label: "How We Use Your Info" },
  { id: "sharing", label: "Sharing of Information" },
  { id: "data-security", label: "Data Security" },
  { id: "cookies", label: "Cookies" },
  { id: "your-rights", label: "Your Rights" },
  { id: "third-party", label: "Third-Party Links" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact Us" },
];

export default function PrivacyPage() {
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
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            How MediProofDocs collects, uses, and protects your personal information.
          </p>
          <p className="mt-3 text-sm text-muted-foreground/70">Last updated: February 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          {/* Table of Contents */}
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
            <p>
              Welcome to MediProofDocs. Protecting your privacy is important to us.
              This Privacy Policy explains how we collect, use, store, and protect
              your personal information when you use our website and services.
            </p>
            <p>
              By accessing or using MediProofDocs, you agree to this Privacy Policy.
              If you do not agree, please do not use our services.
            </p>

            <h2 id="information-we-collect">1. Information We Collect</h2>
            <p>
              We collect only the information that is necessary to provide our
              services effectively and securely.
            </p>

            <h3>1.1 Personal Information</h3>
            <ul>
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>Date of Birth (if required)</li>
              <li>
                Medical details required for consultation and issuing medical
                certificates
              </li>
            </ul>

            <h3>1.2 Payment Information</h3>
            <p>
              To complete transactions, certain payment-related information is
              required. All payment transactions are carried out using secure,
              encrypted systems and industry-standard security protocols. Payment
              information is used only for transaction processing and refunds.
            </p>

            <h3>1.3 Automatically Collected Information</h3>
            <ul>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device and operating system information</li>
              <li>Pages visited and basic usage data</li>
            </ul>

            <h2 id="how-we-use">2. How We Use Your Information</h2>
            <p>Your information is used to:</p>
            <ul>
              <li>
                Provide online medical consultations and issue medical certificates
              </li>
              <li>Process payments and refunds</li>
              <li>Communicate regarding your requests or service updates</li>
              <li>Improve website functionality and user experience</li>
              <li>Comply with applicable legal and regulatory requirements</li>
            </ul>

            <h2 id="sharing">3. Sharing of Information</h2>
            <p>We do not sell, rent, or trade your personal information.</p>
            <p>We may share information only in the following cases:</p>
            <ul>
              <li>
                With licensed medical practitioners for consultation and certificate
                issuance
              </li>
              <li>
                With trusted service providers necessary for website operations and
                payment processing
              </li>
              <li>When required by law, court orders, or government authorities</li>
            </ul>

            <h2 id="data-security">4. Data Security</h2>
            <p>
              We take reasonable administrative and technical measures to protect
              your personal information, including:
            </p>
            <ul>
              <li>Secure Socket Layer (SSL) encryption</li>
              <li>Secure hosting environments</li>
              <li>Restricted access to personal data</li>
            </ul>
            <p>
              While we follow reasonable security practices, no method of data
              transmission over the internet is completely secure. Therefore,
              absolute security cannot be guaranteed.
            </p>

            <h2 id="cookies">5. Cookies</h2>
            <p>MediProofDocs may use cookies to:</p>
            <ul>
              <li>Improve website functionality</li>
              <li>Analyze traffic and usage patterns</li>
            </ul>
            <p>
              You can choose to disable cookies through your browser settings.
            </p>

            <h2 id="your-rights">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access or update your personal information</li>
              <li>
                Request deletion of your data (subject to legal and regulatory
                requirements)
              </li>
              <li>Withdraw consent for non-essential communications</li>
            </ul>
            <p>
              To exercise these rights, contact us at:{" "}
              <a href="mailto:support@medproofdocs.com">
                support@medproofdocs.com
              </a>
            </p>

            <h2 id="third-party">7. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not
              responsible for the content, security, or privacy practices of those
              websites.
            </p>

            <h2 id="changes">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will
              be posted on this page.
            </p>

            <h2 id="contact">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how your data
              is handled, please contact us at:{" "}
              <a href="mailto:support@medproofdocs.com">
                support@medproofdocs.com
              </a>
            </p>

            {/* Cross-links */}
            <div className="not-prose mt-10 flex flex-wrap gap-3">
              <Link href="/terms" className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                Terms &amp; Conditions <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/refund-policy" className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                Refund Policy <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        </div>
      </div>

      <CTASection
        title="Need A Verified Medical Certificate?"
        description="Complete a short online consultation and receive a professionally formatted medical certificate issued by a registered doctor."
        buttonPrimary={{
          label: "Apply For Certificate",
          href: "/certificates/apply",
        }}
      />
    </>
  );
}
