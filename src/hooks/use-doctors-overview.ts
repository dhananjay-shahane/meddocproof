"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";
import type { Doctor, DoctorsSummary, DoctorFiltersState, PaginatedResponse } from "@/types";

interface UseDoctorsOverviewOptions {
  filters: DoctorFiltersState;
  page: number;
  limit?: number;
}

interface UseDoctorsOverviewResult {
  data: PaginatedResponse<Doctor> | null;
  summary: DoctorsSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDoctorsOverview({
  filters,
  page,
  limit = 20,
}: UseDoctorsOverviewOptions): UseDoctorsOverviewResult {
  const [data, setData] = useState<PaginatedResponse<Doctor> | null>(null);
  const [summary, setSummary] = useState<DoctorsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevSearchRef = useRef(filters.search);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (filters.status && filters.status !== "all") params.set("status", filters.status);
    if (filters.search) params.set("search", filters.search);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    return params.toString();
  }, [filters, page, limit]);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const queryString = buildParams();
      const res = await api.get(`/admin/doctors?${queryString}`);
      setData(res.data.data);
      if (res.data.summary) setSummary(res.data.summary);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to load doctors");
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

  return { data, summary, loading, error, refetch: fetchData };
}
