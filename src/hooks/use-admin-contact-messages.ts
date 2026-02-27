"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export interface AdminContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface ContactMessageFilters {
  filter: "all" | "unread" | "read";
  search: string;
}

interface UseAdminContactMessagesResult {
  messages: AdminContactMessage[];
  unreadCount: number;
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: ContactMessageFilters;
  setFilters: (partial: Partial<ContactMessageFilters>) => void;
  setPage: (page: number) => void;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useAdminContactMessages(): UseAdminContactMessagesResult {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ContactMessageFilters>({
    filter: "all",
    search: "",
  });

  const setFilters = useCallback((partial: Partial<ContactMessageFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }));
    setPage(1);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      if (filters.filter !== "all") params.set("filter", filters.filter);
      if (filters.search) params.set("search", filters.search);

      const res = await api.get(`/admin/contact-messages?${params.toString()}`);
      if (res.data.success) {
        setMessages(res.data.data.items);
        setTotal(res.data.data.total);
        setTotalPages(res.data.data.totalPages);
        if (res.data.unreadCount !== undefined) setUnreadCount(res.data.unreadCount);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        await api.put("/admin/contact-messages", { id });
        await fetchData();
        return true;
      } catch {
        return false;
      }
    },
    [fetchData]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await api.put("/admin/contact-messages", { markAll: true });
      await fetchData();
      return true;
    } catch {
      return false;
    }
  }, [fetchData]);

  const deleteMessage = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/admin/contact-messages?id=${id}`);
        await fetchData();
        return true;
      } catch {
        return false;
      }
    },
    [fetchData]
  );

  return {
    messages,
    unreadCount,
    total,
    page,
    totalPages,
    loading,
    error,
    filters,
    setFilters,
    setPage,
    markAsRead,
    markAllAsRead,
    deleteMessage,
    refetch: fetchData,
  };
}
