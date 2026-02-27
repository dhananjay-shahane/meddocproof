"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, Loader2, Phone, Copy, Check } from "lucide-react";
import api from "@/lib/api";

interface OtpVerificationProps {
  phoneNumber: string;
  onPhoneChange: (phone: string) => void;
  otpVerified: boolean;
  onVerified: () => void;
}

export function OtpVerification({
  phoneNumber,
  onPhoneChange,
  otpVerified,
  onVerified,
}: OtpVerificationProps) {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const sendOtp = useCallback(async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Enter a valid phone number");
      return;
    }
    try {
      setSending(true);
      setError(null);
      const res = await api.post("/auth/user/send-otp", { phoneNumber });
      // In dev mode the API returns the OTP directly — auto-fill it
      if (res.data.otp) {
        setDevOtp(res.data.otp);
        setOtp(res.data.otp);
      }
      setOtpSent(true);
      setCountdown(60);
    } catch {
      setError("Failed to send OTP. Try again.");
    } finally {
      setSending(false);
    }
  }, [phoneNumber]);

  const verifyOtp = useCallback(async () => {
    if (!otp || otp.length !== 6) {
      setError("Enter a valid 6-digit OTP");
      return;
    }
    try {
      setVerifying(true);
      setError(null);
      await api.post("/auth/user/verify-otp", { phoneNumber, otp });
      onVerified();
    } catch {
      setError("Invalid OTP. Try again.");
    } finally {
      setVerifying(false);
    }
  }, [phoneNumber, otp, onVerified]);

  if (otpVerified) {
    return (
      <div className="space-y-2">
        <label className="mb-1 block text-sm font-medium">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2 rounded-lg border bg-green-50 px-3 py-2 dark:bg-green-900/20">
          <Phone className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium">{phoneNumber}</span>
          <CheckCircle className="ml-auto h-4 w-4 text-green-600" />
          <span className="text-xs text-green-600">Verified</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Phone Number (WhatsApp preferred) <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => {
              onPhoneChange(e.target.value);
              if (otpSent) setOtpSent(false);
            }}
            disabled={otpSent}
            className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm disabled:opacity-60"
            placeholder="+91 9876543210"
          />
          <button
            type="button"
            onClick={sendOtp}
            disabled={sending || countdown > 0 || !phoneNumber}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : countdown > 0 ? (
              `Resend (${countdown}s)`
            ) : otpSent ? (
              "Resend OTP"
            ) : (
              "Send OTP"
            )}
          </button>
        </div>
      </div>

      {otpSent && (
        <div className="space-y-3">
          {/* Dev mode OTP banner */}
          {devOtp && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
              <p className="mb-1 text-xs font-medium text-amber-800 dark:text-amber-200">
                Dev Mode — Your OTP:
              </p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-bold tracking-widest text-amber-900 dark:text-amber-100">
                  {devOtp}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(devOtp);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="rounded-md p-1.5 transition-colors hover:bg-amber-200 dark:hover:bg-amber-800"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                  )}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Enter OTP <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm tracking-widest"
                placeholder="• • • • • •"
                maxLength={6}
              />
              <button
                type="button"
                onClick={verifyOtp}
                disabled={verifying || otp.length !== 6}
                className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {verifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
