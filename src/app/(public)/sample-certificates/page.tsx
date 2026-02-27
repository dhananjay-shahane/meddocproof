import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Download } from "lucide-react";
import { ALL_CERTIFICATE_TYPES } from "@/lib/certificate-types";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Sample Certificates | MediProofDocs",
  description:
    "View sample medical certificates issued by MediProofDocs. See the formats for sick leave, fitness, work from home, and more.",
};

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
      description: cert.shortDescription,
      icon: cert.icon,
      sampleUrl: sampleMap.get(cert.slug) || null,
    }));
  } catch {
    // Fallback if DB fails
    return ALL_CERTIFICATE_TYPES.map((cert) => ({
      slug: cert.slug,
      name: cert.name,
      description: cert.shortDescription,
      icon: cert.icon,
      sampleUrl: null as string | null,
    }));
  }
}

export default async function SampleCertificatesPage() {
  const SAMPLE_CERTIFICATES = await getSampleCertificates();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-brand-light/40 to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Sample <span className="text-primary">Certificates</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            View the formats of medical certificates we issue. Each certificate
            is signed by a registered doctor and includes all required
            verification details.
          </p>
        </div>
      </section>

      {/* Certificates Grid */}
      <section className="border-t bg-card px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_CERTIFICATES.map((sample) => (
              <div
                key={sample.slug}
                className="group flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                {/* Preview area */}
                <div className="flex h-48 items-center justify-center rounded-xl bg-muted/50">
                  {sample.sampleUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sample.sampleUrl}
                      alt={`${sample.name} sample`}
                      className="h-full w-full rounded-xl object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <sample.icon className="h-10 w-10" />
                      <span className="text-xs">Sample coming soon</span>
                    </div>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-semibold">{sample.name}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">
                  {sample.description}
                </p>

                <div className="mt-4 flex gap-3">
                  {sample.sampleUrl && (
                    <a
                      href={sample.sampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <Download className="h-4 w-4" />
                      View
                    </a>
                  )}
                  <Link
                    href={`/certificates/apply?type=${sample.slug}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-4 text-2xl font-bold">
            Actual certificates may vary
          </h2>
          <p className="mt-3 text-muted-foreground">
            The samples shown above are representative formats. Actual
            certificates are customized based on the doctor&apos;s assessment
            and may include additional details as required by your organization.
          </p>
        </div>
      </section>
    </>
  );
}
