"use client";

import { useState, useEffect } from "react";
import { useAdminTransactions } from "@/hooks/use-admin-transactions";
import {
  Search,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileText,
  TrendingUp,
  RotateCcw,
  ShoppingCart,
  Download,
  Eye,
  ChevronDown,
  CreditCard,
  ArrowUpDown,
} from "lucide-react";
import { format } from "date-fns";
import type { TransactionFilters } from "@/types";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

const transactionTypes = [
  { value: "", label: "All Types" },
  { value: "payment", label: "Payment" },
  { value: "refund", label: "Refund" },
  { value: "doctor_payout", label: "Doctor Payout" },
  { value: "withdrawal", label: "Withdrawal" },
  { value: "adjustment", label: "Adjustment" },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

export default function TransactionsPage() {
  const { data, loading, error, filters, setFilters, refetch } = useAdminTransactions();
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Sync local filter inputs to hook after short debounce
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters({
        ...filters,
        search: searchInput || undefined,
        status: statusFilter || undefined,
        type: (typeFilter as TransactionFilters["type"]) || undefined,
        page: 1,
      });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, statusFilter, typeFilter]);

  const handleClearFilters = () => {
    setSearchInput("");
    setStatusFilter("");
    setTypeFilter("");
    setFilters({ page: 1 });
  };

  const totalTransactions = data?.total ?? 0;
  const totalAmount = data?.stats.totalAmount ?? 0;
  const paymentCount = data?.stats.paymentCount ?? 0;
  const refundCount = data?.stats.refundCount ?? 0;
  const payoutCount = data?.stats.payoutCount ?? 0;
  const withdrawalCount = data?.stats.withdrawalCount ?? 0;
  const avgPerPayment = paymentCount > 0 ? totalAmount / paymentCount : 0;
  const totalPages = Math.ceil(totalTransactions / (filters.limit ?? 20));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500">
            Medical certificate app transactions from Razorpay API (current month)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Top Stats Cards - Row 1 */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Total Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-600">
              Total Transactions
            </span>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? <span className="animate-pulse">—</span> : totalTransactions}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            All transactions in selected period
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-100">
              Total Revenue
            </span>
            <span className="text-blue-200">₹</span>
          </div>
          <p className="text-3xl font-bold">
            {loading ? <span className="opacity-60">—</span> : formatCurrency(totalAmount)}
          </p>
          <p className="text-xs text-blue-200 mt-1">
            From {paymentCount} payment{paymentCount !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Net Revenue */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-600">Payments</span>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {loading ? <span className="animate-pulse">—</span> : paymentCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Completed payments
          </p>
        </div>

        {/* Refunds */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-600">Refunds</span>
            <RotateCcw className="h-5 w-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? <span className="animate-pulse">—</span> : refundCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">Refunded transactions</p>
        </div>
      </div>

      {/* Stats Cards - Row 2 */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        {/* Payouts */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Payouts</span>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {loading ? <span className="animate-pulse">—</span> : payoutCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">Doctor payouts</p>
        </div>

        {/* Withdrawals */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Withdrawals</span>
            <RotateCcw className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {loading ? <span className="animate-pulse">—</span> : withdrawalCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">Wallet withdrawals</p>
        </div>

        {/* Average per payment */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Avg. Payment</span>
            <ShoppingCart className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {loading ? <span className="animate-pulse">—</span> : formatCurrency(avgPerPayment)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Per payment transaction</p>
        </div>

        {/* Current page info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Page</span>
            <ArrowUpDown className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-700">
            {loading ? <span className="animate-pulse">—</span> : `${data?.page ?? 1} / ${totalPages || 1}`}
          </p>
          <p className="text-xs text-gray-500 mt-1">Current page of results</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <button
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Transaction ID, description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1.5">
              Transaction Type
            </label>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {transactionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Date Range
            </label>
            <div className="relative">
              <select
                onChange={(e) =>
                  setFilters({ ...filters, dateRange: e.target.value || undefined, page: 1 })
                }
                className="w-full h-11 px-4 pr-10 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Transaction History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Customer / Doctor</th>
                <th className="px-6 py-4">Type & Description</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500 mx-auto" />
                  </td>
                </tr>
              )}
              {!loading && (data?.transactions ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
              {!loading &&
                (data?.transactions ?? []).map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {format(new Date(t.createdAt), "dd/MM/yy, HH:mm")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400 shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {t.userName || t.doctorName || "—"}
                          </p>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                            {t.userId ? "user" : t.doctorId ? "doctor" : "system"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {t.type.replace(/_/g, " ")}
                        </p>
                        {t.description && (
                          <p className="text-xs text-gray-500 max-w-48 truncate">
                            {t.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          t.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : t.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                          <Eye className="h-4 w-4" />
                        </button>
                        {t.type === "payment" && t.status === "completed" && (
                          <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50">
                            <RotateCcw className="h-3 w-3" />
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-500">
            {loading
              ? "Loading..."
              : `Showing ${Math.min((filters.page ?? 1 - 1) * (filters.limit ?? 20) + 1, totalTransactions)}–${Math.min((filters.page ?? 1) * (filters.limit ?? 20), totalTransactions)} of ${totalTransactions} transactions`}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={(filters.page ?? 1) <= 1 || loading}
              onClick={() => setFilters({ ...filters, page: (filters.page ?? 1) - 1 })}
              className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const currentPage = filters.page ?? 1;
              const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
              const page = start + i;
              if (page > totalPages) return null;
              return (
                <button
                  key={page}
                  onClick={() => setFilters({ ...filters, page })}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    page === currentPage
                      ? "font-medium text-white bg-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              disabled={(filters.page ?? 1) >= totalPages || loading}
              onClick={() => setFilters({ ...filters, page: (filters.page ?? 1) + 1 })}
              className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
