"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import type { TransactionsPageData, TransactionFilters } from "@/types";

interface UseAdminTransactionsResult {
  data: TransactionsPageData | null;
  loading: boolean;
  error: string | null;
  filters: TransactionFilters;
  setFilters: (filters: TransactionFilters) => void;
  refetch: () => Promise<void>;
}

export function useAdminTransactions(): UseAdminTransactionsResult {
  const [data, setData] = useState<TransactionsPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 20,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filters.type) params.set("type", filters.type);
      if (filters.status) params.set("status", filters.status);
      if (filters.dateRange) params.set("dateRange", filters.dateRange);
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);
      if (filters.search) params.set("search", filters.search);
      if (filters.page) params.set("page", filters.page.toString());
      if (filters.limit) params.set("limit", filters.limit.toString());

      const res = await api.get(`/admin/transactions?${params.toString()}`);
      setData(res.data.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, filters, setFilters, refetch: fetchData };
}
