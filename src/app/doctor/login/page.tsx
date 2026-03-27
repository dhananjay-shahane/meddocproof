"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Phone, ArrowLeft, Lock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  GlassInputWrapper,
} from "@/components/ui/sign-in";
import { Logo } from "@/components/shared/logo";

export default function DoctorLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <DoctorLoginContent />
    </Suspense>
  );
}

function DoctorLoginContent() {
  const router = useRouter();
  const { login } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOTP = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    if (cleanNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/doctor/send-otp", { phoneNumber: cleanNumber });
      toast.success(res.data.message);
      
      if (res.data.otp) {
        toast.info(`Dev OTP: ${res.data.otp}`, { duration: 10000 });
      }
      
      setOtpSent(true);
      setResendTimer(60);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }, [phoneNumber]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const cleanNumber = phoneNumber.replace(/\D/g, "");
      const res = await api.post("/auth/doctor/verify-otp", { 
        phoneNumber: cleanNumber, 
        otp 
      });
      login(undefined, { ...res.data.user, type: "doctor" });
      toast.success("Login successful!");
      router.push("/doctor");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (resendTimer === 0) {
      handleSendOTP();
    }
  };

  const handleBackToPhone = () => {
    setOtpSent(false);
    setOtp("");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900">
      <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="white" opacity="0.6"/>
          </pattern>
          <pattern id="circles" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="35" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2"/>
            <circle cx="40" cy="40" r="20" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/>
          </pattern>
          <pattern id="waves" width="100" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q25 0 50 10 T100 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.15"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
        <rect width="100%" height="100%" fill="url(#circles)" />
        <rect width="100%" height="100%" fill="url(#waves)" />
      </svg>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4 py-6"
      >
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-teal-500/5" />
          <div className="relative p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-6">
                <Logo className="h-16 w-auto" />
              </div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600/10 to-teal-500/10 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-600">Doctor Portal</span>
              </div>
              <p className="text-base text-gray-500">
                {otpSent ? "Enter the OTP sent to your phone" : "Sign in with your registered phone number"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!otpSent ? (
                <motion.form
                  key="phone"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSendOTP}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <GlassInputWrapper>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <span className="absolute left-11 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                          +91
                        </span>
                        <input
                          name="phoneNumber"
                          type="tel"
                          inputMode="numeric"
                          placeholder="Enter 10-digit number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="h-12 w-full rounded-xl bg-transparent pl-18 pr-4 text-sm focus:outline-none"
                          maxLength={10}
                        />
                      </div>
                    </GlassInputWrapper>
                    <p className="text-xs text-gray-500">
                      Use the phone number registered with your doctor account
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading || phoneNumber.length !== 10}
                    className="h-14 w-full rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-base font-semibold shadow-lg shadow-blue-500/20"
                  >
                    {loading ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleVerifyOTP}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Enter OTP</label>
                    <GlassInputWrapper>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          name="otp"
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          className="h-12 w-full rounded-xl bg-transparent pl-11 pr-4 text-sm tracking-[0.5em] focus:outline-none"
                          maxLength={6}
                          autoFocus
                        />
                      </div>
                    </GlassInputWrapper>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        OTP sent to +91 {phoneNumber}
                      </span>
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resendTimer > 0 || loading}
                        className="text-blue-600 hover:underline disabled:opacity-50 disabled:no-underline"
                      >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading || otp.length !== 6}
                    className="h-14 w-full rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-base font-semibold shadow-lg shadow-blue-500/20"
                  >
                    {loading ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      "Verify & Sign In"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={handleBackToPhone}
                  >
                    <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                    Change Phone Number
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
          
          <div className="border-t border-gray-100 bg-gray-50/80 px-10 py-5">
            <p className="text-center text-sm text-gray-400">
              MedproofDocs — Doctor Console
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
