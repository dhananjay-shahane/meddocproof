"use client";

import { formatRelativeDate, getInitials } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { FileSearch } from "lucide-react";
import type { Application, PaginatedResponse } from "@/types";

interface ApplicationListProps {
  data: PaginatedResponse<Application> | null;
  loading: boolean;
  showConversion?: boolean;
  onSelect: (app: Application) => void;
  onPageChange: (page: number) => void;
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

export function ApplicationList({
  data,
  loading,
  showConversion = false,
  onSelect,
  onPageChange,
}: ApplicationListProps) {
  if (loading) {
    return <PageLoader />;
  }

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        icon={FileSearch}
        title="No applications found"
        description="Try adjusting your filters or search query."
      />
    );
  }

  return (
    <div>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  ID
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Applicant
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Type
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Doctor
                </th>
                {showConversion && (
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Conversion
                  </th>
                )}
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => onSelect(app)}
                  className="cursor-pointer border-b last:border-0 transition-colors hover:bg-muted/50"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      {app.applicationId?.slice(0, 10) || app.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        fallback={getInitials(app.user?.fullName || "?")}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium">{app.user?.fullName || "—"}</p>
                        <p className="text-xs text-muted-foreground">
                          {app.user?.phoneNumber || app.user?.email || "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">
                      {certTypeLabels[app.certificateType] || app.certificateType}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {app.assignedDoctor ? (
                      <span>{app.assignedDoctor.fullName}</span>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </td>
                  {showConversion && (
                    <td className="px-4 py-3">
                      {app.conversionLikelihood != null ? (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{
                                width: `${Math.min(100, app.conversionLikelihood)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {app.conversionLikelihood}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatRelativeDate(app.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {data.totalPages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={onPageChange}
          className="mt-4"
        />
      )}
    </div>
  );
}
