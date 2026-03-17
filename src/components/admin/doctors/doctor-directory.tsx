"use client";

import { useState } from "react";
import { formatDate } from "date-fns";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { DoctorDetailsModal } from "@/components/admin/doctors/doctor-details-modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  RefreshCw,
  Download,
  MoreVertical,
  Eye,
  TrendingUp,
  Phone,
  Settings,
  MapPin,
  Star,
  Stethoscope,
  CheckCircle,
  ArrowDown,
} from "lucide-react";
import type { Doctor, PaginatedResponse, DoctorFiltersState } from "@/types";

interface DoctorDirectoryProps {
  data: PaginatedResponse<Doctor> | null;
  loading: boolean;
  filters: DoctorFiltersState;
  showAll: boolean;
  onShowAllChange: (showAll: boolean) => void;
  onFilterChange: (filters: Partial<DoctorFiltersState>) => void;
  onPageChange: (page: number) => void;
  onAction: (doctorId: string, action: "approve" | "reject" | "suspend") => void;
  onRefresh: () => void;
}

const statusOptions = [
  { value: "approved", label: "Active Doctors" },
  { value: "pending", label: "Pending Doctors" },
  { value: "all", label: "All Doctors" },
];

const sortOptions = [
  { value: "createdAt", label: "Registration Date" },
  { value: "fullName", label: "Name" },
  { value: "avgRating", label: "Rating" },
  { value: "consultationCount", label: "Consultations" },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-amber-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-cyan-500",
    "bg-rose-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function DoctorDirectory({
  data,
  loading,
  filters,
  showAll,
  onShowAllChange,
  onFilterChange,
  onPageChange,
  onAction,
  onRefresh,
}: DoctorDirectoryProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewProfile = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDetailsOpen(true);
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      {/* Directory Header */}
      <div className="p-6 pb-4">
        <h2 className="text-xl font-semibold text-slate-900">Doctors Directory</h2>
        <p className="text-sm text-slate-500">
          Manage and monitor all doctors in the platform
        </p>
      </div>

      {/* Filters Row */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-4">
          {/* Show All Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onShowAllChange(!showAll)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                showAll ? "bg-blue-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  showAll ? "translate-x-5" : ""
                }`}
              />
            </button>
            <span className="text-sm font-medium text-slate-700">Show All Doctors</span>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Sort Direction */}
          <button
            onClick={() =>
              onFilterChange({
                sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
              })
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >
            <ArrowDown
              className={`h-4 w-4 transition-transform ${
                filters.sortOrder === "asc" ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Refresh & Export */}
          <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-6">
          <PageLoader />
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={Stethoscope}
            title="No doctors found"
            description="Try adjusting your filters or search query."
          />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-t border-b bg-slate-50/50">
                  <th className="px-6 py-3 text-left font-medium text-slate-500">
                    Doctor Information
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">
                    Specialization
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">
                    Performance
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">
                    Earnings
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">
                    Last Consultation
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-b last:border-0 hover:bg-slate-50/50"
                  >
                    {/* Doctor Information */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-medium ${getAvatarColor(
                            doctor.fullName
                          )}`}
                        >
                          {getInitials(doctor.fullName)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {doctor.fullName}
                          </p>
                          <p className="text-blue-500 text-xs">
                            License: {doctor.registrationNumber}
                          </p>
                          <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                            <CheckCircle className="h-3 w-3" />
                            {doctor.experience} years experience
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Specialization */}
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">
                        {doctor.specialization}
                      </p>
                      <p className="text-xs text-slate-500">{doctor.qualification}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {doctor.hospitalAffiliation || "None"}
                      </p>
                    </td>

                    {/* Performance */}
                    <td className="px-4 py-4">
                      <span className="inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        Needs Attention
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        {doctor.completedCertificates} certificates completed
                      </p>
                      <p className="text-xs text-slate-400">
                        ~{doctor.avgCompletionTime || 24}h avg time
                      </p>
                    </td>

                    {/* Earnings */}
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">
                        ₹{(doctor.wallet?.totalEarnings || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">
                        Balance: ₹{(doctor.wallet?.balance || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400">
                        {doctor.consultationCount} consultations
                      </p>
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Star className="h-4 w-4" />
                        <span className="text-sm">
                          {doctor.totalRatings > 0
                            ? doctor.avgRating.toFixed(1)
                            : "No ratings"}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          doctor.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : doctor.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {doctor.status === "approved"
                          ? "Active"
                          : doctor.status.charAt(0).toUpperCase() +
                            doctor.status.slice(1)}
                      </span>
                    </td>

                    {/* Last Consultation */}
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">
                        {doctor.lastActive
                          ? formatDate(doctor.lastActive, "M/dd/yyyy")
                          : "N/A"}
                      </p>
                      <p className="text-xs text-slate-400">Last consultation</p>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => handleViewProfile(doctor)}
                            className="gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Performance
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Phone className="h-4 w-4" />
                            Contact
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Settings className="h-4 w-4" />
                            Manage
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex justify-center border-t p-4">
              <Pagination
                currentPage={data.page}
                totalPages={data.totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}

      {/* Doctor Details Modal */}
      <DoctorDetailsModal
        doctor={selectedDoctor}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}
