"use client";

import { useState, useCallback } from "react";
import { useCertificates } from "@/hooks/use-certificates";
import { CertificateStats } from "@/components/admin/certificates/certificate-stats";
import { CertificateFilters } from "@/components/admin/certificates/certificate-filters";
import { CertificateTable } from "@/components/admin/certificates/certificate-table";
import type { CertificateFiltersState } from "@/types";

const defaultFilters: CertificateFiltersState = {
  search: "",
  tab: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export default function CertificatesPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CertificateFiltersState>(defaultFilters);

  const { data, stats, loading } = useCertificates({ filters, page });

  const handleFilterChange = useCallback((partial: Partial<CertificateFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Certificates</h2>
        <p className="text-muted-foreground">
          View and manage issued medical certificates.
        </p>
      </div>

      <CertificateStats stats={stats} loading={loading} />

      <CertificateFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <CertificateTable
        data={data}
        loading={loading}
        onPageChange={setPage}
      />
    </div>
  );
}
