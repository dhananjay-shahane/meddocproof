import { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  ArrowRight,
  CheckCircle,
  Video,
  FileCheck,
  Star,
  HeartPulse,
  Sparkles,
  Play,
  Calendar,
  Brain,
  Baby,
  Bone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Online Doctor Consultation | MediProofDocs",
  description:
    "Consult a registered doctor online for medical certificates, prescriptions, and health advice. Quick, secure, and affordable.",
};

const FEATURES = [
  {
    icon: Video,
    title: "HD Video Consultation",
    description: "Crystal-clear video calls with registered MBBS doctors from the comfort of your home.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileCheck,
    title: "Instant Documentation",
    description: "Receive digitally signed medical certificates and prescriptions immediately after consultation.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Clock,
    title: "15-Min Response",
    description: "Get connected with a specialist within 15 minutes. No more waiting rooms.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "100% compliant with Telemedicine Practice Guidelines. End-to-end encrypted consultations.",
    color: "from-purple-500 to-pink-500",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Share Symptoms",
    description: "Fill out our intelligent form with your symptoms and medical history.",
  },
  {
    step: "02",
    title: "Connect",
    description: "Join a private video consultation with a verified doctor instantly.",
  },
  {
    step: "03",
    title: "Get Care",
    description: "Receive prescriptions & certificates digitally within minutes.",
  },
];

const GOOGLE_REVIEWS = [
  {
    name: "Priya Sharma",
    initial: "P",
    color: "bg-blue-600",
    rating: 5,
    content: "The consultation was seamless. Got my medical certificate within minutes of ending the call. Highly professional service!",
    time: "2 days ago",
  },
  {
    name: "Rahul Verma",
    initial: "R",
    color: "bg-emerald-600",
    rating: 5,
    content: "Doctor was very understanding and provided clear guidance. The video quality was excellent and the process was smooth.",
    time: "5 days ago",
  },
  {
    name: "Ananya Patel",
    initial: "A",
    color: "bg-purple-600",
    rating: 5,
    content: "Best online consultation experience. The certificate was accepted by my office without any issues. Thank you!",
    time: "1 week ago",
  },
  {
    name: "Karan Mehta",
    initial: "K",
    color: "bg-orange-600",
    rating: 5,
    content: "Quick response time and very helpful doctor. The prescription was delivered digitally immediately. Great service!",
    time: "1 week ago",
  },
  {
    name: "Sneha Gupta",
    initial: "S",
    color: "bg-pink-600",
    rating: 5,
    content: "Very convenient for busy professionals. Consulted during my lunch break and got all documents instantly.",
    time: "2 weeks ago",
  },
  {
    name: "Vikram Rao",
    initial: "V",
    color: "bg-cyan-600",
    rating: 5,
    content: "Professional doctors and secure platform. Felt comfortable discussing my health issues. Will use again.",
    time: "2 weeks ago",
  },
  {
    name: "Neha Kapoor",
    initial: "N",
    color: "bg-rose-600",
    rating: 5,
    content: "Amazing experience! The doctor listened patiently and provided a detailed prescription. Highly recommend.",
    time: "3 weeks ago",
  },
  {
    name: "Arjun Singh",
    initial: "A",
    color: "bg-indigo-600",
    rating: 5,
    content: "Easy to use platform and qualified doctors. Got my fitness certificate for sports participation quickly.",
    time: "3 weeks ago",
  },
];

export default function DoctorConsultationPage() {
  return (
    <>
      {/* Hero Section - Modern Clean */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Subtle Background Elements */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />
        <div className="absolute top-40 -left-20 h-72 w-72 rounded-full bg-emerald-100/30 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 pt-20 sm:pt-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 backdrop-blur-sm shadow-sm">
                <Sparkles className="h-4 w-4" />
                <span>Now Available 24/7</span>
              </div>
              
              <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Healthcare{" "}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    Reimagined
                  </span>
                  <svg className="absolute -bottom-2 left-0 h-3 w-full text-blue-200" viewBox="0 0 100 12" preserveAspectRatio="none">
                    <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h1>
              
              <p className="mt-6 text-xl leading-relaxed text-gray-600">
                Connect with certified doctors instantly. Get medical certificates, 
                prescriptions, and expert advice from the comfort of your home.
              </p>
              
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/certificates/apply"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-gray-900/20 transition-all hover:shadow-2xl hover:-translate-y-1"
                >
                  Start Consultation
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                
                <button className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-gray-200 bg-white px-6 py-4 text-base font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Play className="h-4 w-4 fill-current" />
                  </div>
                  See How It Works
                </button>
              </div>
            </div>

            {/* Right Visual - Doctor Image with Floating Elements */}
            <div className="relative lg:pl-8">
              <div className="relative">
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80"
                    alt="Professional Doctor"
                    className="h-[600px] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                {/* Floating Card 1 - Online Status */}
                <div className="absolute -left-6 top-1/4 rounded-2xl bg-white p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Video className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Doctors Online</p>
                      <p className="text-sm text-emerald-600">Available Now</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2 - Rating */}
                <div className="absolute -right-6 bottom-1/4 rounded-2xl bg-white p-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-gray-900">4.9</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">From 2,000+ reviews</p>
                </div>

                {/* Floating Card 3 - Quick Stats */}
                <div className="absolute bottom-8 left-8 right-8 rounded-xl bg-white/95 backdrop-blur-sm p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Avg. Wait Time</p>
                        <p className="text-xs text-gray-500">Less than 15 minutes</p>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-gray-200" />
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">24/7</p>
                      <p className="text-xs text-gray-500">Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-12 w-6 rounded-full border-2 border-gray-300 p-1">
            <div className="h-3 w-full rounded-full bg-gray-300" />
          </div>
        </div>
      </section>

      {/* Medical Specialties - Exact Bento Grid Layout */}
      <section className="bg-gray-50/50 px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Medical Specialties
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Expert care across multiple disciplines
            </p>
          </div>

          {/* Bento Grid Layout - Exact Match to Your Design */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-3">
            {/* General Medicine - Large Card (Left, spans 2 rows) */}
            <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm transition-all hover:shadow-lg md:col-span-1 md:row-span-2">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-100/50" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">General Medicine</h3>
                <p className="mt-1 text-sm text-gray-500">24/7 Available</p>
              </div>
            </div>

            {/* Mental Health - Top Right */}
            <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm transition-all hover:shadow-lg">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-purple-100/50" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 text-white shadow-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">Mental Health</h3>
                <p className="mt-1 text-sm text-gray-500">Expert psychiatrists</p>
              </div>
            </div>

            {/* Pediatrics - Top Far Right */}
            <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm transition-all hover:shadow-lg">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pink-100/50" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500 text-white shadow-lg">
                  <Baby className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">Pediatrics</h3>
                <p className="mt-1 text-sm text-gray-500">Child specialists</p>
              </div>
            </div>

            {/* Dermatology - Middle Right (spans 2 columns) */}
            <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm transition-all hover:shadow-lg md:col-span-2">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-100/50" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">Dermatology</h3>
                <p className="mt-1 text-sm text-gray-500">Skin & hair care</p>
              </div>
            </div>

            {/* Orthopedics - Bottom Left */}
            <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm transition-all hover:shadow-lg">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-100/50" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg">
                  <Bone className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">Orthopedics</h3>
                <p className="mt-1 text-sm text-gray-500">Bone & joint care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Zigzag Background */}
      <section className="relative overflow-hidden bg-white px-4 py-24">
        {/* Zigzag Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px)`,
        }} />
        
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Three simple steps to better health
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, idx) => (
              <div key={step.step} className="relative">
                <div className="rounded-3xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-lg ring-1 ring-gray-100">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 text-2xl font-bold text-white">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gray-200 text-gray-600 md:flex">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Parallax Section */}
      <section className="relative overflow-hidden bg-gray-900 py-24">
        {/* Parallax Background Image */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&auto=format&fit=crop&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900" />
        
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Why Choose Us
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Experience the future of healthcare
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-3xl bg-white/5 p-6 backdrop-blur-sm ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-white/20"
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg transition-transform group-hover:scale-110`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Zigzag Divider */}
      <section className="relative bg-white px-4 py-24">
        <div className="absolute -top-1 left-0 right-0 h-12 bg-gray-900" style={{
          clipPath: 'polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)'
        }} />
        
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything You Need in One Place
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Comprehensive healthcare services designed for your convenience
              </p>
              
              <div className="mt-8 space-y-4">
                {[
                  "One-on-one consultation with certified doctors",
                  "Detailed medical assessment and diagnosis",
                  "Digitally signed prescription (if required)",
                  "Valid medical certificate for official use",
                  "7-day follow-up chat support",
                  "Digital health record storage",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-blue-50"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-emerald-600 p-8 text-white shadow-2xl">
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                
                <div className="relative">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Calendar className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold">Ready to Get Started?</h3>
                  <p className="mt-2 text-blue-100">
                    Book your consultation today and experience healthcare reimagined.
                  </p>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-emerald-300" />
                      <span>No hidden charges</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-emerald-300" />
                      <span>Cancel anytime</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-emerald-300" />
                      <span>Secure payment</span>
                    </div>
                  </div>

                  <Link
                    href="/certificates/apply"
                    className="mt-8 block w-full rounded-xl bg-white py-4 text-center font-bold text-blue-600 shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Book Consultation Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section className="bg-gray-50 px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">Google Reviews</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              For our time in the limelight, we&apos;ve helped out on over 1,550 projects to date – take a look at our testimonials below, and know you can{" "}
              <a href="#" className="text-blue-600 hover:underline">reach out</a> with confidence!
            </p>
          </div>

          {/* Google Rating Header */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-6 shadow-sm sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Google Rating</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">5.0</span>
                  <div className="flex">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">282 reviews</span>
                </div>
              </div>
            </div>
            <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
              Write A Review
            </button>
          </div>

          {/* Reviews Grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GOOGLE_REVIEWS.map((review, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="mt-3 text-sm leading-relaxed text-gray-700 line-clamp-4">
                  {review.content}
                </p>

                {/* Read More Link */}
                <button className="mt-2 text-xs text-blue-600 hover:underline">
                  Read more
                </button>

                {/* User Info */}
                <div className="mt-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${review.color}`}>
                    {review.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.time}</p>
                  </div>
                </div>

                {/* Posted on Google */}
                <div className="mt-3 flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-xs text-gray-500">Posted on Google</span>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-8 text-center">
            <button className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              Load More
            </button>
          </div>
        </div>
      </section>
    </>
  );
}