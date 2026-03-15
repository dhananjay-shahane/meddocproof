"use client";

import { Users, Clock, DollarSign, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { DoctorsSummary } from "@/types";

interface DoctorStatsProps {
  summary: DoctorsSummary | null;
  loading?: boolean;
}

export function DoctorStats({ summary, loading }: DoctorStatsProps) {
  if (loading || !summary) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="mt-1 h-3 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Doctors */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Total Doctors</p>
          <Users className="h-5 w-5 text-slate-400" />
        </div>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          {summary.totalDoctors}
        </p>
        <p className="mt-1 text-sm text-slate-400">
          {summary.activeDoctors} active
        </p>
      </div>

      {/* Pending Approvals */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Pending Approvals</p>
          <Clock className="h-5 w-5 text-slate-400" />
        </div>
        <p className="mt-2 text-3xl font-bold text-amber-500">
          {summary.pendingApprovals}
        </p>
        <p className="mt-1 text-sm text-slate-400">Awaiting review</p>
      </div>

      {/* Total Earnings */}
      <div className="rounded-xl border border-green-200 bg-green-50/30 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Total Earnings</p>
          <DollarSign className="h-5 w-5 text-slate-400" />
        </div>
        <p className="mt-2 text-3xl font-bold text-green-600">
          ₹{summary.totalEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="mt-1 text-sm text-slate-400">Paid to doctors</p>
      </div>

      {/* Avg Rating */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Avg Rating</p>
          <Star className="h-5 w-5 text-slate-400" />
        </div>
        <p className="mt-2 text-3xl font-bold text-amber-500">
          {summary.avgRating.toFixed(1)}
        </p>
        <p className="mt-1 text-sm text-slate-400">
          {summary.totalCertificatesIssued} certificates issued
        </p>
      </div>
    </div>
  );
}
