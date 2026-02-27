"use client";

import { Card } from "@/components/ui/card";
import { Stethoscope, UserCheck, Clock, IndianRupee, Star, Award } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { DoctorsSummary } from "@/types";

interface DoctorStatsProps {
  summary: DoctorsSummary | null;
  loading?: boolean;
}

export function DoctorStats({ summary, loading }: DoctorStatsProps) {
  if (loading || !summary) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="mb-2 h-4 w-20" />
            <Skeleton className="h-7 w-12" />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Doctors",
      value: summary.totalDoctors,
      icon: Stethoscope,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      label: "Active",
      value: summary.activeDoctors,
      icon: UserCheck,
      color: "text-green-500 bg-green-500/10",
    },
    {
      label: "Pending",
      value: summary.pendingApprovals,
      icon: Clock,
      color: "text-yellow-500 bg-yellow-500/10",
    },
    {
      label: "Total Earnings",
      value: formatCurrency(summary.totalEarnings),
      icon: IndianRupee,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      label: "Avg Rating",
      value: summary.avgRating.toFixed(1),
      icon: Star,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      label: "Certificates",
      value: summary.totalCertificatesIssued,
      icon: Award,
      color: "text-purple-500 bg-purple-500/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.label} className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
            <div className={`rounded-lg p-1.5 ${card.color}`}>
              <card.icon className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="mt-1.5 text-xl font-bold">{card.value}</p>
        </Card>
      ))}
    </div>
  );
}
