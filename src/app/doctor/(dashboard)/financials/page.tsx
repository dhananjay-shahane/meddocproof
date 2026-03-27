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
  ChevronDown,
  FileText,
  CheckCircle2,
  Timer,
  BarChart3,
  AlertTriangle,
  Eye,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
  const [trendType, setTrendType] = useState<"Daily" | "Weekly">("Daily");
  const [dateRange, setDateRange] = useState("This Month");
  const [certTab, setCertTab] = useState<"types" | "breakdown">("types");
  const [activityTab, setActivityTab] = useState<"earnings" | "withdrawals">("earnings");

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
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-3 text-sm text-gray-500">Loading financials...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-lg font-medium text-gray-900">
          {error || "Failed to load financials"}
        </p>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  const totalCertificates = data?.earningsChart?.length ?? 0;
  const completedCerts = data?.recentTransactions?.filter(t => t.type === "CERTIFICATE_EARNING")?.length ?? 0;
  const inProgressCerts = 0;
  const totalEarningsAmount = data?.wallet?.totalEarnings ?? 0;
  const totalCertCount = data?.recentTransactions?.length ?? 0;

  const walletCards = [
    {
      label: "Total Earnings",
      value: data.wallet.totalEarnings,
      icon: IndianRupee,
      color: "text-sky-600",
      borderColor: "border-l-sky-500",
      bgColor: "bg-sky-50",
      description: "Lifetime earnings from consultations",
    },
    {
      label: "Available Balance",
      value: data.wallet.balance,
      icon: Wallet,
      color: "text-emerald-600",
      borderColor: "border-l-emerald-500",
      bgColor: "bg-emerald-50",
      description: "Ready for withdrawal",
    },
    {
      label: "Total Withdrawn",
      value: data.wallet.totalWithdrawn,
      icon: ArrowDownToLine,
      color: "text-violet-600",
      borderColor: "border-l-violet-500",
      bgColor: "bg-violet-50",
      description: "Successfully withdrawn",
    },
    {
      label: "Pending Withdrawals",
      value: data.wallet.pendingWithdrawals,
      icon: Clock,
      color: "text-orange-600",
      borderColor: "border-l-orange-500",
      bgColor: "bg-orange-50",
      description: `${data.wallet.pendingWithdrawals === 0 ? "0" : "1"} pending requests`,
    },
  ];

  // Certificate completion stats
  const certStats = [
    { label: "completed", value: completedCerts, color: "bg-blue-50 text-blue-700 border-blue-200" },
    { label: "in-progress", value: inProgressCerts, color: "bg-green-50 text-green-700 border-green-200" },
    { label: "total-count", value: totalCertCount, color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    { label: "total earnings", value: `₹${totalEarningsAmount.toLocaleString("en-IN")}`, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  ];

  // Chart data from API
  const chartData = data.earningsChart.length > 0 
    ? data.earningsChart.map(item => ({
        date: format(new Date(item.date), "MMM dd"),
        value: item.amount || 0,
      }))
    : [];

  // Weekly days data
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date().getDay();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-red-600">Financial Dashboard</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Comprehensive view of your earnings, wallet, and financial performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Wallet Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {walletCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-xl border-l-4 ${card.borderColor} bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">₹{card.value.toLocaleString("en-IN")}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{card.description}</p>
                </div>
                <div className={`rounded-lg p-2 ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Summary */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6">
        <h3 className="text-base font-semibold text-gray-900">Financial Summary</h3>
        <p className="mt-0.5 text-xs text-gray-500">Your wallet calculation breakdown</p>

        <div className="mt-6 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
          {/* Total Earnings */}
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-700">₹{data.wallet.totalEarnings.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-gray-500">Total Earnings</p>
          </div>

          {/* Minus Sign */}
          <div className="text-xl font-bold text-gray-400">−</div>

          {/* Withdrawn + Pending */}
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-600">Withdrawn + Pending</p>
            <p className="text-xs text-gray-400">(₹{data.wallet.totalWithdrawn.toLocaleString("en-IN")} + ₹{data.wallet.pendingWithdrawals.toLocaleString("en-IN")})</p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-blue-200/50" />

        {/* Available Balance */}
        <div className="text-center">
          <p className="text-xs text-gray-500">Available Balance</p>
          <p className="mt-1 text-3xl font-bold text-blue-700">₹{data.wallet.balance.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Daily Earnings Trend */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="text-base font-semibold text-gray-900">Daily Earnings Trend</h3>
              <p className="text-xs text-gray-500">Your daily earnings breakdown by certificate type (Last 30 days)</p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-1">
            {(["Daily", "Weekly"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTrendType(type)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  trendType === type
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Area */}
        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
          <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
            <span>Daily completion data (20 days)</span>
            <span>Total: 0 data combined</span>
          </div>

          {/* Legend */}
          <div className="mb-4 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-blue-500" />
              <span className="text-gray-600">Earnings</span>
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: "#9ca3af", fontSize: 10 }} 
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: "#9ca3af", fontSize: 10 }} 
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: "#fff", 
                      border: "1px solid #e5e7eb", 
                      borderRadius: 8,
                      fontSize: 12
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-52 items-center justify-center">
              <p className="text-sm text-gray-400">No earnings data yet</p>
            </div>
          )}

          {/* Stats below chart */}
          <div className="mt-4 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4 text-center">
            <div>
              <p className="text-xs text-gray-400">{totalCertCount}</p>
              <p className="text-sm font-medium text-gray-700">certificates</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">₹{totalCertCount > 0 ? Math.round(totalEarningsAmount / totalCertCount) : 0}</p>
              <p className="text-sm font-medium text-gray-700">Avg. Earnings</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">₹{totalEarningsAmount.toLocaleString("en-IN")}</p>
              <p className="text-sm font-medium text-gray-700">total Earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Completion Overview */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="text-base font-semibold text-gray-900">Certificate Completion Overview</h3>
            <p className="text-xs text-gray-500">Detailed view of your completion and pending certificates</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {certStats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl border px-4 py-3 text-center ${stat.color}`}
            >
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="mt-0.5 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-5 flex items-center gap-1 border-b border-gray-200">
          <button
            onClick={() => setCertTab("types")}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-all ${
              certTab === "types"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Certificate types
          </button>
          <button
            onClick={() => setCertTab("breakdown")}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-all ${
              certTab === "breakdown"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Breakdown by Type
          </button>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Certificate</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Count</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Earnings</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-gray-700">certificateConsult</span>
                  </div>
                  <span className="ml-6 text-xs text-gray-400">3 × Completed</span>
                </td>
                <td className="px-4 py-3 text-center text-gray-600">3</td>
                <td className="px-4 py-3 text-center font-medium text-gray-900">0</td>
                <td className="px-4 py-3 text-center">
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">₹600</span>
                  <span className="ml-1 text-xs text-gray-400">earnings</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Weekly View */}
        <div className="mt-5">
          <p className="text-xs text-gray-400">weekly view</p>
          <p className="mt-1 text-sm font-medium text-gray-700">Certificate Completion Trend</p>
          
          <div className="mt-3 grid grid-cols-7 gap-2">
            {weekDays.map((day, idx) => {
              const dayCount = data?.earningsChart?.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate.getDay() === idx;
              }).length ?? 0;
              return (
                <div
                  key={day}
                  className={`flex flex-col items-center rounded-xl border p-3 ${
                    idx === today
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <FileText className={`h-5 w-5 ${idx === today ? "text-blue-500" : "text-gray-400"}`} />
                  <p className={`mt-1 text-xs font-medium ${idx === today ? "text-blue-600" : "text-gray-500"}`}>{day}</p>
                  <p className={`text-lg font-bold ${idx === today ? "text-blue-700" : "text-gray-300"}`}>
                    {dayCount > 0 ? `+${dayCount}` : "0"}
                  </p>
                  <p className="text-[10px] text-gray-400">{idx === today ? "today" : ""}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Wallet Management */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Wallet Management</h3>
        <p className="mt-0.5 text-xs text-gray-500">Manage your earnings and withdrawals</p>

        {/* Bank Details Warning */}
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-800">Bank Details Not Configured</p>
            <p className="mt-0.5 text-xs text-amber-600">
              Bank details are required for withdrawals. Please ensure it when if you&apos;ve already provided them during registration.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={data.wallet.balance <= 0}
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            Request Withdrawal
          </button>
          <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50">
            <Eye className="h-4 w-4" />
            View Earnings
          </button>
          <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Download Summary
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-100 px-6 pt-4">
          <button
            onClick={() => setActivityTab("earnings")}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-all ${
              activityTab === "earnings"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Earnings
          </button>
          <button
            onClick={() => setActivityTab("withdrawals")}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-all ${
              activityTab === "withdrawals"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Withdrawals
          </button>
        </div>

        <div className="p-6">
          {activityTab === "earnings" ? (
            <div>
              <h4 className="text-base font-semibold text-blue-600">Recent Earnings</h4>
              <p className="mt-0.5 text-xs text-gray-500">Your latest consultation earnings</p>
              
              {data.recentTransactions.length === 0 ? (
                <div className="mt-8 flex flex-col items-center justify-center py-8">
                  <IndianRupee className="h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-400">No earnings yet</p>
                </div>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-3 text-left text-xs font-medium text-gray-500">Type</th>
                        <th className="pb-3 text-left text-xs font-medium text-gray-500">Amount</th>
                        <th className="pb-3 text-left text-xs font-medium text-gray-500">Description</th>
                        <th className="pb-3 text-left text-xs font-medium text-gray-500">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentTransactions.map((t) => (
                        <tr key={t.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-3">
                            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                              {t.type.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="py-3 font-medium text-gray-900">
                            {formatCurrency(t.amount)}
                          </td>
                          <td className="py-3 text-gray-500">
                            {t.description ?? "—"}
                          </td>
                          <td className="py-3 text-gray-400">
                            {format(new Date(t.createdAt), "dd MMM yyyy")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h4 className="text-base font-semibold text-blue-600">Withdrawal History</h4>
              <p className="mt-0.5 text-xs text-gray-500">Your recent withdrawal requests</p>
              
              {data.recentWithdrawals.length === 0 ? (
                <div className="mt-8 flex flex-col items-center justify-center py-8">
                  <ArrowDownToLine className="h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-400">No withdrawal requests yet</p>
                </div>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-3 text-left text-xs font-medium text-gray-500">Amount</th>
                        <th className="pb-3 text-left text-xs font-medium text-gray-500">Status</th>
                        <th className="pb-3 text-left text-xs font-medium text-gray-500">Requested</th>
                        <th className="pb-3 text-left text-xs font-medium text-gray-500">Processed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentWithdrawals.map((w) => (
                        <tr key={w.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-3 font-medium text-gray-900">
                            {formatCurrency(w.amount)}
                          </td>
                          <td className="py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                withdrawalStatusColors[w.status] ??
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {w.status}
                            </span>
                          </td>
                          <td className="py-3 text-gray-400">
                            {format(new Date(w.requestedAt), "dd MMM yyyy")}
                          </td>
                          <td className="py-3 text-gray-400">
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
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Request Withdrawal</h3>
            <p className="mt-1 text-sm text-gray-500">
              Available balance: <span className="font-medium text-blue-600">{formatCurrency(data.wallet.balance)}</span>
            </p>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Amount (₹)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                max={data.wallet.balance}
                min={1}
                placeholder="Enter amount"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount("");
                }}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
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
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50"
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
