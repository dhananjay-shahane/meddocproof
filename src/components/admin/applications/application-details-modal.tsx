"use client";

import { useEffect, useState, useCallback } from "react";
import { X, User, FileText, ClipboardList, Clock, Loader2, Stethoscope } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { PageLoader } from "@/components/ui/loading-spinner";
import { formatDate, formatCurrency, getInitials, formatRelativeDate } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";
import type { Application, Doctor } from "@/types";

interface ApplicationDetailsModalProps {
  applicationId: string | null;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export function ApplicationDetailsModal({
  applicationId,
  open,
  onClose,
  onUpdated,
}: ApplicationDetailsModalProps) {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [assigningDoctor, setAssigningDoctor] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [showAssignPanel, setShowAssignPanel] = useState(false);
  const [showStatusPanel, setShowStatusPanel] = useState(false);

  const fetchApplication = useCallback(async () => {
    if (!applicationId) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/applications/${applicationId}`);
      setApplication(res.data.data);
    } catch {
      toast.error("Failed to load application details");
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  const fetchDoctors = useCallback(async () => {
    try {
      const res = await api.get("/admin/doctors?status=approved&active=true&limit=100");
      setDoctors(res.data.data.items || []);
    } catch {
      console.error("Failed to fetch doctors");
    }
  }, []);

  useEffect(() => {
    if (open && applicationId) {
      fetchApplication();
      fetchDoctors();
    }
    return () => {
      setApplication(null);
      setShowAssignPanel(false);
      setShowStatusPanel(false);
    };
  }, [open, applicationId, fetchApplication, fetchDoctors]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleAssignDoctor = async () => {
    if (!selectedDoctorId || !applicationId) return;
    setAssigningDoctor(true);
    try {
      await api.put(`/admin/applications/${applicationId}/assign`, {
        doctorId: selectedDoctorId,
      });
      toast.success("Doctor assigned successfully");
      setShowAssignPanel(false);
      setSelectedDoctorId("");
      fetchApplication();
      onUpdated?.();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to assign doctor");
    } finally {
      setAssigningDoctor(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus || !applicationId) return;
    setUpdatingStatus(true);
    try {
      await api.put(`/admin/applications/${applicationId}/status`, {
        status: selectedStatus,
        note: statusNote || undefined,
      });
      toast.success(`Status updated to "${selectedStatus}"`);
      setShowStatusPanel(false);
      setSelectedStatus("");
      setStatusNote("");
      fetchApplication();
      onUpdated?.();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-4xl rounded-xl border bg-card shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Application Details</h2>
            {application && <StatusBadge status={application.status} />}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-12">
            <PageLoader />
          </div>
        ) : !application ? (
          <div className="p-12 text-center text-muted-foreground">
            Application not found
          </div>
        ) : (
          <>
            {/* Tabs Content */}
            <Tabs defaultValue="details" className="p-6">
              <TabsList className="mb-4 w-full justify-start">
                <TabsTrigger value="details">
                  <User className="mr-1 h-3.5 w-3.5" /> Details
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  badge={application.documents?.length || 0}
                >
                  <FileText className="mr-1 h-3.5 w-3.5" /> Documents
                </TabsTrigger>
                <TabsTrigger value="assessment">
                  <ClipboardList className="mr-1 h-3.5 w-3.5" /> Assessment
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  badge={application.remarks?.length || 0}
                >
                  <Clock className="mr-1 h-3.5 w-3.5" /> Timeline
                </TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Application Info */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Application Info</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Application ID</dt>
                        <dd className="font-mono">{application.applicationId}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Certificate Type</dt>
                        <dd>
                          <Badge variant="secondary">{application.certificateType}</Badge>
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Status</dt>
                        <dd>
                          <StatusBadge status={application.status} />
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Created</dt>
                        <dd>{formatDate(application.createdAt)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Last Updated</dt>
                        <dd>{formatRelativeDate(application.updatedAt)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Payment</dt>
                        <dd>
                          <Badge
                            variant={
                              application.paymentCompleted ? "default" : "destructive"
                            }
                          >
                            {application.paymentCompleted ? "Paid" : "Unpaid"}
                          </Badge>
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* User Info */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Applicant Info</h4>
                    {application.user ? (
                      <div className="flex items-start gap-3">
                        <Avatar
                          fallback={getInitials(application.user.fullName)}
                          size="lg"
                        />
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">{application.user.fullName}</p>
                          <p className="text-muted-foreground">
                            {application.user.phoneNumber}
                          </p>
                          {application.user.email && (
                            <p className="text-muted-foreground">
                              {application.user.email}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No user data</p>
                    )}

                    <h4 className="mt-4 font-semibold">Assigned Doctor</h4>
                    {application.assignedDoctor ? (
                      <div className="flex items-center gap-3">
                        <Avatar
                          fallback={getInitials(application.assignedDoctor.fullName)}
                          size="md"
                        />
                        <div className="text-sm">
                          <p className="font-medium">
                            {application.assignedDoctor.fullName}
                          </p>
                          <p className="text-muted-foreground">
                            {application.assignedDoctor.specialization}
                          </p>
                          {application.assignedAt && (
                            <p className="text-xs text-muted-foreground">
                              Assigned {formatRelativeDate(application.assignedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not assigned yet</p>
                    )}
                  </div>

                  {/* Form Data */}
                  {application.formData &&
                    Object.keys(application.formData).length > 0 && (
                      <div className="col-span-full space-y-2">
                        <h4 className="font-semibold">Form Data</h4>
                        <div className="rounded-lg bg-muted/50 p-4">
                          <dl className="grid gap-2 text-sm sm:grid-cols-2">
                            {Object.entries(application.formData).map(([key, value]) => (
                              <div key={key}>
                                <dt className="text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                                </dt>
                                <dd className="font-medium">{String(value)}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      </div>
                    )}
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents">
                {!application.documents || application.documents.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No documents uploaded
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {application.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <FileText className="h-8 w-8 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {doc.originalName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doc.category && (
                              <Badge variant="outline" className="mr-1">
                                {doc.category}
                              </Badge>
                            )}
                            {doc.contentType} · {(doc.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Medical Assessment Tab */}
              <TabsContent value="assessment">
                {!application.medicalAssessment ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No medical assessment yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <DetailField
                        label="Complaints"
                        value={application.medicalAssessment.complaintsOf}
                      />
                      <DetailField
                        label="Duration"
                        value={application.medicalAssessment.durationOfComplaints}
                      />
                      <DetailField
                        label="Diagnosis"
                        value={application.medicalAssessment.fullDiagnosisOfIllness}
                      />
                      <DetailField
                        label="Severity"
                        value={application.medicalAssessment.severityOfIllness}
                      />
                      <DetailField
                        label="Course of Illness"
                        value={application.medicalAssessment.courseOfIllness}
                      />
                      <DetailField
                        label="Comorbidities"
                        value={application.medicalAssessment.comorbidities}
                      />
                      <DetailField
                        label="Rest Period"
                        value={`${application.medicalAssessment.restDuration} (${formatDate(application.medicalAssessment.restPeriodFrom)} — ${formatDate(application.medicalAssessment.restPeriodTo)})`}
                      />
                      <DetailField
                        label="Advice"
                        value={application.medicalAssessment.adviceByRegisteredMedicalPractitioner}
                      />
                    </div>
                    {application.medicalAssessment.additionalRecommendations && (
                      <DetailField
                        label="Additional Recommendations"
                        value={application.medicalAssessment.additionalRecommendations}
                      />
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline">
                {!application.remarks || application.remarks.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No timeline entries
                  </p>
                ) : (
                  <div className="space-y-3">
                    {application.remarks.map((remark) => (
                      <div
                        key={remark.id}
                        className="flex gap-3 rounded-lg border p-3"
                      >
                        <div className="mt-0.5 rounded-full bg-muted p-1.5">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm">{remark.message}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {remark.addedByRole} · {formatRelativeDate(remark.addedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Action Bar */}
            <div className="border-t px-6 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAssignPanel(!showAssignPanel);
                    setShowStatusPanel(false);
                  }}
                >
                  <Stethoscope className="mr-1.5 h-4 w-4" />
                  Assign Doctor
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowStatusPanel(!showStatusPanel);
                    setShowAssignPanel(false);
                  }}
                >
                  Change Status
                </Button>
              </div>

              {/* Assign Doctor Panel */}
              {showAssignPanel && (
                <div className="mt-3 flex items-end gap-2 rounded-lg bg-muted/50 p-3">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium">
                      Select Doctor
                    </label>
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Choose a doctor...</option>
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.fullName} — {doc.specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    onClick={handleAssignDoctor}
                    disabled={!selectedDoctorId || assigningDoctor}
                    size="sm"
                  >
                    {assigningDoctor && (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    )}
                    Assign
                  </Button>
                </div>
              )}

              {/* Status Panel */}
              {showStatusPanel && (
                <div className="mt-3 space-y-2 rounded-lg bg-muted/50 p-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium">
                        New Status
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                      >
                        <option value="">Select status...</option>
                        <option value="pending">Pending</option>
                        <option value="assigned">Assigned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Note (optional)
                    </label>
                    <textarea
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="Add a note about this status change..."
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                      rows={2}
                    />
                  </div>
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={!selectedStatus || updatingStatus}
                    size="sm"
                  >
                    {updatingStatus && (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    )}
                    Update Status
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm">{value}</p>
    </div>
  );
}
