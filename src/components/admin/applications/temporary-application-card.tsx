"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  User,
  Mail,
  Phone,
  FileText,
  DollarSign,
  Tag,
  CreditCard,
  Eye,
  MoreHorizontal,
  Mail as MailIcon,
  MessageSquare,
  Send,
  CheckCircle,
  MessageCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

// Calculate progress step based on form data
function calculateProgress(app: Application): {
  currentStep: number;
  percentage: number;
  steps: { label: string; completed: boolean }[];
} {
  const formData = app.formData as Record<string, unknown>;
  
  // Check what's filled
  const hasPersonalInfo = !!(formData?.fullName || formData?.phoneNumber || formData?.email);
  const hasCertificateDetails = !!(formData?.certificateType || app.certificateType);
  const hasDocuments = (app.documents?.length || 0) > 0;
  const hasPayment = app.paymentCompleted;

  const steps = [
    { label: "Personal Info", completed: hasPersonalInfo },
    { label: "Certificate Details", completed: hasCertificateDetails },
    { label: "Documents", completed: hasDocuments },
    { label: "Payment", completed: hasPayment },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const percentage = Math.round((completedCount / steps.length) * 100);
  
  // Current step is the first incomplete one, or last if all complete
  let currentStep = steps.findIndex((s) => !s.completed);
  if (currentStep === -1) currentStep = steps.length - 1;

  return { currentStep, percentage, steps };
}

const certTypeLabels: Record<string, string> = {
  sick_leave: "sick-leave",
  fitness: "fitness",
  work_from_home: "work-from-home",
  caretaker: "caretaker",
  recovery: "recovery",
  fit_to_fly: "fit-to-fly",
  unfit_to_work: "unfit-to-work",
  unfit_to_travel: "unfit-to-travel",
  medical_diagnosis: "medical-diagnosis",
};

export function TemporaryApplicationCard({ application }: TemporaryApplicationCardProps) {
  const router = useRouter();
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  
  const formData = application.formData as Record<string, string | undefined>;
  const { currentStep, percentage, steps } = calculateProgress(application);
  
  const timeAgo = formatDistanceToNow(new Date(application.updatedAt), { addSuffix: true });

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
              {formData?.fullName || application.user?.fullName || "Unknown User"}
            </h3>
            <p className="text-sm text-muted-foreground">
              ID: {application.applicationId || application.id.slice(0, 12)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            In Progress
          </span>
          <span className="text-sm text-muted-foreground">{timeAgo}</span>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Application Progress</p>
          <p className="text-sm font-medium text-primary">{percentage}% Complete</p>
        </div>
        
        <div className="flex items-center gap-0">
          {steps.map((step, index) => (
            <div key={step.label} className="flex-1 flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium ${
                    step.completed
                      ? "border-primary bg-primary text-white"
                      : index === currentStep
                      ? "border-primary text-primary"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {step.completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`mt-2 text-xs text-center ${
                    step.completed || index === currentStep
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2">
                  <div
                    className={`h-0.5 w-full ${
                      step.completed ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
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
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium">
            User
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>{certTypeLabels[application.certificateType] || application.certificateType}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="h-4 w-4" />
          <span>No amount</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Tag className="h-4 w-4" />
          <span>No Coupons</span>
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
