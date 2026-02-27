"use client";

import { formatRelativeDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import {
  Bell,
  CheckCheck,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import type { NotificationListItem, NotificationFiltersState, PaginatedResponse } from "@/types";

interface NotificationListProps {
  data: PaginatedResponse<NotificationListItem> | null;
  loading: boolean;
  filters: NotificationFiltersState;
  onFilterChange: (filters: Partial<NotificationFiltersState>) => void;
  onPageChange: (page: number) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  unreadCount: number;
}

const filterOptions = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

const typeIcons: Record<string, typeof Bell> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  message: MessageSquare,
};

const typeBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  info: "secondary",
  success: "default",
  warning: "outline",
  error: "destructive",
  message: "secondary",
};

export function NotificationList({
  data,
  loading,
  filters,
  onFilterChange,
  onPageChange,
  onMarkAsRead,
  onMarkAllAsRead,
  unreadCount,
}: NotificationListProps) {
  if (loading) return <PageLoader />;

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-lg border bg-muted/50 p-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                onFilterChange({ filter: opt.value as NotificationFiltersState["filter"] })
              }
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filters.filter === opt.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
              {opt.value === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={onMarkAllAsRead} className="gap-1.5">
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notification items */}
      {!data || data.items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up!"
        />
      ) : (
        <div className="space-y-2">
          {data.items.map((notification) => {
            const Icon = typeIcons[notification.type] || Bell;
            return (
              <Card
                key={notification.id}
                className={`p-4 transition-colors ${
                  !notification.isRead
                    ? "border-l-4 border-l-primary bg-primary/5"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 rounded-lg p-2 ${
                      !notification.isRead
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={`text-sm ${
                            !notification.isRead ? "font-semibold" : "font-medium"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant={typeBadgeVariant[notification.type] || "secondary"}>
                          {notification.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatRelativeDate(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-7 text-xs"
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
