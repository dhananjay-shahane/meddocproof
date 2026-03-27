"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDoctorApplications } from "@/hooks/use-doctor-applications";
import { MedicalAssessmentForm } from "@/components/doctor/medical-assessment-form";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Eye,
  FileCheck,
  Clock,
  CheckCircle,
  ClipboardList,
  Calendar,
  File,
  MessageSquare,
  X,
  FileIcon,
  Download,
  Image as ImageIcon,
  Stethoscope,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import type { MedicalAssessmentFormData, CertificateType } from "@/types";

const certTypeLabels: Record<string, string> = {
  sick_leave: "Sick-Leave",
  fitness: "Fitness",
  work_from_home: "Work-From-Home",
  caretaker: "Caretaker",
  recovery: "Recovery",
  fit_to_fly: "Fit-To-Fly",
  unfit_to_work: "Unfit-To-Work",
  unfit_to_travel: "Unfit-To-Travel",
  medical_diagnosis: "Medical-Diagnosis",
};

const isPendingStatus = (status: string) => {
  return [
    "assigned",
    "doctor_assigned",
    "pending_doctor_review",
    "under_review",
    "consultation_scheduled",
  ].includes(status);
};

interface DocumentItem {
  id: string;
  fileName: string;
  contentType: string;
  url: string;
  size?: number;
  createdAt: string;
}

interface ApplicationDetail {
  id: string;
  applicationId: string;
  applicationDisplayId: string;
  certificateType: string;
  certificateNumber: string | null;
  status: string;
  formData: Record<string, unknown>;
  user: {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
  };
  assignedDoctor: {
    id: string;
    fullName: string;
    specialization: string;
  } | null;
  assignedAt: string | null;
  consultationDate: string | null;
  createdAt: string;
  documents?: DocumentItem[];
  consultationNotes?: string;
  consultationCompletedAt?: string;
}

export default function DoctorApplicationsPage() {
  const router = useRouter();
  const { data, loading, error, filters, setFilters, page, setPage, refetch } =
    useDoctorApplications();

  const [selectedApp, setSelectedApp] = useState<ApplicationDetail | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [documentsModalData, setDocumentsModalData] = useState<{
    documents: DocumentItem[];
    loading: boolean;
  }>({ documents: [], loading: false });

  // Medical Assessment Modal State
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [assessmentAppData, setAssessmentAppData] = useState<{
    id: string;
    certificateType: CertificateType;
    existingAssessment: MedicalAssessmentFormData | null;
    consultationCompleted: boolean;
  } | null>(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentSaving, setAssessmentSaving] = useState(false);

  const handleViewDetails = async (appId: string) => {
    try {
      setModalLoading(true);
      setShowModal(true);
      const res = await api.get(`/doctor/applications/${appId}`);
      setSelectedApp(res.data.data);
    } catch (err) {
      console.error("Failed to load application details:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewDocuments = async (appId: string) => {
    try {
      setDocumentsModalData({ documents: [], loading: true });
      setShowDocumentsModal(true);
      const res = await api.get(`/doctor/applications/${appId}`);
      setDocumentsModalData({
        documents: res.data.data?.documents || [],
        loading: false,
      });
    } catch (err) {
      console.error("Failed to load documents:", err);
      setDocumentsModalData({ documents: [], loading: false });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApp(null);
  };

  const closeDocumentsModal = () => {
    setShowDocumentsModal(false);
    setDocumentsModalData({ documents: [], loading: false });
  };

  // Medical Assessment Modal Handlers
  const handleOpenAssessment = useCallback(async (appId: string) => {
    try {
      setAssessmentLoading(true);
      setShowAssessmentModal(true);
      const res = await api.get(`/doctor/applications/${appId}`);
      const appData = res.data.data;
      
      // Parse existing medical assessment if available
      let existingAssessment: MedicalAssessmentFormData | null = null;
      if (appData.medicalAssessment) {
        existingAssessment = {
          templateType: appData.medicalAssessment.templateType || "general",
          complaintsOf: appData.medicalAssessment.complaintsOf || "",
          durationOfComplaints: appData.medicalAssessment.durationOfComplaints || "",
          comorbidities: appData.medicalAssessment.comorbidities || "",
          courseOfIllness: appData.medicalAssessment.courseOfIllness || "progressive",
          severityOfIllness: appData.medicalAssessment.severityOfIllness || "mild",
          fullDiagnosisOfIllness: appData.medicalAssessment.fullDiagnosisOfIllness || "",
          adviceByRegisteredMedicalPractitioner: appData.medicalAssessment.adviceByRegisteredMedicalPractitioner || "",
          additionalRecommendations: appData.medicalAssessment.additionalRecommendations || "",
          restPeriodFrom: appData.medicalAssessment.restPeriodFrom || "",
          restPeriodTo: appData.medicalAssessment.restPeriodTo || "",
          restDuration: appData.medicalAssessment.restDuration || "1-day",
          prescription: appData.medicalAssessment.prescription || [{ medicineName: "", dosage: "", duration: "" }],
          pastHistoryOfSimilarComplaints: appData.medicalAssessment.pastHistoryOfSimilarComplaints || false,
          pastHistoryDetails: appData.medicalAssessment.pastHistoryDetails || "",
          anySubstanceIntake: appData.medicalAssessment.anySubstanceIntake || false,
          substanceIntakeDetails: appData.medicalAssessment.substanceIntakeDetails || "",
          anySignificantPastHistoryOfDisease: appData.medicalAssessment.anySignificantPastHistoryOfDisease || false,
          significantPastHistoryDetails: appData.medicalAssessment.significantPastHistoryDetails || "",
          anyHistoryOfSurgery: appData.medicalAssessment.anyHistoryOfSurgery || false,
          surgeryHistoryDetails: appData.medicalAssessment.surgeryHistoryDetails || "",
          historyOfTravel: appData.medicalAssessment.historyOfTravel || false,
          travelHistoryDetails: appData.medicalAssessment.travelHistoryDetails || "",
          familyHistoryOfSuchIllness: appData.medicalAssessment.familyHistoryOfSuchIllness || false,
          familyHistoryDetails: appData.medicalAssessment.familyHistoryDetails || "",
          tookAllopathicHomeopathicAyurvedicMedicine: appData.medicalAssessment.tookAllopathicHomeopathicAyurvedicMedicine || false,
          medicineDetails: appData.medicalAssessment.medicineDetails || "",
          tookSelfHelpAndUsedHomeRemedies: appData.medicalAssessment.tookSelfHelpAndUsedHomeRemedies || false,
          homeRemediesDetails: appData.medicalAssessment.homeRemediesDetails || "",
          anyEmergencyMedicineTreatmentTaken: appData.medicalAssessment.anyEmergencyMedicineTreatmentTaken || false,
          emergencyTreatmentDetails: appData.medicalAssessment.emergencyTreatmentDetails || "",
          anyCastBandageCreamApplied: appData.medicalAssessment.anyCastBandageCreamApplied || false,
          castBandageDetails: appData.medicalAssessment.castBandageDetails || "",
          vitalSigns: appData.medicalAssessment.vitalSigns || undefined,
          fitnessChecklist: appData.medicalAssessment.fitnessChecklist || undefined,
        };
      }
      
      setAssessmentAppData({
        id: appId,
        certificateType: appData.certificateType as CertificateType,
        existingAssessment,
        consultationCompleted: appData.consultationCompleted || false,
      });
    } catch (err) {
      console.error("Failed to load application for assessment:", err);
      setShowAssessmentModal(false);
    } finally {
      setAssessmentLoading(false);
    }
  }, []);

  const handleCloseAssessment = () => {
    setShowAssessmentModal(false);
    setAssessmentAppData(null);
  };

  const handleSubmitAssessment = async (formData: MedicalAssessmentFormData): Promise<boolean> => {
    if (!assessmentAppData) return false;
    
    try {
      setAssessmentSaving(true);
      await api.post(`/doctor/applications/${assessmentAppData.id}/assessment`, formData);
      await refetch();
      handleCloseAssessment();
      return true;
    } catch (err) {
      console.error("Failed to save assessment:", err);
      return false;
    } finally {
      setAssessmentSaving(false);
    }
  };

  // Fix hydration mismatch by setting date only on client
  const [updateTime, setUpdateTime] = useState<string>("");
  useEffect(() => {
    setUpdateTime(format(new Date(), "yyyy-MM-dd HH:mm"));
  }, []);

  const stats = data?.stats;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            My Assigned Applications
          </h1>
          <p className="text-sm text-gray-500">
            Manage and complete consultations for assigned applications
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            Production - Latest Update: {updateTime || "Loading..."} UTC
          </p>
        </div>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">
                Total Applications
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {stats?.totalApplications ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">
                Pending Review
              </p>
              <p className="mt-1 text-3xl font-bold text-orange-500">
                {stats?.pendingReview ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-orange-50 p-3">
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">
                Completed
              </p>
              <p className="mt-1 text-3xl font-bold text-emerald-600">
                {stats?.completed ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">
                Medical Assessment
              </p>
              <p className="mt-1 text-3xl font-bold text-blue-600">
                {stats?.medicalAssessment ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3">
              <ClipboardList className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, phone, or application ID..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setFilters({ tab: "pending" })}
          className={cn(
            "relative px-4 py-2.5 text-sm font-medium transition-colors",
            filters.tab === "pending"
              ? "text-amber-600"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Pending Consultations ({stats?.pendingReview ?? 0})
          {filters.tab === "pending" && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-amber-500" />
          )}
        </button>
        <button
          onClick={() => setFilters({ tab: "completed" })}
          className={cn(
            "relative px-4 py-2.5 text-sm font-medium transition-colors",
            filters.tab === "completed"
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Completed ({stats?.completed ?? 0})
          {filters.tab === "completed" && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-900" />
          )}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-xl border border-gray-100 bg-white">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={refetch}
            className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white">
          <FileText className="h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500">
            No applications found
          </p>
        </div>
      ) : (
        <>
          {/* Application Cards */}
          <div className="space-y-4">
            {data.items.map((app) => (
              <div
                key={app.id}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                {/* Card Header */}
                <div className="border-b border-gray-100 px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{app.userName}</h3>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {certTypeLabels[app.certificateType] ?? app.certificateType}{" "}
                        • Certificate No: {app.certificateNumber ?? app.applicationDisplayId}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
                        isPendingStatus(app.status)
                          ? "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200"
                          : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                      )}
                    >
                      {isPendingStatus(app.status)
                        ? "Pending Consultation"
                        : "Completed"}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Info Grid Row 1 */}
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium text-gray-400">Email</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">{app.userEmail || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">Phone</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">{app.userPhone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">Age</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {app.userAge ? `${app.userAge} years` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">Gender</p>
                      <p className="mt-1 text-sm font-medium capitalize text-gray-900">
                        {app.userGender || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Info Grid Row 2 */}
                  <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Assigned On
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {app.assignedAt
                          ? format(parseISO(app.assignedAt), "MMM dd, yyyy")
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Application Date
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {format(parseISO(app.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Organization
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {app.organization || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Location
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {app.location || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Info Grid Row 3 */}
                  <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Certificate Number
                      </p>
                      <p className="mt-1 text-sm font-medium text-blue-600">
                        {app.certificateNumber ?? app.applicationDisplayId}
                      </p>
                    </div>
                    <div className="lg:col-span-2">
                      <p className="text-xs font-medium text-gray-400">
                        Leave Reason
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {app.leaveReason || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Leave Period
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {app.leavePeriodFrom && app.leavePeriodTo
                          ? `${format(parseISO(app.leavePeriodFrom), "MMM dd")} to ${format(parseISO(app.leavePeriodTo), "MMM dd, yyyy")}`
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Scheduled Consultation for Pending */}
                  {app.consultationDate && isPendingStatus(app.status) && (
                    <div className="mt-4 flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-700">Scheduled Consultation</p>
                          <p className="text-xs text-blue-600">
                            {format(parseISO(app.consultationDate), "EEEE, MMM dd, yyyy 'at' hh:mm a")}
                          </p>
                        </div>
                      </div>
                      <button className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50">
                        <Clock className="h-4 w-4" />
                        Reschedule
                      </button>
                    </div>
                  )}

                  {/* Consultation Completed for Completed Applications */}
                  {!isPendingStatus(app.status) && app.consultationDate && (
                    <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50/50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="text-sm font-medium text-emerald-700">Consultation Completed</p>
                          <p className="text-xs text-emerald-600">
                            {format(parseISO(app.consultationDate), "EEEE, MMM dd, yyyy 'at' hh:mm a")}
                          </p>
                        </div>
                      </div>
                      {app.consultationNotes && (
                        <div className="mt-3 border-t border-emerald-100 pt-3">
                          <p className="text-xs font-medium text-emerald-600">Consultation Notes</p>
                          <p className="mt-1 text-sm text-gray-700">{app.consultationNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer - Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewDetails(app.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleViewDocuments(app.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <File className="h-4 w-4" />
                      Documents
                    </button>
                    <button
                      onClick={() => router.push(`/doctor/applications/${app.id}?tab=remarks`)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Doctor Remarks
                    </button>
                  </div>
                  <button
                    onClick={() => handleOpenAssessment(app.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                      app.hasMedicalAssessment
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <FileCheck className="h-4 w-4" />
                    Medical Assessment
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * data.limit + 1}–
                {Math.min(page * data.limit, data.total)} of {data.total} applications
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {data.totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= data.totalPages}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* View Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Application Details</h2>
                <p className="mt-0.5 text-sm text-gray-500">Complete information about the certificate application</p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : selectedApp ? (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">Personal Information</h3>
                    <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-gray-400">Full Name</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {(selectedApp.formData?.fullName as string) || selectedApp.user?.fullName || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Email</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {(selectedApp.formData?.email as string) || selectedApp.user?.email || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Phone</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {(selectedApp.formData?.phone as string) || selectedApp.user?.phoneNumber || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Gender</p>
                        <p className="mt-1 text-sm font-medium capitalize text-gray-900">
                          {(selectedApp.formData?.gender as string) || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Date of Birth</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {selectedApp.formData?.dateOfBirth 
                            ? format(parseISO(selectedApp.formData.dateOfBirth as string), "MMM dd, yyyy") 
                            : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Age</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {selectedApp.formData?.age ? `${selectedApp.formData.age} years` : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  {selectedApp.formData?.address && (
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Address</p>
                      <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3">
                        <p className="text-sm text-gray-700">{selectedApp.formData.address as string}</p>
                      </div>
                    </div>
                  )}

                  {/* Certificate Information */}
                  <div>
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">Certificate Information</h3>
                    <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-gray-400">Certificate Type</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {certTypeLabels[selectedApp.certificateType] ?? selectedApp.certificateType}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Certificate Number</p>
                        <p className="mt-1 text-sm font-medium text-blue-600">
                          {selectedApp.certificateNumber ?? selectedApp.applicationDisplayId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Status</p>
                        <span
                          className={cn(
                            "mt-1 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                            isPendingStatus(selectedApp.status)
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          )}
                        >
                          {isPendingStatus(selectedApp.status) ? "Pending Consultation" : selectedApp.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Submitted On</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {format(parseISO(selectedApp.createdAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                      {(selectedApp.formData?.organizationName || selectedApp.formData?.institution || selectedApp.formData?.company) && (
                        <div>
                          <p className="text-xs font-medium text-gray-400">Organization</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {(selectedApp.formData?.organizationName as string) || 
                             (selectedApp.formData?.institution as string) || 
                             (selectedApp.formData?.company as string)}
                          </p>
                        </div>
                      )}
                      {(selectedApp.formData?.symptoms || selectedApp.formData?.reason || selectedApp.formData?.medicalCondition) && (
                        <div>
                          <p className="text-xs font-medium text-gray-400">Leave Reason</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {(selectedApp.formData?.symptoms as string) || 
                             (selectedApp.formData?.reason as string) || 
                             (selectedApp.formData?.medicalCondition as string)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Leave Period */}
                  {(selectedApp.formData?.startDate || selectedApp.formData?.leaveStartDate) && 
                   (selectedApp.formData?.endDate || selectedApp.formData?.leaveEndDate) && (
                    <div>
                      <p className="text-xs font-medium text-gray-400">Leave Period</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {format(parseISO((selectedApp.formData?.startDate || selectedApp.formData?.leaveStartDate) as string), "EEEE, MMM dd, yyyy")} to {format(parseISO((selectedApp.formData?.endDate || selectedApp.formData?.leaveEndDate) as string), "EEEE, MMM dd, yyyy")}
                      </p>
                    </div>
                  )}

                  {/* Assignment Information */}
                  <div>
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">Assignment Information</h3>
                    <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-gray-400">Assigned Doctor</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {selectedApp.assignedDoctor?.fullName || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Assigned Date</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {selectedApp.assignedAt ? format(parseISO(selectedApp.assignedAt), "MMM dd, yyyy") : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Assigned By</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">Support Team</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Consultation Scheduled</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {selectedApp.consultationDate 
                            ? format(parseISO(selectedApp.consultationDate), "EEEE, MMM dd, yyyy hh:mm a")
                            : "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Consultation Notes (for completed consultations) */}
                  {selectedApp.consultationNotes && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-gray-900">Consultation Notes</h3>
                      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                        <p className="text-sm text-gray-700">{selectedApp.consultationNotes}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center text-sm text-gray-500">
                  No details available
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-gray-100 px-6 py-4">
              <button
                onClick={closeModal}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {showDocumentsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-50 p-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Application Documents</h2>
                  <p className="mt-0.5 text-sm text-gray-500">View all uploaded documents for this application</p>
                </div>
              </div>
              <button
                onClick={closeDocumentsModal}
                className="rounded-full border border-gray-200 p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {documentsModalData.loading ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : documentsModalData.documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <span className="mb-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    {documentsModalData.documents.length} total files
                  </span>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <FileIcon className="h-12 w-12 text-gray-300" />
                  </div>
                  <p className="mt-4 text-sm text-gray-500">No documents uploaded for this application</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="mb-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    {documentsModalData.documents.length} total file{documentsModalData.documents.length > 1 ? "s" : ""}
                  </span>
                  <div className="space-y-2">
                    {documentsModalData.documents.map((doc) => {
                      const isImage = doc.contentType?.startsWith("image/");
                      return (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3 transition-colors hover:bg-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-white p-2 shadow-sm">
                              {isImage ? (
                                <ImageIcon className="h-5 w-5 text-blue-500" />
                              ) : (
                                <FileText className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                              <p className="text-xs text-gray-500">
                                {doc.createdAt ? format(parseISO(doc.createdAt), "MMM dd, yyyy") : ""}
                                {doc.size && ` • ${(doc.size / 1024).toFixed(1)} KB`}
                              </p>
                            </div>
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            <Download className="h-4 w-4" />
                            View
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Medical Assessment Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[95vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Medical Assessment</h2>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Complete the medical assessment form for this application
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseAssessment}
                disabled={assessmentSaving}
                className="rounded-full border border-gray-200 p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[calc(95vh-120px)] overflow-y-auto p-6">
              {assessmentLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : assessmentAppData ? (
                <MedicalAssessmentForm
                  certificateType={assessmentAppData.certificateType}
                  initialData={assessmentAppData.existingAssessment}
                  onSubmit={handleSubmitAssessment}
                  onCancel={handleCloseAssessment}
                  disabled={assessmentAppData.consultationCompleted || assessmentSaving}
                />
              ) : (
                <div className="flex h-40 items-center justify-center text-sm text-gray-500">
                  Unable to load assessment data
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
