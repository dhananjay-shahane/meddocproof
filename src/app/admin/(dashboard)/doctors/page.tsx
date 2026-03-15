"use client";

import { useState, useCallback } from "react";
import { useDoctorsOverview } from "@/hooks/use-doctors-overview";
import { DoctorStats } from "@/components/admin/doctors/doctor-stats";
import { DoctorDirectory } from "@/components/admin/doctors/doctor-directory";
import api from "@/lib/api";
import { toast } from "sonner";
import type { DoctorFiltersState } from "@/types";
import { Button } from "@/components/ui/button";
import { TrendingUp, Plus } from "lucide-react";
import Link from "next/link";

const defaultFilters: DoctorFiltersState = {
  search: "",
  status: "approved",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export default function DoctorsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<DoctorFiltersState>(defaultFilters);
  const [showAll, setShowAll] = useState(false);

  const { data, summary, loading, refetch } = useDoctorsOverview({ 
    filters: showAll ? { ...filters, status: "all" } : filters, 
    page 
  });

  const handleFilterChange = useCallback(
    (partial: Partial<DoctorFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...partial }));
      setPage(1);
    },
    []
  );

  const handleAction = useCallback(
    async (doctorId: string, action: "approve" | "reject" | "suspend") => {
      try {
        await api.put(`/admin/doctors/${doctorId}/status`, { action });
        toast.success(
          `Doctor ${action === "approve" ? "approved" : action === "reject" ? "rejected" : "suspended"} successfully`
        );
        refetch();
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        toast.error(e.response?.data?.message || `Failed to ${action} doctor`);
      }
    },
    [refetch]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctors Management</h1>
          <p className="text-muted-foreground">
            Active doctors overview and management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/doctors/performance">
            <Button variant="outline" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance Analytics
            </Button>
          </Link>
          <Link href="/admin/doctors/registrations">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Review Applications
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <DoctorStats summary={summary} loading={loading} />

      {/* Doctors Directory */}
      <DoctorDirectory
        data={data}
        loading={loading}
        filters={filters}
        showAll={showAll}
        onShowAllChange={setShowAll}
        onFilterChange={handleFilterChange}
        onPageChange={setPage}
        onAction={handleAction}
        onRefresh={refetch}
      />
    </div>
  );
}
