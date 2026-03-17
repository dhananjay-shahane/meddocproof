"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { getInitials } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { FileSearch, ArrowUpDown, MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Application, PaginatedResponse } from "@/types";

interface ApplicationListProps {
  data: PaginatedResponse<Application> | null;
  loading: boolean;
  showConversion?: boolean;
  onPageChange: (page: number) => void;
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

export function ApplicationList({
  data,
  loading,
  showConversion = false,
  onPageChange,
}: ApplicationListProps) {
  const router = useRouter();
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const handleViewApplication = (appId: string) => {
    router.push(`/admin/applications/${appId}`);
  };

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

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy h:mm a");
    } catch {
      return "—";
    }
  };

  return (
    <div>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left">
                  <button className="flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground">
                    Applicant
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Certificate Type
                </th>
                <th className="px-4 py-3 text-left">
                  <button className="flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground">
                    Last Updated
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                {showConversion && (
                  <th className="px-4 py-3 text-left">
                    <button className="flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground">
                      Conversion Likelihood
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </th>
                )}
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((app) => (
                <tr
                  key={app.id}
                  className="border-b last:border-0 transition-colors hover:bg-muted/50"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p 
                        className="font-medium text-primary hover:underline cursor-pointer"
                        onClick={() => handleViewApplication(app.id)}
                      >
                        {app.user?.fullName || "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {app.user?.email || "—"}
                      </p>
                      {app.user?.phoneNumber && (
                        <p className="text-xs text-muted-foreground">
                          {app.user.phoneNumber}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {certTypeLabels[app.certificateType] || app.certificateType}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(app.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  {showConversion && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-red-400 transition-all"
                            style={{
                              width: `${Math.min(100, app.conversionLikelihood || 0)}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {app.conversionLikelihood || 0}%
                        </span>
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <DropdownMenu 
                      open={actionMenuOpen === app.id} 
                      onOpenChange={(open) => setActionMenuOpen(open ? app.id : null)}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewApplication(app.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
