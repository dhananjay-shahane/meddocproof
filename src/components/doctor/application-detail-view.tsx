"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  User,
  Calendar,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Award,
} from "lucide-react";
import { MedicalAssessmentForm } from "@/components/doctor/medical-assessment-form";
import { DocumentViewer } from "@/components/doctor/document-viewer";
import { RemarksThread } from "@/components/doctor/remarks-thread";
import { ConsultationDialog } from "@/components/doctor/consultation-dialog";
import { prismaTemplateTToZod } from "@/lib/schemas/medical-assessment";
import type {
  ApplicationDetailData,
  MedicalAssessmentFormData,
  TemplateTypeValue,
} from "@/types";

interface ApplicationDetailViewProps {
  data: ApplicationDetailData;
  onSubmitAssessment: (formData: MedicalAssessmentFormData) => Promise<boolean>;
  onCompleteConsultation: (notes: string) => Promise<boolean>;
  onIssueCertificate: () => Promise<boolean>;
  onAddRemark: (message: string) => Promise<void>;
  submitting: boolean;
}

const statusColors: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  pending_review: "bg-yellow-100 text-yellow-800",
  pending_doctor_review: "bg-orange-100 text-orange-800",
  assigned: "bg-indigo-100 text-indigo-800",
  doctor_assigned: "bg-indigo-100 text-indigo-800",
  under_review: "bg-purple-100 text-purple-800",
  consultation_scheduled: "bg-cyan-100 text-cyan-800",
  consultation_completed: "bg-teal-100 text-teal-800",
  completed: "bg-green-100 text-green-800",
  delivered: "bg-green-100 text-green-800",
  certificate_delivered: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const certTypeLabels: Record<string, string> = {
  sick_leave: "Sick Leave",
  fitness: "Fitness",
  work_from_home: "Work From Home",
  caretaker: "Caretaker",
  recovery: "Recovery",
  fit_to_fly: "Fit-to-Fly",
  unfit_to_work: "Unfit To Work",
  unfit_to_travel: "Unfit To Travel",
  medical_diagnosis: "Medical Diagnosis",
};

export function ApplicationDetailView({
  data,
  onSubmitAssessment,
  onCompleteConsultation,
  onIssueCertificate,
  onAddRemark,
  submitting,
}: ApplicationDetailViewProps) {
  const [activeTab, setActiveTab] = useState<
    "details" | "assessment" | "documents" | "remarks"
  >("details");
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);

  const formData = data.formData as Record<string, unknown>;
  const canCompleteConsultation =
    data.hasMedicalAssessment && !data.consultationCompleted;
  const canIssueCertificate =
    data.consultationCompleted &&
    data.hasMedicalAssessment &&
    !data.certificateNumber;

  // Convert existing assessment to form data format
  const existingAssessment: MedicalAssessmentFormData | null =
    data.medicalAssessment
      ? {
          templateType: prismaTemplateTToZod(
            data.medicalAssessment.templateType
          ) as TemplateTypeValue,
          complaintsOf: data.medicalAssessment.complaintsOf,
          durationOfComplaints: data.medicalAssessment.durationOfComplaints,
          comorbidities: data.medicalAssessment.comorbidities,
          courseOfIllness: data.medicalAssessment.courseOfIllness,
          severityOfIllness: data.medicalAssessment.severityOfIllness,
          fullDiagnosisOfIllness:
            data.medicalAssessment.fullDiagnosisOfIllness,
          adviceByRegisteredMedicalPractitioner:
            data.medicalAssessment.adviceByRegisteredMedicalPractitioner,
          restPeriodFrom: data.medicalAssessment.restPeriodFrom
            ? format(
                new Date(data.medicalAssessment.restPeriodFrom),
                "yyyy-MM-dd"
              )
            : "",
          restDuration: data.medicalAssessment.restDuration as MedicalAssessmentFormData["restDuration"],
          restPeriodTo: data.medicalAssessment.restPeriodTo
            ? format(
                new Date(data.medicalAssessment.restPeriodTo),
                "yyyy-MM-dd"
              )
            : "",
          prescription: Array.isArray(data.medicalAssessment.prescription)
            ? data.medicalAssessment.prescription
            : [],
          additionalRecommendations:
            data.medicalAssessment.additionalRecommendations || "",
          pastHistoryOfSimilarComplaints: data.medicalAssessment.pastHistoryOfSimilarComplaints ?? false,
          pastHistoryDetails: data.medicalAssessment.pastHistoryDetails ?? undefined,
          anySubstanceIntake: data.medicalAssessment.anySubstanceIntake ?? false,
          substanceIntakeDetails: data.medicalAssessment.substanceIntakeDetails ?? undefined,
          anySignificantPastHistoryOfDisease: data.medicalAssessment.anySignificantPastHistoryOfDisease ?? false,
          significantPastHistoryDetails: data.medicalAssessment.significantPastHistoryDetails ?? undefined,
          anyHistoryOfSurgery: data.medicalAssessment.anyHistoryOfSurgery ?? false,
          surgeryHistoryDetails: data.medicalAssessment.surgeryHistoryDetails ?? undefined,
          historyOfTravel: data.medicalAssessment.historyOfTravel ?? false,
          travelHistoryDetails: data.medicalAssessment.travelHistoryDetails ?? undefined,
          familyHistoryOfSuchIllness: data.medicalAssessment.familyHistoryOfSuchIllness ?? false,
          familyHistoryDetails: data.medicalAssessment.familyHistoryDetails ?? undefined,
          tookAllopathicHomeopathicAyurvedicMedicine: data.medicalAssessment.tookAllopathicHomeopathicAyurvedicMedicine ?? false,
          medicineDetails: data.medicalAssessment.medicineDetails ?? undefined,
          tookSelfHelpAndUsedHomeRemedies: data.medicalAssessment.tookSelfHelpAndUsedHomeRemedies ?? false,
          homeRemediesDetails: data.medicalAssessment.homeRemediesDetails ?? undefined,
          anyEmergencyMedicineTreatmentTaken: data.medicalAssessment.anyEmergencyMedicineTreatmentTaken ?? false,
          emergencyTreatmentDetails: data.medicalAssessment.emergencyTreatmentDetails ?? undefined,
          anyCastBandageCreamApplied: data.medicalAssessment.anyCastBandageCreamApplied ?? false,
          castBandageDetails: data.medicalAssessment.castBandageDetails ?? undefined,
          vitalSigns: (data.medicalAssessment.vitalSigns as MedicalAssessmentFormData["vitalSigns"]) || undefined,
        }
      : null;

  const tabs = [
    { key: "details" as const, label: "Patient Details" },
    { key: "assessment" as const, label: "Medical Assessment" },
    { key: "documents" as const, label: `Documents (${data.documents.length})` },
    { key: "remarks" as const, label: `Remarks (${data.remarks.length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Header with status & actions */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border bg-card p-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">
              Application #{data.applicationDisplayId}
            </h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                statusColors[data.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {data.status.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {certTypeLabels[data.certificateType] || data.certificateType}{" "}
            Certificate • Created{" "}
            {format(new Date(data.createdAt), "MMM dd, yyyy 'at' h:mm a")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {data.hasMedicalAssessment && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
              <CheckCircle className="h-3.5 w-3.5" />
              Assessment Done
            </span>
          )}
          {data.consultationCompleted ? (
            <span className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700">
              <CheckCircle className="h-3.5 w-3.5" />
              Consultation Complete
            </span>
          ) : canCompleteConsultation ? (
            <button
              onClick={() => setShowConsultationDialog(true)}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              Complete Consultation
            </button>
          ) : null}
          {data.certificateNumber ? (
            <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <Award className="h-3.5 w-3.5" />
              Certificate: {data.certificateNumber}
            </span>
          ) : canIssueCertificate ? (
            <button
              onClick={onIssueCertificate}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Award className="h-4 w-4" />
              Issue Certificate
            </button>
          ) : null}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border bg-muted/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "details" && (
        <div className="space-y-6">
          {/* Patient info */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Patient Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                icon={User}
                label="Full Name"
                value={
                  (formData.fullName as string) || data.user.fullName
                }
              />
              <InfoItem
                icon={Phone}
                label="Phone"
                value={
                  (formData.phone as string) || data.user.phoneNumber
                }
              />
              <InfoItem
                icon={Mail}
                label="Email"
                value={
                  (formData.email as string) ||
                  data.user.email ||
                  "Not provided"
                }
              />
              {Boolean(formData.gender) && (
                <InfoItem
                  icon={User}
                  label="Gender"
                  value={formData.gender as string}
                />
              )}
              {Boolean(formData.age) && (
                <InfoItem
                  icon={Calendar}
                  label="Age"
                  value={`${formData.age} years`}
                />
              )}
              {Boolean(formData.dateOfBirth) && (
                <InfoItem
                  icon={Calendar}
                  label="Date of Birth"
                  value={formData.dateOfBirth as string}
                />
              )}
              {Boolean(formData.occupation) && (
                <InfoItem
                  icon={FileText}
                  label="Occupation"
                  value={formData.occupation as string}
                />
              )}
            </div>
            {Boolean(formData.address) && (
              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Address
                </p>
                <p className="mt-1 text-sm">{formData.address as string}</p>
              </div>
            )}
          </div>

          {/* Application info */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Application Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                icon={FileText}
                label="Certificate Type"
                value={
                  certTypeLabels[data.certificateType] ||
                  data.certificateType
                }
              />
              <InfoItem
                icon={Clock}
                label="Assigned At"
                value={
                  data.assignedAt
                    ? format(new Date(data.assignedAt), "MMM dd, yyyy")
                    : "Not assigned"
                }
              />
              <InfoItem
                icon={data.paymentCompleted ? CheckCircle : AlertCircle}
                label="Payment"
                value={
                  data.paymentCompleted ? "Completed" : "Pending"
                }
              />
            </div>
            {data.consultationNotes && (
              <div className="mt-4 rounded-lg bg-muted p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Consultation Notes
                </p>
                <p className="mt-1 text-sm">{data.consultationNotes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "assessment" && (
        <div className="rounded-xl border bg-card p-6">
          <MedicalAssessmentForm
            certificateType={data.certificateType}
            initialData={existingAssessment}
            onSubmit={onSubmitAssessment}
            disabled={data.consultationCompleted}
          />
        </div>
      )}

      {activeTab === "documents" && (
        <div className="rounded-xl border bg-card p-6">
          <DocumentViewer documents={data.documents} />
        </div>
      )}

      {activeTab === "remarks" && (
        <div className="rounded-xl border bg-card p-6">
          <RemarksThread
            remarks={data.remarks}
            onAdd={async (message) => {
              await onAddRemark(message);
            }}
            disabled={submitting}
          />
        </div>
      )}

      {/* Consultation dialog */}
      <ConsultationDialog
        open={showConsultationDialog}
        onClose={() => setShowConsultationDialog(false)}
        onConfirm={async (notes) => {
          await onCompleteConsultation(notes);
        }}
        disabled={submitting}
      />
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
