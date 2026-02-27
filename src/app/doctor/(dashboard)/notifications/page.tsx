"use client";

import { useDoctorNotifications } from "@/hooks/use-doctor-notifications";
import { Bell, CheckCheck, Loader2, Inbox } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const TYPE_COLORS: Record<string, string> = {
  new_application: "bg-blue-500",
  application_update: "bg-amber-500",
  certificate_issued: "bg-green-500",
  payout: "bg-emerald-500",
  system: "bg-gray-500",
};

export default function DoctorNotificationsPage() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useDoctorNotifications();

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16">
          <Inbox className="h-12 w-12 text-muted-foreground/40" />
          <p className="mt-4 text-sm text-muted-foreground">
            No notifications yet
          </p>
        </div>
      ) : (
        <div className="divide-y rounded-xl border bg-card">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-4 p-4 transition-colors ${
                !n.isRead ? "bg-primary/5" : ""
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    TYPE_COLORS[n.type] || "bg-gray-500"
                  }`}
                >
                  <Bell className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm ${
                      !n.isRead ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {n.title}
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(n.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {n.message}
                </p>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="mt-1 shrink-0 text-xs text-primary hover:underline"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
