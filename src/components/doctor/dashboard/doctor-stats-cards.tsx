"use client";

import {
  FileText,
  Clock,
  CheckCircle,
  Wallet,
  Star,
  IndianRupee,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { DoctorDashboardStats } from "@/types";

interface DoctorStatsCardsProps {
  stats: DoctorDashboardStats;
}

export function DoctorStatsCards({ stats }: DoctorStatsCardsProps) {
  const cards = [
    {
      label: "Assigned Applications",
      value: stats.assignedApplications.toLocaleString(),
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pending Review",
      value: stats.pendingReview.toLocaleString(),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Completed",
      value: stats.completedApplications.toLocaleString(),
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Wallet Balance",
      value: formatCurrency(stats.walletBalance),
      icon: Wallet,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Total Earnings",
      value: formatCurrency(stats.totalEarnings),
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Average Rating",
      value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "N/A",
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {card.label}
              </p>
              <div className={`rounded-lg p-2 ${card.bg}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
