"use client";

import { Card } from "@/components/ui/card";
import { Ticket, CheckCircle, XCircle, BarChart3 } from "lucide-react";
import type { CouponStats as CouponStatsType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface CouponStatsProps {
  stats: CouponStatsType | null;
  loading?: boolean;
}

export function CouponStats({ stats, loading }: CouponStatsProps) {
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
      label: "Total Coupons",
      value: stats.totalCoupons.toLocaleString(),
      sub: "All created coupons",
      icon: Ticket,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      label: "Active Coupons",
      value: stats.activeCoupons.toLocaleString(),
      sub: "Currently valid",
      icon: CheckCircle,
      color: "text-green-500 bg-green-500/10",
    },
    {
      label: "Expired Coupons",
      value: stats.expiredCoupons.toLocaleString(),
      sub: "No longer valid",
      icon: XCircle,
      color: "text-red-500 bg-red-500/10",
    },
    {
      label: "Total Usage",
      value: stats.totalUsage.toLocaleString(),
      sub: "Times redeemed",
      icon: BarChart3,
      color: "text-purple-500 bg-purple-500/10",
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
