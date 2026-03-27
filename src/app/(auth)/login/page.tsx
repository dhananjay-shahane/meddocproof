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
  ChevronLeft,
  Lock,
  Sparkles,
  Activity,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

const COUNTRY_CODES = [
  { code: "+91",  country: "India",          flag: "🇮🇳" },
  { code: "+1",   country: "USA / Canada",    flag: "🇺🇸" },
  { code: "+44",  country: "UK",              flag: "🇬🇧" },
  { code: "+61",  country: "Australia",       flag: "🇦🇺" },
  { code: "+971", country: "UAE",             flag: "🇦🇪" },
  { code: "+65",  country: "Singapore",       flag: "🇸🇬" },
  { code: "+60",  country: "Malaysia",        flag: "🇲🇾" },
  { code: "+966", country: "Saudi Arabia",    flag: "🇸🇦" },
  { code: "+974", country: "Qatar",           flag: "🇶🇦" },
  { code: "+49",  country: "Germany",         flag: "🇩🇪" },
  { code: "+33",  country: "France",          flag: "🇫🇷" },
  { code: "+81",  country: "Japan",           flag: "🇯🇵" },
  { code: "+86",  country: "China",           flag: "🇨🇳" },
  { code: "+64",  country: "New Zealand",     flag: "🇳🇿" },
  { code: "+27",  country: "South Africa",    flag: "🇿🇦" },
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
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const fullPhone = countryCode + phoneNumber.replace(/\D/g, "");
  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode);

  const validatePhone = () => {
    const digits = phoneNumber.replace(/\D/g, "");
    if (countryCode === "+91") return digits.length === 10;
    return digits.length >= 7 && digits.length <= 15;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone()) {
      toast.error(
        countryCode === "+91"
          ? "Please enter a valid 10-digit phone number"
          : "Please enter a valid phone number (7–15 digits)"
      );
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/user/send-otp", { phoneNumber: fullPhone });
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
      const res = await api.post("/auth/user/verify-otp", { phoneNumber: fullPhone, otp });
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
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/80 z-10" />
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
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/40" />
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
                <h1 className="text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight">
                  Welcome
                  <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-400 to-emerald-400">
                    Back
                  </span>
                </h1>
                
                <p className="mt-6 text-lg text-white/60 leading-relaxed">
                  Access your verified medical certificates instantly. 
                  Secure, fast, and legally compliant documentation at your fingertips.
                </p>

                {/* Login Steps for Users */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-8 space-y-3"
                >
                  <p className="text-sm font-medium text-white/40 uppercase tracking-wider">
                    Quick Steps
                  </p>
                  <div className="space-y-2">
                    {[
                      { step: 1, text: "Login with your phone number" },
                      { step: 2, text: "Select certificate type" },
                      { step: 3, text: "Consult with doctor" },
                      { step: 4, text: "Download certificate" },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
                      >
                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold">
                          {item.step}
                        </div>
                        <span className="text-sm text-white/70">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

            </div>
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
                    : `Enter the 6-digit code sent to ${countryCode} ${phoneNumber}`}
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
                    {/* Phone Number with country code */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white lg:text-gray-700 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <div className="flex gap-2">
                        {/* Country Code Dropdown */}
                        <div className="relative">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="h-14 pl-3 pr-8 rounded-xl bg-white/5 lg:bg-gray-50 border border-white/10 lg:border-gray-200 text-white lg:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 appearance-none text-sm font-medium cursor-pointer min-w-[90px]"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.code} value={c.code} className="text-gray-900 bg-white">
                                {c.flag} {c.code}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50 lg:text-gray-400 pointer-events-none" />
                        </div>
                        {/* Local Number */}
                        <input
                          name="phone"
                          type="tel"
                          placeholder={countryCode === "+91" ? "10-digit number" : "Phone number"}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 15))}
                          className="flex-1 h-14 px-4 rounded-xl bg-white/5 lg:bg-gray-50 border border-white/10 lg:border-gray-200 text-white lg:text-gray-900 placeholder:text-white/30 lg:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-lg font-medium"
                        />
                      </div>
                      <p className="text-xs text-white/40 lg:text-gray-400">
                        {selectedCountry?.flag} {selectedCountry?.country} &bull; OTP will be sent to {countryCode} {phoneNumber || "XXXXXXXXXX"}
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="w-full h-14 bg-linear-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 group text-base"
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
                        className="rounded-xl border border-amber-500/30 bg-linear-to-br from-amber-500/20 to-orange-500/20 p-4 backdrop-blur-sm"
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
                        className="w-full h-14 bg-linear-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 text-base"
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