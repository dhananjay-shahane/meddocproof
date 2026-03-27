"use client";

import Link from "next/link";
import { FileText, Users, Zap, TrendingUp, Clock, Star } from "lucide-react";
import type { DoctorDashboardStats } from "@/types";

interface DoctorQuickActionsProps {
  stats: DoctorDashboardStats;
}

export function DoctorQuickActions({ stats }: DoctorQuickActionsProps) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <div className="mt-4 space-y-2">
          <Link
            href="/doctor/applications"
            className="flex w-full items-center gap-3 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <FileText className="h-5 w-5" />
            Review Applications
          </Link>
          <Link
            href="/doctor/patients"
            className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Users className="h-5 w-5 text-muted-foreground" />
            View Patients
          </Link>
        </div>
      </div>

      {/* Your Performance */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold">Your Performance</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Last 30 days metrics</p>

        <div className="mt-5 space-y-4">
          {/* Completion Rate */}
          <div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Completion Rate</span>
              </div>
              <span className="font-semibold">{stats.completionRate}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(stats.completionRate, 100)}%` }}
              />
            </div>
          </div>

          {/* Response Rate */}
          <div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Response Rate</span>
              </div>
              <span className="font-semibold">{stats.responseRate}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${Math.min(stats.responseRate, 100)}%` }}
              />
            </div>
          </div>

          {/* Average Rating */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-muted-foreground">Average Rating</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">
                {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "N/A"}
              </span>
              {stats.avgRating > 0 && (
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= Math.round(stats.avgRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
