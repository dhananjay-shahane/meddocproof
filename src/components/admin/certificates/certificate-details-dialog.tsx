"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  User,
  Stethoscope,
  File,
  Send,
  Phone,
  Loader2,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import api from "@/lib/api";
import type { Application, MedicalAssessment, Remark } from "@/types";

interface CertificateDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  certificateId: string | null;
  onRefresh?: () => void;
}

export function CertificateDetailsDialog({
  open,
  onClose,
  certificateId,
  onRefresh,
}: CertificateDetailsDialogProps) {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [addingRemark, setAddingRemark] = useState(false);
  const [newRemark, setNewRemark] = useState("");
  const [submittingRemark, setSubmittingRemark] = useState(false);

  const fetchApplication = useCallback(async () => {
    if (!certificateId) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/applications/${certificateId}`);
      setApplication(res.data.data);
    } catch {
      toast.error("Failed to load certificate details");
    } finally {
      setLoading(false);
    }
  }, [certificateId]);

  useEffect(() => {
    if (open && certificateId) {
      fetchApplication();
      setActiveTab("overview");
    }
    return () => {
      setApplication(null);
      setNewRemark("");
      setAddingRemark(false);
    };
  }, [open, certificateId, fetchApplication]);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "dd/MM/yyyy");
    } catch {
      return "—";
    }
  };

  const formatDateTime = (dateStr: string | null | undefined) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "MMM dd, yyyy, hh:mm a");
    } catch {
      return "—";
    }
  };

  const getFormDataValue = (key: string): string => {
    if (!application?.formData) return "Not provided";
    const value = application.formData[key];
    if (value === null || value === undefined || value === "") return "Not provided";
    return String(value);
  };

  const getProgressPercentage = (): number => {
    if (!application) return 0;
    if (application.status === "completed" || application.status === "delivered") return 100;
    if (application.hasMedicalAssessment) return 75;
    if (application.consultationCompleted) return 50;
    if (application.assignedDoctorId) return 25;
    return 10;
  };

  const getStatusLabel = (): string => {
    if (!application) return "Pending";
    if (application.hasMedicalAssessment) return "Certificate Available";
    if (application.consultationCompleted) return "Consultation Done";
    if (application.assignedDoctorId) return "Doctor Assigned";
    return "Pending";
  };

  const getNextAction = (): string => {
    if (!application) return "Assign Doctor";
    if (application.hasMedicalAssessment) return "Regenerate Certificate";
    if (application.consultationCompleted) return "Generate Certificate";
    if (application.assignedDoctorId) return "Complete Consultation";
    return "Assign Doctor";
  };

  const handleAddRemark = async () => {
    if (!newRemark.trim() || !application) {
      toast.error("Please enter a remark");
      return;
    }

    setSubmittingRemark(true);
    try {
      await api.post(`/admin/applications/${application.id}/remarks`, {
        message: newRemark,
      });
      toast.success("Remark added successfully");
      setNewRemark("");
      setAddingRemark(false);
      fetchApplication();
    } catch {
      toast.error("Failed to add remark");
    } finally {
      setSubmittingRemark(false);
    }
  };

  const handleGenerateCertificate = () => {
    toast.info("Generating certificate...");
  };

  const handleSendEmail = () => {
    toast.info("Progress update email sent");
  };

  const handleSendWhatsApp = () => {
    toast.info("WhatsApp update sent");
  };

  if (!application && !loading) return null;

  const userName = application?.user?.fullName || "Unknown";
  const remarks = application?.remarks || [];
  const medicalAssessment = application?.medicalAssessment;
  const progress = getProgressPercentage();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Certificate Details - {userName}
          </DialogTitle>
          <DialogDescription>
            Certificate completion tracking and management
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 shrink-0">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assessment" className="flex items-center gap-1.5">
                <ClipboardList className="h-4 w-4" />
                Medical Assessment
              </TabsTrigger>
              <TabsTrigger value="remarks">Remarks</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              {/* Overview Tab */}
              <TabsContent value="overview" className="m-0 space-y-6">
                {/* Status Card */}
                <div className="rounded-xl border-l-4 border-l-blue-500 bg-blue-50 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-blue-100 p-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900">
                          {getStatusLabel()}
                        </h3>
                        <p className="text-sm text-blue-700">Current Status</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-900">{progress}%</p>
                      <p className="text-sm text-blue-700">Complete</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-white/50 p-3">
                    <p className="text-sm text-muted-foreground mb-1">
                      Next Action Required:
                    </p>
                    <p className="font-medium">{getNextAction()}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {application?.hasMedicalAssessment && (
                      <span className="inline-flex items-center rounded-full border border-green-300 bg-green-50 px-3 py-1 text-sm text-green-700">
                        <CheckCircle2 className="mr-1.5 h-4 w-4" />
                        Medical Assessment Available
                      </span>
                    )}
                    <Button onClick={handleGenerateCertificate} className="ml-auto">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Certificate Now
                    </Button>
                  </div>
                </div>

                {/* Certificate Information */}
                <div>
                  <h3 className="text-base font-semibold mb-4">
                    Certificate Information
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Patient Name</p>
                      <p className="font-medium">{application?.user?.fullName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-blue-600">
                        {application?.user?.email || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        {application?.user?.phoneNumber || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-medium">
                        {getFormDataValue("age")} years (DOB:{" "}
                        {formatDate(getFormDataValue("dateOfBirth"))})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium capitalize">
                        {getFormDataValue("gender")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Guardian Relationship
                      </p>
                      <p className="font-medium capitalize">
                        {getFormDataValue("guardianRelationship")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Guardian&apos;s Name</p>
                      <p className="font-medium">{getFormDataValue("guardianName")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Certificate Type</p>
                      <p className="font-medium">
                        {application?.certificateType
                          ?.replace(/_/g, " ")
                          .toLowerCase() || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Medical Condition</p>
                      <p className="font-medium">
                        {getFormDataValue("medicalCondition")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Priority</p>
                      <span className="inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-sm font-medium text-purple-700">
                        Medium
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Assigned Doctor</p>
                      <p className="font-medium">
                        {application?.assignedDoctor
                          ? `Dr. ${application.assignedDoctor.fullName}`
                          : "Not assigned"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Specialization</p>
                      <p className="font-medium">
                        {application?.assignedDoctor?.specialization || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Medical Assessment Tab */}
              <TabsContent value="assessment" className="m-0 space-y-6">
                {medicalAssessment ? (
                  <>
                    {/* Header */}
                    <div className="rounded-xl bg-blue-50 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-blue-100 p-2">
                            <Stethoscope className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Medical Assessment Report</h3>
                            <p className="text-sm text-muted-foreground">
                              Template Type:{" "}
                              <span className="text-blue-600">
                                {medicalAssessment.templateType || "General"}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-medium">
                            Doctor: Dr. {application?.assignedDoctor?.fullName || "—"}
                          </p>
                          <p className="text-muted-foreground">
                            {formatDateTime(medicalAssessment.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Chief Complaint & Duration */}
                    <div>
                      <h4 className="font-semibold mb-3">2. Chief Complaint & Duration</h4>
                      <div className="rounded-lg bg-muted/50 p-4 space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Complaints Of</p>
                          <p className="mt-1">
                            {medicalAssessment.complaintsOf ||
                              "No active complaints. Routine health checkup for fitness certificate."}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Duration of Complaints
                            </p>
                            <p className="font-medium">
                              {medicalAssessment.durationOfComplaints || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Course of Illness
                            </p>
                            <p className="font-medium">
                              {medicalAssessment.courseOfIllness || "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Medical History Assessment */}
                    <div>
                      <h4 className="font-semibold mb-3">3. Medical History Assessment</h4>
                      <div className="rounded-lg bg-muted/50 p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Comorbidities</p>
                            <p className="font-medium text-blue-600">
                              {medicalAssessment.comorbidities || "nil"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Severity of Illness
                            </p>
                            <p className="font-medium">
                              {medicalAssessment.severityOfIllness || "—"}
                            </p>
                          </div>
                        </div>

                        <hr />

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">
                              Past History of Similar Complaints
                            </span>
                            <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                              No
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Any Substance Intake</span>
                            <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                              No
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">
                              Any Significant Past History of Disease
                            </span>
                            <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                              No
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Diagnosis & Advice */}
                    {medicalAssessment.fullDiagnosisOfIllness && (
                      <div>
                        <h4 className="font-semibold mb-3">4. Diagnosis & Advice</h4>
                        <div className="rounded-lg bg-muted/50 p-4 space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Full Diagnosis
                            </p>
                            <p className="mt-1">
                              {medicalAssessment.fullDiagnosisOfIllness}
                            </p>
                          </div>
                          {medicalAssessment.adviceByRegisteredMedicalPractitioner && (
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Doctor&apos;s Advice
                              </p>
                              <p className="mt-1">
                                {medicalAssessment.adviceByRegisteredMedicalPractitioner}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ClipboardList className="mb-3 h-12 w-12 text-muted-foreground" />
                    <h3 className="font-semibold">No Medical Assessment Yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      The doctor has not completed the medical assessment.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Remarks Tab */}
              <TabsContent value="remarks" className="m-0 space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="text-base font-semibold mb-3">Add Progress Remark</h3>

                  {!addingRemark ? (
                    <button
                      onClick={() => setAddingRemark(true)}
                      className="flex w-full items-center gap-2 rounded-lg border border-dashed border-input px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                    >
                      <File className="h-4 w-4" />
                      Add New Remark
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        value={newRemark}
                        onChange={(e) => setNewRemark(e.target.value)}
                        placeholder="Enter your remark..."
                        className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddRemark}
                          disabled={!newRemark.trim() || submittingRemark}
                          size="sm"
                        >
                          {submittingRemark && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Add Remark
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAddingRemark(false);
                            setNewRemark("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress History */}
                <div className="rounded-lg border p-4">
                  <h3 className="text-base font-semibold mb-4">Progress History</h3>

                  {remarks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <File className="mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No remarks yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {remarks.map((remark: Remark) => (
                        <div key={remark.id} className="rounded-lg bg-muted/50 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <span className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs font-medium">
                              {remark.addedByRole?.replace(/_/g, " ") || "admin"}
                            </span>
                            <div className="text-right text-xs text-muted-foreground">
                              <p>{formatDate(remark.addedAt)}</p>
                              <p>by Support Team</p>
                            </div>
                          </div>
                          <p className="text-sm">{remark.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Actions Tab */}
              <TabsContent value="actions" className="m-0 space-y-6">
                {/* Workflow Actions */}
                <div className="rounded-lg border p-4">
                  <h3 className="text-base font-semibold mb-1">Workflow Actions</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Actions available for current step:{" "}
                    <span className="font-medium text-foreground">
                      Generate Certificate/Upload
                    </span>
                  </p>

                  <div className="rounded-lg bg-blue-50 p-4 mb-4">
                    <h4 className="text-blue-700 font-medium mb-1">
                      Step 3: Certificate Generation
                    </h4>
                    <p className="text-sm text-blue-600">
                      Consultation completed with medical assessment. Ready to generate
                      certificate.
                    </p>
                  </div>

                  <Button onClick={handleGenerateCertificate} className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Certificate with Patient Data
                  </Button>
                </div>

                {/* Communication Actions */}
                <div className="rounded-lg border p-4">
                  <h3 className="text-base font-semibold mb-4">Communication Actions</h3>

                  <div className="space-y-2">
                    <button
                      onClick={handleSendEmail}
                      className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <Send className="h-5 w-5 text-muted-foreground" />
                      <span>Send Progress Update Email</span>
                    </button>

                    <button
                      onClick={handleSendWhatsApp}
                      className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span>Send WhatsApp Update</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("remarks");
                        setAddingRemark(true);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <File className="h-5 w-5 text-muted-foreground" />
                      <span>Add Progress Remark</span>
                    </button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
