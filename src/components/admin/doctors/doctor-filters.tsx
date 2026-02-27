"use client";

import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { DoctorFiltersState } from "@/types";

interface DoctorFiltersProps {
  filters: DoctorFiltersState;
  onFilterChange: (filters: Partial<DoctorFiltersState>) => void;
  onReset: () => void;
}

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
];

const sortOptions = [
  { value: "createdAt", label: "Date Joined" },
  { value: "fullName", label: "Name" },
  { value: "avgRating", label: "Rating" },
  { value: "consultationCount", label: "Consultations" },
  { value: "completedCertificates", label: "Certificates" },
  { value: "lastActive", label: "Last Active" },
];

export function DoctorFilters({
  filters,
  onFilterChange,
  onReset,
}: DoctorFiltersProps) {
  const hasActiveFilters =
    filters.search || filters.status !== "all" || filters.sortBy !== "createdAt";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <SearchInput
        value={filters.search}
        onChange={(value) => onFilterChange({ search: value })}
        placeholder="Search by name, email, registration..."
        className="w-full sm:w-64"
      />
      <select
        value={filters.status}
        onChange={(e) => onFilterChange({ status: e.target.value })}
        className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        value={filters.sortBy}
        onChange={(e) => onFilterChange({ sortBy: e.target.value })}
        className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={() =>
          onFilterChange({
            sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
          })
        }
        className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm transition-colors hover:bg-accent"
        title={filters.sortOrder === "asc" ? "Ascending" : "Descending"}
      >
        {filters.sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
      </button>
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      )}
    </div>
  );
}
