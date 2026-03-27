"use client";

import {
  FileText,
  Clock,
  CheckCircle,
  Users,
  IndianRupee,
  Wallet,
  Timer,
  ArrowUpRight,
  BadgeCheck,
  DollarSign,
  FileCheck,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { DoctorDashboardStats } from "@/types";
import { format } from "date-fns";

interface DoctorStatsCardsProps {
  stats: DoctorDashboardStats;
}

export function DoctorStatsCards({ stats }: DoctorStatsCardsProps) {
  const currentDate = format(new Date(), "EEEE, dd MMMM yyyy • h:mm a");

  return (
    <div className="space-y-6">
      {/* Welcome Header Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-xl">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/20"></div>
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10"></div>
        </div>

        <div className="relative z-10">
          {/* Header with welcome and verified badge */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Welcome back, {stats.doctorName}!
              </h1>
              <p className="mt-1 text-blue-100">
                {stats.qualification} • {stats.experience} years experience
              </p>
            </div>
            {stats.isVerified && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-emerald-100 backdrop-blur-sm">
                <BadgeCheck className="h-4 w-4" />
                Verified Doctor
              </span>
            )}
          </div>

          {/* Financial Stats Cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Earnings */}
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <IndianRupee className="h-5 w-5 text-blue-200" />
                <span className="rounded-full bg-blue-500/30 px-2 py-0.5 text-xs font-medium text-blue-100">
                  Total
                </span>
              </div>
              <p className="mt-2 text-xs text-blue-200">Total Earnings</p>
              <p className="mt-1 text-xl font-bold">
                {formatCurrency(stats.totalEarnings)}
              </p>
            </div>

            {/* Wallet Balance */}
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <Wallet className="h-5 w-5 text-blue-200" />
                <span className="rounded-full bg-emerald-500/30 px-2 py-0.5 text-xs font-medium text-emerald-200">
                  Available
                </span>
              </div>
              <p className="mt-2 text-xs text-blue-200">Wallet Balance</p>
              <p className="mt-1 text-xl font-bold">
                {formatCurrency(stats.walletBalance)}
              </p>
            </div>

            {/* Pending Amount */}
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <Clock className="h-5 w-5 text-blue-200" />
                <span className="rounded-full bg-amber-500/30 px-2 py-0.5 text-xs font-medium text-amber-200">
                  Pending
                </span>
              </div>
              <p className="mt-2 text-xs text-blue-200">Pending Amount</p>
              <p className="mt-1 text-xl font-bold text-amber-300">
                {formatCurrency(stats.pendingAmount)}
              </p>
            </div>

            {/* Pending Withdrawals */}
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <ArrowUpRight className="h-5 w-5 text-blue-200" />
                <span className="rounded-full bg-purple-500/30 px-2 py-0.5 text-xs font-medium text-purple-200">
                  Processing
                </span>
              </div>
              <p className="mt-2 text-xs text-blue-200">Pending Withdrawals</p>
              <p className="mt-1 text-xl font-bold text-purple-300">
                {formatCurrency(stats.pendingWithdrawals)}
              </p>
            </div>
          </div>

          {/* Fee Structure Section */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {/* Online Consultation Fee */}
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
              <DollarSign className="h-5 w-5 text-blue-200" />
              <div>
                <p className="text-xs text-blue-200">Online Consultation Fee</p>
                <p className="text-lg font-bold">
                  {formatCurrency(stats.consultationFee)}
                </p>
              </div>
            </div>

            {/* Certificate Fee Structure */}
            <div className="rounded-xl bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-blue-200" />
                <p className="text-xs text-blue-200">Certificate Fee Structure</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-blue-200">Digital:</span>
                  <span className="font-semibold">
                    {formatCurrency(stats.certificateFeeStructure.digital)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-blue-200">Handwritten:</span>
                  <span className="font-semibold">
                    {formatCurrency(stats.certificateFeeStructure.handwritten)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-blue-200">Form 1A:</span>
                  <span className="font-semibold">
                    {formatCurrency(stats.certificateFeeStructure.form1A)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Date/Time */}
          <div className="mt-4 text-sm text-blue-200">{currentDate}</div>
        </div>
      </div>

      {/* Application Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Applications */}
        <div className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Applications
              </p>
              <p className="mt-1 text-3xl font-bold">
                {stats.assignedApplications}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <span className="text-blue-500">✦</span> All time
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Pending Review */}
        <div className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending Review
              </p>
              <p className="mt-1 text-3xl font-bold">{stats.pendingReview}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                <Timer className="h-3 w-3" /> Needs attention
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-900/20">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        {/* Completed Today */}
        <div className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed Today
              </p>
              <p className="mt-1 text-3xl font-bold">{stats.completedToday}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                <CheckCircle className="h-3 w-3" /> Great progress!
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-900/20">
              <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Total Patients */}
        <div className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Patients
              </p>
              <p className="mt-1 text-3xl font-bold">{stats.totalPatients}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-purple-600">
                <Users className="h-3 w-3" /> Unique patients
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-3 dark:bg-purple-900/20">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
