"use client";

import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useDoctorDashboard } from "@/hooks/use-doctor-dashboard";
import { DoctorStatsCards } from "@/components/doctor/dashboard/doctor-stats-cards";
import { DoctorRecentApplications } from "@/components/doctor/dashboard/doctor-recent-applications";
import { DoctorQuickActions } from "@/components/doctor/dashboard/doctor-quick-actions";

export default function DoctorDashboardPage() {
  const { data, loading, error, refetch } = useDoctorDashboard();

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium text-red-600">{error}</p>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Doctor Dashboard
          </h2>
          <p className="text-muted-foreground">
            Overview of your assigned applications and earnings.
          </p>
        </div>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <DoctorStatsCards stats={data} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DoctorRecentApplications applications={data.recentApplications} />
        </div>
        <div>
          <DoctorQuickActions recentApplications={data.recentApplications} />
        </div>
      </div>
    </div>
  );
}
