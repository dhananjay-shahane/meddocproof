"use client";

import { useRouter } from "next/navigation";
import { formatRelativeDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import type { Application } from "@/types";

interface LatestApplicationsTableProps {
  applications: Application[];
  onSelect?: (app: Application) => void;
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

export function LatestApplicationsTable({
  applications,
  onSelect,
}: LatestApplicationsTableProps) {
  const router = useRouter();

  const handleClick = (app: Application) => {
    if (onSelect) {
      onSelect(app);
    } else {
      router.push(`/admin/applications?id=${app.id}`);
    }
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-6 py-4">
        <h3 className="font-semibold">Latest Applications</h3>
      </div>
      {applications.length === 0 ? (
        <div className="p-6 text-center text-sm text-muted-foreground">
          No applications yet
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                  Type
                </th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => handleClick(app)}
                  className="cursor-pointer border-b last:border-0 transition-colors hover:bg-muted/50"
                >
                  <td className="px-6 py-3">
                    <div>
                      <p className="font-medium">{app.user?.fullName || "—"}</p>
                      <p className="text-xs text-muted-foreground">
                        {app.user?.phoneNumber || app.user?.email || "—"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant="secondary">
                      {certTypeLabels[app.certificateType] || app.certificateType}
                    </Badge>
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">
                    {formatRelativeDate(app.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
