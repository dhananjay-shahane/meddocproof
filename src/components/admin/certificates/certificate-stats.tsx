"use client";

import { Card } from "@/components/ui/card";
import { FileText, CheckCircle, Clock } from "lucide-react";
import type { CertificateStats as CertificateStatsType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface CertificateStatsProps {
  stats: CertificateStatsType | null;
  loading?: boolean;
}

export function CertificateStats({ stats, loading }: CertificateStatsProps) {
  if (loading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Certificates",
      value: stats.totalCertificates.toLocaleString(),
      sub: "All applications",
      icon: FileText,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      label: "Completed",
      value: stats.completedCertificates.toLocaleString(),
      sub: "Successfully issued",
      icon: CheckCircle,
      color: "text-green-500 bg-green-500/10",
    },
    {
      label: "Pending",
      value: stats.pendingCertificates.toLocaleString(),
      sub: "Awaiting processing",
      icon: Clock,
      color: "text-orange-500 bg-orange-500/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label} className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            <div className={`rounded-lg p-2 ${card.color}`}>
              <card.icon className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold">{card.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
        </Card>
      ))}
    </div>
  );
}
