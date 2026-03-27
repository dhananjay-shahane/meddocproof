'use client';

import { motion } from 'framer-motion';
import { MapPin, Globe } from 'lucide-react';

interface CertificateServiceAreasProps {
  slug: string;
  certTitle: string;
}

const cities = [
  'Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'New Delhi', 'Chennai', 'Kolkata',
  'Pune', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
  'Ranchi', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar',
  'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Gurgaon', 'Amritsar',
  'Navi Mumbai', 'Allahabad', 'Howrah', 'Gwalior', 'Jabalpur', 'Coimbatore',
  'Vijayawada', 'Raipur', 'Chandigarh', 'Guwahati', 'Mysore', 'Bhubaneswar',
  'Mira-Bhayandar', 'Bhiwandi', 'Tirupati', 'Gorakhpur', 'Amravati', 'Jamshedpur',
  'Cuttack', 'Kochi', 'Dehradun', 'Rourkela', 'Kolhapur', 'Ujjain', 'Siliguri',
  'Ulhasnagar', 'Mangalore', 'Belgaum', 'Gaya', 'Bokaro', 'Agartala', 'Thrissur',
  'Imphal', 'Ambarnath', 'Pondicherry', 'Vijayanagaram', 'Secunderabad',
  'Kharagpur', 'Ongole', 'Puri', 'Bhiwani', 'Ambala', 'Raebareli', 'Unnao',
  'Shimla', 'Jorhat', 'Gangtok', 'Visakhapatnam', 'Noida',
];

export function CertificateServiceAreas({ slug, certTitle }: CertificateServiceAreasProps) {
  return (
    <section className="py-16 lg:py-24 bg-section-light-blue">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-theme-cyan-border text-theme-primary px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-sm">
            <Globe className="w-4 h-4 text-theme-cyan" />
            Nationwide Service
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Get Your <span className="text-theme-cyan">{certTitle}</span> Online —{' '}
            <span className="text-theme-primary">Available Across India</span>
          </h2>
          <p className="text-lg text-gray-600">
            Our online doctor consultation service for{' '}
            <strong className="text-gray-800">{certTitle}</strong> is available in 80+ cities across
            India. No clinic visit needed — apply from home and receive your certificate via WhatsApp
            &amp; Email within 30–90 minutes.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-12"
        >
          {[
            { value: '80+', label: 'Cities Covered' },
            { value: '28+', label: 'States & UTs' },
            { value: '100%', label: 'Online Process' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl text-center py-4 px-3 border border-theme-cyan-border shadow-sm"
            >
              <div className="text-2xl font-bold text-theme-cyan">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Cities Pill Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl border border-theme-cyan-border p-6 lg:p-8"
        >
          <h3 className="text-base font-semibold text-gray-700 mb-5 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-theme-cyan" />
            Cities We Serve for {certTitle}
          </h3>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <span
                key={city}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-theme-cyan-light text-[#0e7490] border border-theme-cyan-border hover:bg-theme-cyan/10 transition-colors duration-150 cursor-default"
              >
                {city}
              </span>
            ))}
          </div>
        </motion.div>

        {/* SEO Text Paragraph — visible to users and search engines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 bg-white rounded-2xl border border-theme-cyan-border p-6 lg:p-8"
        >
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Online {certTitle} — Available in Your City
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            QuickMedicalCertificate.com provides a fast, genuine, and doctor-verified{' '}
            <strong>{certTitle}</strong> online across India, including major cities such as{' '}
            <strong>
              Hyderabad, Bangalore, Mumbai, Delhi, Pune, Chennai, Kolkata, Noida, Gurgaon, Surat,
              Jaipur, Lucknow, Nagpur
            </strong>
            , and 70+ other cities and towns. Our online doctor consultation service is fully compliant
            with the <strong>Telemedicine Practice Guidelines</strong> issued by the Government of India
            under the <strong>National Medical Commission (NMC)</strong>. Whether you are in a metro
            city or a smaller town, our registered doctors can issue a valid {certTitle} after a brief
            online consultation — delivered to your WhatsAp6 or Email within 30–90 minutes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
