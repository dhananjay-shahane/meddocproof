"use client";

import { FileText, Users, Stethoscope, IndianRupee, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface TopLevelStatsProps {
  totalApplications: number;
  activeDoctors: number;
  totalRevenue: number;
  totalUsers: number;
  monthOverMonth: {
    applications: number;
    revenue: number;
    users: number;
    doctors: number;
  };
}

export function TopLevelStats({
  totalApplications,
  activeDoctors,
  totalRevenue,
  totalUsers,
  monthOverMonth,
}: TopLevelStatsProps) {
  const stats = [
    {
      label: "Total Applications",
      value: totalApplications.toLocaleString(),
      icon: FileText,
      change: monthOverMonth.applications,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Doctors",
      value: activeDoctors.toLocaleString(),
      icon: Stethoscope,
      change: monthOverMonth.doctors,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: IndianRupee,
      change: monthOverMonth.revenue,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      change: monthOverMonth.users,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;
        const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

        return (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">{stat.value}</p>
              <div className="mt-1 flex items-center gap-1">
                <ChangeIcon
                  className={`h-3 w-3 ${isPositive ? "text-green-600" : "text-red-600"}`}
                />
                <span
                  className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
                >
                  {isPositive ? "+" : ""}
                  {stat.change}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
