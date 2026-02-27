import { Metadata } from 'next';
import { CertificatesIndex } from '@/components/public/certificates/certificates-index';

export const metadata: Metadata = {
  title: 'Medical Certificates | MediProofDocs',
  description: 'Browse all types of medical certificates offered by MediProofDocs. Get Sick Leave, Fitness, Work From Home, Fit-to-Fly, and more certificates online.',
};

export default function CertificatesPage() {
  return <CertificatesIndex />;
}
