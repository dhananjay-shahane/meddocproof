"use client";

import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  generateCertificatePDF,
  type CertificateData,
} from "@/lib/pdf/certificate-templates";
import { format } from "date-fns";

interface PdfDownloadButtonProps {
  certificateNumber: string;
  certificateType: string;
  patientName: string;
  patientAge?: string;
  patientGender?: string;
  patientPhone?: string;
  doctorName: string;
  doctorRegistrationNumber: string;
  doctorSpecialization: string;
  diagnosis: string;
  restPeriodFrom: string;
  restPeriodTo: string;
  restDuration: string;
  additionalRecommendations?: string;
  issuedDate?: string;
  variant?: "button" | "icon" | "link";
  size?: "sm" | "md";
}

export function PdfDownloadButton({
  certificateNumber,
  certificateType,
  patientName,
  patientAge,
  patientGender,
  patientPhone,
  doctorName,
  doctorRegistrationNumber,
  doctorSpecialization,
  diagnosis,
  restPeriodFrom,
  restPeriodTo,
  restDuration,
  additionalRecommendations,
  issuedDate,
  variant = "button",
  size = "sm",
}: PdfDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);
    try {
      const data: CertificateData = {
        certificateNumber,
        certificateType,
        patientName,
        patientAge,
        patientGender,
        patientPhone,
        doctorName,
        doctorRegistrationNumber,
        doctorSpecialization,
        diagnosis,
        restPeriodFrom: format(new Date(restPeriodFrom), "dd MMM yyyy"),
        restPeriodTo: format(new Date(restPeriodTo), "dd MMM yyyy"),
        restDuration,
        additionalRecommendations,
        issuedDate: issuedDate
          ? format(new Date(issuedDate), "dd MMM yyyy")
          : format(new Date(), "dd MMM yyyy"),
        verificationUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/verify-certificate?number=${certificateNumber}`,
      };
      generateCertificatePDF(data);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className="rounded-lg border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
        title="Download Certificate PDF"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileDown className="h-4 w-4" />
        )}
      </button>
    );
  }

  if (variant === "link") {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <FileDown className="h-3.5 w-3.5" />
        )}
        Download PDF
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-lg border bg-card font-medium transition-colors hover:bg-muted disabled:opacity-50 ${
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
      }`}
    >
      {loading ? (
        <Loader2 className={`animate-spin ${size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
      ) : (
        <FileDown className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      )}
      PDF
    </button>
  );
}
