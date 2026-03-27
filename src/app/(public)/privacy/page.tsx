import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/public/home/cta-section";

export const metadata: Metadata = {
  title: "Privacy Policy | Medical Data Protection | Online Doctor Consultation India | QuickMedicalCertificate",
  description:
    "Read our comprehensive privacy policy for online medical certificate services. Learn how QuickMedicalCertificate.com protects your personal health information, medical data, and maintains patient confidentiality under Indian telemedicine regulations.",
  keywords: [
    "medical data privacy India",
    "patient confidentiality telemedicine",
    "online consultation privacy policy",
    "healthcare data protection",
    "personal health information security",
    "medical certificate privacy",
    "telemedicine data security",
    "doctor patient confidentiality",
    "health information protection India",
    "online medical records privacy",
    "IT Act 2000 compliance",
    "NMC telemedicine guidelines privacy"
  ],
  openGraph: {
    title: "Privacy Policy | Medical Data Protection | QuickMedicalCertificate",
    description: "Comprehensive privacy policy ensuring patient confidentiality and secure handling of medical data for online doctor consultations in India.",
    type: "website",
    locale: "en_IN",
  },
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
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
            Privacy Policy for Online Medical Certificate Services
          </h1>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            Your medical data privacy and patient confidentiality are our top priorities.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <article className="prose prose-slate max-w-none">
          {/* Introduction */}
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-5 mb-8">
            <p className={`${paragraphClass} mb-0`}>
              <strong>Last Updated:</strong> January 2025. At QuickMedicalCertificate.com, we respect your privacy and 
              treat your personal and medical details with the utmost care. All information is securely handled and used 
              only for doctor consultation and issuing your medical certificate. Our system is built to protect your details 
              at every step, compliant with the <strong>Information Technology Act 2000</strong> and 
              <strong> Telemedicine Practice Guidelines 2020</strong>.
            </p>
          </div>

          <h2 className={sectionTitleClass}>1. About This Privacy Policy</h2>
          <p className={paragraphClass}>
            This Privacy Policy describes how QuickMedicalCertificate.com (operated by Stargate Technologies Pvt Ltd) 
            collects, uses, stores, and protects your personal and medical information when you use our online medical 
            certificate and telemedicine consultation services.
          </p>
          <p className={paragraphClass}>
            The security of your personal health information is paramount. When you submit sensitive information 
            (such as medical history, contact details, or identification documents), we employ encryption and secure 
            protocols to protect your data throughout the consultation and certificate issuance process.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
            <p className="font-semibold text-green-900 mb-2">Our Data Protection Commitment:</p>
            <ul className="list-disc pl-6 space-y-1 text-green-800">
              <li>✔️ Full compliance with Indian IT Act 2000 and healthcare regulations</li>
              <li>✔️ Strict doctor-patient confidentiality maintained</li>
              <li>✔️ Industry-standard encryption for all data transmission</li>
              <li>✔️ No sale of personal or medical data to third parties</li>
            </ul>
          </div>

          <h2 className={sectionTitleClass}>2. Personal & Medical Information We Collect</h2>
          <p className={paragraphClass}>
            To provide online medical certificate services and telemedicine consultations, we collect the following information:
          </p>
          
          <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Personal Identification Data:</h3>
          <ul className={listClass}>
            <li><strong>Full name</strong> (as per official documents)</li>
            <li><strong>Date of birth</strong> and age verification</li>
            <li><strong>Gender</strong></li>
            <li><strong>Contact information</strong> – Email address, mobile number (WhatsApp preferred)</li>
            <li><strong>Address</strong> – Street, city, state, postal code, country</li>
            <li><strong>Government-issued identification</strong> (for verification purposes)</li>
            <li><strong>Guardian details</strong> (for minors or caretaker certificates)</li>
          </ul>

          <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Medical Information:</h3>
          <ul className={listClass}>
            <li><strong>Medical condition/symptoms</strong> (fever, cold, body pain, etc.)</li>
            <li><strong>Duration of illness</strong> and leave requirements</li>
            <li><strong>Medical history</strong> relevant to the certificate request</li>
            <li><strong>Consultation recordings</strong> (for quality and medical records)</li>
            <li><strong>Supporting documents</strong> (prescriptions, reports if required)</li>
          </ul>

          <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Technical & Transaction Data:</h3>
          <ul className={listClass}>
            <li>Order history and certificate requests</li>
            <li>Payment information (processed securely via payment gateways)</li>
            <li>IP address and device information for security</li>
            <li>Cookies and browsing preferences</li>
          </ul>

          <h2 className={sectionTitleClass}>3. How We Use Your Information</h2>
          <p className={paragraphClass}>
            Your personal and medical information is used strictly for the following purposes:
          </p>
          <ul className={listClass}>
            <li><strong>Doctor Consultation:</strong> To facilitate online medical consultations with registered doctors</li>
            <li><strong>Certificate Issuance:</strong> To generate and deliver your medical certificate</li>
            <li><strong>Verification:</strong> To verify your identity and medical claims</li>
            <li><strong>Communication:</strong> To contact you regarding your application status and consultation</li>
            <li><strong>Payment Processing:</strong> To securely process your payment transactions</li>
            <li><strong>Service Improvement:</strong> To enhance our telemedicine platform and user experience</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable healthcare and IT regulations</li>
            <li><strong>Quality Assurance:</strong> To maintain service standards and resolve disputes</li>
          </ul>

          <h2 className={sectionTitleClass}>4. Data Sharing & Third-Party Disclosure</h2>
          <p className={paragraphClass}>
            We may share your information with the following parties strictly for service delivery:
          </p>
          <ul className={listClass}>
            <li><strong>Registered Doctors:</strong> For medical consultation and certificate issuance</li>
            <li><strong>Payment Processors:</strong> Secure payment gateways for transaction processing (Razorpay, etc.)</li>
            <li><strong>Courier Services:</strong> For physical certificate delivery (shipping address only)</li>
            <li><strong>Technical Partners:</strong> Stargate Technologies Pvt Ltd for data hosting and management</li>
            <li><strong>Legal Authorities:</strong> When required by Indian law or court orders</li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
            <p className="font-semibold text-blue-900">Important:</p>
            <p className="text-blue-800">
              We do NOT sell, rent, or share your personal or medical data with third parties for marketing or advertising purposes.
            </p>
          </div>

          <h2 className={sectionTitleClass}>5. Data Security & Protection Measures</h2>
          <p className={paragraphClass}>
            Your personal and medical information is protected using industry-standard security measures:
          </p>
          <ul className={listClass}>
            <li><strong>Encryption:</strong> SSL/TLS encryption for all data transmission</li>
            <li><strong>Secure Servers:</strong> Data stored on protected servers with restricted access</li>
            <li><strong>Access Control:</strong> Only authorized personnel can access medical records</li>
            <li><strong>Regular Audits:</strong> Security assessments to identify and address vulnerabilities</li>
            <li><strong>Password Protection:</strong> Secure authentication for user accounts</li>
          </ul>

          <h2 className={sectionTitleClass}>6. Medical Data & Patient Confidentiality</h2>
          <p className={paragraphClass}>
            We adhere to strict doctor-patient confidentiality standards as per the Indian Medical Council (Professional Conduct, Etiquette and Ethics) Regulations and NMC guidelines:
          </p>
          <ul className={listClass}>
            <li>Medical consultations are confidential between patient and doctor</li>
            <li>Health information is never disclosed without patient consent (except legal requirements)</li>
            <li>Consultation recordings are stored securely and accessed only when necessary</li>
            <li>Medical certificates contain only essential information for verification</li>
          </ul>

          <h2 className={sectionTitleClass}>7. Your Privacy Rights</h2>
          <p className={paragraphClass}>
            Under Indian law, you have the following rights regarding your personal data:
          </p>
          <ul className={listClass}>
            <li><strong>Access:</strong> Request access to personal information we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
            <li><strong>Consent Withdrawal:</strong> Withdraw consent for data processing (may affect service delivery)</li>
            <li><strong>Data Portability:</strong> Request your data in a commonly used format</li>
          </ul>
          <p className={paragraphClass}>
            To exercise these rights, contact us at <a href="mailto:privacy@quickmedicalcertificate.com" className="text-primary font-semibold hover:underline">privacy@quickmedicalcertificate.com</a>
          </p>

          <h2 className={sectionTitleClass}>8. Cookies & Tracking Technologies</h2>
          <p className={paragraphClass}>
            Our website uses cookies and similar technologies to:
          </p>
          <ul className={listClass}>
            <li>Remember your preferences and login information</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Improve user experience and service functionality</li>
            <li>Ensure security and prevent fraud</li>
          </ul>
          <p className={paragraphClass}>
            You can manage cookie preferences through your browser settings. Disabling certain cookies may affect website functionality.
          </p>

          <h2 className={sectionTitleClass}>9. Data Retention Policy</h2>
          <p className={paragraphClass}>
            We retain your personal and medical information for the following periods:
          </p>
          <ul className={listClass}>
            <li><strong>Medical Records:</strong> As required by Indian healthcare regulations (typically 3-7 years)</li>
            <li><strong>Transaction Data:</strong> As per accounting and tax requirements</li>
            <li><strong>Communication Records:</strong> For service improvement and dispute resolution</li>
            <li><strong>Inactive Accounts:</strong> Data may be deleted after extended periods of inactivity</li>
          </ul>

          <h2 className={sectionTitleClass}>10. External Links</h2>
          <p className={paragraphClass}>
            Our website may contain links to third-party websites or services. We are not responsible for the 
            privacy practices of external sites. Please review their privacy policies before providing personal information.
          </p>

          <h2 className={sectionTitleClass}>11. Children&apos;s Privacy</h2>
          <p className={paragraphClass}>
            Medical certificate services for minors (under 18 years) require parental or guardian consent. 
            We do not knowingly collect personal information from children without appropriate parental consent.
          </p>

          <h2 className={sectionTitleClass}>12. Policy Updates</h2>
          <p className={paragraphClass}>
            We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. 
            Updates will be posted on this page with a revised &quot;Last Updated&quot; date. We encourage you to review 
            this policy regularly.
          </p>

          <h2 className={sectionTitleClass}>13. Contact Us</h2>
          <p className={paragraphClass}>
            For questions about this Privacy Policy, your personal data, or privacy concerns:
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 my-4">
            <p className="font-semibold text-slate-900 mb-2">Stargate Technologies Pvt Ltd</p>
            <p className="text-slate-600 mb-1">
              <strong>Privacy Inquiries:</strong>{" "}
              <a href="mailto:privacy@quickmedicalcertificate.com" className="text-primary hover:underline">privacy@quickmedicalcertificate.com</a>
            </p>
            <p className="text-slate-600 mb-1">
              <strong>General Support:</strong>{" "}
              <a href="mailto:contact@quickmedicalcertificate.com" className="text-primary hover:underline">contact@quickmedicalcertificate.com</a>
            </p>
            <p className="text-slate-600">
              <strong>Help Desk:</strong>{" "}
              <a href="mailto:help@quickmedicalcertificate.com" className="text-primary hover:underline">help@quickmedicalcertificate.com</a>
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
              Refund & Cancellation Policy
            </Link>
          </div>
        </article>
      </div>

      <CTASection
        title="Your Privacy Is Protected With Us"
        description="Apply for your medical certificate with confidence. Our secure platform ensures your personal and medical data remains confidential."
        buttonPrimary={{
          label: "Apply For Certificate",
          href: "/certificates/apply",
        }}
      />
    </>
  );
}
