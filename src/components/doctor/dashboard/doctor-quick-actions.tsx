"use client";

import { Activity } from "lucide-react";
import type { Application } from "@/types";
import { format, formatDistanceToNow } from "date-fns";

interface DoctorQuickActionsProps {
  recentApplications: Application[];
}

const certTypeLabels: Record<string, string> = {
  sick_leave: "Sick Leave",
  fitness: "Fitness",
  work_from_home: "Work From Home",
  caretaker: "Caretaker",
  recovery: "Recovery",
  fit_to_fly: "Fit-to-Fly",
  unfit_to_work: "Unfit To Work",
  unfit_to_travel: "Unfit To Travel",
  medical_diagnosis: "Medical Diagnosis",
};

export function DoctorQuickActions({
  recentApplications,
}: DoctorQuickActionsProps) {
  const pendingApps = recentApplications.filter((app) =>
    [
      "assigned",
      "doctor_assigned",
      "pending_doctor_review",
      "under_review",
    ].includes(app.status)
  );

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Pending Actions</h3>
      </div>
      {pendingApps.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No pending actions. You&apos;re all caught up!
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {pendingApps.slice(0, 5).map((app) => {
            const user = app.user as
              | { fullName: string; phoneNumber: string }
              | undefined;
            return (
              <li
                key={app.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">
                    {certTypeLabels[app.certificateType] ??
                      app.certificateType}{" "}
                    — {user?.fullName ?? "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Assigned{" "}
                    {app.assignedAt
                      ? formatDistanceToNow(new Date(app.assignedAt), {
                          addSuffix: true,
                        })
                      : format(new Date(app.createdAt), "dd MMM")}
                  </p>
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  {app.hasMedicalAssessment ? "Review" : "Assess"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
