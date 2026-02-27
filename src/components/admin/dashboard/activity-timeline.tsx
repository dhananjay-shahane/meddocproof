"use client";

import { formatRelativeDate } from "@/lib/utils";
import { MessageSquare, CreditCard, ArrowRightLeft, UserPlus } from "lucide-react";
import type { ActivityItem } from "@/types";

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

const iconMap: Record<string, typeof MessageSquare> = {
  remark: MessageSquare,
  payment: CreditCard,
  status_change: ArrowRightLeft,
  assignment: UserPlus,
  registration: UserPlus,
};

const colorMap: Record<string, string> = {
  remark: "bg-blue-100 text-blue-600",
  payment: "bg-green-100 text-green-600",
  status_change: "bg-purple-100 text-purple-600",
  assignment: "bg-orange-100 text-orange-600",
  registration: "bg-teal-100 text-teal-600",
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="mb-4 font-semibold">Recent Activity</h3>
      {activities.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">No recent activity</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = iconMap[activity.type] || ArrowRightLeft;
            const color = colorMap[activity.type] || "bg-gray-100 text-gray-600";

            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-lg p-1.5 ${color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">{activity.message}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatRelativeDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
