import { Metadata } from "next";
import Link from "next/link";
import { PAYMENT_OPTIONS } from "@/lib/certificate-types";
import { CTASection } from "@/components/public/home/cta-section";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | MediProofDocs",
  description:
    "Read the refund and cancellation policy for MediProofDocs medical certificate services.",
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
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Refund and Cancellation Policy
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <article className="prose prose-slate max-w-none">
          <h2 className={sectionTitleClass}>1. Cases, when your eligible for a refund</h2>
          <ul className={listClass}>
            <li>If the user requests a refund <strong>before being contacted</strong> by the customer representative team</li>
            <li>In the doctor rejects the case due to <strong>unmet demands before making consultation</strong>, and no contact has been made with the user.</li>
            <li>When properly submitted details or contact internal address which cannot be unreachable and correspondence to the firm <strong>before doctor consultation</strong></li>
            <li>Complaints submitted as death certificates</li>
            <li>At a certificate is required for any purpose (like <strong>insurance claims</strong>, reg patticular or to legitimize medium for <strong>government employees</strong>)</li>
          </ul>

          <h2 className={sectionTitleClass}>2. Cases, where user is not entitled for a refund</h2>
          <ul className={listClass}>
            <li><strong>A non-refundable product</strong> has been chosen by the user</li>
            <li>The user is going to refund the <strong>Doctor consultation</strong></li>
            <li>A discussion or waiting for <strong>Doctor consultation has taken place</strong></li>
            <li>The user is claiming for a certificate for a <strong>wrong legal case</strong></li>
            <li>User fails to accept for paying for a discussion/consultation as any product</li>
            <li><strong>The certificate has already been issued</strong></li>
            <li><strong>No paperwork materials</strong> are attachment for insurance or necessary requests</li>
            <li>The user claims on place their own medical condition, resulting in the details provided in the form and during the doctor consultation, resulting in <strong>rejection by the doctor</strong></li>
            <li>The user fails to respond to any calls or emails from the support team for <strong>more than 14 days</strong> after booking their order</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 my-8">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">Note:</h3>
            <ul className="list-disc pl-6 space-y-2 text-amber-800 leading-relaxed">
              <li>Nischinto Medical Certificates, a refundable document format, incurs a charge of INR 1249, Online prescription document format also only for primary.</li>
              <li>For Nischinto Medical Certificates, a refundable document format incurs a charge of INR 749 only, online prescription document format for INR only 18 years and above who can apply for a certificate.</li>
              <li>For Certificate of Medical for foreigners(only), a document format incurs a charge of INR 1249. This format applicable outside India.</li>
              <li>No refunds on extra are made to use refundable service.</li>
            </ul>
          </div>

          <h2 className={sectionTitleClass}>3. Refundable Product List & Convenience Fees</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-200 my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Product</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Convenience Fee</th>
                </tr>
              </thead>
              <tbody>
                {PAYMENT_OPTIONS.map((opt) => (
                  <tr key={opt.id} className="border-b last:border-0">
                    <td className="px-4 py-3 text-slate-600">{opt.label}</td>
                    <td className="px-4 py-3 text-slate-600">₹{opt.price}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {opt.convenienceFee ? `₹${opt.convenienceFee}` : "Non-Refundable"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 my-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Support</h3>
            <p className={`${paragraphClass} mb-0`}>
              Want to know more? Mail at{" "}
              <a href="mailto:help@medproofdocs.in" className="text-primary font-semibold hover:underline">
                help@medproofdocs.in
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
