"use client";

import { useState, useCallback } from "react";
import { useDoctorsOverview } from "@/hooks/use-doctors-overview";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { PageLoader } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "date-fns";
import {
  ChevronLeft,
  Download,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  Trophy,
  ChevronRight,
  MessageSquare,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import type { DoctorFiltersState, Doctor } from "@/types";

const defaultFilters: DoctorFiltersState = {
  search: "",
  status: "approved",
  sortBy: "consultationCount",
  sortOrder: "desc",
};

const timeFilters = [
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "last_3_months", label: "Last 3 Months" },
  { value: "this_year", label: "This Year" },
  { value: "all_time", label: "All Time" },
];

export default function DoctorPerformancePage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<DoctorFiltersState>(defaultFilters);
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [timePeriod, setTimePeriod] = useState("this_month");

  const { data, summary, loading } = useDoctorsOverview({ filters, page });

  // Calculate stats from data
  const totalDoctors = summary?.activeDoctors || 0;
  const totalEarnings = summary?.totalEarnings || 0;
  const totalConsultations = data?.items?.reduce((sum, d) => sum + d.consultationCount, 0) || 0;
  const avgPerConsultation = totalConsultations > 0 ? totalEarnings / totalConsultations : 0;

  // Sort doctors by earnings for ranking
  const rankedDoctors = [...(data?.items || [])].sort(
    (a, b) => (b.wallet?.totalEarnings || 0) - (a.wallet?.totalEarnings || 0)
  );

  // Top 3 performers
  const topPerformers = rankedDoctors.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/doctors">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Doctors Performance Overview
            </h1>
            <p className="text-muted-foreground">
              Comprehensive performance analytics and insights
            </p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Performance Filters */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Performance Filters</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-slate-500 mb-1.5 block">Doctor</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            >
              <option value="all">All Doctors</option>
              {data?.items?.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.fullName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-500 mb-1.5 block">Time Period</label>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            >
              {timeFilters.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Doctors */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Doctors</p>
            <Users className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{totalDoctors}</p>
          <p className="mt-1 text-sm text-slate-400">Active doctors</p>
        </div>

        {/* Total Earnings */}
        <div className="rounded-xl border border-green-200 bg-green-50/30 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Earnings</p>
            <DollarSign className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            ₹{totalEarnings.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            ₹{totalDoctors > 0 ? Math.round(totalEarnings / totalDoctors).toLocaleString() : 0} per doctor
          </p>
        </div>

        {/* Total Consultations */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Consultations</p>
            <TrendingUp className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{totalConsultations}</p>
          <p className="mt-1 text-sm text-slate-400">
            {totalDoctors > 0 ? (totalConsultations / totalDoctors).toFixed(1) : 0} per doctor
          </p>
        </div>

        {/* Avg Per Consultation */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Avg Per Consultation</p>
            <BarChart3 className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            ₹{Math.round(avgPerConsultation).toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-slate-400">Average earning</p>
        </div>
      </div>

      {/* Doctors Performance Ranking */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="p-6 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Doctors Performance Ranking
          </h2>
          <p className="text-sm text-slate-500">
            Performance metrics for all active doctors in the selected period. Click on any row to see detailed breakdown.
          </p>
        </div>

        {loading ? (
          <div className="p-6">
            <PageLoader />
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Stethoscope}
              title="No doctors found"
              description="No performance data available."
            />
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-b bg-slate-50/50">
                  <th className="px-6 py-3 text-left font-medium text-slate-500"></th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Rank</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Doctor</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Specialization</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">Total Earnings</th>
                  <th className="px-4 py-3 text-center font-medium text-slate-500">Consultations</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">Withdrawals</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">Balance</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {rankedDoctors.map((doctor, index) => (
                  <DoctorRankingRow
                    key={doctor.id}
                    doctor={doctor}
                    rank={index + 1}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex justify-center border-t p-4">
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Performers</h2>
          <div className="grid grid-cols-3 gap-6">
            {topPerformers.map((doctor, index) => (
              <div key={doctor.id} className="flex items-start gap-3">
                <Trophy
                  className={`h-5 w-5 ${
                    index === 0
                      ? "text-amber-500"
                      : index === 1
                      ? "text-slate-400"
                      : "text-amber-700"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{doctor.fullName}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                    <span className="text-slate-500">Earnings</span>
                    <span className="text-right font-medium">
                      ₹{(doctor.wallet?.totalEarnings || 0).toLocaleString()}
                    </span>
                    <span className="text-slate-500">Consultations</span>
                    <span className="text-right font-medium">
                      {doctor.consultationCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Doctor Ranking Row Component
function DoctorRankingRow({ doctor, rank }: { doctor: Doctor; rank: number }) {
  const [expanded, setExpanded] = useState(false);

  const getRankBadge = () => {
    if (rank === 1) return "bg-amber-100 text-amber-700";
    if (rank === 2) return "bg-slate-100 text-slate-600";
    if (rank === 3) return "bg-amber-50 text-amber-600";
    return "";
  };

  return (
    <>
      <tr
        className="border-b last:border-0 hover:bg-slate-50/50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-6 py-4">
          <ChevronRight
            className={`h-4 w-4 text-slate-400 transition-transform ${
              expanded ? "rotate-90" : ""
            }`}
          />
        </td>
        <td className="px-4 py-4">
          {rank <= 3 ? (
            <span
              className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-sm font-semibold ${getRankBadge()}`}
            >
              🏆 {rank}
            </span>
          ) : (
            <span className="text-slate-600">{rank}</span>
          )}
        </td>
        <td className="px-4 py-4">
          <span className="font-medium text-blue-600 hover:underline">
            {doctor.fullName}
          </span>
        </td>
        <td className="px-4 py-4 text-slate-600">{doctor.specialization}</td>
        <td className="px-4 py-4 text-right font-medium text-slate-900">
          ₹{(doctor.wallet?.totalEarnings || 0).toLocaleString()}
        </td>
        <td className="px-4 py-4 text-center">
          <span className="inline-flex items-center gap-1">
            {doctor.consultationCount}
            <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
          </span>
        </td>
        <td className="px-4 py-4 text-right">
          <span className="inline-flex items-center gap-1 text-red-500">
            ₹{(doctor.wallet?.totalWithdrawn || 0).toLocaleString()}
            <MessageSquare className="h-3.5 w-3.5" />
          </span>
        </td>
        <td className="px-4 py-4 text-right font-medium text-green-600">
          ₹{(doctor.wallet?.balance || 0).toLocaleString()}
        </td>
        <td className="px-4 py-4 text-right text-slate-600">
          {doctor.lastActive
            ? formatDate(doctor.lastActive, "M/dd/yyyy")
            : "N/A"}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-50">
          <td colSpan={9} className="px-6 py-4">
            <div className="grid grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-slate-500">Email</p>
                <p className="font-medium">{doctor.email}</p>
              </div>
              <div>
                <p className="text-slate-500">Phone</p>
                <p className="font-medium">{doctor.phoneNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-slate-500">Registration</p>
                <p className="font-medium">{doctor.registrationNumber}</p>
              </div>
              <div>
                <p className="text-slate-500">Certificates Completed</p>
                <p className="font-medium">{doctor.completedCertificates}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
