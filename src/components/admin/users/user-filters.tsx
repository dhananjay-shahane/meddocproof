"use client";

import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { UserFiltersState } from "@/types";

interface UserFiltersProps {
  filters: UserFiltersState;
  onFilterChange: (filters: Partial<UserFiltersState>) => void;
  onReset: () => void;
}

const filterOptions = [
  { value: "all", label: "All Users" },
  { value: "paid", label: "Paid Users" },
  { value: "unpaid", label: "Unpaid Users" },
];

const sortOptions = [
  { value: "createdAt", label: "Date Joined" },
  { value: "name", label: "Name" },
  { value: "lastLoginAt", label: "Last Login" },
  { value: "totalSpent", label: "Total Spent" },
  { value: "applicationCount", label: "Applications" },
];

export function UserFilters({ filters, onFilterChange, onReset }: UserFiltersProps) {
  const hasActiveFilters =
    filters.search || filters.filter !== "all" || filters.sortBy !== "createdAt";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <SearchInput
        value={filters.search}
        onChange={(value) => onFilterChange({ search: value })}
        placeholder="Search by name, phone, email..."
        className="w-full sm:w-64"
      />
      <select
        value={filters.filter}
        onChange={(e) =>
          onFilterChange({ filter: e.target.value as UserFiltersState["filter"] })
        }
        className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {filterOptions.map((opt) => (
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
