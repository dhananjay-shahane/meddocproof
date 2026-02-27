"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Phone,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Lock,
  Zap,
  Stethoscope,
  Activity,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

const features = [
  { icon: Zap, label: "30-Min Delivery", color: "from-amber-400 to-orange-500" },
  { icon: ShieldCheck, label: "Legally Valid", color: "from-emerald-400 to-teal-500" },
];

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "General Physician",
    text: "The most efficient platform for issuing medical certificates. Saves hours of paperwork.",
    avatar: "SC",
  },
  {
    name: "Rahul Mehta",
    role: "HR Manager",
    text: "We verify certificates instantly. This platform has streamlined our leave management.",
    avatar: "RM",
  },
];

type Step = "phone" | "otp";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { login } = useAuth();
  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/user/send-otp", { phoneNumber });
      if (res.data.otp) {
        setDevOtp(res.data.otp);
        setOtp(res.data.otp);
      }
      toast.success(res.data.message || "OTP sent to your phone");
      setStep("otp");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/user/verify-otp", { phoneNumber, otp });
      login(undefined, { ...res.data.user, type: "user" });
      toast.success("Welcome back!");
      router.push(redirectUrl);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] lg:bg-white">
      {/* Mobile Background */}
      <div className="absolute inset-0 lg:hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10" />
        <img
          src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=2191"
          alt="Medical background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-20 flex min-h-screen w-full">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=2191"
              alt="Modern medical facility"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
          </div>

          {/* Animated Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-600/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-emerald-600/20 rounded-full blur-3xl"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 h-full text-white">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <Logo/>
            </motion.div>

            {/* Main Content */}
            <div className="space-y-8 max-w-lg">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium">Live Platform</span>
                </div>
                
                <h1 className="text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight">
                  Welcome
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
                    Back
                  </span>
                </h1>
                
                <p className="mt-6 text-lg text-white/60 leading-relaxed">
                  Access your verified medical certificates instantly. 
                  Secure, fast, and legally compliant documentation at your fingertips.
                </p>
              </motion.div>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-default"
                  >
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${feature.color} shadow-lg`}>
                      <feature.icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-semibold">{feature.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              <p className="text-sm font-medium text-white/40 uppercase tracking-wider">
                Trusted by Professionals
              </p>
              <div className="grid gap-3">
                {testimonials.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-sm font-bold shrink-0">
                        {item.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm">{item.name}</h4>
                          <span className="text-xs text-white/40">{item.role}</span>
                        </div>
                        <p className="text-sm text-white/50 line-clamp-2">&quot;{item.text}&quot;</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 lg:p-12 xl:p-16">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden flex items-center justify-center gap-3 mb-8"
            >
              <Logo/>
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 lg:p-8 rounded-3xl bg-white/10 lg:bg-white border border-white/20 lg:border-gray-200 shadow-2xl shadow-black/20 lg:shadow-xl backdrop-blur-xl lg:backdrop-blur-none"
            >
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-white lg:text-gray-900">
                    {step === "phone" ? "Sign In" : "Verify OTP"}
                  </h2>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 lg:bg-emerald-100 border border-emerald-500/30 lg:border-emerald-200">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-emerald-300 lg:text-emerald-700">
                      Secure
                    </span>
                  </div>
                </div>
                <p className="text-sm text-white/60 lg:text-gray-500">
                  {step === "phone"
                    ? "Enter your phone number to continue"
                    : `Enter the 6-digit code sent to ${phoneNumber}`}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {step === "phone" ? (
                  <motion.form
                    key="phone"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSendOTP}
                    className="space-y-6"
                  >
                    {/* Phone Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white lg:text-gray-700 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <div className="relative group">
                        <input
                          name="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          maxLength={15}
                          className="w-full h-14 px-4 pl-12 rounded-xl bg-white/5 lg:bg-gray-50 border border-white/10 lg:border-gray-200 text-white lg:text-gray-900 placeholder:text-white/30 lg:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-lg font-medium"
                        />
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 lg:text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 group text-base"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleVerifyOTP}
                    className="space-y-6"
                  >
                    {/* Dev OTP Banner */}
                    {devOtp && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-4 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Development Mode
                          </span>
                          <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/30 text-amber-200 font-medium">
                            Auto-filled
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                          <span className="font-mono text-2xl font-bold tracking-[0.3em] text-white">
                            {devOtp}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (devOtp) {
                                navigator.clipboard.writeText(devOtp);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                                toast.success("Copied!");
                              }
                            }}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            {copied ? (
                              <Check className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Copy className="w-5 h-5 text-white/60" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* OTP Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white lg:text-gray-700">
                        One-Time Password
                      </label>
                      <input
                        name="otp"
                        type="text"
                        inputMode="numeric"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        maxLength={6}
                        className="w-full h-16 text-center text-3xl tracking-[0.5em] font-bold rounded-xl bg-white/5 lg:bg-gray-50 border border-white/10 lg:border-gray-200 text-white lg:text-gray-900 placeholder:text-white/20 lg:placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                      />
                      <p className="text-xs text-center text-white/40 lg:text-gray-400">
                        Didn&apos;t receive?{" "}
                        <button
                          type="button"
                          onClick={() => handleSendOTP({ preventDefault: () => {} } as React.FormEvent)}
                          className="text-blue-400 lg:text-blue-600 font-semibold hover:underline"
                        >
                          Resend OTP
                        </button>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={loading}
                        className="w-full h-14 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 text-base"
                      >
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                        ) : (
                          "Verify & Continue"
                        )}
                      </Button>

                      <button
                        type="button"
                        onClick={() => {
                          setStep("phone");
                          setDevOtp(null);
                          setOtp("");
                        }}
                        className="w-full flex items-center justify-center gap-2 text-sm text-white/60 lg:text-gray-500 hover:text-white lg:hover:text-gray-900 transition-colors py-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Change phone number
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Footer Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Register Link */}
              <p className="text-center text-sm text-white/60 lg:text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-blue-400 lg:text-blue-600 hover:text-blue-300 lg:hover:text-blue-500 transition-colors"
                >
                  Create account
                </Link>
              </p>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/30 lg:text-gray-400">
                <Lock className="w-3 h-3" />
                <span>256-bit SSL encryption</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}