"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CreditCard,
  Calendar,
  FileText,
  Download,
  Loader2,
  Send,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/loading-spinner";
import { formatDate } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";
import type { Application, Payment } from "@/types";

// Application View Components
import {
  DetailsTab,
  DocumentsTab,
  TimelineTab,
  PaymentInfoCard,
  QuickActionsCard,
} from "@/components/admin/application-view";

// Extended application type with payments
interface ApplicationWithPayments extends Application {
  payments?: Payment[];
}

export default function ApplicationViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [application, setApplication] = useState<ApplicationWithPayments | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchApplication = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/applications/${resolvedParams.id}`);
      setApplication(res.data.data);
    } catch {
      toast.error("Failed to load application details");
      router.push("/admin/applications");
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id, router]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("PDF exported successfully");
    } catch {
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    const styles: Record<string, string> = {
      submitted: "bg-blue-100 text-blue-700",
      payment_pending: "bg-yellow-100 text-yellow-700",
      pending_doctor_assignment: "bg-orange-100 text-orange-700",
      assigned: "bg-purple-100 text-purple-700",
      pending_review: "bg-blue-100 text-blue-700",
      pending_doctor_review: "bg-blue-100 text-blue-700",
      doctor_assigned: "bg-purple-100 text-purple-700",
      in_progress: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      cancelled: "bg-gray-100 text-gray-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Application not found</p>
        <Button variant="outline" asChild>
          <Link href="/admin/applications">Go Back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/applications">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              Application #{application.applicationId?.slice(-8) || application.id.slice(-8)}
            </h1>
            <p className="text-sm text-muted-foreground">
              {application.certificateType.replace(/_/g, "-")} for {application.user?.fullName}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleExportPDF} disabled={exporting}>
          {exporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export PDF
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4">
        {/* Status Card */}
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span
                className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium uppercase ${getStatusBadgeStyle(application.status)}`}
              >
                {application.status.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Card */}
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Payment</p>
              <span
                className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium uppercase ${
                  application.paymentCompleted
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {application.paymentCompleted ? "PAID" : "PENDING"}
              </span>
            </div>
          </div>
        </div>

        {/* Created Card */}
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="mt-1 text-sm font-medium">
                {formatDate(application.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Certificate</p>
              <p className="mt-1 text-sm font-medium">
                {application.certificateNumber || "Not Generated"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Left Column - Tabs */}
        <div className="flex-1">
          <Tabs defaultValue="details" className="rounded-xl border bg-card">
            <div className="border-b">
              <TabsList className="w-full justify-start gap-0 bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="details"
                  className="rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Timeline
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="details">
                <DetailsTab application={application} />
              </TabsContent>

              <TabsContent value="documents">
                <DocumentsTab documents={application.documents || []} />
              </TabsContent>

              <TabsContent value="timeline">
                <TimelineTab
                  application={application}
                  remarks={application.remarks || []}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Right Column - Sidebar */}
        <div className="w-80 space-y-4">
          <PaymentInfoCard paymentCompleted={application.paymentCompleted} />
          <QuickActionsCard applicationId={application.id} />
        </div>
      </div>
    </div>
  );
}
