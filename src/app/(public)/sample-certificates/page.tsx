import { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, FileCheck, Mail, Phone } from "lucide-react";
import { ALL_CERTIFICATE_TYPES } from "@/lib/certificate-types";
import { CTASection } from "@/components/public/home/cta-section";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Sample Certificates | MediProofDocs",
  description:
    "Take a look at Mediproofdocs medical certificate samples to review the format, consultation details, doctor credentials, and verification elements.",
};

function getCertificateDescription(slug: string): string {
  const descriptions: Record<string, string> = {
    "sick-leave":
      "A sick leave certificate is a document issued by our doctor or registered medical practitioner attesting to your health condition and the number of recovery days advised.",
    "work-from-home":
      "A work from home certificate is issued by our doctor or registered medical practitioner when your condition supports rest and remote work instead of travel to the workplace.",
    fitness:
      "A fitness certificate confirms you are medically fit for work, travel, or a specific activity after a proper health assessment by our registered doctors.",
    recovery:
      "A recovery certificate confirms you have recovered from an illness and are fit to resume work or other activities after medical review.",
    caretaker:
      "A caretaker certificate is issued when you need to care for a family member and require leave for that purpose.",
    "fit-to-fly":
      "A fit-to-fly certificate confirms you are medically fit to travel by air and is issued after health assessment by our doctors.",
    "unfit-to-work":
      "An unfit to work certificate is issued when you are medically advised not to work due to your health condition.",
    "unfit-to-travel":
      "An unfit to travel certificate confirms you are currently not in a suitable condition to travel because of health reasons.",
    "medical-diagnosis":
      "A medical diagnosis certificate provides official documentation of your diagnosed condition and the recommended treatment plan.",
  };

  return (
    descriptions[slug] ||
    "This certificate is issued by our registered medical practitioners after a proper health assessment and consultation."
  );
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
    return ALL_CERTIFICATE_TYPES.map((cert) => ({
      slug: cert.slug,
      name: cert.name,
      description: getCertificateDescription(cert.slug),
      sampleUrl: null as string | null,
    }));
  }
}

function MedicalEmblem() {
  return (
    <svg viewBox="0 0 72 72" className="h-11 w-11 fill-current">
      <path d="M35 8c-3 5-6 8-11 8 2 2 5 4 9 4h1v4h-4v3h4v4c-6 0-10 3-10 7 3-2 6-3 10-3v5h-4v3h4v15h4V43h4v-3h-4v-5c4 0 7 1 10 3 0-4-4-7-10-7v-4h4v-3h-4v-4h1c4 0 7-2 9-4-5 0-8-3-11-8h-2Z" />
      <path d="M10 24c8-7 16-10 24-9-4 3-7 7-8 12-5 1-10 0-16-3Z" />
      <path d="M62 24c-8-7-16-10-24-9 4 3 7 7 8 12 5 1 10 0 16-3Z" />
    </svg>
  );
}

function SignatureMark() {
  return (
    <svg viewBox="0 0 120 40" className="h-10 w-24 text-indigo-700">
      <path
        d="M8 28c11-17 17 5 28-11 4-6 6-16 10-16 5 0-2 20 8 20 8 0 12-14 18-14 6 0 4 17 11 17 8 0 12-13 18-13 6 0 7 11 12 15"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SampleCertificatePreview({ title }: { title: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[566px]">
      <div className="relative overflow-hidden border-[4px] border-[#21395f] bg-[#dde4ec] shadow-[0_20px_60px_rgba(2,32,71,0.18)]">
        <div className="bg-[#304f79] px-5 pb-4 pt-5 text-white">
          <div className="flex items-start justify-between">
            <div className="flex flex-col items-start">
              <div className="pl-1 text-white">
                <MedicalEmblem />
              </div>
              <p className="mt-4 text-[6px] font-medium uppercase tracking-[0.28em] text-white/70">
                Care Comes First
              </p>
            </div>

            <div className="relative pt-1 text-right">
              <div className="absolute -right-1 -top-1 h-9 w-9">
                <svg viewBox="0 0 40 40" className="h-full w-full text-red-600">
                  <path
                    d="M8 10 30 30M30 10 8 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-[18px] font-extrabold uppercase tracking-tight leading-none">
                DR NAME
              </p>
              <p className="mt-2 text-[9px] font-bold uppercase leading-none">Qualification |</p>
              <p className="mt-1 text-[9px] font-bold uppercase leading-none">Registration No.</p>
              <div className="mt-3 flex items-center justify-end gap-3 text-[7px] text-white/80">
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  doctorname@medicalcertificate.in
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Contact Details
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[2px] bg-white/90" />
        <div className="border-y-[3px] border-[#486280] bg-[#dde4ec] py-[1px] text-center">
          <p className="text-[13px] font-extrabold uppercase tracking-tight text-[#304f79]">
            Medical Certificate
          </p>
        </div>

        <div className="px-7 pb-0 pt-6 text-[11px] leading-[1.95] text-[#323843]">
          <div className="flex items-start justify-between text-[10px] font-extrabold uppercase text-[#304f79]">
            <span>Issue Date:</span>
            <div className="text-right">
              <span>Document No.</span>
            </div>
          </div>

          <div className="mt-9">
            <p className="mb-1 text-[11px]">To</p>
            <div className="h-4 w-[58%] border-b border-dotted border-[#677181]" />
            <div className="mt-2 h-4 w-[58%] border-b border-dotted border-[#677181]" />
          </div>

          <div className="mt-9 text-[11px] leading-[1.95]">
            <p>
              This is to certify that I, Dr.
              <span className="mx-1.5 inline-block w-[26%] border-b border-dotted border-[#677181]" />
              examining <span className="font-bold">Ms./Mr.</span>
            </p>
            <p>
              <span className="inline-block w-[24%] border-b border-dotted border-[#677181]" />, C/O
              Ms./Mr.
              <span className="mx-1.5 inline-block w-[24%] border-b border-dotted border-[#677181]" />
              aged about
              <span className="mx-1.5 inline-block w-[14%] border-b border-dotted border-[#677181]" />
            </p>
            <p>
              years, gender- female/male, resident of
              <span className="mx-1.5 inline-block w-[46%] border-b border-dotted border-[#677181]" />
            </p>
            <p>
              <span className="inline-block w-full border-b border-dotted border-[#677181]" />
            </p>
            <p>
              signature is verified as under) has diagnosed the patient with
              <span className="mx-1.5 inline-block w-[25%] border-b border-dotted border-[#677181]" />
            </p>
            <p>
              <span className="inline-block w-full border-b border-dotted border-[#677181]" />
            </p>
            <p className="sr-only">{title}</p>
          </div>

          <div className="h-[13.5rem]" />

          <div className="grid grid-cols-2 gap-8 pb-2 text-[10px] text-[#343843]">
            <div className="pt-6">
              <p>Patient&apos;s Signature</p>
              <p className="mt-8">Patient&apos;s Name</p>
            </div>

            <div className="pr-1 text-right">
              <p>Doctor&apos;s Signature</p>
              <div className="mt-1 inline-flex flex-col items-end">
                <SignatureMark />
                <div className="-mt-1 text-left">
                  <p className="text-[8px] font-bold uppercase leading-tight text-[#6358bf]">
                    Doctor Stamp With
                  </p>
                  <p className="text-[8px] font-bold uppercase leading-tight text-[#6358bf]">
                    Name, Qualification,
                  </p>
                  <p className="text-[8px] font-bold uppercase leading-tight text-[#6358bf]">
                    Registration Number
                  </p>
                </div>
              </div>
              <p className="mt-2">Doctor&apos;s Name</p>
            </div>
          </div>

          <div className="border-t border-[#b8c3cf] py-2 text-[6px] leading-tight text-[#59616f]">
            This certificate is valid only from the date of issue.
          </div>
        </div>

        <div className="bg-[#304f79] px-3 py-3 text-[6px] leading-tight text-white/85">
          This medical document is valid without your signature. The details mentioned in this
          medical document are as per the symptoms mentioned by you during an online consultation or
          video consultation if required. Medicalcertificate.in is not responsible for any wrong
          information shared while submitting details for consultation. This document is valid only
          for the dates mentioned by the doctor and only for the organization to which it is
          addressed.
        </div>

        <div className="pointer-events-none absolute left-[14px] top-[126px] -rotate-[28deg]">
          <span className="text-[30px] font-extrabold uppercase tracking-wide text-red-600">
            Sample Only. Not For Use.
          </span>
        </div>
        <div className="pointer-events-none absolute left-[18px] top-[305px] -rotate-[28deg]">
          <span className="text-[30px] font-extrabold uppercase tracking-wide text-red-600">
            Sample Only. Not For Use.
          </span>
        </div>
        <div className="pointer-events-none absolute left-[42px] top-[500px] -rotate-[28deg]">
          <span className="text-[30px] font-extrabold uppercase tracking-wide text-red-600">
            Sample Only. Not For Use.
          </span>
        </div>
      </div>
    </div>
  );
}

export default async function SampleCertificatesPage() {
  const SAMPLE_CERTIFICATES = await getSampleCertificates();

  return (
    <>
      <section className="relative overflow-hidden px-4 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(32,178,170,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
            <FileCheck className="h-3.5 w-3.5 text-primary" />
            Sample Certificates
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Mediproofdocs Medical <br /> <span className="text-primary">Certificate Samples</span>
          </h1>
          <p className="mx-auto mt-4 max-w-4xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Review the layout, doctor credentials, signature area, and verification details used in
            certificates issued through Mediproofdocs after medical consultation.
          </p>
          <p className="mx-auto mt-3 max-w-4xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            The preview below is styled to reflect a real consultation certificate format so users
            can see the final document structure before applying.
          </p>
          <div className="mx-auto mt-8 grid max-w-4xl gap-3 text-left sm:grid-cols-2">
            {[
              "Professionally formatted medical certificates",
              "Issued by qualified and registered doctors",
              "Secure digital documents for easy sharing",
              "Clear verification details for authenticity",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm"
              >
                <BadgeCheck className="h-4 w-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {SAMPLE_CERTIFICATES.map((sample) => (
              <div
                key={sample.slug}
                className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="bg-[linear-gradient(180deg,#eef9ff_0%,#ffffff_22%,#ffffff_100%)] px-4 py-6 sm:px-6">
                  <SampleCertificatePreview title={sample.name} />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-3 text-xl font-bold text-slate-900">{sample.name}</h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-600">
                    {sample.description}
                  </p>
                  <Link
                    href={`/certificates/apply?type=${sample.slug}`}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-primary/90"
                  >
                    Get Certificate
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <FileCheck className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-slate-900">Actual Certificates May Vary</h2>
          <p className="text-slate-600">
            The samples shown above are representative formats. Actual certificates are customized
            based on the doctor&apos;s assessment and may include additional details required for your
            medical condition or organization.
          </p>
        </div>
      </section>

      <CTASection
        title="Need A Certificate Like This?"
        description="Complete a short online consultation and receive a professionally formatted medical certificate issued by a registered doctor."
        buttonPrimary={{
          label: "Apply For Certificate",
          href: "/certificates/apply",
        }}
      />
    </>
  );
}
