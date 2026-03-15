"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import {
  Check,
  X,
  Clock,
  Loader2,
  Eye,
  Mail,
  Phone,
  MessageCircle,
  Calendar,
  MapPin,
  AlertCircle,
  User,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";
import type { DoctorRegistration, PaginatedResponse } from "@/types";

interface RegistrationCardsProps {
  data: PaginatedResponse<DoctorRegistration> | null;
  loading: boolean;
  search?: string;
  onPageChange: (page: number) => void;
  onActionComplete: () => void;
}

export function RegistrationCards({
  data,
  loading,
  search = "",
  onPageChange,
  onActionComplete,
}: RegistrationCardsProps) {
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: "approve" | "reject";
    doctor: DoctorRegistration | null;
  }>({ open: false, action: "approve", doctor: null });
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);

  if (loading) return <PageLoader />;

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No pending registrations"
        description="All doctor registrations have been reviewed."
      />
    );
  }

  // Filter by search
  const filteredItems = search
    ? data.items.filter(
        (d) =>
          d.fullName.toLowerCase().includes(search.toLowerCase()) ||
          d.email.toLowerCase().includes(search.toLowerCase()) ||
          d.registrationNumber?.toLowerCase().includes(search.toLowerCase())
      )
    : data.items;

  const handleAction = async () => {
    if (!actionDialog.doctor) return;
    setProcessing(true);
    try {
      await api.put(`/admin/doctors/${actionDialog.doctor.id}/status`, {
        action: actionDialog.action,
        reason: reason || undefined,
      });
      toast.success(
        `Doctor ${actionDialog.action === "approve" ? "approved" : "rejected"} successfully`
      );
      setActionDialog({ open: false, action: "approve", doctor: null });
      setReason("");
      onActionComplete();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || `Failed to ${actionDialog.action} doctor`);
    } finally {
      setProcessing(false);
    }
  };

  // Check if profile is incomplete
  const isProfileIncomplete = (doctor: DoctorRegistration) => {
    return !doctor.specialization || !doctor.hospitalAffiliation || !doctor.consultationFee;
  };

  return (
    <div className="space-y-4">
      {filteredItems.map((doctor) => {
        const incomplete = isProfileIncomplete(doctor);
        const progressSteps = [
          { label: "Registration", completed: true },
          { label: incomplete ? "Incomplete" : "Submitted", completed: !incomplete },
          { label: "Pending", completed: false, current: true },
        ];

        return (
          <div key={doctor.id} className="rounded-xl border bg-card p-6">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{doctor.fullName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {doctor.specialization || "Specialization not specified"}
                    {doctor.experience && ` • ${doctor.experience} years experience`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                  Pending Review
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDate(doctor.createdAt, "MMM dd, yyyy")}
                </span>
              </div>
            </div>

            {/* Application Progress */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-3">Application Progress</p>
              <div className="flex items-center gap-2">
                {progressSteps.map((step, index) => (
                  <div key={step.label} className="flex items-center">
                    <div className="flex items-center gap-2">
                      {step.completed ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Check className="h-4 w-4" />
                        </div>
                      ) : step.current ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                          <Clock className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                          <Clock className="h-4 w-4" />
                        </div>
                      )}
                      <span
                        className={`text-sm ${
                          step.completed
                            ? "text-blue-600"
                            : step.current
                              ? "text-yellow-600"
                              : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < progressSteps.length - 1 && (
                      <div
                        className={`mx-3 h-px w-12 ${
                          step.completed ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Details Row */}
            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{doctor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{doctor.phoneNumber || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>DM</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Reg: {doctor.registrationNumber || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{doctor.hospitalAffiliation || "Not specified"}</span>
              </div>
              <div className="text-muted-foreground">
                <span className="font-medium">Fee:</span>{" "}
                <span>₹{doctor.consultationFee || 0}</span>
              </div>
            </div>

            {/* Incomplete Warning */}
            {incomplete && (
              <div className="mb-4 rounded-lg bg-orange-50 border border-orange-200 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-700">Profile Incomplete</p>
                    <p className="text-sm text-orange-600">
                      Doctor needs to complete their profile before approval. Check required documents and information.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Row */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    setActionDialog({ open: true, action: "reject", doctor })
                  }
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={incomplete}
                  onClick={() =>
                    setActionDialog({ open: true, action: "approve", doctor })
                  }
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      {data.totalPages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={onPageChange}
          className="mt-4"
        />
      )}

      {/* Confirm Dialog */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setActionDialog({ open: false, action: "approve", doctor: null });
            setReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === "approve" ? "Approve" : "Reject"} Doctor
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === "approve"
                ? `Are you sure you want to approve ${actionDialog.doctor?.fullName}? They will be able to receive patient assignments.`
                : `Are you sure you want to reject ${actionDialog.doctor?.fullName}'s registration?`}
            </DialogDescription>
          </DialogHeader>

          {actionDialog.action === "reject" && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                Reason (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Provide a reason for rejection..."
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                rows={3}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionDialog({ open: false, action: "approve", doctor: null });
                setReason("");
              }}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant={actionDialog.action === "reject" ? "destructive" : "default"}
              onClick={handleAction}
              disabled={processing}
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {actionDialog.action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
