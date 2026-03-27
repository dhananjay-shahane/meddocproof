"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Phone,
  User,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

const steps = [
  { step: 1, title: "Create Account", desc: "Sign up with your phone number" },
  { step: 2, title: "Choose Certificate", desc: "Select the type you need" },
  { step: 3, title: "Doctor Consultation", desc: "Talk to a licensed doctor" },
  { step: 4, title: "Get Certificate", desc: "Receive your valid certificate" },
];

const COUNTRY_CODES = [
  { code: "+91", country: "India",         flag: "🇮🇳" },
  { code: "+1",  country: "USA / Canada",   flag: "🇺🇸" },
  { code: "+44", country: "UK",             flag: "🇬🇧" },
  { code: "+61", country: "Australia",      flag: "🇦🇺" },
  { code: "+971",country: "UAE",            flag: "🇦🇪" },
  { code: "+65", country: "Singapore",      flag: "🇸🇬" },
  { code: "+60", country: "Malaysia",       flag: "🇲🇾" },
  { code: "+966",country: "Saudi Arabia",   flag: "🇸🇦" },
  { code: "+974",country: "Qatar",          flag: "🇶🇦" },
  { code: "+49", country: "Germany",        flag: "🇩🇪" },
  { code: "+33", country: "France",         flag: "🇫🇷" },
  { code: "+81", country: "Japan",          flag: "🇯🇵" },
  { code: "+86", country: "China",          flag: "🇨🇳" },
  { code: "+64", country: "New Zealand",    flag: "🇳🇿" },
  { code: "+27", country: "South Africa",   flag: "🇿🇦" },
];

type Step = "details" | "otp";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<Step>("details");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const fullPhone = countryCode + phoneNumber.replace(/\D/g, "");
  const displayPhone = `${countryCode} ${phoneNumber}`;
  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode);

  const validatePhone = () => {
    const digits = phoneNumber.replace(/\D/g, "");
    if (countryCode === "+91") return digits.length === 10;
    return digits.length >= 7 && digits.length <= 15;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || firstName.trim().length < 1) {
      toast.error("Please enter your first name");
      return;
    }
    if (!lastName.trim() || lastName.trim().length < 1) {
      toast.error("Please enter your last name");
      return;
    }
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

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/user/register", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: fullPhone,
        otp,
      });
      login(undefined, { ...res.data.user, type: "user" });
      toast.success("Account created successfully!");
      router.push("/");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] lg:bg-white">
      {/* Mobile Background Image */}
      <div className="absolute inset-0 lg:hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070"
          alt="Medical background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-20 flex min-h-screen w-full">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070"
              alt="Modern medical facility"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-emerald-500/10 rounded-full blur-3xl"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 h-full text-white">
            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <Logo/>
            </motion.div>

            {/* Main Hero Content */}
            <div className="space-y-8 max-w-lg">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
                  Trusted Medical
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                    Certificates
                  </span>
                </h1>
                <p className="mt-6 text-lg text-white/70 leading-relaxed">
                  Get verified medical certificates from licensed doctors within
                  30 minutes. Fast, secure, and legally valid documentation.
                </p>
              </motion.div>

            </div>

            {/* Registration Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <p className="text-sm font-medium text-white/40 uppercase tracking-wider">
                How It Works
              </p>
              <div className="space-y-3">
                {steps.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-sm font-bold shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-sm text-white/50">{item.desc}</p>
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
        

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white lg:text-gray-900">
                Create Account
              </h2>
              <p className="mt-2 text-white/60 lg:text-gray-500">
                Register with your details to get started
              </p>
            </motion.div>

            {/* Form Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 lg:p-8 rounded-3xl bg-white/10 lg:bg-white border border-white/20 lg:border-gray-200 shadow-2xl shadow-black/20 lg:shadow-xl backdrop-blur-xl lg:backdrop-blur-none"
            >
              <AnimatePresence mode="wait">
                {step === "details" ? (
                  <motion.form
                    key="details"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSendOTP}
                    className="space-y-6"
                  >
                    {/* First Name + Last Name — side by side */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-white lg:text-gray-700 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          First Name
                        </label>
                        <input
                          name="firstName"
                          type="text"
                          placeholder="First name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          maxLength={50}
                          className="w-full h-12 px-4 rounded-xl bg-white/5 lg:bg-gray-50 border border-white/10 lg:border-gray-200 text-white lg:text-gray-900 placeholder:text-white/30 lg:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-white lg:text-gray-700">
                          Last Name
                        </label>
                        <input
                          name="lastName"
                          type="text"
                          placeholder="Last name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          maxLength={50}
                          className="w-full h-12 px-4 rounded-xl bg-white/5 lg:bg-gray-50 border border-white/10 lg:border-gray-200 text-white lg:text-gray-900 placeholder:text-white/30 lg:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Phone Number with Country Code */}
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
                            className="h-12 pl-3 pr-8 rounded-xl bg-white/5 lg:bg-gray-50 border border-white/10 lg:border-gray-200 text-white lg:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 appearance-none text-sm font-medium cursor-pointer min-w-[90px]"
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
                          className="flex-1 h-12 px-4 rounded-xl bg-white/5 lg:bg-gray-50 border border-white/10 lg:border-gray-200 text-white lg:text-gray-900 placeholder:text-white/30 lg:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
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
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                          Send OTP & Register
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
                    onSubmit={handleVerifyAndRegister}
                    className="space-y-6"
                  >
                    {/* Dev OTP Badge */}
                    {devOtp && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-4 backdrop-blur-sm"
                      >
                        <p className="mb-2 text-xs font-semibold text-amber-300 flex items-center gap-2">
                          <Sparkles className="w-3 h-3" />
                          Development Mode
                        </p>
                        <div className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                          <span className="font-mono text-2xl font-bold tracking-[0.5em] text-white">
                            {devOtp}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (devOtp) {
                                navigator.clipboard.writeText(devOtp);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                                toast.success("OTP copied!");
                              }
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            {copied ? (
                              <Check className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Copy className="w-5 h-5 text-white/70" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* User Summary */}
                    <div className="rounded-xl bg-white/5 lg:bg-gray-50 border border-white/10 lg:border-gray-200 p-4 space-y-1">
                      <p className="text-sm text-white/60 lg:text-gray-500">
                        Registering as
                      </p>
                      <p className="font-semibold text-white lg:text-gray-900">
                        {firstName} {lastName}
                      </p>
                      <p className="text-xs text-white/40 lg:text-gray-400">
                        OTP sent to {displayPhone}
                      </p>
                    </div>

                    {/* OTP Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white lg:text-gray-700">
                        Enter OTP
                      </label>
                      <input
                        name="otp"
                        type="text"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        maxLength={6}
                        className="w-full h-14 text-center text-2xl tracking-[1em] font-mono rounded-xl bg-white/5 lg:bg-gray-50 border border-white/10 lg:border-gray-200 text-white lg:text-gray-900 placeholder:text-white/20 lg:placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                      />
                    </div>

                    {/* Verify Button */}
                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        "Verify & Create Account"
                      )}
                    </Button>

                    {/* Back Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-white/60 lg:text-gray-500 hover:text-white lg:hover:text-gray-900 hover:bg-white/5 lg:hover:bg-gray-100"
                      onClick={() => {
                        setStep("details");
                        setDevOtp(null);
                        setOtp("");
                      }}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Change details
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4 text-center"
            >
              <p className="text-sm text-white/50 lg:text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-400 lg:text-blue-600 hover:text-blue-300 lg:hover:text-blue-500 transition-colors"
                >
                  Sign In
                </Link>
              </p>

              <p className="text-xs text-white/20 lg:text-gray-400">
                © 2024 MediProofDocs — Trusted Medical Certificates
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}