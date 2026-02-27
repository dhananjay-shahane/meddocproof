"use client";

import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { CouponFiltersState } from "@/types";

interface CouponFiltersProps {
  filters: CouponFiltersState;
  onFilterChange: (filters: Partial<CouponFiltersState>) => void;
  onReset: () => void;
}

const filterOptions = [
  { value: "all", label: "All Coupons" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
];

const sortOptions = [
  { value: "createdAt", label: "Date Created" },
  { value: "code", label: "Code" },
  { value: "discountValue", label: "Discount Value" },
  { value: "usedCount", label: "Usage Count" },
  { value: "expiresAt", label: "Expiry Date" },
];

export function CouponFilters({ filters, onFilterChange, onReset }: CouponFiltersProps) {
  const hasActiveFilters =
    filters.search || filters.filter !== "all" || filters.sortBy !== "createdAt";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <SearchInput
        value={filters.search}
        onChange={(value) => onFilterChange({ search: value })}
        placeholder="Search by coupon code..."
        className="w-full sm:w-64"
      />
      <select
        value={filters.filter}
        onChange={(e) =>
          onFilterChange({ filter: e.target.value as CouponFiltersState["filter"] })
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
  );
}
