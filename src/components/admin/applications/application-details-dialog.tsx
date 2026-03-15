"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  MapPin,
  Calendar,
  Phone,
  Mail,
  Edit,
  Upload,
  FileUp,
  Send,
  MessageSquare,
  Receipt,
  UserPlus,
  FileQuestion,
  Loader2,
  File,
  X,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import api from "@/lib/api";
import type { Application, Document as AppDocument, Remark } from "@/types";

interface ApplicationDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  applicationId: string | null;
  onAssignDoctor?: (app: Application) => void;
}

export function ApplicationDetailsDialog({
  open,
  onClose,
  applicationId,
  onAssignDoctor,
}: ApplicationDetailsDialogProps) {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Documents tab state
  const [uploading, setUploading] = useState(false);
  const [documentCategory, setDocumentCategory] = useState("additional");
  const [documentDescription, setDocumentDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Remarks tab state
  const [addingRemark, setAddingRemark] = useState(false);
  const [newRemark, setNewRemark] = useState("");
  const [submittingRemark, setSubmittingRemark] = useState(false);

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

  useEffect(() => {
    if (open && applicationId) {
      fetchApplication();
      setActiveTab("overview");
    }
    return () => {
      setApplication(null);
      setSelectedFiles([]);
      setDocumentDescription("");
      setNewRemark("");
      setAddingRemark(false);
    };
  }, [open, applicationId, fetchApplication]);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "dd MMM yyyy");
    } catch {
      return "—";
    }
  };

  const getFormDataValue = (key: string): string => {
    if (!application?.formData) return "—";
    const value = application.formData[key];
    if (value === null || value === undefined) return "—";
    return String(value);
  };

  // Document handling
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUploadDocuments = async () => {
    if (selectedFiles.length === 0 || !application) {
      toast.error("Please select files to upload");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("category", documentCategory);
      formData.append("description", documentDescription);

      await api.post(
        `/admin/applications/${application.id}/documents`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Documents uploaded successfully");
      setSelectedFiles([]);
      setDocumentDescription("");
      fetchApplication();
    } catch {
      toast.error("Failed to upload documents");
    } finally {
      setUploading(false);
    }
  };

  // Remark handling
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

  // Quick actions
  const handleSendConsultationReminder = async () => {
    toast.info("Consultation reminder sent");
  };

  const handleSendWhatsAppUpdate = async () => {
    toast.info("WhatsApp update sent with invoice link");
  };

  const handleViewInvoice = () => {
    toast.info("Invoice view coming soon");
  };

  const handleRequestDocuments = () => {
    toast.info("Document request sent");
  };

  if (!application && !loading) return null;

  const userName = application?.user?.fullName || "Unknown";
  const totalDocuments = application?.documents?.length || 0;
  const remarks = application?.remarks || [];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Application Details - {userName}
          </DialogTitle>
          <DialogDescription>
            Complete application overview and management options
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
            <TabsList className="grid w-full grid-cols-5 shrink-0">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="remarks">Remarks</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              {/* Overview Tab */}
              <TabsContent value="overview" className="m-0 space-y-6">
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Details
                  </Button>
                </div>

                {/* Basic Information */}
                <div>
                  <h3 className="text-base font-semibold mb-4">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
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
                      <p className="font-medium text-blue-600">
                        {application?.user?.phoneNumber || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium">{getFormDataValue("gender")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">
                        {formatDate(getFormDataValue("dateOfBirth"))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Guardian Relationship</p>
                      <p className="font-medium">
                        {getFormDataValue("guardianRelationship")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Guardian&apos;s Name</p>
                      <p className="font-medium">{getFormDataValue("guardianName")}</p>
                    </div>
                  </div>
                </div>

                <hr />

                {/* Address Details */}
                <div>
                  <h3 className="text-base font-semibold mb-4">Address Details</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{getFormDataValue("address")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">City</p>
                      <p className="font-medium">{getFormDataValue("city")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">State</p>
                      <p className="font-medium">{getFormDataValue("state")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pincode</p>
                      <p className="font-medium">{getFormDataValue("pincode")}</p>
                    </div>
                  </div>
                </div>

                <hr />

                {/* Certificate Details */}
                <div>
                  <h3 className="text-base font-semibold mb-4">Certificate Details</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Certificate Type</p>
                      <p className="font-medium">
                        {application?.certificateType
                          ?.replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase()) || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Application ID</p>
                      <p className="font-medium">{application?.applicationId || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">
                        {application?.status?.replace(/_/g, " ") || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created At</p>
                      <p className="font-medium">{formatDate(application?.createdAt)}</p>
                    </div>
                    {application?.assignedDoctor && (
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned Doctor</p>
                        <p className="font-medium">
                          Dr. {application.assignedDoctor.fullName}
                        </p>
                      </div>
                    )}
                    {application?.consultationDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">Consultation Date</p>
                        <p className="font-medium">
                          {formatDate(application.consultationDate)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="m-0 space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold">Application Documents</h3>
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                    {totalDocuments} total files
                  </span>
                </div>

                {/* Existing Documents */}
                {totalDocuments > 0 && (
                  <div className="space-y-2">
                    {application?.documents?.map((doc: AppDocument) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <File className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{doc.fileName}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {doc.category?.replace(/_/g, " ") || "Document"}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={doc.filePath} target="_blank" rel="noopener noreferrer">
                            View
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Section */}
                <div className="rounded-lg border p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    <h4 className="font-semibold">Upload Documents</h4>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Document Category</label>
                      <select
                        value={documentCategory}
                        onChange={(e) => setDocumentCategory(e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                      >
                        <option value="additional">Additional Documents...</option>
                        <option value="id_proof">ID Proof</option>
                        <option value="medical_records">Medical Records</option>
                        <option value="prescription">Prescription</option>
                        <option value="lab_reports">Lab Reports</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Description (Optional)
                      </label>
                      <textarea
                        value={documentDescription}
                        onChange={(e) => setDocumentDescription(e.target.value)}
                        placeholder="Add a description for these documents..."
                        className="mt-1 min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Select Files</label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input py-8 transition-colors hover:border-primary"
                      >
                        <FileUp className="mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium text-blue-600">
                          Click to select files
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Support: Images, PDFs, Videos (Max 10MB each)
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      {selectedFiles.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {selectedFiles.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded bg-muted px-2 py-1 text-sm"
                            >
                              <span className="truncate">{file.name}</span>
                              <button
                                onClick={() =>
                                  setSelectedFiles((prev) =>
                                    prev.filter((_, i) => i !== idx)
                                  )
                                }
                                className="ml-2 text-muted-foreground hover:text-foreground"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleUploadDocuments}
                      disabled={selectedFiles.length === 0 || uploading}
                      className="w-full"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload {selectedFiles.length} Files
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Progress Tab */}
              <TabsContent value="progress" className="m-0 space-y-4">
                <h3 className="text-base font-semibold">Application Progress</h3>

                <div className="space-y-4">
                  {/* Progress Timeline */}
                  <div className="relative pl-6">
                    <div className="absolute left-2 top-2 h-[calc(100%-16px)] w-0.5 bg-muted" />

                    {/* Step 1: Application Created */}
                    <div className="relative mb-6">
                      <div className="absolute -left-4 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Application Created</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(application?.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Payment Completed */}
                    <div className="relative mb-6">
                      <div
                        className={`absolute -left-4 flex h-6 w-6 items-center justify-center rounded-full ${
                          application?.paymentCompleted
                            ? "bg-green-500"
                            : "bg-muted"
                        }`}
                      >
                        {application?.paymentCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Payment Completed</p>
                        <p className="text-sm text-muted-foreground">
                          {application?.paymentCompleted ? "Completed" : "Pending"}
                        </p>
                      </div>
                    </div>

                    {/* Step 3: Doctor Assigned */}
                    <div className="relative mb-6">
                      <div
                        className={`absolute -left-4 flex h-6 w-6 items-center justify-center rounded-full ${
                          application?.assignedDoctorId
                            ? "bg-green-500"
                            : "bg-muted"
                        }`}
                      >
                        {application?.assignedDoctorId ? (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Doctor Assigned</p>
                        <p className="text-sm text-muted-foreground">
                          {application?.assignedDoctor
                            ? `Dr. ${application.assignedDoctor.fullName}`
                            : "Pending"}
                        </p>
                      </div>
                    </div>

                    {/* Step 4: Consultation Completed */}
                    <div className="relative mb-6">
                      <div
                        className={`absolute -left-4 flex h-6 w-6 items-center justify-center rounded-full ${
                          application?.consultationCompleted
                            ? "bg-green-500"
                            : "bg-muted"
                        }`}
                      >
                        {application?.consultationCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Consultation Completed</p>
                        <p className="text-sm text-muted-foreground">
                          {application?.consultationCompleted
                            ? "Completed"
                            : "Pending"}
                        </p>
                      </div>
                    </div>

                    {/* Step 5: Certificate Delivered */}
                    <div className="relative">
                      <div
                        className={`absolute -left-4 flex h-6 w-6 items-center justify-center rounded-full ${
                          application?.status === "completed" ||
                          application?.status === "delivered"
                            ? "bg-green-500"
                            : "bg-muted"
                        }`}
                      >
                        {application?.status === "completed" ||
                        application?.status === "delivered" ? (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Certificate Delivered</p>
                        <p className="text-sm text-muted-foreground">
                          {application?.status === "completed" ||
                          application?.status === "delivered"
                            ? "Delivered"
                            : "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Remarks Tab */}
              <TabsContent value="remarks" className="m-0 space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="text-base font-semibold mb-3">Add Support Remark</h3>

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
                        className="min-h-25 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddRemark}
                          disabled={!newRemark.trim() || submittingRemark}
                          size="sm"
                        >
                          {submittingRemark ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
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

                {/* Remarks List */}
                <div className="rounded-lg border p-4">
                  {remarks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <File className="mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No remarks yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {remarks.map((remark: Remark) => (
                        <div
                          key={remark.id}
                          className="rounded-lg bg-muted/50 p-3"
                        >
                          <p className="text-sm">{remark.message}</p>
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="capitalize">{remark.addedByRole}</span>
                            <span>•</span>
                            <span>{formatDate(remark.addedAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Actions Tab */}
              <TabsContent value="actions" className="m-0 space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="text-base font-semibold mb-4">Quick Actions</h3>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        if (application && onAssignDoctor) {
                          onClose();
                          onAssignDoctor(application);
                        }
                      }}
                      className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <UserPlus className="h-5 w-5 text-muted-foreground" />
                      <span>Assign Doctor</span>
                    </button>

                    <button
                      onClick={handleSendConsultationReminder}
                      className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <Send className="h-5 w-5 text-muted-foreground" />
                      <span>Send Consultation Reminder</span>
                    </button>

                    <button
                      onClick={handleSendWhatsAppUpdate}
                      className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <span className="block">Send WhatsApp Update</span>
                        <span className="block text-xs text-muted-foreground">
                          Will include payment confirmation and invoice download link
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={handleViewInvoice}
                      className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                      <span>View Invoice</span>
                    </button>

                    <button
                      onClick={handleRequestDocuments}
                      className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <FileQuestion className="h-5 w-5 text-muted-foreground" />
                      <span>Request Documents</span>
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
