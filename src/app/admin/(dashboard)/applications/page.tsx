"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useApplications } from "@/hooks/use-applications";
import { ApplicationFilters } from "@/components/admin/applications/application-filters";
import { ApplicationList } from "@/components/admin/applications/application-list";
import type { ApplicationFiltersState } from "@/types";

const defaultFilters: ApplicationFiltersState = {
  search: "",
  status: "all",
  certificateType: "all",
  dateFrom: "",
  dateTo: "",
};

export default function ApplicationsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ApplicationFiltersState>(defaultFilters);

  const { data, loading } = useApplications({
    tab: "all",
    filters,
    page,
  });

  const handleFilterChange = useCallback(
    (partial: Partial<ApplicationFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...partial }));
      setPage(1);
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Applications Management</h2>
        <p className="text-muted-foreground">
          View and manage all certificate applications in one place
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b overflow-x-auto">
        <nav className="flex gap-4 min-w-max">
          <Link
            href="/admin/applications"
            className="border-b-2 border-primary px-1 pb-3 text-sm font-medium text-primary whitespace-nowrap"
          >
            All Applications
          </Link>
          <Link
            href="/admin/applications/temporary"
            className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap"
          >
            Temporary Applications
          </Link>
          <Link
            href="/admin/applications/completed"
            className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap"
          >
            Completed Applications
          </Link>
        </nav>
      </div>

      {/* Filters */}
      <ApplicationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Application List */}
      <ApplicationList
        data={data}
        loading={loading}
        onPageChange={setPage}
      />
    </div>
  );
}
