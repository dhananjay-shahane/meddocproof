"use client";

import { format } from "date-fns";
import Link from "next/link";
import type { Application } from "@/types";
import { FileText } from "lucide-react";

interface DoctorRecentApplicationsProps {
  applications: Application[];
}

const statusColors: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  pending_review: "bg-yellow-100 text-yellow-800",
  pending_doctor_review: "bg-orange-100 text-orange-800",
  assigned: "bg-indigo-100 text-indigo-800",
  doctor_assigned: "bg-indigo-100 text-indigo-800",
  under_review: "bg-purple-100 text-purple-800",
  processing: "bg-purple-100 text-purple-800",
  consultation_scheduled: "bg-cyan-100 text-cyan-800",
  consultation_completed: "bg-teal-100 text-teal-800",
  completed: "bg-green-100 text-green-800",
  delivered: "bg-green-100 text-green-800",
  certificate_delivered: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

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

export function DoctorRecentApplications({
  applications,
}: DoctorRecentApplicationsProps) {
  if (!applications.length) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Recent Applications</h3>
        <div className="mt-8 flex flex-col items-center justify-center text-muted-foreground">
          <FileText className="mb-2 h-10 w-10 opacity-40" />
          <p className="text-sm">No applications assigned yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Applications</h3>
        <Link
          href="/doctor/applications"
          className="text-sm text-primary hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-3 font-medium">Application ID</th>
              <th className="pb-3 font-medium">Patient</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const user = app.user as
                | { fullName: string; phoneNumber: string }
                | undefined;
              return (
                <tr key={app.id} className="border-b last:border-0">
                  <td className="py-3 font-mono text-xs">
                    {app.applicationId}
                  </td>
                  <td className="py-3">
                    <div className="font-medium">
                      {user?.fullName ?? "Unknown"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user?.phoneNumber ?? ""}
                    </div>
                  </td>
                  <td className="py-3">
                    {certTypeLabels[app.certificateType] ??
                      app.certificateType}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusColors[app.status] ??
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {app.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {format(new Date(app.createdAt), "dd MMM yyyy")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
