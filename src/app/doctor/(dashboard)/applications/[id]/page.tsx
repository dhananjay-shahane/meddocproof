"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useDoctorApplicationDetail } from "@/hooks/use-doctor-application-detail";
import { ApplicationDetailView } from "@/components/doctor/application-detail-view";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DoctorApplicationDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const {
    data,
    loading,
    error,
    refetch,
    submitAssessment,
    completeConsultation,
    issueCertificate,
    addRemark,
    submitting,
  } = useDoctorApplicationDetail(id);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-muted-foreground">{error || "Application not found"}</p>
        <div className="flex gap-2">
          <button
            onClick={() => router.back()}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-accent"
          >
            Go Back
          </button>
          <button
            onClick={refetch}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/doctor/applications")}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Applications
      </button>

      <ApplicationDetailView
        data={data}
        onSubmitAssessment={submitAssessment}
        onCompleteConsultation={completeConsultation}
        onIssueCertificate={issueCertificate}
        onAddRemark={async (message) => {
          await addRemark(message);
        }}
        submitting={submitting}
      />
    </div>
  );
}
