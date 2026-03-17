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
import {
  FileText,
  User,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import type { Application, Doctor } from "@/types";

interface AssignDoctorModalProps {
  open: boolean;
  onClose: () => void;
  application: Application | null;
  onSuccess?: () => void;
}

type PriorityLevel = "medium" | "urgent" | "emergency";

export function AssignDoctorModal({
  open,
  onClose,
  application,
  onSuccess,
}: AssignDoctorModalProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [consultationDate, setConsultationDate] = useState("");
  const [consultationTime, setConsultationTime] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("medium");

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/doctors?status=approved&active=true&limit=100");
      setDoctors(res.data.data.items || []);
    } catch {
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchDoctors();
      // Reset form
      setSelectedDoctorId("");
      setConsultationDate("");
      setConsultationTime("");
      setPriority("medium");
    }
  }, [open, fetchDoctors]);

  const formatCertificateType = (type: string) => {
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleAssign = async () => {
    if (!selectedDoctorId || !application) {
      toast.error("Please select a doctor");
      return;
    }

    setAssigning(true);
    try {
      await api.put(`/admin/applications/${application.id}/assign`, {
        doctorId: selectedDoctorId,
        consultationDate: consultationDate && consultationTime
          ? new Date(`${consultationDate}T${consultationTime}`).toISOString()
          : undefined,
        priority,
      });
      toast.success("Doctor assigned successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to assign doctor:", err);
      toast.error("Failed to assign doctor");
    } finally {
      setAssigning(false);
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Assign Doctor
          </DialogTitle>
          <DialogDescription>
            Assign a doctor to review this application and provide consultation.
          </DialogDescription>
        </DialogHeader>

        {/* Certificate Info Banner */}
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-blue-900">
                {formatCertificateType(application.certificateType)}
              </p>
              <p className="text-sm text-blue-700">
                Application #{application.applicationId}
              </p>
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {application.user?.fullName || "Unknown"}
            </span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            {application.user?.email || application.user?.phoneNumber || "—"}
          </span>
        </div>

        {/* Doctor Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Doctor</label>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Choose a doctor...</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.fullName} — {doctor.specialization} (
                  {doctor.completedCertificates} completed)
                </option>
              ))}
            </select>
          )}
          {selectedDoctor && (
            <p className="text-xs text-muted-foreground">
              Rating: {selectedDoctor.avgRating.toFixed(1)}★ • Response rate:{" "}
              {selectedDoctor.responseRate}%
            </p>
          )}
        </div>

        {/* Consultation Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Consultation Date
            </label>
            <input
              type="date"
              value={consultationDate}
              onChange={(e) => setConsultationDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Consultation Time
            </label>
            <input
              type="time"
              value={consultationTime}
              onChange={(e) => setConsultationTime(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Priority Level */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Priority Level</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPriority("medium")}
              className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                priority === "medium"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-input bg-background hover:bg-muted"
              }`}
            >
              Medium
            </button>
            <button
              type="button"
              onClick={() => setPriority("urgent")}
              className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                priority === "urgent"
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-input bg-background hover:bg-muted"
              }`}
            >
              Urgent
            </button>
            <button
              type="button"
              onClick={() => setPriority("emergency")}
              className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                priority === "emergency"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-input bg-background hover:bg-muted"
              }`}
            >
              Emergency
            </button>
          </div>
        </div>

        {/* What happens next? */}
        <div className="rounded-lg border border-dashed p-4">
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            What happens next?
          </h4>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-green-500" />
              Doctor will be notified immediately
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-green-500" />
              Customer will receive SMS & email confirmation
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-green-500" />
              Application status changes to &quot;Doctor Assigned&quot;
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={assigning}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedDoctorId || assigning}
          >
            {assigning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <Stethoscope className="mr-2 h-4 w-4" />
                Assign Doctor
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
