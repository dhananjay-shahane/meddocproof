"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

export interface AdminReview {
  id: string;
  title: string;
  message: string;
  rating: number;
  date: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReviewStats {
  total: number;
  approved: number;
  pending: number;
}

interface ReviewFilters {
  filter: "all" | "approved" | "pending";
  search: string;
}

interface UseAdminReviewsResult {
  reviews: AdminReview[];
  stats: ReviewStats | null;
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: ReviewFilters;
  setFilters: (partial: Partial<ReviewFilters>) => void;
  setPage: (page: number) => void;
  approveReview: (id: string) => Promise<boolean>;
  rejectReview: (id: string) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useAdminReviews(): UseAdminReviewsResult {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ReviewFilters>({
    filter: "all",
    search: "",
  });

  const setFilters = useCallback((partial: Partial<ReviewFilters>) => {
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

      const res = await api.get(`/admin/reviews?${params.toString()}`);
      if (res.data.success) {
        setReviews(res.data.data.items);
        setTotal(res.data.data.total);
        setTotalPages(res.data.data.totalPages);
        if (res.data.stats) setStats(res.data.stats);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load reviews"));
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const approveReview = useCallback(
    async (id: string) => {
      try {
        await api.put("/admin/reviews", { id, approved: true });
        await fetchData();
        return true;
      } catch {
        return false;
      }
    },
    [fetchData]
  );

  const rejectReview = useCallback(
    async (id: string) => {
      try {
        await api.put("/admin/reviews", { id, approved: false });
        await fetchData();
        return true;
      } catch {
        return false;
      }
    },
    [fetchData]
  );

  const deleteReview = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/admin/reviews?id=${id}`);
        await fetchData();
        return true;
      } catch {
        return false;
      }
    },
    [fetchData]
  );

  return {
    reviews,
    stats,
    total,
    page,
    totalPages,
    loading,
    error,
    filters,
    setFilters,
    setPage,
    approveReview,
    rejectReview,
    deleteReview,
    refetch: fetchData,
  };
}
