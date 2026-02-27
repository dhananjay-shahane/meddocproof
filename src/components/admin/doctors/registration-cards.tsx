"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
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
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  UserPlus,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";
import type { DoctorRegistration, PaginatedResponse } from "@/types";

interface RegistrationCardsProps {
  data: PaginatedResponse<DoctorRegistration> | null;
  loading: boolean;
  onPageChange: (page: number) => void;
  onActionComplete: () => void;
}

export function RegistrationCards({
  data,
  loading,
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

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden">
            <div className="p-5">
              <div className="flex items-start gap-3">
                <Avatar
                  fallback={getInitials(doctor.fullName)}
                  size="lg"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold truncate">{doctor.fullName}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {doctor.email}
                  </p>
                  {doctor.phoneNumber && (
                    <p className="text-sm text-muted-foreground">
                      {doctor.phoneNumber}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="shrink-0 text-yellow-600 border-yellow-300 bg-yellow-50">
                  Pending
                </Badge>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {doctor.qualification} · {doctor.specialization}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4 shrink-0" />
                  <span>{doctor.experience} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserPlus className="h-4 w-4 shrink-0" />
                  <span>Reg: {doctor.registrationNumber}</span>
                </div>
                {doctor.hospitalAffiliation && (
                  <p className="text-muted-foreground pl-6 truncate">
                    {doctor.hospitalAffiliation}
                  </p>
                )}
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Applied {formatDate(doctor.createdAt, "dd MMM yyyy, hh:mm a")}
              </p>
            </div>

            <div className="flex border-t">
              <button
                onClick={() =>
                  setActionDialog({ open: true, action: "reject", doctor })
                }
                className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
              <div className="w-px bg-border" />
              <button
                onClick={() =>
                  setActionDialog({ open: true, action: "approve", doctor })
                }
                className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </button>
            </div>
          </Card>
        ))}
      </div>

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
              variant={actionDialog.action === "approve" ? "default" : "destructive"}
              onClick={handleAction}
              disabled={processing}
              className="gap-1.5"
            >
              {processing && <Loader2 className="h-4 w-4 animate-spin" />}
              {actionDialog.action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
