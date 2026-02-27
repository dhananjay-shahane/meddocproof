"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Clock, CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import api from "@/lib/api";

type ApprovalStatus = "pending" | "approved" | "rejected" | "suspended" | null;

export default function PendingApprovalPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <PendingApprovalContent />
    </Suspense>
  );
}

function PendingApprovalContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [status, setStatus] = useState<ApprovalStatus>(null);
  const [doctorName, setDoctorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const checkStatus = useCallback(async () => {
    if (!email) {
      setError("No email provided");
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/auth/doctor/pending-approval?email=${encodeURIComponent(email)}`);
      setStatus(res.data.data.status);
      setDoctorName(res.data.data.fullName);
    } catch {
      setError("Could not check approval status");
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    checkStatus();
    // Poll every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neubg p-4">
        <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Checking approval status...</p>
        </div>
      </div>
    );
  }

  if (error || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neubg p-4">
        <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm text-center">
          <XCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-lg font-semibold">Error</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error || "No email provided"}</p>
          <Link
            href="/doctor/register"
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            ← Back to Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neubg p-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          {status === "pending" && (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <h2 className="mt-4 text-xl font-bold">Registration Under Review</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Thank you, Dr. {doctorName}! Your registration has been submitted successfully.
              </p>
              <div className="mt-6 rounded-lg border bg-muted/50 p-4">
                <h3 className="text-sm font-medium">What happens next?</h3>
                <ul className="mt-2 space-y-2 text-left text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    Our admin team will review your credentials and registration number.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    This usually takes 1-2 business days.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    You&apos;ll be able to log in once approved.
                  </li>
                </ul>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                This page auto-refreshes every 30 seconds.
              </p>
            </div>
          )}

          {status === "approved" && (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-green-700">Account Approved!</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Congratulations, Dr. {doctorName}! Your account has been approved.
                You can now log in to access the doctor portal.
              </p>
              <Link
                href="/doctor/login"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === "rejected" && (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-red-700">Registration Rejected</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Unfortunately, your registration could not be approved at this time.
                Please contact support for more information.
              </p>
              <a
                href="mailto:support@medproofdocs.com"
                className="mt-4 inline-block text-sm text-primary hover:underline"
              >
                Contact Support
              </a>
            </div>
          )}

          {status === "suspended" && (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <XCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-orange-700">Account Suspended</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your account has been suspended. Please contact support.
              </p>
            </div>
          )}

          <div className="mt-6 border-t pt-4">
            <Link
              href="/doctor/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
