"use client";

import { useState, useCallback } from "react";
import { useDoctorsOverview } from "@/hooks/use-doctors-overview";
import { DoctorStats } from "@/components/admin/doctors/doctor-stats";
import { DoctorFilters } from "@/components/admin/doctors/doctor-filters";
import { DoctorTable } from "@/components/admin/doctors/doctor-table";
import api from "@/lib/api";
import { toast } from "sonner";
import type { DoctorFiltersState } from "@/types";

const defaultFilters: DoctorFiltersState = {
  search: "",
  status: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export default function DoctorsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<DoctorFiltersState>(defaultFilters);

  const { data, summary, loading, refetch } = useDoctorsOverview({ filters, page });

  const handleFilterChange = useCallback(
    (partial: Partial<DoctorFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...partial }));
      setPage(1);
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
  }, []);

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
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Doctors Overview</h2>
        <p className="text-muted-foreground">
          Manage registered doctors and their profiles.
        </p>
      </div>

      <DoctorStats summary={summary} loading={loading} />

      <DoctorFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <DoctorTable
        data={data}
        loading={loading}
        onPageChange={setPage}
        onAction={handleAction}
      />
    </div>
  );
}
