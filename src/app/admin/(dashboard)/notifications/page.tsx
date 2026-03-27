"use client";

import { useState, useCallback } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationList } from "@/components/admin/notifications/notification-list";
import { toast } from "sonner";
import type { NotificationFiltersState } from "@/types";

const defaultFilters: NotificationFiltersState = {
  filter: "all",
  type: "",
};

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<NotificationFiltersState>(defaultFilters);

  const { data, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications({
    filters,
    page,
  });

  const handleFilterChange = useCallback((partial: Partial<NotificationFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1);
  }, []);

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      const success = await markAsRead(id);
      if (success) toast.success("Marked as read");
    },
    [markAsRead]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    const success = await markAllAsRead();
    if (success) toast.success("All notifications marked as read");
  }, [markAllAsRead]);

  const handleDelete = useCallback(
    async (id: string) => {
      const success = await deleteNotification(id);
      if (success) toast.success("Notification deleted");
    },
    [deleteNotification]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground">
          View and manage system notifications.
        </p>
      </div>

      <NotificationList
        data={data}
        loading={loading}
        filters={filters}
        onFilterChange={handleFilterChange}
        onPageChange={setPage}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDelete}
        unreadCount={unreadCount}
      />
    </div>
  );
}
