"use client";

import { useState, useCallback } from "react";
import { RefreshCw, Search, Filter } from "lucide-react";
import { useApplications } from "@/hooks/use-applications";
import { TemporaryApplicationCard } from "@/components/admin/applications/temporary-application-card";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { FileSearch } from "lucide-react";
import type { ApplicationFiltersState } from "@/types";

const defaultFilters: ApplicationFiltersState = {
  search: "",
  status: "all",
  certificateType: "all",
  dateFrom: "",
  dateTo: "",
};

export default function TemporaryApplicationsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ApplicationFiltersState>(defaultFilters);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, loading, refetch } = useApplications({
    tab: "temporary",
    filters,
    page,
  });

  const handleSearch = useCallback(() => {
    setFilters((prev) => ({ ...prev, search: searchInput, status: statusFilter }));
    setPage(1);
  }, [searchInput, statusFilter]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Temporary Applications</h1>
          <p className="text-muted-foreground">
            Manage incomplete and in-progress applications ({data?.total || 0} total)
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-xl border bg-card p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or application ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="h-10">
              <Filter className="mr-2 h-4 w-4" />
              Status: {statusFilter === "all" ? "All" : statusFilter}
            </Button>
            <Button onClick={handleSearch} className="h-10">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Application Cards */}
      {loading ? (
        <PageLoader />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          icon={FileSearch}
          title="No temporary applications found"
          description="Try adjusting your search or check back later."
        />
      ) : (
        <div className="space-y-4">
          {data.items.map((app) => (
            <TemporaryApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
