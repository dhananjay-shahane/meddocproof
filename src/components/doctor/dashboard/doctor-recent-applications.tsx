"use client";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import type { Application } from "@/types";
import { FileText, RefreshCw, Eye } from "lucide-react";

interface DoctorRecentApplicationsProps {
  applications: Application[];
  onRefresh?: () => void;
}

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  submitted: { label: "Submitted", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  pending: { label: "Pending", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
  pending_review: { label: "Pending", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
  pending_doctor_review: { label: "Pending Review", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  assigned: { label: "Assigned", className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" },
  doctor_assigned: { label: "Assigned", className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" },
  under_review: { label: "Under Review", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
  processing: { label: "Processing", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
  consultation_scheduled: { label: "Scheduled", className: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300" },
  consultation_completed: { label: "Completed", className: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300" },
  completed: { label: "Approved", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  certificate_delivered: { label: "Delivered", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300" },
};

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

const isPendingStatus = (status: string) => {
  return [
    "assigned",
    "doctor_assigned",
    "pending_doctor_review",
    "under_review",
    "pending",
    "pending_review",
  ].includes(status);
};

export function DoctorRecentApplications({
  applications,
  onRefresh,
}: DoctorRecentApplicationsProps) {
  if (!applications.length) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Recent Applications</h3>
            <p className="text-sm text-muted-foreground">
              Latest certificate applications assigned to you
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center py-8 text-muted-foreground">
          <FileText className="mb-2 h-12 w-12 opacity-40" />
          <p className="text-sm">No applications assigned yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h3 className="text-lg font-semibold">Recent Applications</h3>
          <p className="text-sm text-muted-foreground">
            Latest certificate applications assigned to you
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          )}
          <Link
            href="/doctor/applications"
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Applications List */}
      <div className="divide-y">
        {applications.map((app) => {
          const user = app.user as
            | { fullName: string; phoneNumber: string }
            | undefined;
          const status = statusConfig[app.status] ?? {
            label: app.status.replace(/_/g, " "),
            className: "bg-gray-100 text-gray-700",
          };
          const timeAgo = formatDistanceToNow(new Date(app.createdAt), {
            addSuffix: false,
          });

          return (
            <div
              key={app.id}
              className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {user?.fullName?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{user?.fullName ?? "Unknown"}</p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {certTypeLabels[app.certificateType] ?? app.certificateType}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {app.applicationId} • {timeAgo} ago
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isPendingStatus(app.status) && (
                  <Link
                    href={`/doctor/applications/${app.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/40"
                  >
                    Pending Review
                  </Link>
                )}
                <Link
                  href={`/doctor/applications/${app.id}`}
                  className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
