import { Metadata } from "next";
import { ReceiptText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PAYMENT_OPTIONS } from "@/lib/certificate-types";
import { GridPattern } from "@/components/ui/grid-pattern";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | MediProofDocs",
  description:
    "Read the refund and cancellation policy for MediProofDocs medical certificate services.",
};

const SECTIONS = [
  { id: "eligible-refund-cases", label: "Eligible Refund Cases" },
  { id: "non-refundable-cases", label: "Non-Refundable Cases" },
  { id: "refundable-products", label: "Refundable Products & Fees" },
  { id: "partner-services", label: "Partner Services" },
  { id: "case-classification", label: "International vs Indian" },
  { id: "data-retention", label: "Data Retention & Closure" },
  { id: "diagnosis-policy", label: "Diagnosis & Document Policy" },
  { id: "shipping", label: "Shipping Policy" },
  { id: "verification", label: "Document Verification" },
  { id: "refund-process", label: "Refund Request Process" },
];

export default function RefundPolicyPage() {
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
            <ReceiptText className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Transparent refund terms for all MediProofDocs medical certificate services.
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
              A convenience fee is applicable on all eligible refunds. Refunds are
              processed strictly as per the policy below.
            </p>
            <p>
              At MediProofDocs, we follow a transparent, structured, and legally
              compliant refund policy. Refunds are considered only in specific cases
              and only before doctor consultation/review, unless explicitly
              mentioned.
            </p>

            <h2 id="eligible-refund-cases">1. Eligible Refund Cases</h2>
            <p>
              Refunds are applicable only if the request is raised before doctor
              consultation or review.
            </p>
            <h3>A. General Eligibility (Before Doctor Review)</h3>
            <p>A refund may be initiated if any one of the following applies:</p>
            <ul>
              <li>
                An underage user (below 12 years) applies without parental/guardian
                consent and informs our team before doctor review.
              </li>
              <li>
                The user requests a refund before being contacted by the customer
                support or medical team.
              </li>
              <li>
                Complaints are reviewed and deemed invalid by our internal
                medical/health team.
              </li>
              <li>
                The doctor rejects the case due to unmet, unreasonable, or
                inappropriate user demands before initiating consultation, and no
                contact has been made with the user.
              </li>
              <li>
                The user repeatedly requests certificates (more than five times)
                without undergoing treatment for the claimed condition and informs
                the team before doctor review.
              </li>
              <li>
                The certificate is required for insurance claims, government
                employee duty regularization, will purposes, medico-legal cases, or
                any unethical/illegal purpose, and this is disclosed before doctor
                review.
              </li>
              <li>
                The doctor fails to contact the user for more than 48 working
                hours.
              </li>
              <li>
                The user has booked a product or service that is not offered by
                MediProofDocs.
              </li>
              <li>
                The user selected the wrong form or product and informs the team
                before doctor consultation.
              </li>
            </ul>

            <h2 id="non-refundable-cases">2. Non-Refundable Cases</h2>
            <p>
              Refunds are not applicable under the following circumstances:
            </p>
            <ul>
              <li>A non-refundable document format has been selected.</li>
              <li>
                The doctor consultation or review has already been completed.
              </li>
              <li>The certificate has already been issued or released.</li>
              <li>
                The user is unwilling to attend the doctor consultation when
                requested.
              </li>
              <li>
                The user fails to attend a scheduled consultation despite three
                contact attempts by the doctor.
              </li>
              <li>
                The certificate is submitted or intended for a medico-legal case.
              </li>
              <li>
                The user&apos;s medical condition contradicts the information provided in
                the form or during consultation.
              </li>
              <li>
                The user provides false, misleading, incorrect, or illegal
                information, or requests a fake certificate.
              </li>
              <li>
                The user attends the doctor consultation and later requests
                cancellation.
              </li>
              <li>
                The user fails to respond to calls or emails from the support team
                for more than 14 days after booking.
              </li>
              <li>
                The case remains inactive for 7 consecutive days, resulting in
                automatic closure.
              </li>
              <li>
                Required supporting documents are not submitted when requested by
                the doctor.
              </li>
            </ul>

            <h2 id="refundable-products">3. Refundable Product List &amp; Convenience Fees</h2>
            <div className="not-prose">
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">Product</th>
                      <th className="px-4 py-3 text-left font-semibold">Amount</th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Convenience Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PAYMENT_OPTIONS.map((opt) => (
                      <tr key={opt.id} className="border-b last:border-0">
                        <td className="px-4 py-3">{opt.label}</td>
                        <td className="px-4 py-3">₹{opt.price}</td>
                        <td className="px-4 py-3">
                          {opt.convenienceFee
                            ? `₹${opt.convenienceFee}`
                            : "Non-Refundable"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <h2 id="partner-services">4. Partner Services</h2>
            <p>
              MediProofDocs is not responsible for any payments made directly to
              third-party or partner services.
            </p>

            <h2 id="case-classification">5. International vs Indian Case Classification</h2>
            <p>A case is considered International if:</p>
            <ul>
              <li>The user is outside India, OR</li>
              <li>
                The certificate is submitted to an organization outside India
              </li>
            </ul>
            <p>
              Doctors may contact users only if additional clarification is
              required.
            </p>
            <p>
              For Indian cases, direct doctor consultation is mandatory, except for
              minors (parent/guardian must attend) and critical cases (30-second
              health condition video + documents required).
            </p>

            <h2 id="data-retention">6. Data Retention &amp; Case Closure</h2>
            <ul>
              <li>
                Closed case records are stored for a maximum of 10 days.
              </li>
              <li>
                Inactive cases for 7 days are automatically closed without refund
                eligibility.
              </li>
              <li>No document modifications after issue.</li>
            </ul>

            <h2 id="diagnosis-policy">7. Diagnosis, Duration &amp; Document Policy</h2>
            <ul>
              <li>
                Diagnosis and duration are solely determined by the doctor based on
                medical judgment and legal standards.
              </li>
              <li>
                No changes or edits are allowed once a document is issued.
              </li>
              <li>
                If approval is not received for handwritten documents, the document
                will be auto-released after 24 hours.
              </li>
            </ul>

            <h2 id="shipping">8. Shipping Policy (India Only)</h2>
            <ul>
              <li>Shipping is available only within India.</li>
              <li>Delivery is subject to Blue Dart serviceability.</li>
              <li>Only one shipping attempt is included.</li>
              <li>Second attempt (on request) costs ₹499.</li>
              <li>
                Once dispatched, delivery responsibility does not lie with the
                company.
              </li>
            </ul>

            <h2 id="verification">9. Document Verification</h2>
            <ul>
              <li>Email verification with the doctor is free.</li>
              <li>
                Telephonic verification fee: ₹599 / $10 / €10 (based on base
                currency).
              </li>
            </ul>

            <h2 id="refund-process">10. Refund Request Process</h2>
            <p>To initiate a refund, email:</p>
            <p>
              <a href="mailto:refund@medproofdocs.com">
                refund@medproofdocs.com
              </a>
            </p>
            <p>Include:</p>
            <ul>
              <li>Invoice Number</li>
              <li>Registered Mobile Number</li>
              <li>Reason for Refund</li>
            </ul>
            <p>Refund requests are accepted via email only.</p>
            <p>
              Response Time: Within 5 working days (Mon–Fri, 10 AM – 6 PM).
              Refunds are processed to the original payment method within 7–10
              business days, subject to payment gateway timelines.
            </p>

            {/* Cross-links */}
            <div className="not-prose mt-10 flex flex-wrap gap-3">
              <Link href="/terms" className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                Terms &amp; Conditions <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/privacy" className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                Privacy Policy <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
