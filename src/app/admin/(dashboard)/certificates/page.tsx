"use client";

import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  FileText,
  Download,
  Bell,
  BarChart3,
  ArrowRight,
  Eye,
  FileDown,
  Send,
  TrendingUp,
  ClipboardList,
  Users,
  FileCheck,
  Upload,
  LayoutTemplate,
  UserPlus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCertificates } from "@/hooks/use-certificates";

export default function CertificatesPage() {
  const { stats, loading } = useCertificates({
    filters: { search: "", tab: "all", sortBy: "createdAt", sortOrder: "desc" },
    page: 1,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Certificate Management</h2>
        <p className="text-muted-foreground">
          Manage certificate workflow, track progress, and handle completed certificates
        </p>
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Incomplete Certificates Card */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Incomplete Certificates</h3>
              <p className="text-sm text-muted-foreground">
                Track and manage certificates in progress
              </p>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-sm text-muted-foreground mb-2">Workflow stages:</p>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Doctor Assignment
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Consultation Completion
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                Certificate Generation
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                PDF Upload & Submission
              </li>
            </ul>
          </div>

          <Button
            asChild
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Link href="/admin/certificates/incomplete">
              <FileText className="mr-2 h-4 w-4" />
              Manage Incomplete Certificates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Completed Certificates Card */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Completed Certificates</h3>
              <p className="text-sm text-muted-foreground">
                View and manage submitted certificates
              </p>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-sm text-muted-foreground mb-2">Available actions:</p>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-muted-foreground" />
                View certificate details
              </li>
              <li className="flex items-center gap-2 text-sm">
                <FileDown className="h-4 w-4 text-muted-foreground" />
                Download PDF certificates
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Send className="h-4 w-4 text-muted-foreground" />
                Send notifications to patients
              </li>
              <li className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Track completion metrics
              </li>
            </ul>
          </div>

          <Button
            asChild
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            <Link href="/admin/certificates/completed">
              <FileCheck className="mr-2 h-4 w-4" />
              View Completed Certificates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pending Assignment */}
        <div className="rounded-xl border bg-card p-4 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Pending Assignment
            </h4>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              stats?.pendingCertificates ?? "-"
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            Awaiting doctor assignment
          </p>
        </div>

        {/* In Progress */}
        <div className="rounded-xl border bg-card p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              In Progress
            </h4>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "-"
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            Currently being processed
          </p>
        </div>

        {/* Ready for Submission */}
        <div className="rounded-xl border bg-card p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Ready for Submission
            </h4>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "-"
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            Ready to submit to patients
          </p>
        </div>

        {/* Completed Today */}
        <div className="rounded-xl border bg-card p-4 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Completed Today
            </h4>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "-"
            )}
          </p>
          <p className="text-xs text-muted-foreground">Submitted today</p>
        </div>
      </div>

      {/* Additional Tools */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold mb-1">Additional Tools</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Additional certificate management tools and utilities
        </p>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/certificates/templates">
              <LayoutTemplate className="mr-2 h-4 w-4" />
              Certificate Templates
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/certificates/demo-templates">
              <UserPlus className="mr-2 h-4 w-4" />
              Generate Certificate
            </Link>
          </Button>
          <Button variant="outline" disabled>
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics (Coming Soon)
          </Button>
        </div>
      </div>
    </div>
  );
}
