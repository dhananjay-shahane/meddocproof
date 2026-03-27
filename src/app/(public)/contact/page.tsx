"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Loader2,
  Headphones,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";

const CONTACT_INFO = {
  email: "contact@mediproofdocs.com",
  phone: "+91 8737854807",
  whatsapp: "+91 8737854807",
  hours: "24/7 Online Service",
  address: "MediProofDocs, Banjara Hills, Hyderabad, Telangana, India",
};

const FEATURES = [
  { icon: Clock, title: "Quick Response", desc: "Reply within 2-4 hours" },
  { icon: Headphones, title: "24/7 Support", desc: "Available round the clock" },
  { icon: Shield, title: "Secure & Private", desc: "Your data is protected" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/contact", formData);
      if (res.data.success) {
        setSubmitted(true);
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(res.data.message || "Failed to send message");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 px-4 pt-32 pb-24 sm:pt-36">
        <div className="absolute inset-0 bg-grid-white/[0.05] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            <Headphones className="h-4 w-4" />
            We&apos;re here to help
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-blue-100">
            Have questions about our medical certificate services? Our support team is available{" "}
            <strong className="text-white">24/7</strong> to assist you.
          </p>
          {/* Feature badges */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm"
              >
                <feature.icon className="h-5 w-5 text-cyan-300" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">{feature.title}</p>
                  <p className="text-xs text-blue-200">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative -mt-12 px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Contact Form - Takes 3 columns */}
            <div className="lg:col-span-3 rounded-2xl border bg-white p-6 sm:p-8 shadow-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Send Us a Message</h2>
                  <p className="text-sm text-gray-500">We&apos;ll respond within 24 hours</p>
                </div>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/25">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                  <p className="mt-2 text-gray-600">
                    Thank you for reaching out. We&apos;ll get back to you shortly.
                  </p>
                  <Button
                    className="mt-6"
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1.5 h-12"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1.5 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-700 font-medium">
                      Your Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="How can we help you today?"
                      value={formData.message}
                      onChange={handleChange}
                      className="mt-1.5 min-h-[160px] resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full gap-2 h-12 text-base bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              {/* Email Card */}
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="group flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Email Us</p>
                  <p className="text-sm text-blue-600">{CONTACT_INFO.email}</p>
                </div>
              </a>

              {/* Phone Card */}
              <a
                href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                className="group flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Call Us</p>
                  <p className="text-sm text-green-600">{CONTACT_INFO.phone}</p>
                </div>
              </a>

              {/* WhatsApp Card */}
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900">WhatsApp</p>
                  <p className="text-sm text-emerald-600">{CONTACT_INFO.whatsapp}</p>
                </div>
              </a>

              {/* Hours Card */}
              <div className="rounded-2xl border bg-gradient-to-br from-purple-50 to-indigo-50 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="font-bold text-gray-900">{CONTACT_INFO.hours}</p>
                </div>
                <p className="text-sm text-gray-600">
                  Our platform is available around the clock for certificate applications
                </p>
              </div>

              {/* Location Card */}
              <div className="rounded-2xl border bg-gradient-to-br from-amber-50 to-orange-50 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="font-bold text-gray-900">Pan-India Service</p>
                </div>
                <p className="text-sm text-gray-600">
                  We serve patients across all states and cities in India
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Width Map Section */}
      <section className="w-full">
        <div className="bg-gray-900 px-4 py-8 sm:py-10">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Our Location</h2>
            <p className="mt-2 text-gray-400">{CONTACT_INFO.address}</p>
          </div>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.7850452319336!2d78.39704!3d17.36052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91b2e8b8e8b5%3A0x8b8b8b8b8b8b8b8b!2sBanjara%20Hills%2C%20Hyderabad%2C%20Telangana%20500034!5e0!3m2!1sen!2sin!4v1679990000000!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="MediProofDocs Location"
          className="w-full"
        />
      </section>
    </>
  );
}
