'use client';

import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * Certificate FAQ Component
 * 
 * Based on online research, FAQ sections on certificate pages should:
 * 1. Address common concerns about this specific certificate type
 * 2. Reduce support inquiries
 * 3. Improve SEO with relevant keywords
 * 4. Build trust by addressing objections upfront
 * 
 * This component displays certificate-specific FAQs in an accordion format.
 */

interface FAQItem {
  question: string;
  answer: string;
}

interface CertificateFAQProps {
  faqs?: FAQItem[];
  slug?: string;
}

// Default FAQs for certificate pages
const defaultFAQs: FAQItem[] = [
  {
    question: 'When will I receive my medical certificate?',
    answer: 'You will receive your digital medical certificate within 30–60 minutes after completing the online doctor consultation. If you choose a physical copy, it will be delivered within 8–10 business days.',
  },
  {
    question: 'Are online medical certificates valid in India?',
    answer: 'Yes, all our medical notes are as per NMC & WHO guidelines. If your employer or education institute has any clarifications, they could reach out to the Doctor on the medical certificate issued.',
  },
  {
    question: 'Will my employer or educational institution accept this certificate?',
    answer: 'Yes, all our certificates adhere to NMC and WHO guidelines and are accepted by most organizations. For any clarifications, they can contact the doctor whose details are on the certificate.',
  },
  {
    question: 'How can I verify the authenticity of my certificate?',
    answer: 'Each certificate includes the doctor\'s registration number, signature, and contact details. Employers or institutions can verify the certificate by contacting the issuing doctor directly using the information provided on the certificate.',
  },
  {
    question: 'What if my certificate is rejected?',
    answer: 'In the rare case that your certificate is rejected, please contact our support team immediately. We will work with you and the concerned organization to address any concerns. Our certificates follow all NMC & WHO protocols and are legally valid.',
  },
];

// Certificate-specific FAQs
const certificateSpecificFAQs: Record<string, FAQItem[]> = {
  'sick-leave': [
    {
      question: 'How many days of sick leave can I get?',
      answer: 'The duration of sick leave depends on your medical condition as assessed by the doctor during consultation. Typically, certificates can be issued for 1-15 days based on the severity of your condition.',
    },
    {
      question: 'Can I get a backdated sick leave certificate?',
      answer: 'Backdated certificates are issued at the doctor\'s discretion based on medical necessity and supporting documentation. The doctor will assess your case during the consultation.',
    },
  ],
  'work-from-home': [
    {
      question: 'How long can I work from home with this certificate?',
      answer: 'The duration is determined by the doctor based on your medical condition. It can range from a few days to several weeks, depending on what is medically appropriate for your situation.',
    },
    {
      question: 'Will this certificate guarantee my work-from-home request is approved?',
      answer: 'While our certificates are accepted by most employers, final approval depends on your organization\'s policies. The certificate provides the medical justification needed for your request.',
    },
  ],
  'fitness': [
    {
      question: 'What medical checks are done for a fitness certificate?',
      answer: 'The doctor will assess your general health, medical history, and current condition through an online consultation. For specific fitness requirements (sports, employment), additional details may be discussed.',
    },
    {
      question: 'Is this certificate valid for government job applications?',
      answer: 'Yes, our fitness certificates are issued by registered doctors and follow NMC guidelines, making them valid for most government and private sector job applications.',
    },
  ],
  'fit-to-fly': [
    {
      question: 'Which airlines accept this certificate?',
      answer: 'Our Fit-to-Fly certificates are accepted by all major airlines including Air India, Indigo, Vistara, and international carriers. The certificate follows international travel health standards.',
    },
    {
      question: 'How recent should the certificate be before my flight?',
      answer: 'Most airlines require the certificate to be issued within 48-72 hours of your flight. Please check with your specific airline for their exact requirements.',
    },
  ],
};

// Parse **bold** markers into <strong> elements
function renderBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function CertificateFAQ({ faqs, slug }: CertificateFAQProps) {
  // Combine default FAQs with certificate-specific ones
  let displayFAQs = faqs || defaultFAQs;
  
  if (slug && certificateSpecificFAQs[slug]) {
    displayFAQs = [...certificateSpecificFAQs[slug], ...defaultFAQs];
  }

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            Common Questions
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Find answers to the most common questions about this certificate
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {displayFAQs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="text-left text-base font-medium text-gray-900 hover:text-teal-600 py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-5">
                  {renderBoldText(faq.answer)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
