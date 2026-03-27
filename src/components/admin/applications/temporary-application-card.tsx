"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  User,
  Mail,
  Phone,
  FileText,
  CreditCard,
  Eye,
  MoreHorizontal,
  Mail as MailIcon,
  MessageSquare,
  CheckCircle,
  MessageCircle,
  Check,
  Loader2,
  Tag,
  DollarSign,
} from "lucide-react";import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { Application } from "@/types";

interface TemporaryApplicationCardProps {
  application: Application;
}

const certTypeLabels: Record<string, string> = {
  sick_leave: "Sick Leave",
  fitness: "Fitness",
  work_from_home: "Work From Home",
  caretaker: "Caretaker",
  recovery: "Recovery",
  fit_to_fly: "Fit to Fly",
  unfit_to_work: "Unfit to Work",
  unfit_to_travel: "Unfit to Travel",
  medical_diagnosis: "Medical Diagnosis",
};

// The 4 steps shown in the tracker
const STEP_LABELS = [
  "Cert Type",
  "Personal Info",
  "Details & Docs",
  "Payment",
];

// Returns a description for each completed step to show under the label
function getStepDetail(
  stepIndex: number,
  app: Application,
  formData: Record<string, string | undefined>
): string | null {
  if (stepIndex === 0) {
    return certTypeLabels[app.certificateType] ?? app.certificateType ?? null;
  }
  if (stepIndex === 1) {
    const first = formData?.firstName ?? "";
    const last = formData?.lastName ?? "";
    const phone = formData?.phoneNumber ?? app.user?.phoneNumber ?? "";
    if (first || last) return `${first} ${last}`.trim() + (phone ? ` · ${phone}` : "");
    return phone || null;
  }
  if (stepIndex === 2) return "Documents submitted";
  if (stepIndex === 3) return "Payment completed";
  return null;
}

/** True if the user was active within the last 2 minutes */
function isActiveNow(lastActiveAt: string): boolean {
  return Date.now() - new Date(lastActiveAt).getTime() < 2 * 60 * 1000;
}

export function TemporaryApplicationCard({ application }: TemporaryApplicationCardProps) {
  const router = useRouter();
  const [actionMenuOpen, setActionMenuOpen] = useState(false);

  const formData = application.formData as Record<string, string | undefined>;
  // Use the DB-tracked step directly
  const dbStep: number = application.currentStep ?? 0;
  const percentage = Math.round((dbStep / (STEP_LABELS.length - 1)) * 100);

  const lastActive = application.lastActiveAt ?? application.updatedAt;
  const activeNow = isActiveNow(lastActive);
  const timeAgo = formatDistanceToNow(new Date(lastActive), { addSuffix: true });

  const handleViewDetails = () => {
    router.push(`/admin/applications/${application.id}`);
  };

  const handleSendEmailReminder = () => {
    toast.success("Email reminder sent");
    setActionMenuOpen(false);
  };

  const handleWhatsAppReminder = () => {
    toast.success("WhatsApp reminder sent");
    setActionMenuOpen(false);
  };

  const handlePaymentReminder = () => {
    toast.success("Payment reminder sent");
    setActionMenuOpen(false);
  };

  const handleSendCouponCode = () => {
    toast.info("Coupon code feature coming soon");
    setActionMenuOpen(false);
  };

  const handleMarkAsPaid = () => {
    toast.success("Marked as paid");
    setActionMenuOpen(false);
  };

  const handleAddSupportRemark = () => {
    toast.info("Support remark feature coming soon");
    setActionMenuOpen(false);
  };

  return (
    <div className="rounded-xl border bg-card p-6 space-y-5">
      {/* Header Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {formData?.firstName
                ? `${formData.firstName} ${formData.lastName ?? ""}`.trim()
                : application.user?.fullName ?? "Unknown User"}
            </h3>
            <p className="text-sm text-muted-foreground">
              ID: {application.applicationId || application.id.slice(0, 12)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Activity badge */}
          {activeNow ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              Active now
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              Last seen {timeAgo}
            </span>
          )}
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            In Progress
          </span>
        </div>
      </div>

      {/* Live Step Tracker */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Application Progress</p>
          <p className="text-sm font-medium text-primary">Step {dbStep + 1} of {STEP_LABELS.length}</p>
        </div>

        <div className="flex items-start gap-0">
          {STEP_LABELS.map((label, index) => {
            const completed = index < dbStep;
            const isCurrent = index === dbStep;
            const detail = (completed || isCurrent) ? getStepDetail(index, application, formData) : null;

            return (
              <div key={label} className="flex-1 flex items-start">
                {/* Step column */}
                <div className="flex flex-col items-center min-w-0 w-full">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                      completed
                        ? "border-primary bg-primary text-white"
                        : isCurrent
                        ? "border-primary text-primary"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {completed ? (
                      <Check className="h-4 w-4" />
                    ) : isCurrent ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs text-center leading-tight px-1 ${
                      completed || isCurrent
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                  {detail && (
                    <span className="mt-1 text-[10px] text-center text-muted-foreground leading-tight px-1 max-w-20 truncate">
                      {detail}
                    </span>
                  )}
                </div>

                {/* Connector Line */}
                {index < STEP_LABELS.length - 1 && (
                  <div className="shrink-0 w-6 mt-4">
                    <div className={`h-0.5 w-full ${completed ? "bg-primary" : "bg-gray-200"}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full rounded-full bg-gray-100">
          <div
            className="h-1.5 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Info Row */}
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="text-primary">
            {formData?.email || application.user?.email || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>
            {formData?.phoneNumber || application.user?.phoneNumber || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>{certTypeLabels[application.certificateType] ?? application.certificateType}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="h-4 w-4" />
          <span>{application.paymentCompleted ? "Paid" : "Unpaid"}</span>
        </div>
      </div>

      {/* Payment Alert */}
      {!application.paymentCompleted && (
        <div className="flex items-start gap-3 rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3">
          <CreditCard className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Payment Pending</p>
            <p className="text-sm text-yellow-700">
              User has not completed payment. Consider sending a payment reminder.
            </p>
          </div>
        </div>
      )}

      {/* Action Row */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" size="sm" onClick={handleViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>

        <DropdownMenu open={actionMenuOpen} onOpenChange={setActionMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleSendEmailReminder}>
              <MailIcon className="mr-2 h-4 w-4" />
              Send Email Reminder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleWhatsAppReminder}>
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp Reminder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePaymentReminder}>
              <CreditCard className="mr-2 h-4 w-4" />
              Payment Reminder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSendCouponCode}>
              <Tag className="mr-2 h-4 w-4" />
              Send Coupon Code
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMarkAsPaid}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Paid
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddSupportRemark}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Add Support Remark
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
