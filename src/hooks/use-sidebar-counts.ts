"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export interface SidebarCounts {
  applications: {
    all: number;
    temporary: number;
    completed: number;
  };
  certificates: {
    all: number;
    incomplete: number;
    completed: number;
  };
  doctors: {
    all: number;
    newRegistrations: number;
    approved: number;
  };
  payments: {
    pendingWithdrawals: number;
    pendingPayouts: number;
  };
}

const defaultCounts: SidebarCounts = {
  applications: { all: 0, temporary: 0, completed: 0 },
  certificates: { all: 0, incomplete: 0, completed: 0 },
  doctors: { all: 0, newRegistrations: 0, approved: 0 },
  payments: { pendingWithdrawals: 0, pendingPayouts: 0 },
};

const POLL_INTERVAL = 30000; // 30 seconds

export function useSidebarCounts() {
  const [counts, setCounts] = useState<SidebarCounts>(defaultCounts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = useCallback(async () => {
    try {
      const response = await api.get("/admin/sidebar-counts");
      if (response.data.success) {
        setCounts(response.data.data);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch sidebar counts:", err);
      setError("Failed to fetch counts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchCounts();

    // Set up polling
    const interval = setInterval(fetchCounts, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchCounts]);

  return { counts, loading, error, refetch: fetchCounts };
}
