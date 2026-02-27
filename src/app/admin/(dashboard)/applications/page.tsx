"use client";

import { useState, useCallback } from "react";
import { useApplications } from "@/hooks/use-applications";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ApplicationFilters } from "@/components/admin/applications/application-filters";
import { ApplicationList } from "@/components/admin/applications/application-list";
import { ApplicationDetailsModal } from "@/components/admin/applications/application-details-modal";
import type { Application, ApplicationFiltersState } from "@/types";

const defaultFilters: ApplicationFiltersState = {
  search: "",
  status: "all",
  certificateType: "all",
  dateFrom: "",
  dateTo: "",
};

export default function ApplicationsPage() {
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ApplicationFiltersState>(defaultFilters);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, tabCounts, loading, refetch } = useApplications({
    tab,
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

  const handleTabChange = useCallback((newTab: string) => {
    setTab(newTab);
    setPage(1);
  }, []);

  const handleSelect = useCallback((app: Application) => {
    setSelectedAppId(app.id);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedAppId(null);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Applications</h2>
        <p className="text-muted-foreground">
          Manage all medical certificate applications.
        </p>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all" badge={tabCounts.all}>
            All
          </TabsTrigger>
          <TabsTrigger value="temporary" badge={tabCounts.temporary}>
            Temporary
          </TabsTrigger>
          <TabsTrigger value="completed" badge={tabCounts.completed}>
            Completed
          </TabsTrigger>
        </TabsList>

        {/* Filters (shared across tabs) */}
        <div className="mt-4">
          <ApplicationFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        <TabsContent value="all" className="mt-4">
          <ApplicationList
            data={data}
            loading={loading}
            onSelect={handleSelect}
            onPageChange={setPage}
          />
        </TabsContent>

        <TabsContent value="temporary" className="mt-4">
          <ApplicationList
            data={data}
            loading={loading}
            showConversion
            onSelect={handleSelect}
            onPageChange={setPage}
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <ApplicationList
            data={data}
            loading={loading}
            onSelect={handleSelect}
            onPageChange={setPage}
          />
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <ApplicationDetailsModal
        applicationId={selectedAppId}
        open={modalOpen}
        onClose={handleCloseModal}
        onUpdated={refetch}
      />
    </div>
  );
}
