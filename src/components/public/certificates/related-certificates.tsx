'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CERTIFICATE_CATEGORIES } from '@/lib/certificate-types';

interface RelatedCertificatesProps {
  currentSlug: string;
  limit?: number;
}

export function RelatedCertificates({ currentSlug, limit = 3 }: RelatedCertificatesProps) {
  const allCertificates = CERTIFICATE_CATEGORIES.flatMap(category => category.items);
  
  const relatedCertificates = allCertificates
    .filter(cert => cert.slug !== currentSlug)
    .slice(0, limit);

  if (relatedCertificates.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Other Certificates You May Need
          </h2>
          <p className="text-lg text-gray-600">
            Explore our range of medical certificates for different requirements
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {relatedCertificates.map((certificate, index) => {
            const Icon = certificate.icon;
            
            return (
              <motion.div
                key={certificate.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/certificates/${certificate.slug}`}
                  className="block group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-teal-600" />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {certificate.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {certificate.shortDescription}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-teal-600 font-bold">
                      From {certificate.startingPrice}
                    </span>
                    <span className="inline-flex items-center text-sm font-medium text-teal-600 group-hover:translate-x-1 transition-transform">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link
            href="/certificates"
            className="inline-flex items-center justify-center bg-white border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            View All Certificates
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
