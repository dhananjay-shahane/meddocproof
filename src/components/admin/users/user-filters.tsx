"use client";

import { Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserFiltersState } from "@/types";

interface UserFiltersProps {
  filters: UserFiltersState;
  onFilterChange: (filters: Partial<UserFiltersState>) => void;
  onReset: () => void;
  onBulkWhatsApp?: () => void;
  selectedCount?: number;
}

const filterOptions = [
  { value: "all", label: "All Users" },
  { value: "paid", label: "Paid Users" },
  { value: "unpaid", label: "Unpaid Users" },
];

const sortOptions = [
  { value: "createdAt", label: "Join Date" },
  { value: "name", label: "Name" },
  { value: "lastLoginAt", label: "Last Login" },
  { value: "totalSpent", label: "Total Spent" },
  { value: "applicationCount", label: "Applications" },
];

export function UserFilters({
  filters,
  onFilterChange,
  onReset,
  onBulkWhatsApp,
  selectedCount = 0,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search by name, phone, or email..."
            className="h-9 w-full rounded-lg border border-input bg-transparent pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Filter Dropdown */}
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

        {/* Sort By Dropdown */}
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

        {/* Sort Order */}
        <select
          value={filters.sortOrder}
          onChange={(e) =>
            onFilterChange({ sortOrder: e.target.value as "asc" | "desc" })
          }
          className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {/* Bulk WhatsApp Button */}
      {onBulkWhatsApp && (
        <Button
          onClick={onBulkWhatsApp}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Bulk WhatsApp
        </Button>
      )}
    </div>
  );
}
