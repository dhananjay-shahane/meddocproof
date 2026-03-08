import { Metadata } from "next";
import Link from "next/link";
import { FileCheck } from "lucide-react";
import { ALL_CERTIFICATE_TYPES } from "@/lib/certificate-types";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Sample Certificates | MediProofDocs",
  description:
    "View sample medical certificates issued by MediProofDocs. See the formats for sick leave, fitness, work from home, and more.",
};

function getCertificateDescription(slug: string): string {
  const descriptions: Record<string, string> = {
    "sick-leave": "A sick leave certificate is a document issued by our doctor/registered medical practitioner (M.B.B.S/M.D/M.S) attesting to your health and the number of sick days required to recover.",
    "work-from-home": "A medical work from home certificate is issued by our doctor/registered medical practitioner (M.B.B.S/M.D/M.S) attesting to your health and the number of work-from-home days needed to recover.",
    "fitness": "A fitness certificate confirms you are medically fit for work, travel, or specific activities. It is issued after a thorough health assessment by our registered doctors.",
    "recovery": "A recovery certificate confirms you have recovered from an illness and are fit to resume work or other activities. Issued by our certified medical practitioners.",
    "caretaker": "A caretaker certificate is issued when you need to take care of a family member. It validates your need for leave to provide necessary care and support.",
    "fit-to-fly": "A fit-to-fly certificate confirms you are medically fit to travel by air. Required by airlines and issued after health assessment by our doctors.",
    "unfit-to-work": "An unfit to work certificate is issued when you are medically advised not to work due to health conditions. It helps employers understand your medical restrictions.",
    "unfit-to-travel": "An unfit to travel certificate confirms you are not in a suitable condition to travel due to health reasons. Essential for travel insurance claims and rescheduling.",
    "medical-diagnosis": "A medical diagnosis certificate provides official documentation of your diagnosed condition. It includes details about the diagnosis and recommended treatment plan.",
  };
  return descriptions[slug] || "This certificate is issued by our registered medical practitioners after proper health assessment and consultation.";
}

async function getSampleCertificates() {
  try {
    const samples = await prisma.sampleCertificate.findMany({
      where: { isActive: true },
      select: { certificateType: true, fileUrl: true },
    });
    const sampleMap = new Map(samples.map((s) => [s.certificateType, s.fileUrl]));

    return ALL_CERTIFICATE_TYPES.map((cert) => ({
      slug: cert.slug,
      name: cert.name,
      description: getCertificateDescription(cert.slug),
      sampleUrl: sampleMap.get(cert.slug) || null,
    }));
  } catch {
    // Fallback if DB fails
    return ALL_CERTIFICATE_TYPES.map((cert) => ({
      slug: cert.slug,
      name: cert.name,
      description: getCertificateDescription(cert.slug),
      sampleUrl: null as string | null,
    }));
  }
}

export default async function SampleCertificatesPage() {
  const SAMPLE_CERTIFICATES = await getSampleCertificates();
  
  return (
    <>
      {/* Hero Section - FAQ Style */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-brand-light/40 to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <FileCheck className="h-3.5 w-3.5 text-primary" />
            Sample Certificates
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Medical Certificate <span className="text-primary">Samples</span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Explore our range of medical certificate samples to find the format that best meets your needs.
            Our team provides standard and custom formats, prepared with professional accuracy for real use cases.
          </p>
        </div>
      </section>

      {/* Certificates Grid - MedBond Style */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {SAMPLE_CERTIFICATES.map((sample) => (
              <div
                key={sample.slug}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
                {/* Certificate Image with Watermark - Expanded to fill card area */}
                <div className="relative bg-white p-4 sm:p-6 md:p-7 flex items-stretch justify-center min-h-[620px]">
                  <div className="relative w-full h-full max-w-[540px]">
                    {/* Certificate Mockup */}
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden h-full flex flex-col">
                      {/* Certificate Header */}
                      <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L3 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
                            </svg>
                            <span className="font-bold text-sm">MediProofDocs</span>
                          </div>
                          <span className="text-xs opacity-80">Medical Certificate</span>
                        </div>
                      </div>
                      {/* Certificate Body */}
                      <div className="p-6 space-y-3 flex-1">
                        <div className="text-center mb-4">
                          <h4 className="font-bold text-gray-800 text-lg">{sample.name}</h4>
                          <div className="w-16 h-0.5 bg-teal-500 mx-auto mt-2"></div>
                        </div>
                        <div className="space-y-2 text-xs text-gray-600">
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-medium">Date:</span>
                            <span>XX/XX/XXXX</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-medium">Patient Name:</span>
                            <span>XXXXXXXXX</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-medium">Age:</span>
                            <span>XX</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-medium">Gender:</span>
                            <span>XXXX</span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600 leading-relaxed">
                          This is to certify that the above mentioned patient has been examined
                          and requires medical leave/certificate as per the doctor's assessment.
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="text-xs text-gray-500">
                            <p>Dr. XXXXXXX</p>
                            <p>MBBS, MD</p>
                            <p>Reg. No: XXXXX</p>
                          </div>
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Watermark Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="transform -translate-x-10 -translate-y-8 -rotate-45 border-4 border-red-400/40 px-10 py-3 bg-red-400/10">
                        <span className="text-red-500/55 text-2xl font-bold whitespace-nowrap tracking-wide">
                          SAMPLE ONLY NOT FOR USE
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="translate-x-12 translate-y-24 transform -rotate-45 border-4 border-red-400/35 px-10 py-3 bg-red-400/8">
                        <span className="text-red-500/50 text-2xl font-bold whitespace-nowrap tracking-wide">
                          SAMPLE ONLY NOT FOR USE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {sample.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                    {sample.description}
                  </p>
                  <Link
                    href={`/certificates/apply?type=${sample.slug}`}
                    className="inline-flex items-center justify-center w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                  >
                    Get Certificate
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Actual Certificates May Vary
          </h2>
          <p className="text-gray-600">
            The samples shown above are representative formats. Actual certificates are customized 
            based on the doctor's assessment and may include additional details as required by 
            your organization or specific medical needs.
          </p>
        </div>
      </section>
    </>
  );
}
