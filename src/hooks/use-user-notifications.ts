"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

interface UseUserNotificationsResult {
  notifications: UserNotification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useUserNotifications(): UseUserNotificationsResult {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get("/user/notifications?limit=10");
      if (res.data.success) {
        setNotifications(res.data.data.items);
        setUnreadCount(res.data.unreadCount ?? 0);
      }
    } catch {
      // Silently fail for notifications
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Poll every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await api.put("/user/notifications", { notificationId: id });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Silently fail
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.put("/user/notifications", { markAll: true });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Silently fail
    }
  }, []);

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead, refetch: fetchData };
}
