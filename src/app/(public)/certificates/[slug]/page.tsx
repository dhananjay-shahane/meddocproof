'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  FileText, Home, Users, Activity, Heart, PlaneTakeoff, BriefcaseMedical, Plane,
  ClipboardList, CheckCircle, Clock, Shield, ArrowRight, Award,
  Building, GraduationCap, Briefcase, HeartPulse, TruckIcon,
  HeadphonesIcon, Stethoscope, FileCheck, Timer, Laptop, UserCheck,
  CalendarCheck, BadgeCheck, Fingerprint, ShieldCheck, Zap, MapPin, IndianRupee,
} from 'lucide-react';
import { getCertificateBySlug } from '@/lib/certificate-types';
import { InfiniteSlider } from '@/components/ui/infinite-slider';

/* ============================================================
   DATA & CONFIGURATION
   ============================================================ */

const certificateImages: Record<string, string> = {
  'sick-leave': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=1080&fit=crop',
  'work-from-home': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1920&h=1080&fit=crop',
  caretaker: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1920&h=1080&fit=crop',
  recovery: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop',
  fitness: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&h=1080&fit=crop',
  'fit-to-fly': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=1080&fit=crop',
  'unfit-to-work': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1920&h=1080&fit=crop',
  'unfit-to-travel': 'https://images.unsplash.com/photo-1522098635833-216c03d81fbe?w=1920&h=1080&fit=crop',
  'medical-diagnosis': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=1080&fit=crop',
};

const iconMap: Record<string, React.ElementType> = {
  'sick-leave': FileText, 'work-from-home': Home, caretaker: Users,
  recovery: Activity, fitness: Heart, 'fit-to-fly': PlaneTakeoff,
  'unfit-to-work': BriefcaseMedical, 'unfit-to-travel': Plane,
  'medical-diagnosis': ClipboardList,
};

const certificateDescriptions: Record<string, { title: string; description: string; features: string[] }> = {
  'sick-leave': {
    title: 'Sick Leave Certificate',
    description: 'When health issues prevent you from attending work, school, or college, a Sick Leave Medical Certificate provides official medical confirmation of your condition.',
    features: ['Valid for employers and educational institutions', 'Includes doctor registration details', 'Digital delivery within 30-90 minutes', 'Accepted nationwide'],
  },
  'work-from-home': {
    title: 'Work From Home Certificate',
    description: 'Certain medical conditions may allow you to work but make office attendance difficult. A Work from Home Medical Certificate supports remote working arrangements.',
    features: ['Corporate HR compliant format', 'Medical justification included', 'Recommended duration specified', 'Digital signature verified'],
  },
  caretaker: {
    title: 'Caretaker Certificate',
    description: 'When a family member requires medical care, a Caretaker Medical Certificate confirms the need for your presence as a caregiver during their recovery.',
    features: ['Family care documentation', 'Leave justification provided', 'Valid for extended leave requests', 'Employer accepted format'],
  },
  recovery: {
    title: 'Recovery Certificate',
    description: 'A Recovery Medical Certificate confirms that an individual has recovered from a medical condition and is fit to resume regular activities.',
    features: ['Fitness confirmation', 'Return to work clearance', 'Activity resumption approval', 'Doctor verified assessment'],
  },
  fitness: {
    title: 'Fitness Certificate',
    description: 'A Medical Fitness Certificate is often required before starting a job, academic program, sports activity, or travel plan.',
    features: ['Pre-employment screening', 'Academic admission requirement', 'Sports participation clearance', 'Travel and visa documentation'],
  },
  'fit-to-fly': {
    title: 'Fit to Fly Certificate',
    description: 'A Fit-to-Fly Certificate is medical clearance for air travel, required by airlines and immigration authorities for certain health conditions.',
    features: ['Airline accepted format', 'International travel valid', 'Express processing available', 'Multi-language support'],
  },
  'unfit-to-work': {
    title: 'Unfit to Work Certificate',
    description: 'When illness or injury affects your ability to perform work duties safely, an Unfit To Work Medical Certificate provides clear medical documentation.',
    features: ['Legal employment protection', 'Recovery period defined', 'HR compliant format', 'Medical necessity based'],
  },
  'unfit-to-travel': {
    title: 'Unfit to Travel Certificate',
    description: 'Medical conditions or recovery phases may make travel unsafe or inadvisable. An Unfit To Travel Medical Certificate formally states that travel should be avoided.',
    features: ['Flight rebooking support', 'Travel insurance claims', 'Hotel cancellation help', 'Medical advisory documentation'],
  },
  'medical-diagnosis': {
    title: 'Medical Diagnosis Certificate',
    description: 'A Medical Diagnosis Certificate serves as official documentation of a diagnosed medical condition for insurance or workplace records.',
    features: ['Insurance claim support', 'Detailed medical records', 'Legal documentation', 'Institutional acceptance'],
  },
};

const whyUsData = [
  { feature: 'Doctor Consultation', us: true, others: false, icon: Stethoscope },
  { feature: 'Digital Verification', us: true, others: false, icon: Fingerprint },
  { feature: '30-90 Min Delivery', us: true, others: false, icon: Timer },
  { feature: '24/7 Availability', us: true, others: false, icon: Clock },
  { feature: 'Money-back Guarantee', us: true, others: false, icon: IndianRupee },
  { feature: 'Pan-India Validity', us: true, others: true, icon: MapPin },
];

const useCases: Record<string, { icon: React.ElementType; title: string; description: string }[]> = {
  'sick-leave': [
    { icon: Briefcase, title: 'Workplace Leave', description: 'Official documentation for employer-required sick leave' },
    { icon: GraduationCap, title: 'Academic Absence', description: 'Valid excuse for school or college attendance' },
    { icon: Building, title: 'Corporate Compliance', description: 'Meets HR documentation requirements' },
  ],
  'work-from-home': [
    { icon: Home, title: 'Remote Work Setup', description: 'Medical justification for working from home' },
    { icon: HeartPulse, title: 'Health Recovery', description: 'Support for recovery while maintaining productivity' },
    { icon: Briefcase, title: 'Employer Approval', description: 'Documentation for HR approval process' },
  ],
  caretaker: [
    { icon: Users, title: 'Family Care', description: 'Official documentation for caregiving responsibilities' },
    { icon: Heart, title: 'Medical Support', description: 'Support for family member medical needs' },
    { icon: Clock, title: 'Extended Leave', description: 'Justification for extended time off' },
  ],
  recovery: [
    { icon: Activity, title: 'Return to Work', description: 'Medical clearance for workplace return' },
    { icon: Shield, title: 'Fitness Confirmation', description: 'Official confirmation of recovery status' },
    { icon: CheckCircle, title: 'Health Clearance', description: 'Documentation for resumed activities' },
  ],
  fitness: [
    { icon: Award, title: 'Employment Requirements', description: 'Pre-employment health clearance' },
    { icon: GraduationCap, title: 'Academic Programs', description: 'Admission fitness requirements' },
    { icon: Heart, title: 'Sports Participation', description: 'Medical clearance for athletic activities' },
  ],
  'fit-to-fly': [
    { icon: Plane, title: 'Air Travel Clearance', description: 'Medical approval for airline travel' },
    { icon: Shield, title: 'Immigration Requirements', description: 'Documentation for travel authorities' },
    { icon: CheckCircle, title: 'Health Declaration', description: 'Official health status for travel' },
  ],
  'unfit-to-work': [
    { icon: Briefcase, title: 'Workplace Safety', description: 'Medical documentation for work inability' },
    { icon: Shield, title: 'Health Protection', description: 'Protection for personal and workplace safety' },
    { icon: Clock, title: 'Recovery Period', description: 'Documented recovery timeline' },
  ],
  'unfit-to-travel': [
    { icon: Plane, title: 'Travel Postponement', description: 'Medical grounds for travel delay' },
    { icon: Award, title: 'Insurance Claims', description: 'Documentation for travel insurance' },
    { icon: HeadphonesIcon, title: 'Official Communication', description: 'Medical advisory documentation' },
  ],
  'medical-diagnosis': [
    { icon: ClipboardList, title: 'Medical Records', description: 'Official diagnosis documentation' },
    { icon: Award, title: 'Insurance Purposes', description: 'Support for insurance claims' },
    { icon: Shield, title: 'Legal Documentation', description: 'Official medical evidence' },
  ],
};

const trustBadges = [
  { icon: BadgeCheck, text: 'Registered Doctors' },
  { icon: Shield, text: '100% Genuine' },
  { icon: TruckIcon, text: '30-90 Min Delivery' },
  { icon: HeadphonesIcon, text: '24/7 Support' },
];

const howItWorks = [
  { step: 1, title: 'Submit Application', description: 'Fill out our simple online form with your details.', icon: FileText },
  { step: 2, title: 'Doctor Consultation', description: 'A certified doctor reviews and approves your request.', icon: Stethoscope },
  { step: 3, title: 'Get Certificate', description: 'Receive your verified certificate via email and WhatsApp.', icon: Award },
];

/* ============================================================
   MAIN PAGE COMPONENT
   ============================================================ */

export default function CertificatePage() {
  const params = useParams();
  const slug = params.slug as string;

  const certificate = getCertificateBySlug(slug);
  const heroImage = certificateImages[slug] || certificateImages['sick-leave'];
  const Icon = iconMap[slug] || FileText;
  const certInfo = certificateDescriptions[slug] || certificateDescriptions['sick-leave'];
  const certificateUseCases = useCases[slug] || useCases['sick-leave'];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Certificate Not Found</h1>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,#e0f7fa_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,#f3e8ff_0%,transparent_50%)]" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-gray-500 mb-8"
          >
            <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/certificates" className="hover:text-teal-600 transition-colors">Certificates</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{certInfo.title}</span>
          </motion.nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <Shield className="w-4 h-4" />
                Medical Certificate
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6"
              >
                {certInfo.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-600 leading-relaxed mb-8"
              >
                {certInfo.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Link
                  href="/certificates/apply"
                  className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-6 py-4 rounded-lg">
                  <span className="text-2xl font-bold text-teal-600">₹599</span>
                  <span className="text-sm">starting price</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-6 text-sm text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <span>30-90 min delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <span>Doctor verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-600" />
                  <span>100% genuine</span>
                </div>
              </motion.div>
            </div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={heroImage}
                  alt={certInfo.title}
                  width={600}
                  height={400}
                  className="object-cover w-full"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Card Overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{certInfo.title}</p>
                      <p className="text-sm text-gray-600">Digital Delivery</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium">Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <InfiniteSlider gap={48} duration={30}>
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-3 px-4">
                <badge.icon className="w-5 h-5 text-teal-600" />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{badge.text}</span>
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left: Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                What You Get
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Every certificate includes all essential details for verification and acceptance.
              </p>

              <div className="space-y-4">
                {certInfo.features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                    </div>
                    <span className="text-gray-900 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Info Cards */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  Service Availability
                </h3>
                <div className="space-y-2">
                  {['Monday - Sunday'].map((day, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <span className="text-gray-600">{day}</span>
                      <span className="font-medium text-teal-600">24/7 Available</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  Certificate Includes
                </h3>
                <ul className="space-y-3">
                  {[
                    "Doctor's registration details",
                    "QR code for verification",
                    "Official medical letterhead",
                    "Digital signature",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get your certificate in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm h-full">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="text-4xl font-bold text-teal-100 mb-2">0{step.step}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              When You Need This Certificate
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Common scenarios where this certificate is required
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {certificateUseCases.map((useCase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center"
              >
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <useCase.icon className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-gray-600 text-sm">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose MediProofDocs?
              </h2>
              <p className="text-lg text-gray-600">
                See how we compare to other certificate providers
              </p>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="grid grid-cols-[1fr_100px_100px] bg-gray-50 p-4 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">Features</span>
                <span className="text-sm font-bold text-teal-600 text-center">Us</span>
                <span className="text-sm font-medium text-gray-500 text-center">Others</span>
              </div>
              {whyUsData.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[1fr_100px_100px] p-4 items-center ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} ${i < whyUsData.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <row.icon className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-700">{row.feature}</span>
                  </div>
                  <div className="flex justify-center">
                    {row.us ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <span className="text-red-400">✗</span>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {row.others ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <span className="text-red-400">✗</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
