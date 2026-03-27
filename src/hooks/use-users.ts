"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import type {
  UserListItem,
  UserStats,
  UserFiltersState,
  PaginatedResponse,
} from "@/types";

interface UseUsersOptions {
  filters: UserFiltersState;
  page: number;
  limit?: number;
}

interface UseUsersResult {
  data: PaginatedResponse<UserListItem> | null;
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUsers({ filters, page, limit = 50 }: UseUsersOptions): UseUsersResult {
  const [data, setData] = useState<PaginatedResponse<UserListItem> | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevSearchRef = useRef(filters.search);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (filters.filter !== "all") params.set("filter", filters.filter);
    if (filters.search) params.set("search", filters.search);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    return params.toString();
  }, [filters, page, limit]);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const queryString = buildParams();
      const res = await api.get(`/admin/users?${queryString}`);
      setData(res.data.data);
      if (res.data.stats) setStats(res.data.stats);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load users"));
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    const searchChanged = prevSearchRef.current !== filters.search;
    prevSearchRef.current = filters.search;

    if (searchChanged && filters.search) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setLoading(true);
      debounceRef.current = setTimeout(() => fetchData(), 500);
    } else {
      setLoading(true);
      fetchData();
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchData, filters.search]);

  return { data, stats, loading, error, refetch: fetchData };
}
