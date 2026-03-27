"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  X,
  FileText,
  Eye,
  Download,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  GraduationCap,
  Award,
  Shield,
  Clock,
  Check,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";
import type { DoctorRegistration } from "@/types";

interface DoctorRegistrationDetailsModalProps {
  doctor: DoctorRegistration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionComplete: () => void;
}

type TabType = "personal" | "professional" | "documents";

export function DoctorRegistrationDetailsModal({
  doctor,
  open,
  onOpenChange,
  onActionComplete,
}: DoctorRegistrationDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [processing, setProcessing] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (!doctor) return null;

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "personal", label: "Personal Info", icon: <User className="h-4 w-4" /> },
    { id: "professional", label: "Professional", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "documents", label: "Documents", icon: <FileText className="h-4 w-4" /> },
  ];

  const handleAction = async (action: "approve" | "reject") => {
    setProcessing(true);
    try {
      await api.put(`/admin/doctors/${doctor.id}/status`, {
        action,
        reason: action === "reject" ? rejectReason : undefined,
      });
      toast.success(`Doctor ${action === "approve" ? "approved" : "rejected"} successfully`);
      setShowConfirmDialog(false);
      setRejectReason("");
      onOpenChange(false);
      onActionComplete();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || `Failed to ${action} doctor`);
    } finally {
      setProcessing(false);
    }
  };

  const openConfirmDialog = (action: "approve" | "reject") => {
    setActionType(action);
    setShowConfirmDialog(true);
  };

  // Check document completeness
  const documents = [
    { name: "Medical License", url: doctor.medicalLicenseUrl, required: true },
    { name: "Government ID Proof", url: doctor.govtIdProofUrl, required: true },
    { name: "Degree Certificate", url: doctor.degreeCertificateUrl, required: true },
    { name: "Signature", url: doctor.signatureUrl, required: true },
    { name: "Profile Photo", url: doctor.profilePhotoUrl, required: false },
  ];

  const missingRequiredDocs = documents.filter((d) => d.required && !d.url);
  const hasAllRequiredDocs = missingRequiredDocs.length === 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {doctor.profilePhotoUrl ? (
                  <img
                    src={doctor.profilePhotoUrl}
                    alt={doctor.fullName}
                    className="h-16 w-16 rounded-full object-cover border-2 border-blue-100"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <User className="h-8 w-8" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-xl font-semibold">
                      {doctor.fullName}
                    </DialogTitle>
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      Pending Review
                    </Badge>
                  </div>
                  <DialogDescription className="mt-1">
                    {doctor.specialization} • {doctor.experience} years experience
                  </DialogDescription>
                  <p className="text-xs text-muted-foreground mt-1">
                    Applied on {formatDate(doctor.createdAt, "MMMM dd, yyyy 'at' hh:mm a")}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Tabs */}
          <div className="px-6 pt-4">
            <div className="flex rounded-lg bg-slate-100 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            {activeTab === "personal" && <PersonalInfoTab doctor={doctor} />}
            {activeTab === "professional" && <ProfessionalTab doctor={doctor} />}
            {activeTab === "documents" && <DocumentsTab doctor={doctor} documents={documents} />}
          </div>

          {/* Footer Actions */}
          <div className="border-t p-4 bg-slate-50">
            {!hasAllRequiredDocs && (
              <div className="mb-3 rounded-lg bg-orange-50 border border-orange-200 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-700">Missing Required Documents</p>
                    <p className="text-sm text-orange-600">
                      {missingRequiredDocs.map((d) => d.name).join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => openConfirmDialog("reject")}
              >
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!hasAllRequiredDocs}
                onClick={() => openConfirmDialog("approve")}
              >
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve" : "Reject"} Doctor Registration
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? `Are you sure you want to approve ${doctor.fullName}? They will be able to receive patient assignments.`
                : `Are you sure you want to reject ${doctor.fullName}'s registration?`}
            </DialogDescription>
          </DialogHeader>

          {actionType === "reject" && (
            <div className="py-2">
              <label className="text-sm font-medium">Reason for rejection (optional)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason..."
                className="mt-1.5 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                rows={3}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === "approve" ? "default" : "destructive"}
              onClick={() => actionType && handleAction(actionType)}
              disabled={processing}
              className={actionType === "approve" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Personal Info Tab
function PersonalInfoTab({ doctor }: { doctor: DoctorRegistration }) {
  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value={doctor.email}
          />
          <InfoCard
            icon={<Phone className="h-4 w-4" />}
            label="Phone"
            value={doctor.phoneNumber || "Not provided"}
          />
        </div>
      </div>

      {/* Personal Details */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Personal Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={<User className="h-4 w-4" />}
            label="Gender"
            value={doctor.gender || "Not specified"}
          />
          <InfoCard
            icon={<Calendar className="h-4 w-4" />}
            label="Date of Birth"
            value={doctor.dateOfBirth ? formatDate(doctor.dateOfBirth, "MMMM dd, yyyy") : "Not provided"}
          />
        </div>
        {doctor.bio && (
          <div className="mt-4 rounded-lg bg-slate-50 border p-4">
            <p className="text-sm font-medium text-slate-500 mb-1">Bio</p>
            <p className="text-sm text-slate-700">{doctor.bio}</p>
          </div>
        )}
      </div>

      {/* Address */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Address
        </h3>
        <div className="rounded-lg bg-slate-50 border p-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
            <div>
              {doctor.address || doctor.city || doctor.state || doctor.pincode ? (
                <>
                  {doctor.address && <p className="text-sm text-slate-700">{doctor.address}</p>}
                  <p className="text-sm text-slate-600">
                    {[doctor.city, doctor.state, doctor.pincode].filter(Boolean).join(", ")}
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-500">Address not provided</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Professional Tab
function ProfessionalTab({ doctor }: { doctor: DoctorRegistration }) {
  return (
    <div className="space-y-6">
      {/* Medical Registration */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Medical Registration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={<Award className="h-4 w-4" />}
            label="Registration Number"
            value={doctor.registrationNumber}
            highlight
          />
          <InfoCard
            icon={<Shield className="h-4 w-4" />}
            label="Medical Council"
            value={doctor.medicalCouncil || "Not specified"}
          />
          <InfoCard
            icon={<Calendar className="h-4 w-4" />}
            label="Registration Year"
            value={doctor.registrationYear?.toString() || "Not specified"}
          />
        </div>
      </div>

      {/* Qualifications */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Qualifications & Experience
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={<GraduationCap className="h-4 w-4" />}
            label="Specialization"
            value={doctor.specialization}
            highlight
          />
          <InfoCard
            icon={<GraduationCap className="h-4 w-4" />}
            label="Qualification"
            value={doctor.qualification}
          />
          <InfoCard
            icon={<Clock className="h-4 w-4" />}
            label="Experience"
            value={`${doctor.experience} years`}
          />
          <InfoCard
            icon={<Building2 className="h-4 w-4" />}
            label="Hospital Affiliation"
            value={doctor.hospitalAffiliation || "Not specified"}
          />
        </div>
      </div>

      {/* Terms Acceptance */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Terms & Agreements
        </h3>
        <div className="rounded-lg bg-slate-50 border p-4">
          <div className="flex items-center gap-3">
            {doctor.termsAcceptedAt ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Terms & Conditions Accepted</p>
                  <p className="text-xs text-slate-500">
                    Accepted on {formatDate(doctor.termsAcceptedAt, "MMMM dd, yyyy 'at' hh:mm a")}
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <p className="text-sm text-orange-600">Terms not yet accepted</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Documents Tab
function DocumentsTab({
  doctor,
  documents,
}: {
  doctor: DoctorRegistration;
  documents: { name: string; url: string | null; required: boolean }[];
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Uploaded Documents
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <DocumentCard key={doc.name} document={doc} />
        ))}
      </div>

      {/* Signature Preview */}
      {doctor.signatureUrl && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Signature Preview
          </h3>
          <div className="rounded-lg border bg-white p-4">
            <img
              src={doctor.signatureUrl}
              alt="Doctor's Signature"
              className="max-h-24 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Document Card Component
function DocumentCard({
  document,
}: {
  document: { name: string; url: string | null; required: boolean };
}) {
  const [loading, setLoading] = useState(false);

  const handleView = async () => {
    if (!document.url) return;
    setLoading(true);
    try {
      // Open document in new tab
      window.open(document.url, "_blank");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!document.url) return;
    setLoading(true);
    try {
      // Create download link
      const link = window.document.createElement("a");
      link.href = document.url;
      link.download = document.name.replace(/\s+/g, "_");
      link.target = "_blank";
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } finally {
      setLoading(false);
    }
  };

  if (!document.url) {
    return (
      <div className="rounded-lg border border-dashed border-orange-300 bg-orange-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="font-medium text-slate-900">{document.name}</p>
              <p className="text-xs text-orange-600">
                {document.required ? "Required - Not uploaded" : "Optional - Not uploaded"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isImage = document.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  return (
    <div className="rounded-lg border bg-white p-4 hover:border-blue-200 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            {isImage ? (
              <ImageIcon className="h-5 w-5 text-blue-600" />
            ) : (
              <FileText className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div>
            <p className="font-medium text-slate-900">{document.name}</p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Uploaded
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleView}
            disabled={loading}
            className="h-8 w-8 p-0"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={loading}
            className="h-8 w-8 p-0"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(document.url!, "_blank")}
            className="h-8 w-8 p-0"
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Info Card Component
function InfoCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-4 ${highlight ? "bg-blue-50 border-blue-200" : "bg-white"}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${highlight ? "text-blue-600" : "text-slate-400"}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className={`text-sm font-medium ${highlight ? "text-blue-700" : "text-slate-900"}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
