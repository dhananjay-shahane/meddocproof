"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";
import { format } from "date-fns";
import { CERT_TYPE_LABELS } from "@/lib/certificate-types";
import { PdfDownloadButton } from "@/components/shared/pdf-download-button";
import {
  ArrowLeft,
  Loader2,
  FileText,
  User,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Award,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ApplicationDetail {
  id: string;
  applicationId: string;
  certificateType: string;
  certificateNumber: string | null;
  status: string;
  formData: Record<string, unknown>;
  paymentCompleted: boolean;
  consultationDate: string | null;
  consultationCompleted: boolean;
  assignedDoctor: {
    fullName: string;
    specialization: string;
    registrationNumber: string;
  } | null;
  medicalAssessment: {
    fullDiagnosisOfIllness: string;
    restPeriodFrom: string;
    restPeriodTo: string;
    restDuration: string;
    adviceByRegisteredMedicalPractitioner: string;
    additionalRecommendations: string | null;
  } | null;
  remarks: {
    id: string;
    message: string;
    addedByRole: string;
    addedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700",
  assigned: "bg-indigo-100 text-indigo-700",
  under_review: "bg-orange-100 text-orange-700",
  consultation_scheduled: "bg-purple-100 text-purple-700",
  consultation_completed: "bg-teal-100 text-teal-700",
  completed: "bg-green-100 text-green-700",
  certificate_delivered: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
};

export default function UserApplicationDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user: authUser } = useAuth();
  const [data, setData] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/user/applications/${id}`);
      if (res.data.success) {
        setData(res.data.data);
      } else {
        setError(res.data.message || "Failed to load");
      }
    } catch {
      setError("Failed to load application details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchDetail();
    }
  }, [authLoading, isAuthenticated, fetchDetail]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neubg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || authUser?.type !== "user") {
    router.push("/login");
    return null;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-neubg">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-xl border bg-card p-12 text-center shadow-sm">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
            <p className="mt-4 text-muted-foreground">{error || "Application not found"}</p>
            <Link
              href="/profile"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formData = data.formData;
  const patientName =
    (formData.fullName as string) ||
    `${formData.firstName || ""} ${formData.lastName || ""}`.trim() ||
    "Patient";

  return (
    <div className="min-h-screen bg-neubg">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold text-primary">
            MediProofDocs
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        {/* Status Header */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">
                  Application #{data.applicationId}
                </h1>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    STATUS_COLORS[data.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {data.status.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {CERT_TYPE_LABELS[data.certificateType] || data.certificateType}{" "}
                Certificate • Applied{" "}
                {format(new Date(data.createdAt), "MMM dd, yyyy")}
              </p>
            </div>

            {data.certificateNumber && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                  <Award className="h-3.5 w-3.5" />
                  {data.certificateNumber}
                </span>
              </div>
            )}
          </div>

          {/* Progress steps */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto text-xs">
            {["submitted", "assigned", "under_review", "consultation_completed", "completed"].map(
              (step, idx, arr) => {
                const stepLabels: Record<string, string> = {
                  submitted: "Submitted",
                  assigned: "Doctor Assigned",
                  under_review: "Under Review",
                  consultation_completed: "Consultation Done",
                  completed: "Certificate Issued",
                };
                const stepOrder = arr;
                const currentIdx = stepOrder.indexOf(data.status);
                const isCompleted = idx <= currentIdx;
                const isCurrent = step === data.status;
                return (
                  <div key={step} className="flex items-center gap-1.5 shrink-0">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? "✓" : idx + 1}
                    </div>
                    <span
                      className={`${
                        isCompleted || isCurrent
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {stepLabels[step]}
                    </span>
                    {idx < arr.length - 1 && (
                      <div
                        className={`mx-1 h-px w-6 ${
                          isCompleted ? "bg-green-400" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Patient Info */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <User className="h-4 w-4" />
              Patient Info
            </h3>
            <div className="space-y-2 text-sm">
              <Row label="Name" value={patientName} />
              {Boolean(formData.phoneNumber) && (
                <Row label="Phone" value={formData.phoneNumber as string} />
              )}
              {Boolean(formData.email) && (
                <Row label="Email" value={formData.email as string} />
              )}
              {Boolean(formData.gender) && (
                <Row label="Gender" value={formData.gender as string} />
              )}
              {Boolean(formData.dateOfBirth) && (
                <Row label="DOB" value={formData.dateOfBirth as string} />
              )}
            </div>
          </div>

          {/* Application Info */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <FileText className="h-4 w-4" />
              Application Info
            </h3>
            <div className="space-y-2 text-sm">
              <Row
                label="Type"
                value={
                  CERT_TYPE_LABELS[data.certificateType] ||
                  data.certificateType
                }
              />
              <Row
                label="Payment"
                value={data.paymentCompleted ? "Completed" : "Pending"}
              />
              {data.consultationDate && (
                <Row
                  label="Consultation"
                  value={format(
                    new Date(data.consultationDate),
                    "dd MMM yyyy"
                  )}
                />
              )}
              {data.assignedDoctor && (
                <>
                  <Row label="Doctor" value={data.assignedDoctor.fullName} />
                  <Row
                    label="Specialization"
                    value={data.assignedDoctor.specialization}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Medical Assessment (if completed) */}
        {data.medicalAssessment && (
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Medical Assessment
            </h3>
            <div className="space-y-2 text-sm">
              <Row
                label="Diagnosis"
                value={data.medicalAssessment.fullDiagnosisOfIllness}
              />
              <Row
                label="Rest Period"
                value={`${format(
                  new Date(data.medicalAssessment.restPeriodFrom),
                  "dd MMM yyyy"
                )} – ${format(
                  new Date(data.medicalAssessment.restPeriodTo),
                  "dd MMM yyyy"
                )}`}
              />
              <Row
                label="Duration"
                value={data.medicalAssessment.restDuration}
              />
              {data.medicalAssessment.adviceByRegisteredMedicalPractitioner && (
                <Row
                  label="Doctor's Advice"
                  value={
                    data.medicalAssessment
                      .adviceByRegisteredMedicalPractitioner
                  }
                />
              )}
              {data.medicalAssessment.additionalRecommendations && (
                <Row
                  label="Recommendations"
                  value={data.medicalAssessment.additionalRecommendations}
                />
              )}
            </div>
          </div>
        )}

        {/* Remarks */}
        {data.remarks.length > 0 && (
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock className="h-4 w-4" />
              Updates
            </h3>
            <div className="space-y-3">
              {data.remarks.map((r) => (
                <div key={r.id} className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm">{r.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(r.addedAt), "dd MMM yyyy, h:mm a")} •{" "}
                    {r.addedByRole}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Download Certificate */}
        {data.certificateNumber &&
          data.assignedDoctor &&
          data.medicalAssessment && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center shadow-sm dark:border-green-900 dark:bg-green-950">
              <Award className="mx-auto h-10 w-10 text-green-600" />
              <h3 className="mt-3 text-lg font-semibold text-green-800 dark:text-green-200">
                Your Certificate is Ready!
              </h3>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                Certificate Number: {data.certificateNumber}
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <PdfDownloadButton
                  certificateNumber={data.certificateNumber}
                  certificateType={data.certificateType}
                  patientName={patientName}
                  patientAge={formData.age as string}
                  patientGender={formData.gender as string}
                  patientPhone={formData.phoneNumber as string}
                  doctorName={data.assignedDoctor.fullName}
                  doctorRegistrationNumber={
                    data.assignedDoctor.registrationNumber
                  }
                  doctorSpecialization={data.assignedDoctor.specialization}
                  diagnosis={
                    data.medicalAssessment.fullDiagnosisOfIllness
                  }
                  restPeriodFrom={data.medicalAssessment.restPeriodFrom}
                  restPeriodTo={data.medicalAssessment.restPeriodTo}
                  restDuration={data.medicalAssessment.restDuration}
                  additionalRecommendations={
                    data.medicalAssessment.additionalRecommendations ||
                    undefined
                  }
                  issuedDate={data.updatedAt}
                  variant="button"
                />
                <Link
                  href={`/verify-certificate?number=${data.certificateNumber}`}
                  className="rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900"
                >
                  Verify Certificate
                </Link>
              </div>
            </div>
          )}
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
