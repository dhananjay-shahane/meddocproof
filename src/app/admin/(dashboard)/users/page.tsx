"use client";

import { useState, useCallback } from "react";
import { useUsers } from "@/hooks/use-users";
import { UserStats } from "@/components/admin/users/user-stats";
import { UserFilters } from "@/components/admin/users/user-filters";
import { UserTable } from "@/components/admin/users/user-table";
import { BulkWhatsAppDialog } from "@/components/admin/users/bulk-whatsapp-dialog";
import type { UserFiltersState } from "@/types";

const defaultFilters: UserFiltersState = {
  search: "",
  filter: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<UserFiltersState>(defaultFilters);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [whatsappOpen, setWhatsappOpen] = useState(false);

  const { data, stats, loading, refetch } = useUsers({ filters, page });

  const handleFilterChange = useCallback(
    (partial: Partial<UserFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...partial }));
      setPage(1);
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
  }, []);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    if (!data) return;
    const allSelected = data.items.every((u) => selectedIds.has(u.id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.items.map((u) => u.id)));
    }
  }, [data, selectedIds]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    setSelectedIds(new Set());
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">
          Manage platform users and their accounts.
        </p>
      </div>

      <UserStats stats={stats} loading={loading} />

      <UserFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <UserTable
        data={data}
        loading={loading}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleAll={handleToggleAll}
        onPageChange={handlePageChange}
        onBulkWhatsApp={() => setWhatsappOpen(true)}
      />

      <BulkWhatsAppDialog
        open={whatsappOpen}
        onClose={() => setWhatsappOpen(false)}
        selectedUserIds={Array.from(selectedIds)}
        onSuccess={() => {
          setSelectedIds(new Set());
          refetch();
        }}
      />
    </div>
  );
}
