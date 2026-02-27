"use client";

import { useEffect, useState, useCallback } from "react";
import { useDashboard } from "@/hooks/use-dashboard";
import { TopLevelStats } from "@/components/admin/dashboard/top-level-stats";
import { EarningsTicker } from "@/components/admin/dashboard/earnings-ticker";
import { CertificateDistribution } from "@/components/admin/dashboard/certificate-distribution";
import { LatestApplicationsTable } from "@/components/admin/dashboard/latest-applications-table";
import { ActivityTimeline } from "@/components/admin/dashboard/activity-timeline";
import { NeedAttention } from "@/components/admin/dashboard/need-attention";
import { TopDoctorsEarnings } from "@/components/admin/dashboard/top-doctors-earnings";
import { FailedPayments } from "@/components/admin/dashboard/failed-payments";
import { AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import type { ActivityItem } from "@/types";

export default function AdminDashboardPage() {
  const { data, loading, error, refetch } = useDashboard();
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await api.get("/admin/activity?limit=10");
      setActivities(res.data.data || []);
    } catch {
      // silently fail — non-critical widget
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={refetch} className="gap-1.5">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  const defaultMoM = { applications: 0, revenue: 0, users: 0, doctors: 0 };
  const defaultEarnings = { today: 0, thisWeek: 0, thisMonth: 0 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your medical certificate platform.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={refetch} title="Refresh">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Top-level Stats */}
      <TopLevelStats
        totalApplications={data?.totalApplications ?? 0}
        activeDoctors={data?.activeDoctors ?? 0}
        totalRevenue={data?.totalRevenue ?? 0}
        totalUsers={data?.totalUsers ?? 0}
        monthOverMonth={data?.monthOverMonth ?? defaultMoM}
      />

      {/* Row 2: Earnings + Cert Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <EarningsTicker earnings={data?.earnings ?? defaultEarnings} />
        <CertificateDistribution data={data?.certificateDistribution ?? []} />
      </div>

      {/* Row 3: Latest Applications (full width) */}
      <LatestApplicationsTable applications={data?.recentApplications ?? []} />

      {/* Row 4: Activity + Need Attention */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityTimeline activities={activities} />
        <NeedAttention items={data?.needAttention ?? []} />
      </div>

      {/* Row 5: Top Doctors + Failed Payments */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopDoctorsEarnings doctors={data?.topDoctors ?? []} />
        <FailedPayments payments={data?.failedPayments ?? []} />
      </div>
    </div>
  );
}
