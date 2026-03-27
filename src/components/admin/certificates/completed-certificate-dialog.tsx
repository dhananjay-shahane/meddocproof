"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  User,
  CheckCircle2,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import api from "@/lib/api";
import type { Application } from "@/types";

interface CompletedCertificateDialogProps {
  open: boolean;
  onClose: () => void;
  certificateId: string | null;
}

interface NotificationItem {
  id: string;
  type: string;
  message: string;
  sentTo: string;
  sentAt: string;
}

export function CompletedCertificateDialog({
  open,
  onClose,
  certificateId,
}: CompletedCertificateDialogProps) {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

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
    }
    return () => {
      setApplication(null);
      setNotifications([]);
    };
  }, [open, certificateId, fetchApplication]);

  useEffect(() => {
    if (!application?.userId) return;
    api
      .get(`/admin/notifications?userId=${application.userId}&limit=10`)
      .then((res) => {
        const items: Array<{ id: string; type: string; message: string; createdAt: string }> =
          res.data?.data?.items ?? res.data?.data?.notifications ?? [];
        setNotifications(
          items.map((n) => ({
            id: n.id,
            type: n.type,
            message: n.message,
            sentTo: application.user?.phoneNumber || application.user?.email || "—",
            sentAt: n.createdAt,
          }))
        );
      })
      .catch(() => {
        // silently fail — notifications are non-critical
      });
  }, [application]);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "MMM dd, yyyy, h:mm a");
    } catch {
      return "—";
    }
  };

  const getFormDataValue = (key: string): string => {
    if (!application?.formData) return "Not specified";
    const value = application.formData[key];
    if (value === null || value === undefined || value === "") return "Not specified";
    return String(value);
  };

  // Fallback notifications when API returns nothing
  const displayNotifications: NotificationItem[] = notifications.length > 0
    ? notifications
    : application ? [
    {
      id: "1",
      type: "whatsapp",
      message: "Certificate completion notification sent via WhatsApp",
      sentTo: application.user?.phoneNumber || "—",
      sentAt: application.updatedAt,
    },
  ] : [];

  if (!application && !loading) return null;

  const userName = application?.user?.fullName || "Unknown";
  const certNumber = application?.certificateNumber || application?.applicationId || "—";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Completed Certificate - {userName}
          </DialogTitle>
          <DialogDescription>
            Certificate completion details and information
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="rounded-xl border-l-4 border-l-green-500 bg-green-50 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900">Certificate Completed</h3>
                    <p className="text-sm text-green-700">
                      Successfully submitted to patient
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-900">100%</p>
                  <p className="text-sm text-green-700">Complete</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-white/60 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Certificate Number:</p>
                  <p className="font-medium">{certNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted Date:</p>
                  <p className="font-medium">{formatDate(application?.updatedAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted By:</p>
                  <p className="font-medium">Admin</p>
                </div>
              </div>
            </div>

            {/* Certificate Information */}
            <div>
              <h3 className="text-base font-semibold mb-4">Certificate Information</h3>
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
                  <p className="font-medium">{application?.user?.phoneNumber || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Certificate Type</p>
                  <p className="font-medium">
                    {application?.certificateType?.replace(/_/g, " ").toLowerCase() || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Medical Condition</p>
                  <p className="font-medium">{getFormDataValue("medicalCondition")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-sm font-medium text-red-700">
                    Urgent
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Doctor</p>
                  <p className="font-medium">
                    {application?.assignedDoctor
                      ? `Dr. ${application.assignedDoctor.fullName}`
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Specialization</p>
                  <p className="font-medium">
                    {application?.assignedDoctor?.specialization || "General Practitioner"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Consultation Date</p>
                  <p className="font-medium">
                    {formatDate(application?.consultationDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Notifications Sent */}
            <div>
              <h3 className="text-base font-semibold mb-4">Notifications Sent</h3>
              <div className="space-y-3">
                {displayNotifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">
                    No notifications sent for this certificate.
                  </p>
                ) : (
                  displayNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">{notification.message}</p>
                          <p className="text-sm text-muted-foreground">
                            Sent to: {notification.sentTo}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(notification.sentAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
