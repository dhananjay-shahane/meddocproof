"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import type { PaymentOverviewData, AdminWithdrawalData } from "@/types";

interface UseAdminPaymentsResult {
  data: PaymentOverviewData | null;
  withdrawals: AdminWithdrawalData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  processWithdrawal: (id: string, action: "approve" | "reject" | "complete") => Promise<void>;
  processing: boolean;
}

export function useAdminPayments(): UseAdminPaymentsResult {
  const [data, setData] = useState<PaymentOverviewData | null>(null);
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [paymentsRes, withdrawalsRes] = await Promise.all([
        api.get("/admin/payments"),
        api.get("/admin/payments/withdrawals"),
      ]);
      setData(paymentsRes.data.data);
      setWithdrawals(withdrawalsRes.data.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to load payments data");
    } finally {
      setLoading(false);
    }
  }, []);

  const processWithdrawal = useCallback(
    async (id: string, action: "approve" | "reject" | "complete") => {
      try {
        setProcessing(true);
        await api.post(`/admin/payments/withdrawals/${id}`, { action });
        await fetchData();
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        throw new Error(e.response?.data?.message || "Failed to process withdrawal");
      } finally {
        setProcessing(false);
      }
    },
    [fetchData]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, withdrawals, loading, error, refetch: fetchData, processWithdrawal, processing };
}
