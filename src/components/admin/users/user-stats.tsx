"use client";

import { Users, FileText, IndianRupee, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { UserStats as UserStatsType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface UserStatsProps {
  stats: UserStatsType | null;
  loading?: boolean;
}

export function UserStats({ stats, loading }: UserStatsProps) {
  if (loading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      sub: `${stats.paidUsers} paid • ${stats.unpaidUsers} unpaid`,
      icon: Users,
    },
    {
      label: "Total Applications",
      value: stats.totalApplications.toLocaleString(),
      sub: `${stats.totalCertificates || 0} certificates issued`,
      icon: FileText,
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      sub: `${formatCurrency(stats.avgRevenuePerUser)} avg per user`,
      icon: IndianRupee,
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate.toFixed(0)}%`,
      sub: "App to certificate ratio",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            <card.icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">{card.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
