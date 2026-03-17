"use client";

import { formatRelativeDate, getInitials } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CheckCircle, XCircle, Ban, Star, Stethoscope } from "lucide-react";
import type { Doctor, PaginatedResponse } from "@/types";

interface DoctorTableProps {
  data: PaginatedResponse<Doctor> | null;
  loading: boolean;
  onPageChange: (page: number) => void;
  onAction: (doctorId: string, action: "approve" | "reject" | "suspend") => void;
}

function getRatingBadge(rating: number) {
  if (rating >= 4.5) return { label: "Excellent", variant: "default" as const };
  if (rating >= 3.5) return { label: "Good", variant: "secondary" as const };
  if (rating >= 2.5) return { label: "Average", variant: "outline" as const };
  return { label: "Needs Attention", variant: "destructive" as const };
}

export function DoctorTable({
  data,
  loading,
  onPageChange,
  onAction,
}: DoctorTableProps) {
  if (loading) return <PageLoader />;

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        icon={Stethoscope}
        title="No doctors found"
        description="Try adjusting your filters or search query."
      />
    );
  }

  return (
    <div>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Doctor
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Rating
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Consultations
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Certificates
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Last Active
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((doctor) => {
                const ratingBadge = getRatingBadge(doctor.avgRating);
                return (
                  <tr
                    key={doctor.id}
                    className="border-b last:border-0 transition-colors hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          fallback={getInitials(doctor.fullName)}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium">{doctor.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {doctor.specialization} · {doctor.registrationNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={doctor.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{doctor.avgRating.toFixed(1)}</span>
                        <Badge variant={ratingBadge.variant} className="ml-1 text-[10px] px-1.5 py-0">
                          {ratingBadge.label}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {doctor.consultationCount}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {doctor.completedCertificates}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {doctor.lastActive
                        ? formatRelativeDate(doctor.lastActive)
                        : "Never"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {doctor.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => onAction(doctor.id, "approve")}
                                className="text-green-600"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onAction(doctor.id, "reject")}
                                className="text-red-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {doctor.status === "approved" && (
                            <DropdownMenuItem
                              onClick={() => onAction(doctor.id, "suspend")}
                              className="text-red-600"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                          {(doctor.status === "rejected" ||
                            doctor.status === "suspended") && (
                            <DropdownMenuItem
                              disabled
                              className="text-muted-foreground"
                            >
                              No actions available
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem disabled>
                            View Profile
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
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
