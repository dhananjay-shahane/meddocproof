"use client";

import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { ApplicationFiltersState } from "@/types";

interface ApplicationFiltersProps {
  filters: ApplicationFiltersState;
  onFilterChange: (filters: Partial<ApplicationFiltersState>) => void;
  onReset: () => void;
}

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "submitted", label: "Submitted" },
  { value: "pending", label: "Pending" },
  { value: "pending_review", label: "Pending Review" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "under_review", label: "Under Review" },
  { value: "approved", label: "Approved" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

const certTypeOptions = [
  { value: "all", label: "All Types" },
  { value: "sick_leave", label: "Sick Leave" },
  { value: "fitness", label: "Fitness" },
  { value: "work_from_home", label: "Work From Home" },
  { value: "caretaker", label: "Caretaker" },
  { value: "recovery", label: "Recovery" },
  { value: "fit_to_fly", label: "Fit-to-Fly" },
  { value: "unfit_to_work", label: "Unfit To Work" },
  { value: "unfit_to_travel", label: "Unfit To Travel" },
  { value: "medical_diagnosis", label: "Medical Diagnosis" },
];

export function ApplicationFilters({
  filters,
  onFilterChange,
  onReset,
}: ApplicationFiltersProps) {
  const hasActiveFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.certificateType !== "all" ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <SearchInput
        value={filters.search}
        onChange={(value) => onFilterChange({ search: value })}
        placeholder="Search by ID, name, phone..."
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
        value={filters.certificateType}
        onChange={(e) => onFilterChange({ certificateType: e.target.value })}
        className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {certTypeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onFilterChange({ dateFrom: e.target.value })}
          className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="From"
        />
        <span className="text-muted-foreground">—</span>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => onFilterChange({ dateTo: e.target.value })}
          className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="To"
        />
      </div>
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      )}
    </div>
  );
}
