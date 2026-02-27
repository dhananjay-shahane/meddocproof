"use client";

import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { CertificateFiltersState } from "@/types";

interface CertificateFiltersProps {
  filters: CertificateFiltersState;
  onFilterChange: (filters: Partial<CertificateFiltersState>) => void;
  onReset: () => void;
}

const tabOptions = [
  { value: "all", label: "All" },
  { value: "incomplete", label: "Incomplete" },
  { value: "completed", label: "Completed" },
];

const sortOptions = [
  { value: "createdAt", label: "Date Created" },
  { value: "certificateType", label: "Certificate Type" },
  { value: "status", label: "Status" },
];

export function CertificateFilters({ filters, onFilterChange, onReset }: CertificateFiltersProps) {
  const hasActiveFilters =
    filters.search || filters.tab !== "all" || filters.sortBy !== "createdAt";

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border bg-muted/50 p-1">
        {tabOptions.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onFilterChange({ tab: tab.value as CertificateFiltersState["tab"] })}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filters.tab === tab.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchInput
          value={filters.search}
          onChange={(value) => onFilterChange({ search: value })}
          placeholder="Search by certificate number, name, phone..."
          className="w-full sm:w-72"
        />
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onFilterChange({
              sortOrder: filters.sortOrder === "desc" ? "asc" : "desc",
            })
          }
          className="h-9 px-3"
        >
          {filters.sortOrder === "desc" ? "↓ Newest" : "↑ Oldest"}
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onReset} className="h-9 gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
