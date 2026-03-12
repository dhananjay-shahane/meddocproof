import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/public/home/cta-section";

export const metadata: Metadata = {
  title: "Terms & Conditions | MediProofDocs",
  description:
    "Review the terms that govern the use of MediProofDocs, including eligibility, consultations, payments, and acceptable use.",
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
            Terms and Conditions
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <article className="prose prose-slate max-w-none">
          <h2 className={sectionTitleClass}>1. About Us</h2>
          <p className={paragraphClass}>
            &quot;MediProofDocs&quot; is operated by <strong>Stargate Technologies PVT LTD</strong>, operating in the
            field of IT Services. The IT Services is a company organized and existing under the laws of India, 
            w/e/f October 1, 2024. It is available on{" "}
            <Link href="https://MediProofDocs.in" className="text-primary font-semibold">
              https://MediProofDocs.in
            </Link>{" "}
            as a domain service and on Android application in the Google Play Store.
          </p>

          <h2 className={sectionTitleClass}>2. Services</h2>
          <p className={paragraphClass}>
            These terms define that this website carries details about regulated medical products/services or 
            incorporates a buying/selling platform/options for such products and is not for general public 
            advertisement/information. These certificates or prescriptions we provide by conducting one on one 
            live consultation with the assigned consulting doctor. The consulting doctor decides after one-on-one 
            video consultation along with the prescriber whether a certificate is suitable for the consumer, and 
            what certificate to provide to the consumer.
          </p>

          <h2 className={sectionTitleClass}>3. Working Hours and Timeline</h2>
          <ul className={listClass}>
            <li><strong>Consultations/Working Hours</strong> are <strong>10:30 am–6:30 pm</strong> excluding public holidays (Monday to Saturday).</li>
            <li><strong>Timeline for review:</strong> 24 hours (2 to 10 hours are taken as norm).</li>
            <li>Timelines depend on doctors/assignees availability during working hours.</li>
            <li><strong>Soft copy release:</strong> Within 6 hours post-approval/signature.</li>
            <li><strong>Hard copy delivery:</strong> Within 7 days (via current mode of dispatching).</li>
            <li><strong>Doctor Telephonic contact:</strong> Within 4 to 6 hours (during working hours).</li>
            <li><strong>Non-refundable</strong> means: Where there is no scope of refund.</li>
          </ul>

          <h2 className={sectionTitleClass}>4. Certificate Format & Usage</h2>
          <p className={paragraphClass}>
            All Medical Certificates must be submitted for their respective purposes, as the objective of this product 
            MediProofDocs serves with their legitimate use. Configuration/modification requests for any add-ons are 
            non-refundable/non-applicable post the consultation/review. Consultation fee is the fee for availing 
            consultation/review services of the Certificate.
          </p>

          <h2 className={sectionTitleClass}>5. Identification Policy</h2>
          <p className={paragraphClass}>
            The Identification/ID Document attached will be used as a verification to validate any consultation for 
            the records. Consultation is provided regardless of the identification validation.
          </p>

          <h2 className={sectionTitleClass}>6. Affiliation Policy</h2>
          <p className={paragraphClass}>
            The doctors associated with this organization are either appointed or contracted/affiliated to 
            provide services via any number of methods supported.
          </p>

          <h2 className={sectionTitleClass}>7. User Responsibilities</h2>
          <p className={paragraphClass}>
            Applicants/users are the end consumers who submit applications for a certificate. They are responsible 
            for providing valid and accurate information at the form-filling as well as during discussion with 
            the doctor.
          </p>

          <h2 className={sectionTitleClass}>8. Consent for Consultation</h2>
          <p className={paragraphClass}>
            Booking for consultation means consent has been submitted for medical/wellness or employee purposes only, 
            using legitimate reason/purpose/intent, no malice in use, no misuse, to deceive. Users consent to 
            MediProofDocs use of Call Recorder/Screen recorder during any scheduled consultation.
          </p>

          <h2 className={sectionTitleClass}>9. Restrictions and Prohibited Conduct</h2>
          <ul className={listClass}>
            <li><strong>Any document for medico-legal cases</strong></li>
            <li><strong>Professional service as consultation</strong></li>
            <li><strong>Misrepresentation/Fake certificates</strong></li>
            <li><strong>Attempting to disturb</strong> the doctor or any member of this organization</li>
            <li><strong>Using services without any consent</strong></li>
          </ul>
          <p className={paragraphClass}>
            Providing misleading/fake/unlawful/false details we don&apos;t accept and holds full responsibility 
            for any charge/consequence.
          </p>

          <h2 className={sectionTitleClass}>10. Intellectual Property</h2>
          <p className={paragraphClass}>
            All content on this Website Technologies PVT. Ltd is owned by Registrar.
          </p>

          <h2 className={sectionTitleClass}>11. Disclaimer</h2>
          <p className={paragraphClass}>
            The counseling, texts in this document and the website do not constitute health claims or diagnose conditions. 
            We are not liable for any legal use of the Service or Product at any given point of time. This is only 
            applicable for non-critical conditions and where the doctor is not legally bound by any applicable law.
          </p>

          <h2 className={sectionTitleClass}>12. Limitation of Liability</h2>
          <p className={paragraphClass}>
            We are not liable for Fraud/Fake/Misleading and misuse of our product by 3rd party/individual/self.
          </p>

          <h2 className={sectionTitleClass}>13. Third Party Data</h2>
          <p className={paragraphClass}>
            Any form of sending/sharing your data outfieldside with outside to any outside 3rd party/individual/self is 
            for service purpose only. We do not sell your data to third-party applications.
          </p>

          <h2 className={sectionTitleClass}>14. Indemnification</h2>
          <p className={paragraphClass}>
            You agree to defend and hold harmless MediProofDocs and its officers, agents, employees, and suppliers from 
            any and all claims or demand, made by any third party due to or arising out of (a) any content you submit 
            or use to which MediProofDocs gains access as a result of your use of the Services and (b) a breach of this 
            Agreement.
          </p>

          <h2 className={sectionTitleClass}>15. Termination</h2>
          <p className={paragraphClass}>
            We may suspend or terminate the Service at any time without prior notice and with no liability for any damages 
            arising out.
          </p>

          <h2 className={sectionTitleClass}>16. Dispute Resolution</h2>
          <p className={paragraphClass}>
            This Agreement will be governed by and constituted in accordance with the Laws of India without reference 
            to conflict of laws principles.
          </p>

          <h2 className={sectionTitleClass}>17. Governing Law</h2>
          <p className={paragraphClass}>
            This agreement and its performance shall be governed by laws of India. Stargate Technologies may assign 
            this Agreement without your consent to: (1) a subsidiary or affiliate; (2) an acquirer of Stargate Technologies 
            equity, business, or assets; or (3) a successor by merger.
          </p>

          <h2 className={sectionTitleClass}>18. Miscellaneous</h2>
          <p className={paragraphClass}>
            User agrees to follow instructions as provided by the MediProofDocs team and to strictly maintain confidentiality. 
            MediProofDocs reserves the right to update this Terms of Use at any time.
          </p>

          <p className={paragraphClass}>
            For any concerns, contact us <a href="mailto:help@MediProofDocs.in" className="text-primary font-semibold">help@MediProofDocs.in</a>
          </p>

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
              Refund Policy
            </Link>
          </div>
        </article>
      </div>

      <CTASection
        title="Ready To Start A Certificate Request?"
        description="Share your details through the guided application flow and we will route the request through the appropriate review process."
        buttonPrimary={{
          label: "Apply For Certificate",
          href: "/certificates/apply",
        }}
      />
    </>
  );
}
