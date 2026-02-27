"use client";

import { useState } from "react";
import { 
  Mail, 
  Phone, 
  Shield, 
  Send, 
  Loader2, 
  CheckCircle, 
  MapPin, 
  Clock, 
  Globe,
  MessageCircle,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "",
      href: "",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 87378 54807",
      href: "tel:+918737854807",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: "Mon - Fri: 10 AM - 6 PM",
      href: null,
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: Globe,
      label: "Location",
      value: "Bengaluru, Karnataka, India",
      href: null,
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <MessageCircle className="h-4 w-4" />
              We&apos;re Here to Help
            </span>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Have questions about our medical certificate services? Our support team is ready to assist you with any queries or concerns.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            
            {/* Left Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-3xl border bg-card/50 backdrop-blur-sm p-8 shadow-xl shadow-primary/5">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    Send us a Message
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fill out the form below and we&apos;ll get back to you within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="relative">
                    <label 
                      htmlFor="name" 
                      className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                        focusedField === "name" || form.name 
                          ? "-top-2.5 text-xs font-medium text-primary bg-card px-2" 
                          : "top-3.5 text-sm text-muted-foreground"
                      }`}
                    >
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border bg-transparent px-4 py-3.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <label 
                      htmlFor="email" 
                      className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                        focusedField === "email" || form.email 
                          ? "-top-2.5 text-xs font-medium text-primary bg-card px-2" 
                          : "top-3.5 text-sm text-muted-foreground"
                      }`}
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border bg-transparent px-4 py-3.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="relative">
                    <label 
                      htmlFor="message" 
                      className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                        focusedField === "message" || form.message 
                          ? "-top-2.5 text-xs font-medium text-primary bg-card px-2" 
                          : "top-3.5 text-sm text-muted-foreground"
                      }`}
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={form.message}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full resize-none rounded-xl border bg-transparent px-4 py-3.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Status Messages */}
                  <AnimatePresence mode="wait">
                    {status === "success" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-600"
                      >
                        <CheckCircle className="h-5 w-5 shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium">Message Sent!</p>
                          <p className="text-emerald-600/80">We&apos;ll respond within 24 hours.</p>
                        </div>
                      </motion.div>
                    )}

                    {status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive"
                      >
                        Something went wrong. Please try again or email us directly.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group relative w-full overflow-hidden rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {status === "loading" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/80 opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                </form>

                {/* Security Notice */}
                <div className="mt-6 flex items-start gap-3 rounded-xl bg-muted/50 p-4 border border-border/50">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    For your safety, please avoid sharing confidential medical or payment details in this message. We&apos;ll never ask for sensitive information via email.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-8"
            >
              {/* Contact Cards Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 transition-opacity group-hover:opacity-5`} />
                    <div className="relative">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg mb-4`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{item.label}</p>
                      {item.href ? (
                        <a 
                          href={item.href}
                          className="text-base font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-base font-semibold text-foreground">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map Section */}
              <div className="overflow-hidden rounded-3xl border bg-card shadow-xl shadow-primary/5">
                <div className="relative h-[400px] w-full bg-muted">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.88654010476!2d77.49085412154478!3d12.95395998710663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1709049600000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "grayscale(100%) contrast(1.1) opacity(0.9)" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />
                  
                  {/* Map Overlay Card */}
                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-card/95 backdrop-blur-md border p-4 shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">QuickMedicalCertificate.com</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Bengaluru, Karnataka, India<br />
                          PIN: 560048
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Support Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 p-6 text-center">
                <p className="text-sm font-medium text-foreground mb-2">Need Urgent Assistance?</p>
                <p className="text-xs text-muted-foreground mb-4">
                  For immediate support regarding your medical certificate, WhatsApp us directly.
                </p>
                <a 
                  href="https://wa.me/918737854807"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}