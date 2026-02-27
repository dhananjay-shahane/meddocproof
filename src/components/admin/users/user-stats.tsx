"use client";

import { Card } from "@/components/ui/card";
import { Users, CreditCard, IndianRupee, TrendingUp } from "lucide-react";
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
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      sub: `${stats.paidUsers} paid · ${stats.unpaidUsers} unpaid`,
      icon: Users,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      label: "Total Applications",
      value: stats.totalApplications.toLocaleString(),
      sub: `${(stats.totalApplications / Math.max(stats.totalUsers, 1)).toFixed(1)} per user`,
      icon: CreditCard,
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      sub: `${formatCurrency(stats.avgRevenuePerUser)} avg / user`,
      icon: IndianRupee,
      color: "text-green-500 bg-green-500/10",
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate.toFixed(1)}%`,
      sub: "Free → Paid users",
      icon: TrendingUp,
      color: "text-orange-500 bg-orange-500/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
