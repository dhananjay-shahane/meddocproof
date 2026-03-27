"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import type {
  DoctorApplicationListItem,
  DoctorApplicationFiltersState,
  DoctorApplicationStats,
} from "@/types";

interface DoctorApplicationsData {
  items: DoctorApplicationListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: DoctorApplicationStats;
}

interface UseDoctorApplicationsResult {
  data: DoctorApplicationsData | null;
  loading: boolean;
  error: string | null;
  filters: DoctorApplicationFiltersState;
  setFilters: (filters: Partial<DoctorApplicationFiltersState>) => void;
  page: number;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
}

export function useDoctorApplications(): UseDoctorApplicationsResult {
  const [data, setData] = useState<DoctorApplicationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFiltersState] =
    useState<DoctorApplicationFiltersState>({
      search: "",
      status: "",
      certificateType: "",
      tab: "pending",
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
        tab: filters.tab,
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
      const message = getErrorMessage(err, "Failed to load applications");
      const status = typeof err === "object" && err !== null ? (err as { response?: { status?: number } }).response?.status : undefined;
      
      if (status === 401) {
        setError("Session expired. Please login again.");
      } else if (status === 403) {
        setError(message || "Access denied. Your account may not be approved.");
      } else {
        setError(message);
      }
      console.error("Doctor applications fetch error:", status, message);
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
