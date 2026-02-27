"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";
import type {
  CertificateListItem,
  CertificateStats,
  CertificateFiltersState,
  PaginatedResponse,
} from "@/types";

interface UseCertificatesOptions {
  filters: CertificateFiltersState;
  page: number;
  limit?: number;
}

interface UseCertificatesResult {
  data: PaginatedResponse<CertificateListItem> | null;
  stats: CertificateStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCertificates({ filters, page, limit = 20 }: UseCertificatesOptions): UseCertificatesResult {
  const [data, setData] = useState<PaginatedResponse<CertificateListItem> | null>(null);
  const [stats, setStats] = useState<CertificateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevSearchRef = useRef(filters.search);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (filters.tab !== "all") params.set("tab", filters.tab);
    if (filters.search) params.set("search", filters.search);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    return params.toString();
  }, [filters, page, limit]);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const queryString = buildParams();
      const res = await api.get(`/admin/certificates?${queryString}`);
      setData(res.data.data);
      if (res.data.stats) setStats(res.data.stats);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to load certificates");
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
