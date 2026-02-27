"use client";

import { useDoctorPerformance } from "@/hooks/use-doctor-performance";
import { PerformanceOverview } from "@/components/admin/doctors/performance-overview";

export default function DoctorPerformancePage() {
  const { data, loading } = useDoctorPerformance();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Doctor Performance</h2>
        <p className="text-muted-foreground">
          Track doctor performance metrics and ratings.
        </p>
      </div>

      <PerformanceOverview data={data} loading={loading} />
    </div>
  );
}
