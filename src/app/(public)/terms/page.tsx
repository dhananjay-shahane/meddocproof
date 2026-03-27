import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/public/home/cta-section";

export const metadata: Metadata = {
  title: "Terms & Conditions | Online Medical Certificate Service India | QuickMedicalCertificate",
  description:
    "Read our terms and conditions for online medical certificate services in India. Understand telemedicine consultation rules, NMC guidelines compliance, doctor consultation terms, certificate delivery timelines, and user responsibilities for legitimate medical documentation.",
  keywords: [
    "online medical certificate terms",
    "telemedicine consultation India",
    "medical certificate service agreement",
    "doctor consultation terms and conditions",
    "NMC guidelines medical certificate",
    "online doctor consultation agreement",
    "medical certificate eligibility",
    "telemedicine practice guidelines India",
    "registered doctor consultation terms",
    "healthcare service terms",
    "medical certificate delivery terms",
    "online health consultation India"
  ],
  openGraph: {
    title: "Terms & Conditions | Online Medical Certificate Service | QuickMedicalCertificate",
    description: "Complete terms and conditions for online medical certificate services. NMC & WHO compliant telemedicine consultations by registered Indian doctors.",
    type: "website",
    locale: "en_IN",
  },
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sectionTitleClass = "text-3xl font-semibold text-slate-900 mt-8 mb-3";
const paragraphClass = "text-slate-600 leading-relaxed mb-4";
const listClass = "list-disc pl-6 space-y-2 text-slate-600 leading-relaxed mb-6";

export default function TermsPage() {
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
            Terms & Conditions
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Terms and Conditions for Online Medical Certificate Services
          </h1>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            Please read these terms carefully before using our telemedicine consultation and medical certificate services in India.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <article className="prose prose-slate max-w-none">
          {/* Introduction */}
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-5 mb-8">
            <p className={`${paragraphClass} mb-0`}>
              <strong>Last Updated:</strong> January 2025. These terms govern your use of QuickMedicalCertificate.com, 
              an online telemedicine platform providing genuine medical certificates through registered doctors in compliance 
              with the <strong>Telemedicine Practice Guidelines 2020</strong> issued by the Government of India under the 
              National Medical Commission (NMC).
            </p>
          </div>

          <h2 className={sectionTitleClass}>1. About Our Online Medical Certificate Service</h2>
          <p className={paragraphClass}>
            QuickMedicalCertificate.com is operated by <strong>Stargate Technologies PVT LTD</strong>, a registered IT services company 
            under the laws of India. Our platform connects patients with registered medical practitioners for online consultations 
            and issuance of legitimate medical certificates as per <strong>NMC and WHO guidelines</strong>.
          </p>
          <p className={paragraphClass}>
            We provide telemedicine services across India, available via our website and mobile application. All medical certificates 
            are issued only after a proper doctor-patient consultation, ensuring authenticity and compliance with healthcare regulations.
          </p>

          <h2 className={sectionTitleClass}>2. Telemedicine Consultation Services</h2>
          <p className={paragraphClass}>
            Our online doctor consultation service provides the following medical certificates:
          </p>
          <ul className={listClass}>
            <li><strong>Sick Leave Certificate</strong> – For workplace or educational institution sick leave</li>
            <li><strong>Fitness Certificate</strong> – Medical fitness certification for employment or activities</li>
            <li><strong>Work From Home Certificate</strong> – Documentation for remote work medical requirements</li>
            <li><strong>Unfit to Travel Certificate</strong> – Medical certification for travel cancellation</li>
            <li><strong>Unfit to Work Certificate</strong> – Documentation for temporary work incapacity</li>
            <li><strong>Medical Diagnosis Certificate</strong> – Verification of medical conditions</li>
            <li><strong>Caretaker Certificate</strong> – For family medical care responsibilities</li>
            <li><strong>Recovery Certificate</strong> – Post-illness fitness documentation</li>
            <li><strong>Fit-to-Fly Certificate</strong> – Airline travel medical clearance</li>
          </ul>
          <p className={paragraphClass}>
            The consulting doctor determines the appropriateness and validity of each certificate after conducting a thorough 
            one-on-one video/audio consultation as per telemedicine guidelines.
          </p>

          <h2 className={sectionTitleClass}>3. Service Hours & Certificate Delivery Timeline</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-200 my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Service</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Timeline</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="px-4 py-3 text-slate-600">Working Hours</td><td className="px-4 py-3 text-slate-600">10:30 AM – 6:30 PM (Mon-Sat, excluding holidays)</td></tr>
                <tr className="border-b"><td className="px-4 py-3 text-slate-600">Doctor Review</td><td className="px-4 py-3 text-slate-600">2-10 hours (within 24 hours)</td></tr>
                <tr className="border-b"><td className="px-4 py-3 text-slate-600">Digital Certificate (Soft Copy)</td><td className="px-4 py-3 text-slate-600">Within 30-90 minutes post-approval</td></tr>
                <tr className="border-b"><td className="px-4 py-3 text-slate-600">Express Delivery</td><td className="px-4 py-3 text-slate-600">30 minutes (premium service)</td></tr>
                <tr className="border-b"><td className="px-4 py-3 text-slate-600">Physical Certificate (Hard Copy)</td><td className="px-4 py-3 text-slate-600">8-10 business days via courier</td></tr>
                <tr className="border-b last:border-0"><td className="px-4 py-3 text-slate-600">Doctor Telephonic Contact</td><td className="px-4 py-3 text-slate-600">4-6 hours during working hours</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={sectionTitleClass}>4. Medical Certificate Format & Legitimate Usage</h2>
          <p className={paragraphClass}>
            All medical certificates issued through our platform are formatted as per Indian medical standards and contain:
          </p>
          <ul className={listClass}>
            <li>Doctor&apos;s full name and medical registration number</li>
            <li>Doctor&apos;s signature and official seal</li>
            <li>Patient details and medical assessment</li>
            <li>Date of issue and validity period</li>
            <li>Contact details for verification purposes</li>
          </ul>
          <p className={paragraphClass}>
            Certificates must only be used for their intended legitimate purposes. Modification requests post-consultation 
            are not applicable. Our certificates are accepted by employers, educational institutions, and official bodies across India.
          </p>

          <h2 className={sectionTitleClass}>5. Identity Verification Policy</h2>
          <p className={paragraphClass}>
            For compliance with telemedicine guidelines and to ensure authentic medical documentation, we may require 
            government-issued identification. This verification protects both patients and healthcare providers, 
            maintaining the integrity of the medical certificate process.
          </p>

          <h2 className={sectionTitleClass}>6. Registered Doctor Affiliation</h2>
          <p className={paragraphClass}>
            All doctors associated with QuickMedicalCertificate.com are registered medical practitioners with valid 
            Medical Council registration numbers. They are either employed or contracted to provide telemedicine 
            consultation services in compliance with the Telemedicine Practice Guidelines 2020.
          </p>

          <h2 className={sectionTitleClass}>7. User Responsibilities & Accurate Information</h2>
          <p className={paragraphClass}>
            Users applying for online medical certificates are responsible for:
          </p>
          <ul className={listClass}>
            <li>Providing accurate and truthful personal and medical information</li>
            <li>Attending scheduled doctor consultations promptly</li>
            <li>Responding to communication from the medical team within specified timelines</li>
            <li>Using certificates only for legitimate, legal purposes</li>
            <li>Not misrepresenting medical conditions or symptoms</li>
          </ul>

          <h2 className={sectionTitleClass}>8. Consent for Online Medical Consultation</h2>
          <p className={paragraphClass}>
            By booking a consultation, you consent to:
          </p>
          <ul className={listClass}>
            <li>Receiving medical consultation via telemedicine (video/audio call)</li>
            <li>Recording of consultations for quality assurance and medical records</li>
            <li>Storage of your medical information as per privacy regulations</li>
            <li>Doctor&apos;s professional judgment on certificate issuance</li>
          </ul>

          <h2 className={sectionTitleClass}>9. Prohibited Uses & Restrictions</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-5 my-6">
            <p className="font-semibold text-red-900 mb-3">The following are strictly prohibited:</p>
            <ul className="list-disc pl-6 space-y-2 text-red-800 leading-relaxed">
              <li>Requesting certificates for medico-legal cases or court proceedings</li>
              <li>Seeking fake, fraudulent, or misleading medical documentation</li>
              <li>Providing false medical history or symptoms</li>
              <li>Misusing certificates for insurance fraud or illegal purposes</li>
              <li>Harassing or disturbing medical staff or support team</li>
              <li>Using services without proper consent or authorization</li>
            </ul>
          </div>
          <p className={paragraphClass}>
            Users providing misleading, fake, or unlawful information bear full responsibility for any legal consequences.
          </p>

          <h2 className={sectionTitleClass}>10. Intellectual Property Rights</h2>
          <p className={paragraphClass}>
            All content, designs, logos, and materials on QuickMedicalCertificate.com are the intellectual property 
            of Stargate Technologies Pvt Ltd and protected under Indian copyright laws.
          </p>

          <h2 className={sectionTitleClass}>11. Medical Disclaimer</h2>
          <p className={paragraphClass}>
            Our online consultation service is intended for non-emergency medical documentation purposes only. 
            We do not:
          </p>
          <ul className={listClass}>
            <li>Provide emergency medical services</li>
            <li>Diagnose critical or life-threatening conditions</li>
            <li>Replace in-person medical examinations when needed</li>
            <li>Guarantee certificate issuance (subject to doctor&apos;s assessment)</li>
          </ul>

          <h2 className={sectionTitleClass}>12. Limitation of Liability</h2>
          <p className={paragraphClass}>
            QuickMedicalCertificate.com is not liable for any misuse, fraud, or improper use of medical certificates 
            by users or third parties. We provide legitimate telemedicine services; users are responsible for proper usage.
          </p>

          <h2 className={sectionTitleClass}>13. Data Sharing & Third-Party Services</h2>
          <p className={paragraphClass}>
            Your data may be shared with authorized healthcare providers and payment processors solely for service delivery. 
            We do not sell personal or medical data to third parties for marketing purposes.
          </p>

          <h2 className={sectionTitleClass}>14. Indemnification</h2>
          <p className={paragraphClass}>
            You agree to indemnify and hold harmless QuickMedicalCertificate.com, Stargate Technologies Pvt Ltd, and 
            associated doctors from any claims arising from your misuse of services, false information provided, 
            or violation of these terms.
          </p>

          <h2 className={sectionTitleClass}>15. Service Termination</h2>
          <p className={paragraphClass}>
            We reserve the right to suspend or terminate access to our services at any time for violations of these terms, 
            fraudulent activity, or any reason deemed necessary to protect the integrity of our platform.
          </p>

          <h2 className={sectionTitleClass}>16. Dispute Resolution</h2>
          <p className={paragraphClass}>
            Any disputes arising from the use of QuickMedicalCertificate.com shall be governed by and construed in 
            accordance with the laws of India. Disputes will be subject to the exclusive jurisdiction of courts 
            in Hyderabad, Telangana, India.
          </p>

          <h2 className={sectionTitleClass}>17. Governing Law</h2>
          <p className={paragraphClass}>
            These terms and conditions are governed by Indian law, including the Information Technology Act 2000, 
            Telemedicine Practice Guidelines 2020, and applicable healthcare regulations. Stargate Technologies 
            Pvt Ltd may assign this agreement to subsidiaries, affiliates, or successors.
          </p>

          <h2 className={sectionTitleClass}>18. Updates to Terms & Conditions</h2>
          <p className={paragraphClass}>
            QuickMedicalCertificate.com reserves the right to update these terms at any time. Continued use of our 
            services after changes constitutes acceptance of the modified terms. We recommend reviewing this page periodically.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 my-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Contact Us</h3>
            <p className={`${paragraphClass} mb-2`}>
              For questions about these terms or our online medical certificate services:
            </p>
            <p className="text-slate-600 mb-1">
              <strong>Email:</strong>{" "}
              <a href="mailto:contact@quickmedicalcertificate.com" className="text-primary font-semibold hover:underline">
                contact@quickmedicalcertificate.com
              </a>
            </p>
            <p className="text-slate-600">
              <strong>Support:</strong>{" "}
              <a href="mailto:help@quickmedicalcertificate.com" className="text-primary font-semibold hover:underline">
                help@quickmedicalcertificate.com
              </a>
            </p>
          </div>

          {/* Cross-links */}
          <div className="flex flex-wrap gap-3 mt-10 pt-6 border-t border-slate-200">
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Privacy Policy
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
        title="Ready To Get Your Medical Certificate Online?"
        description="Apply for a genuine medical certificate through our NMC-compliant telemedicine consultation process. Connect with registered doctors across India."
        buttonPrimary={{
          label: "Apply For Certificate",
          href: "/certificates/apply",
        }}
      />
    </>
  );
}
