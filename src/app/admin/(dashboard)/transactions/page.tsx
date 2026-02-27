"use client";

import { useState } from "react";
import { useAdminTransactions } from "@/hooks/use-admin-transactions";
import {
  ArrowUpDown,
  Search,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import type { TransactionFilters } from "@/types";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

const typeColors: Record<string, string> = {
  payment: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  refund: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  doctor_payout: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  withdrawal: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  adjustment: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const typeLabels: Record<string, string> = {
  payment: "Payment",
  refund: "Refund",
  doctor_payout: "Doctor Payout",
  withdrawal: "Withdrawal",
  adjustment: "Adjustment",
};

const dateRangeOptions = [
  { value: "", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
];

export default function TransactionsPage() {
  const { data, loading, error, filters, setFilters, refetch } = useAdminTransactions();
  const [searchInput, setSearchInput] = useState("");

  const updateFilter = (key: keyof TransactionFilters, value: string) => {
    setFilters({ ...filters, [key]: value || undefined, page: 1 });
  };

  const handleSearch = () => {
    setFilters({ ...filters, search: searchInput || undefined, page: 1 });
  };

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  if (loading && !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <p className="text-destructive">{error}</p>
        <button
          onClick={refetch}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">
            View all financial transactions across the platform.
          </p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Summary Stats */}
      {data?.stats && (
        <div className="grid gap-3 sm:grid-cols-5">
          <div className="rounded-lg border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Total Volume</p>
            <p className="mt-1 text-lg font-bold">{formatCurrency(data.stats.totalAmount)}</p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Payments</p>
            <p className="mt-1 text-lg font-bold text-green-600">{data.stats.paymentCount}</p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Refunds</p>
            <p className="mt-1 text-lg font-bold text-red-600">{data.stats.refundCount}</p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Payouts</p>
            <p className="mt-1 text-lg font-bold text-blue-600">{data.stats.payoutCount}</p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Withdrawals</p>
            <p className="mt-1 text-lg font-bold text-purple-600">{data.stats.withdrawalCount}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          value={filters.type || ""}
          onChange={(e) => updateFilter("type", e.target.value)}
          className="rounded-lg border bg-background px-3 py-1.5 text-sm"
        >
          <option value="">All Types</option>
          {Object.entries(typeLabels).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select
          value={filters.status || ""}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="rounded-lg border bg-background px-3 py-1.5 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={filters.dateRange || ""}
          onChange={(e) => updateFilter("dateRange", e.target.value)}
          className="rounded-lg border bg-background px-3 py-1.5 text-sm"
        >
          {dateRangeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="rounded-lg border bg-background pl-8 pr-3 py-1.5 text-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
          >
            Search
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3">
                  <div className="flex items-center gap-1">
                    Type <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">User / Doctor</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.transactions.map((t) => (
                <tr key={t.id} className="hover:bg-muted/30">
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        typeColors[t.type] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {typeLabels[t.type] || t.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-medium">
                    <span
                      className={
                        t.type === "refund" || t.type === "withdrawal"
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      {t.type === "refund" || t.type === "withdrawal" ? "-" : "+"}
                      {formatCurrency(t.amount)}
                    </span>
                  </td>
                  <td className="max-w-[200px] truncate px-6 py-3 text-muted-foreground">
                    {t.description || "—"}
                  </td>
                  <td className="px-6 py-3">
                    {t.userName && (
                      <p className="text-sm">{t.userName}</p>
                    )}
                    {t.doctorName && (
                      <p className="text-xs text-muted-foreground">Dr. {t.doctorName}</p>
                    )}
                    {!t.userName && !t.doctorName && (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        t.status === "completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : t.status === "failed"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">
                    {format(new Date(t.createdAt), "dd MMM yyyy, HH:mm")}
                  </td>
                </tr>
              ))}
              {(!data?.transactions || data.transactions.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.total > data.limit && (
          <div className="flex items-center justify-between border-t px-6 py-3">
            <p className="text-sm text-muted-foreground">
              Showing {(data.page - 1) * data.limit + 1}–{Math.min(data.page * data.limit, data.total)} of{" "}
              {data.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                disabled={data.page <= 1}
                className="rounded border p-1.5 hover:bg-muted disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm">
                Page {data.page} of {totalPages}
              </span>
              <button
                onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                disabled={data.page >= totalPages}
                className="rounded border p-1.5 hover:bg-muted disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
