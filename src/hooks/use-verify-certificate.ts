"use client";

import { useState, useCallback } from "react";
import type { CertificateVerificationResult } from "@/types";

interface UseVerifyCertificateResult {
  result: CertificateVerificationResult | null;
  loading: boolean;
  error: string | null;
  verify: (certificateNumber: string) => Promise<void>;
  reset: () => void;
}

export function useVerifyCertificate(): UseVerifyCertificateResult {
  const [result, setResult] = useState<CertificateVerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(async (certificateNumber: string) => {
    if (!certificateNumber.trim()) {
      setError("Please enter a certificate number");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await fetch(
        `/api/verify-certificate?certificateNumber=${encodeURIComponent(certificateNumber.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to verify certificate");
        return;
      }

      setResult(data.data);
    } catch {
      setError("Failed to verify certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, verify, reset };
}
