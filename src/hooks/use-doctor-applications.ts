"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import type {
  DoctorApplicationListItem,
  DoctorApplicationFiltersState,
  PaginatedResponse,
} from "@/types";

interface UseDoctorApplicationsResult {
  data: PaginatedResponse<DoctorApplicationListItem> | null;
  loading: boolean;
  error: string | null;
  filters: DoctorApplicationFiltersState;
  setFilters: (filters: Partial<DoctorApplicationFiltersState>) => void;
  page: number;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
}

export function useDoctorApplications(): UseDoctorApplicationsResult {
  const [data, setData] =
    useState<PaginatedResponse<DoctorApplicationListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFiltersState] =
    useState<DoctorApplicationFiltersState>({
      search: "",
      status: "",
      certificateType: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  const setFilters = useCallback(
    (partial: Partial<DoctorApplicationFiltersState>) => {
      setFiltersState((prev) => ({ ...prev, ...partial }));
      setPage(1);
    },
    []
  );

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.certificateType && {
          certificateType: filters.certificateType,
        }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      const res = await api.get(`/doctor/applications?${params}`);
      setData(res.data.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    filters,
    setFilters,
    page,
    setPage,
    refetch: fetchData,
  };
}
