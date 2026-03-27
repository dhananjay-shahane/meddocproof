"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import type {
  Application,
  PaginatedResponse,
  ApplicationFiltersState,
  ApplicationTabCounts,
} from "@/types";

interface UseApplicationsOptions {
  tab: string;
  filters: ApplicationFiltersState;
  page: number;
  limit?: number;
}

interface UseApplicationsResult {
  data: PaginatedResponse<Application> | null;
  tabCounts: ApplicationTabCounts;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const defaultTabCounts: ApplicationTabCounts = {
  all: 0,
  temporary: 0,
  completed: 0,
};

export function useApplications({
  tab,
  filters,
  page,
  limit = 15,
}: UseApplicationsOptions): UseApplicationsResult {
  const [data, setData] = useState<PaginatedResponse<Application> | null>(null);
  const [tabCounts, setTabCounts] = useState<ApplicationTabCounts>(defaultTabCounts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevSearchRef = useRef(filters.search);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("tab", tab);
    if (filters.status && filters.status !== "all") params.set("status", filters.status);
    if (filters.certificateType && filters.certificateType !== "all")
      params.set("certificateType", filters.certificateType);
    if (filters.search) params.set("search", filters.search);
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    return params.toString();
  }, [tab, filters, page, limit]);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const queryString = buildParams();
      const res = await api.get(`/admin/applications?${queryString}`);
      setData(res.data.data);
      if (res.data.tabCounts) {
        setTabCounts(res.data.tabCounts);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load applications"));
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    const searchChanged = prevSearchRef.current !== filters.search;
    prevSearchRef.current = filters.search;

    if (searchChanged && filters.search) {
      // Debounce search input
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setLoading(true);
      debounceRef.current = setTimeout(() => {
        fetchData();
      }, 500);
    } else {
      setLoading(true);
      fetchData();
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchData, filters.search]);

  return { data, tabCounts, loading, error, refetch: fetchData };
}
