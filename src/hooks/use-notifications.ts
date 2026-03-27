"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import type { NotificationListItem, NotificationFiltersState, PaginatedResponse } from "@/types";

interface UseNotificationsOptions {
  filters: NotificationFiltersState;
  page: number;
  limit?: number;
}

interface UseNotificationsResult {
  data: PaginatedResponse<NotificationListItem> | null;
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteNotification: (id: string) => Promise<boolean>;
}

export function useNotifications({ filters, page, limit = 20 }: UseNotificationsOptions): UseNotificationsResult {
  const [data, setData] = useState<PaginatedResponse<NotificationListItem> | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (filters.filter !== "all") params.set("filter", filters.filter);
    if (filters.type) params.set("type", filters.type);
    return params.toString();
  }, [filters, page, limit]);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const queryString = buildParams();
      const res = await api.get(`/admin/notifications?${queryString}`);
      setData(res.data.data);
      if (res.data.unreadCount !== undefined) setUnreadCount(res.data.unreadCount);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await api.put(`/admin/notifications/${id}`);
      await fetchData();
      return true;
    } catch {
      return false;
    }
  }, [fetchData]);

  const markAllAsRead = useCallback(async () => {
    try {
      // Use bulk API endpoint to mark all as read
      await api.put("/admin/notifications");
      await fetchData();
      return true;
    } catch {
      return false;
    }
  }, [fetchData]);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await api.delete(`/admin/notifications/${id}`);
      await fetchData();
      return true;
    } catch {
      return false;
    }
  }, [fetchData]);

  return { data, unreadCount, loading, error, refetch: fetchData, markAsRead, markAllAsRead, deleteNotification };
}
