"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { getInitials } from "@/lib/utils";
import {
  BarChart3,
  Clock,
  Award,
  Star,
  Users,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { DoctorPerformanceData } from "@/types";

interface PerformanceOverviewProps {
  data: DoctorPerformanceData | null;
  loading: boolean;
}

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function PerformanceOverview({ data, loading }: PerformanceOverviewProps) {
  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <Skeleton className="h-64" />
          </Card>
          <Card className="p-5">
            <Skeleton className="h-64" />
          </Card>
        </div>
      </div>
    );
  }

  const overviewCards = [
    {
      label: "Total Doctors",
      value: data.overview.totalDoctors,
      icon: Users,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      label: "Avg Response Rate",
      value: `${data.overview.avgResponseRate.toFixed(1)}%`,
      icon: BarChart3,
      color: "text-green-500 bg-green-500/10",
    },
    {
      label: "Avg Completion Time",
      value: `${data.overview.avgCompletionTime.toFixed(1)}h`,
      icon: Clock,
      color: "text-orange-500 bg-orange-500/10",
    },
    {
      label: "Certificates Issued",
      value: data.overview.totalCertificatesIssued,
      icon: Award,
      color: "text-purple-500 bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card) => (
          <Card key={card.label} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <div className={`rounded-lg p-2 ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold">{card.value}</p>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trend */}
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Monthly Certificates Trend</h3>
          {data.monthlyTrend.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="No data yet"
              description="Monthly trends will appear once certificates are issued."
              className="min-h-[200px] border-0"
            />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12 }} />
                <YAxis className="text-xs" tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                  }}
                />
                <Bar
                  dataKey="certificates"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Certificates by Type */}
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Certificates by Type</h3>
          {data.certificatesByType.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No data yet"
              description="Certificate distribution will appear here."
              className="min-h-[200px] border-0"
            />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.certificatesByType}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name || ""} (${((percent || 0) * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {data.certificatesByType.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Rating Distribution & Top Performers */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Rating Distribution */}
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Rating Distribution</h3>
          <div className="space-y-3">
            {data.ratingDistribution.map((item) => {
              const total = data.ratingDistribution.reduce(
                (sum, r) => sum + r.count,
                0
              );
              const pct = total > 0 ? (item.count / total) * 100 : 0;
              return (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="flex w-12 items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{item.stars}</span>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-10 text-right text-sm text-muted-foreground">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top Performers */}
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Top Performers</h3>
          {data.topPerformers.length === 0 ? (
            <EmptyState
              icon={Star}
              title="No data yet"
              description="Top performers will appear here."
              className="min-h-[200px] border-0"
            />
          ) : (
            <div className="space-y-2">
              {data.topPerformers.map((doc, index) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                    {index + 1}
                  </span>
                  <Avatar fallback={getInitials(doc.fullName)} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{doc.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.completedCertificates} certs · {doc.avgRating.toFixed(1)} ★
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {doc.totalEarnings ? `₹${doc.totalEarnings.toLocaleString()}` : "₹0"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
