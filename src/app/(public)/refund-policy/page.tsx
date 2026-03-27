import { Metadata } from "next";
import Link from "next/link";
import { PAYMENT_OPTIONS } from "@/lib/certificate-types";
import { CTASection } from "@/components/public/home/cta-section";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Online Medical Certificate Refund India | QuickMedicalCertificate",
  description:
    "Read our transparent refund and cancellation policy for online medical certificate services. Understand refund eligibility, convenience fees, non-refundable cases, and how to request a refund before doctor consultation.",
  keywords: [
    "medical certificate refund policy",
    "online doctor consultation refund India",
    "telemedicine cancellation policy",
    "healthcare service refund",
    "medical certificate money back",
    "doctor consultation refund eligibility",
    "non-refundable medical services",
    "online medical certificate cancellation",
    "refund before consultation",
    "telemedicine refund terms",
    "medical certificate convenience fee",
    "healthcare refund process India"
  ],
  openGraph: {
    title: "Refund & Cancellation Policy | Online Medical Certificate | QuickMedicalCertificate",
    description: "Transparent refund policy for online medical certificates. Understand when you're eligible for a refund and check convenience fees for different services.",
    type: "website",
    locale: "en_IN",
  },
  alternates: {
    canonical: "/refund-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sectionTitleClass = "text-3xl font-semibold text-slate-900 mt-10 mb-4";
const paragraphClass = "text-slate-600 leading-relaxed mb-4";
const listClass = "list-disc pl-6 space-y-2 text-slate-600 leading-relaxed mb-6";

export default function RefundPolicyPage() {
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
            Refund & Cancellation Policy
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Refund and Cancellation Policy for Medical Certificate Services
          </h1>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            Transparent, structured, and legally compliant refund policy for online medical certificate services.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <article className="prose prose-slate max-w-none">
          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-8">
            <p className="font-semibold text-amber-900 mb-2">⚠️ Important Notice:</p>
            <p className="text-amber-800 mb-0">
              A <strong>convenience fee</strong> is applicable on all eligible refunds. Refunds are processed strictly as per the policy below. 
              Refunds are considered only in specific cases and <strong>only before doctor consultation/review</strong>, unless explicitly mentioned.
            </p>
          </div>

          <p className={paragraphClass}>
            At QuickMedicalCertificate.com, we follow a transparent, structured, and legally compliant refund policy for our 
            online medical certificate and telemedicine consultation services. We understand that circumstances may change, 
            and we have outlined clear guidelines to help you understand when you&apos;re eligible for a refund.
          </p>

          <h2 className={sectionTitleClass}>1. Eligible Refund Cases (Before Doctor Consultation)</h2>
          <p className={paragraphClass}>
            Refunds are applicable <strong>only if the request is raised before doctor consultation or review</strong>. 
            You may be eligible for a refund in the following cases:
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-5 my-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">✓ General Refund Eligibility</h3>
            <ul className="list-disc pl-6 space-y-2 text-green-800 leading-relaxed">
              <li>
                <strong>Underage Users:</strong> An underage user (below 12 years) applies without parental/guardian consent 
                and informs our team <strong>before doctor review</strong>.
              </li>
              <li>
                <strong>Pre-Contact Cancellation:</strong> The user requests a refund <strong>before being contacted</strong> by 
                the customer support or medical team.
              </li>
              <li>
                <strong>Invalid Complaints:</strong> Complaints are reviewed and deemed invalid by our internal medical/health team.
              </li>
              <li>
                <strong>Doctor Rejection (Pre-Consultation):</strong> The doctor rejects the case due to unmet, unreasonable, 
                or inappropriate user demands <strong>before initiating consultation</strong>, and no contact has been made with the user.
              </li>
              <li>
                <strong>Excessive Requests:</strong> The user repeatedly requests certificates (more than five times) without 
                undergoing treatment for the claimed condition and informs the team <strong>before doctor review</strong>.
              </li>
              <li>
                <strong>Ineligible Purposes:</strong> The certificate is required for insurance claims, government employee duty 
                regularization, will purposes, medico-legal cases, or any unethical/illegal purpose, and this is disclosed 
                <strong> before doctor review</strong>.
              </li>
              <li>
                <strong>Doctor Non-Contact:</strong> The doctor fails to contact the user for more than <strong>48 working hours</strong>.
              </li>
              <li>
                <strong>Service Not Offered:</strong> The user has booked a product or service that is not offered by QuickMedicalCertificate.com.
              </li>
              <li>
                <strong>Wrong Form Selection:</strong> The user selected the wrong form or product and informs the team 
                <strong> before doctor consultation</strong>.
              </li>
            </ul>
          </div>

          <h2 className={sectionTitleClass}>2. Non-Refundable Cases</h2>
          <p className={paragraphClass}>
            Refunds are <strong>NOT applicable</strong> under the following circumstances:
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-5 my-6">
            <h3 className="text-lg font-semibold text-red-900 mb-3">✗ Refund Not Available</h3>
            <ul className="list-disc pl-6 space-y-2 text-red-800 leading-relaxed">
              <li>
                <strong>Non-Refundable Product:</strong> A non-refundable document format has been selected at checkout.
              </li>
              <li>
                <strong>Post-Consultation:</strong> The doctor consultation or review has already been completed.
              </li>
              <li>
                <strong>Certificate Issued:</strong> The medical certificate has already been issued or released.
              </li>
              <li>
                <strong>Consultation Refusal:</strong> The user is unwilling to attend the doctor consultation when requested.
              </li>
              <li>
                <strong>Missed Appointments:</strong> The user fails to attend a scheduled consultation despite three contact 
                attempts by the doctor.
              </li>
              <li>
                <strong>Medico-Legal Cases:</strong> The certificate is submitted or intended for a medico-legal case.
              </li>
              <li>
                <strong>Contradictory Information:</strong> The user&apos;s medical condition contradicts the information provided 
                in the form or during consultation.
              </li>
              <li>
                <strong>False Information:</strong> The user provides false, misleading, incorrect, or illegal information, 
                or requests a fake certificate.
              </li>
              <li>
                <strong>Post-Consultation Cancellation:</strong> The user attends the doctor consultation and later requests cancellation.
              </li>
              <li>
                <strong>Non-Responsive (14 Days):</strong> The user fails to respond to calls or emails from the support team 
                for more than <strong>14 days</strong> after booking.
              </li>
              <li>
                <strong>Case Closure (7 Days):</strong> The case remains inactive for <strong>7 consecutive days</strong>, resulting 
                in automatic closure.
              </li>
              <li>
                <strong>Missing Documents:</strong> Required supporting documents are not submitted when requested by the doctor.
              </li>
            </ul>
          </div>

          <h2 className={sectionTitleClass}>3. Refundable Products List & Convenience Fees</h2>
          <p className={paragraphClass}>
            Below are our medical certificate pricing options and applicable convenience fees for refunds. 
            The convenience fee is deducted from eligible refunds:
          </p>
          
          <div className="overflow-x-auto rounded-lg border border-slate-200 my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Product & Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Amount (INR)</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Convenience Fee (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 text-slate-600">Digital Certificate without prescription</td>
                  <td className="px-4 py-3 text-slate-600">₹599</td>
                  <td className="px-4 py-3 text-red-600 font-medium">Non-Refundable</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 text-slate-600">Digital Certificate with prescription</td>
                  <td className="px-4 py-3 text-slate-600">₹799</td>
                  <td className="px-4 py-3 text-slate-600">₹199</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 text-slate-600">Digital Certificate with prescription (30-Minute Express Delivery)</td>
                  <td className="px-4 py-3 text-slate-600">₹899</td>
                  <td className="px-4 py-3 text-slate-600">₹199</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 text-slate-600">Handwritten Certificate without prescription</td>
                  <td className="px-4 py-3 text-slate-600">₹1,099</td>
                  <td className="px-4 py-3 text-red-600 font-medium">Non-Refundable</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 text-slate-600">Handwritten Certificate with prescription</td>
                  <td className="px-4 py-3 text-slate-600">₹1,399</td>
                  <td className="px-4 py-3 text-slate-600">₹299</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 text-slate-600">Handwritten Medical Certificate without prescription + Shipping</td>
                  <td className="px-4 py-3 text-slate-600">₹1,299</td>
                  <td className="px-4 py-3 text-slate-600">₹299</td>
                </tr>
                <tr className="border-b last:border-0">
                  <td className="px-4 py-3 text-slate-600">Handwritten Medical Certificate with prescription + Shipping</td>
                  <td className="px-4 py-3 text-slate-600">₹1,499</td>
                  <td className="px-4 py-3 text-slate-600">₹299</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
            <p className="text-blue-900 mb-0">
              <strong>Refund Amount Calculation:</strong> Eligible refund = Product Amount - Convenience Fee. 
              For example, if you paid ₹799 for Digital Certificate with prescription, your refund (if eligible) would be 
              ₹799 - ₹199 = <strong>₹600</strong>.
            </p>
          </div>

          <h2 className={sectionTitleClass}>4. Partner Services & Third-Party Payments</h2>
          <p className={paragraphClass}>
            QuickMedicalCertificate.com is not responsible for any payments made directly to third-party or partner services. 
            Refund requests for such services should be directed to the respective service providers.
          </p>

          <h2 className={sectionTitleClass}>5. International vs Indian Cases</h2>
          <p className={paragraphClass}>
            Our refund policy applies uniformly to both Indian and international users. However, please note:
          </p>
          <ul className={listClass}>
            <li>Refunds for international payments may take additional processing time due to currency conversion and banking processes</li>
            <li>International shipping fees for physical certificates are non-refundable once dispatched</li>
            <li>Currency exchange rate differences at the time of refund are the responsibility of the user</li>
          </ul>

          <h2 className={sectionTitleClass}>6. How to Request a Refund</h2>
          <p className={paragraphClass}>
            To request a refund for your online medical certificate order:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-slate-600 leading-relaxed mb-6">
            <li>Email us at <a href="mailto:refund@quickmedicalcertificate.com" className="text-primary font-semibold hover:underline">refund@quickmedicalcertificate.com</a> with your order details</li>
            <li>Include your full name, order ID, and reason for refund request</li>
            <li>Submit your request <strong>before doctor consultation</strong> for eligible refunds</li>
            <li>Our team will review your request within 24-48 working hours</li>
            <li>Approved refunds are processed within 5-7 business days to the original payment method</li>
          </ol>

          <h2 className={sectionTitleClass}>7. Refund Processing Timeline</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-200 my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Stage</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Timeline</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="px-4 py-3 text-slate-600">Request Review</td><td className="px-4 py-3 text-slate-600">24-48 working hours</td></tr>
                <tr className="border-b"><td className="px-4 py-3 text-slate-600">Refund Approval</td><td className="px-4 py-3 text-slate-600">1-2 business days after review</td></tr>
                <tr className="border-b"><td className="px-4 py-3 text-slate-600">Credit to Bank/Card</td><td className="px-4 py-3 text-slate-600">5-7 business days</td></tr>
                <tr className="border-b last:border-0"><td className="px-4 py-3 text-slate-600">UPI/Wallet Refunds</td><td className="px-4 py-3 text-slate-600">3-5 business days</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={sectionTitleClass}>8. Contact Us for Refund Queries</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 my-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Support Contact</h3>
            <p className={`${paragraphClass} mb-2`}>
              Have questions about our refund policy or need assistance with a refund request?
            </p>
            <p className="text-slate-600 mb-1">
              <strong>Refund Inquiries:</strong>{" "}
              <a href="mailto:refund@quickmedicalcertificate.com" className="text-primary font-semibold hover:underline">
                refund@quickmedicalcertificate.com
              </a>
            </p>
            <p className="text-slate-600 mb-1">
              <strong>General Support:</strong>{" "}
              <a href="mailto:contact@quickmedicalcertificate.com" className="text-primary font-semibold hover:underline">
                contact@quickmedicalcertificate.com
              </a>
            </p>
            <p className="text-slate-600 mb-0">
              <strong>Help Desk:</strong>{" "}
              <a href="mailto:help@quickmedicalcertificate.com" className="text-primary font-semibold hover:underline">
                help@quickmedicalcertificate.com
              </a>
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
              href="/privacy"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Privacy Policy
            </Link>
          </div>
        </article>
      </div>

      <CTASection
        title="Ready To Get Your Medical Certificate Online?"
        description="Apply for a genuine medical certificate through our simple online process. Complete a doctor consultation and receive your certificate quickly."
        buttonPrimary={{
          label: "Apply For Certificate",
          href: "/certificates/apply",
        }}
      />
    </>
  );
}
