"use client";

import { formatCurrency } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Star, Award } from "lucide-react";
import type { TopDoctorItem } from "@/types";

interface TopDoctorsEarningsProps {
  doctors: TopDoctorItem[];
}

export function TopDoctorsEarnings({ doctors }: TopDoctorsEarningsProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-lg bg-purple-50 p-2">
          <Award className="h-4 w-4 text-purple-600" />
        </div>
        <h3 className="font-semibold">Top Doctors</h3>
      </div>
      {doctors.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">No doctor data yet</p>
      ) : (
        <div className="space-y-3">
          {doctors.map((doctor, index) => (
            <div
              key={doctor.id}
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                {index + 1}
              </span>
              <Avatar
                fallback={getInitials(doctor.fullName)}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{doctor.fullName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {doctor.specialization}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {formatCurrency(doctor.totalEarnings)}
                </p>
                <div className="flex items-center justify-end gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">
                    {doctor.avgRating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
