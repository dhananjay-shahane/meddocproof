"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import type {
  Coupon,
  CouponStats,
  CouponFiltersState,
  PaginatedResponse,
} from "@/types";

interface UseCouponsOptions {
  filters: CouponFiltersState;
  page: number;
  limit?: number;
}

interface UseCouponsResult {
  data: PaginatedResponse<Coupon> | null;
  stats: CouponStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createCoupon: (data: Record<string, unknown>) => Promise<boolean>;
  updateCoupon: (id: string, data: Record<string, unknown>) => Promise<boolean>;
  deleteCoupon: (id: string) => Promise<boolean>;
}

export function useCoupons({ filters, page, limit = 20 }: UseCouponsOptions): UseCouponsResult {
  const [data, setData] = useState<PaginatedResponse<Coupon> | null>(null);
  const [stats, setStats] = useState<CouponStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevSearchRef = useRef(filters.search);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (filters.filter !== "all") params.set("filter", filters.filter);
    if (filters.type && filters.type !== "all") params.set("type", filters.type);
    if (filters.search) params.set("search", filters.search);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    return params.toString();
  }, [filters, page, limit]);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const queryString = buildParams();
      const res = await api.get(`/admin/coupons?${queryString}`);
      setData(res.data.data);
      if (res.data.stats) setStats(res.data.stats);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load coupons"));
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

  const createCoupon = useCallback(async (formData: Record<string, unknown>) => {
    try {
      await api.post("/admin/coupons", formData);
      await fetchData();
      return true;
    } catch {
      return false;
    }
  }, [fetchData]);

  const updateCoupon = useCallback(async (id: string, updateData: Record<string, unknown>) => {
    try {
      await api.put(`/admin/coupons/${id}`, updateData);
      await fetchData();
      return true;
    } catch {
      return false;
    }
  }, [fetchData]);

  const deleteCoupon = useCallback(async (id: string) => {
    try {
      await api.delete(`/admin/coupons/${id}`);
      await fetchData();
      return true;
    } catch {
      return false;
    }
  }, [fetchData]);

  return { data, stats, loading, error, refetch: fetchData, createCoupon, updateCoupon, deleteCoupon };
}
