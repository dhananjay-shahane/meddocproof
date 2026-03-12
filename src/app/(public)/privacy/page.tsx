import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/public/home/cta-section";

export const metadata: Metadata = {
  title: "Privacy Policy | MediProofDocs",
  description:
    "Learn how MediProofDocs collects, uses, stores, and protects personal information shared through the platform.",
};

const sectionTitleClass = "text-3xl font-semibold text-slate-900 mt-10 mb-4";
const paragraphClass = "text-slate-600 leading-relaxed mb-4";
const listClass = "list-disc pl-6 space-y-2 text-slate-600 leading-relaxed mb-6";

export default function PrivacyPage() {
  return (
    <>
      {/* Hero Header */}
      <div className="relative border-b border-primary/10 overflow-hidden">
        {/* Background Image - Unsplash CDN */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80')" }}
        />
        {/* Light Secondary Color Overlay */}
        <div className="absolute inset-0 bg-primary/85" />
        {/* Content */}
        <div className="relative mx-auto max-w-4xl px-4 pt-28 pb-20 sm:pt-36 sm:pb-28 text-center">
          <span className="inline-block rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white mb-4">
            Privacy Policy
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Privacy Policy
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <article className="prose prose-slate max-w-none">
          <h2 className={sectionTitleClass}>1. Privacy Policy</h2>
          <p className={paragraphClass}>
            This Privacy Policy describes how MediProofDocs (the &quot;Site&quot; or &quot;we&quot;) collects, uses, and 
            discloses your Personal Information when you visit or make a purchase from the Site.
          </p>
          <p className={paragraphClass}>
            The security of your personal information is important to us. When you enter sensitive information 
            (such as your phone number or other details through our service), we encrypt that information. 
            Stargate Technologies Pvt Ltd helps us with data management and is a sub-contractor to our service. 
            They will host, store, and process data under our instruction, and on our behalf. They may have access 
            to your data for operational purposes only.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-6">
            <p className={`${paragraphClass} mb-0`}>
              If you are using the Services on behalf of a business entity, you confirm that:
            </p>
            <ul className={`${listClass} mt-3 mb-0`}>
              <li>You have the authority to agree to this Privacy Policy on behalf of that entity</li>
              <li>The entity agrees to be legally bound by this Privacy Policy</li>
            </ul>
          </div>

          <h2 className={sectionTitleClass}>2. Personal Information We Collect</h2>
          <p className={paragraphClass}>
            We may collect the following information that you choose to provide:
          </p>
          <ul className={listClass}>
            <li><strong>Full name</strong></li>
            <li><strong>Email address</strong></li>
            <li><strong>Phone number</strong></li>
            <li><strong>Address and location</strong></li>
            <li><strong>Date of birth</strong> and Age</li>
            <li><strong>Government issued identification</strong></li>
            <li>Order history and preferences</li>
            <li>Any content you submit via forms or communication channels</li>
            <li><strong>Financial or payment details</strong> necessary to process transactions</li>
            <li>Any other personal information you provide while using our services</li>
          </ul>

          <h2 className={sectionTitleClass}>3. How We Use Your Personal Information</h2>
          <p className={paragraphClass}>
            We may collect, store, use, and disclose your information for the following purposes:
          </p>
          <ul className={listClass}>
            <li>To fulfill orders, process payments, and manage refunds or exchanges</li>
            <li>To provide customer support and respond to inquiries</li>
            <li>To send promotional materials, updates, and marketing communications (if you opt in)</li>
            <li>To analyze and improve our products, services, and website functionality</li>
            <li>To prevent fraud and ensure secure transactions</li>
            <li>To share insights with trusted third-party partners for analytics or marketing</li>
            <li>To comply with legal requirements and enforce our terms</li>
          </ul>

          <h2 className={sectionTitleClass}>4. Disclosure to Third Parties</h2>
          <p className={paragraphClass}>
            We may disclose your personal information to:
          </p>
          <ul className={listClass}>
            <li>Third-party service providers who assist us in operating the website or conducting business</li>
            <li>Professional service companies for data processing or analytics</li>
            <li>Marketing and advertising platforms (with your consent)</li>
            <li>Government, regulatory, or legal bodies when required by law</li>
          </ul>

          <h2 className={sectionTitleClass}>5. Data Protection and Security</h2>
          <p className={paragraphClass}>
            Your personal information is stored securely. It is uploaded, maintained using industry-standard 
            security measures to protect it from theft, loss, misuse, unauthorized access, disclosure, 
            alteration, or destruction.
          </p>
          <p className={paragraphClass}>
            We take reasonable measures to protect your personal information from unauthorized access, 
            including encryption protocols, secure servers, and restricted access policies.
          </p>

          <h2 className={sectionTitleClass}>6. Sensitive Information</h2>
          <p className={paragraphClass}>
            We may occasionally process sensitive information, such as:
          </p>
          <ul className={listClass}>
            <li>Health status</li>
            <li>Biometric data</li>
            <li>Personal beliefs</li>
          </ul>
          <p className={paragraphClass}>
            Such data is collected only when necessary and protected with enhanced security measures.
          </p>

          <h2 className={sectionTitleClass}>7. Your Rights</h2>
          <p className={paragraphClass}>
            Depending on your location, you may have the following rights:
          </p>
          <ul className={listClass}>
            <li><strong>Access</strong> the personal information we hold about you</li>
            <li><strong>Request correction</strong> of inaccurate information</li>
            <li><strong>Request deletion</strong> of your personal information</li>
            <li><strong>Opt out</strong> of marketing communications</li>
            <li><strong>Withdraw consent</strong> for data processing (where applicable)</li>
          </ul>

          <h2 className={sectionTitleClass}>8. Cookies & Web Beacons</h2>
          <p className={paragraphClass}>
            Our Site may use cookies, pixel tags, and similar technologies to track your preferences, 
            analyze Site usage, and improve user experience. You can manage cookie preferences in 
            your browser settings.
          </p>

          <h2 className={sectionTitleClass}>9. Links to External Sites</h2>
          <p className={paragraphClass}>
            Our Site may contain links to third-party websites. We are not responsible for their 
            privacy practices. Please review their policies before providing personal information.
          </p>

          <h2 className={sectionTitleClass}>10. Policy Updates</h2>
          <p className={paragraphClass}>
            We may update this Privacy Policy periodically. Updates will be posted on this page. 
            Please check back regularly to stay informed.
          </p>

          <h2 className={sectionTitleClass}>11. Contact Us</h2>
          <p className={paragraphClass}>
            For questions about this Privacy Policy or your personal information, contact us at:
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 my-4">
            <p className="font-semibold text-slate-900 mb-2">Stargate Technologies Pvt Ltd</p>
            <p className="text-slate-600 mb-1">
              <a href="mailto:admin@medproofdocs.com" className="text-primary hover:underline">admin@medproofdocs.com</a>
            </p>
            <p className="text-slate-600 mb-1">
              <a href="mailto:support@medproofdocs.com" className="text-primary hover:underline">support@medproofdocs.com</a>
            </p>
            <p className="text-slate-600">
              <a href="mailto:help@medproofdocs.in" className="text-primary hover:underline">help@medproofdocs.in</a>
            </p>
          </div>

          {/* Cross-links */}
          <div className="flex flex-wrap gap-3 mt-10 pt-6 border-t border-slate-200">
            <Link
              href="/terms"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/refund-policy"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Refund Policy
            </Link>
          </div>
        </article>
      </div>

      <CTASection
        title="Need A Secure, Guided Certificate Workflow?"
        description="Start with the application flow and we will guide your request through the right support and review steps."
        buttonPrimary={{
          label: "Apply For Certificate",
          href: "/certificates/apply",
        }}
      />
    </>
  );
}
