"use client";

import { useState } from "react";
import { useVerifyCertificate } from "@/hooks/use-verify-certificate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GridPattern } from "@/components/ui/grid-pattern";
import {
  CheckCircle,
  XCircle,
  Search,
  ShieldCheck,
  FileText,
  User,
  Stethoscope,
  Calendar,
  Loader2,
  Lock,
  ArrowRight,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function VerifyCertificatePage() {
  const [certificateNumber, setCertificateNumber] = useState("");
  const { result, loading, error, verify, reset } = useVerifyCertificate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verify(certificateNumber);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero header */}
      <div className="relative overflow-hidden bg-primary/5 border-b">
        <GridPattern
          width={30}
          height={30}
          x={-1}
          y={-1}
          strokeDasharray="4 2"
          className="mask-[radial-gradient(ellipse_at_center,white,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:py-20 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Verify Certificate
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground sm:text-lg">
            Instantly verify the authenticity of any medical certificate issued by MediProofDocs.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-2xl px-4 -mt-8 relative z-10 pb-20">
        {/* Search card */}
        <div className="rounded-2xl border bg-card p-6 shadow-lg sm:p-8">
          <form onSubmit={handleSubmit}>
            <label className="mb-3 block text-sm font-semibold">
              Certificate Number
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={certificateNumber}
                  onChange={(e) => {
                    setCertificateNumber(e.target.value);
                    if (result) reset();
                  }}
                  placeholder="e.g. MDP-2024-001234"
                  className="pl-10 h-12"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={loading || !certificateNumber.trim()}
                className="h-12 px-6 gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">Verify</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              <XCircle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6">
              {result.valid ? (
                <div className="space-y-5">
                  {/* Valid badge */}
                  <div className="flex items-center gap-4 rounded-xl bg-green-500/10 p-5 ring-1 ring-green-500/20">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500/20">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-green-700">
                        Valid Certificate
                      </p>
                      <p className="text-sm text-green-600">
                        This certificate is authentic and verified by MediProofDocs.
                      </p>
                    </div>
                  </div>

                  {/* Certificate details grid */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border bg-background p-4">
                      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        <FileText className="h-3.5 w-3.5" />
                        Certificate ID
                      </div>
                      <p className="mt-2 font-semibold">{result.certificateNumber}</p>
                    </div>

                    {result.certificateType && (
                      <div className="rounded-xl border bg-background p-4">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          <FileText className="h-3.5 w-3.5" />
                          Type
                        </div>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-sm">
                            {result.certificateType
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {result.patientName && (
                      <div className="rounded-xl border bg-background p-4">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          Patient
                        </div>
                        <p className="mt-2 font-semibold">{result.patientName}</p>
                      </div>
                    )}

                    {result.doctorName && (
                      <div className="rounded-xl border bg-background p-4">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          <Stethoscope className="h-3.5 w-3.5" />
                          Issued By
                        </div>
                        <p className="mt-2 font-semibold">{result.doctorName}</p>
                      </div>
                    )}

                    {result.issuedAt && (
                      <div className="rounded-xl border bg-background p-4 sm:col-span-2">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          Issue Date
                        </div>
                        <p className="mt-2 font-semibold">
                          {formatDate(result.issuedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 rounded-xl bg-red-500/10 p-5 ring-1 ring-red-500/20">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-red-700">
                      Certificate Not Found
                    </p>
                    <p className="text-sm text-red-600">
                      No valid certificate was found with this number. Please check and try again.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Trust indicators */}
        <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Secure & Encrypted</span>
          </div>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            <span>Instant Verification</span>
          </div>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <Link
            href="/certificates/apply"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Get a Certificate
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          MediProofDocs — Trusted Medical Certificate Verification
        </p>
      </div>
    </div>
  );
}
