"use client";

import { useState, useCallback } from "react";
import { useDoctorsOverview } from "@/hooks/use-doctors-overview";
import { ApprovedDoctorCards } from "@/components/admin/doctors/approved-doctor-cards";
import api from "@/lib/api";
import { toast } from "sonner";
import type { DoctorFiltersState } from "@/types";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const defaultFilters: DoctorFiltersState = {
  search: "",
  status: "approved",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export default function ApprovedDoctorsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<DoctorFiltersState>(defaultFilters);
  const [searchInput, setSearchInput] = useState("");

  const { data, summary, loading, refetch } = useDoctorsOverview({ filters, page });

  const handleSearch = useCallback(() => {
    setFilters((prev) => ({ ...prev, search: searchInput }));
    setPage(1);
  }, [searchInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handleAction = useCallback(
    async (doctorId: string, action: "approve" | "reject" | "suspend") => {
      try {
        await api.put(`/admin/doctors/${doctorId}/status`, { action });
        toast.success(
          `Doctor ${action === "approve" ? "approved" : action === "reject" ? "rejected" : "deactivated"} successfully`
        );
        refetch();
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        toast.error(e.response?.data?.message || `Failed to ${action} doctor`);
      }
    },
    [refetch]
  );

  const totalDoctors = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approved Doctors</h1>
        <p className="text-muted-foreground">
          Manage approved doctors and their status ({totalDoctors} total)
        </p>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or registration number..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
          </div>
          <Button onClick={handleSearch} variant="outline">
            Search
          </Button>
        </div>
      </div>

      {/* Doctor Cards */}
      <ApprovedDoctorCards
        data={data}
        loading={loading}
        onPageChange={setPage}
        onAction={handleAction}
      />
    </div>
  );
}
