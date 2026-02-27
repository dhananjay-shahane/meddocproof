"use client";

import { useState } from "react";
import { useDoctorFinancials } from "@/hooks/use-doctor-financials";
import { formatCurrency } from "@/lib/utils";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Wallet,
  IndianRupee,
  ArrowDownToLine,
  TrendingUp,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const withdrawalStatusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function DoctorFinancialsPage() {
  const { data, loading, error, refetch, requestWithdrawal, withdrawing } =
    useDoctorFinancials();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) return;
    const success = await requestWithdrawal(amount);
    if (success) {
      setShowWithdrawModal(false);
      setWithdrawAmount("");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium text-red-600">
          {error || "Failed to load financials"}
        </p>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  const walletCards = [
    {
      label: "Total Earnings",
      value: formatCurrency(data.wallet.totalEarnings),
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Available Balance",
      value: formatCurrency(data.wallet.balance),
      icon: Wallet,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Withdrawn",
      value: formatCurrency(data.wallet.totalWithdrawn),
      icon: ArrowDownToLine,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Pending Withdrawals",
      value: formatCurrency(data.wallet.pendingWithdrawals),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financials</h2>
          <p className="text-muted-foreground">
            Track your earnings and withdrawals.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={data.wallet.balance <= 0}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Request Withdrawal
          </button>
        </div>
      </div>

      {/* Wallet stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {walletCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </p>
                <div className={`rounded-lg p-2 ${card.bg}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Earnings chart */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Earnings Trend</h3>
        </div>
        {data.earningsChart.length > 0 ? (
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.earningsChart}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  formatter={((value?: number) => [formatCurrency(value ?? 0), "Earnings"]) as never}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary) / 0.1)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No earnings data yet
          </p>
        )}
      </div>

      {/* Recent withdrawals */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Withdrawal History</h3>
        {data.recentWithdrawals.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No withdrawal requests yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Requested</th>
                  <th className="pb-3 font-medium">Processed</th>
                </tr>
              </thead>
              <tbody>
                {data.recentWithdrawals.map((w) => (
                  <tr key={w.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">
                      {formatCurrency(w.amount)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          withdrawalStatusColors[w.status] ??
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {format(new Date(w.requestedAt), "dd MMM yyyy")}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {w.processedAt
                        ? format(new Date(w.processedAt), "dd MMM yyyy")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent transactions */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Recent Transactions</h3>
        {data.recentTransactions.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No transactions yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentTransactions.map((t) => (
                  <tr key={t.id} className="border-b last:border-0">
                    <td className="py-3">
                      <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">
                        {t.type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 font-medium">
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {t.description ?? "—"}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {format(new Date(t.createdAt), "dd MMM yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Request Withdrawal</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Available balance: {formatCurrency(data.wallet.balance)}
            </p>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium">
                Amount (₹)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                max={data.wallet.balance}
                min={1}
                placeholder="Enter amount"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount("");
                }}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={
                  withdrawing ||
                  !withdrawAmount ||
                  parseFloat(withdrawAmount) <= 0 ||
                  parseFloat(withdrawAmount) > data.wallet.balance
                }
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {withdrawing && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
