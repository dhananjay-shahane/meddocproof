"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ApplicationFiltersState } from "@/types";

interface ApplicationFiltersProps {
  filters: ApplicationFiltersState;
  onFilterChange: (filters: Partial<ApplicationFiltersState>) => void;
  onReset: () => void;
}

const statusOptions = [
  { value: "all", label: "All Statuses" },
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

const dateRangeOptions = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "Last 3 Months" },
];

export function ApplicationFilters({
  filters,
  onFilterChange,
  onReset,
}: ApplicationFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [dateRange, setDateRange] = useState("all");

  const handleFilter = () => {
    onFilterChange({ search: searchInput });
  };

  const handleReset = () => {
    setSearchInput("");
    setDateRange("all");
    onReset();
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end">
      {/* Status */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted-foreground">Status</label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Certificate Type */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted-foreground">Certificate Type</label>
        <select
          value={filters.certificateType}
          onChange={(e) => onFilterChange({ certificateType: e.target.value })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {certTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted-foreground">Date Range</label>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {dateRangeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Search */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted-foreground">Search</label>
        <Input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleFilter()}
          placeholder="Search name, email, ID..."
          className="h-10"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleFilter} className="flex-1">
          Filter
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
