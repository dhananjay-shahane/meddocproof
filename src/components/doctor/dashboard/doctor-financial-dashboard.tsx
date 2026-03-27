"use client";

import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import {
  IndianRupee,
  Wallet,
  ArrowDownToLine,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface DoctorFinancialDashboardProps {
  data: {
    wallet: {
      totalEarnings: number;
      balance: number;
      totalWithdrawn: number;
      pendingWithdrawals: number;
    };
    earningsChart: Array<{ date: string; amount: number }>;
  };
}

export function DoctorFinancialDashboard({
  data,
}: DoctorFinancialDashboardProps) {
  const [trendType, setTrendType] = useState<"Daily" | "Weekly">("Daily");

  // Updated stat cards to match the screenshot content and order
  const statCards = [
    {
      label: "Total Earnings",
      value: formatCurrency(data.wallet.totalEarnings),
      icon: IndianRupee,
      color: "text-sky-600",
      bg: "bg-sky-100",
      borderColor: "border-l-sky-500",
      description: "Lifetime earnings from consultations",
    },
    {
      label: "Available Balance",
      value: formatCurrency(data.wallet.balance),
      icon: Wallet,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      borderColor: "border-l-emerald-500",
      description: "Ready for withdrawal!",
    },
    {
      label: "Total Withdrawn",
      value: formatCurrency(data.wallet.totalWithdrawn),
      icon: ArrowDownToLine,
      color: "text-violet-600",
      bg: "bg-violet-100",
      borderColor: "border-l-violet-500",
      description: "Successfully withdrawn",
    },
    {
      label: "Pending Withdrawals",
      value: formatCurrency(data.wallet.pendingWithdrawals),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
      borderColor: "border-l-amber-500",
      description:
        data.wallet.pendingWithdrawals === 0
          ? "0 pending requests"
          : `${Math.ceil(data.wallet.pendingWithdrawals / 1000)} pending requests`,
    },
  ];

  // Calculate financial summary data
  const withdrawn = data.wallet.totalWithdrawn;
  const pending = data.wallet.pendingWithdrawals;
  const available = data.wallet.balance;
  const totalEarnings = data.wallet.totalEarnings;

  const totalCertificates = data.earningsChart.length;
  const averageDaily =
    totalCertificates > 0
      ? data.earningsChart.reduce((acc, item) => acc + item.amount, 0) /
        totalCertificates
      : 0;
  const highest =
    data.earningsChart.reduce((acc, item) => Math.max(acc, item.amount), 0);

  return (
    <div className="space-y-6">
      {/* Stat Cards - Updated for screenshot content and spacing */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-lg border ${card.borderColor} border-l-4 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">
                    {card.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-amber-600">
                    {card.description}
                  </p>
                </div>
                <div className={`rounded-lg p-2 ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Summary + Chart Row - Updated for screenshot content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 shadow-sm lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-900">Financial Summary</h3>
          <p className="mt-1 text-sm text-slate-500">Your wallet calculation breakdown</p>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-blue-100 bg-white p-4">
              <p className="text-sm text-slate-500">Total Earnings</p>
              <p className="mt-2 text-3xl font-bold text-blue-700">{formatCurrency(totalEarnings)}</p>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
              <div>
                <p className="text-xs text-slate-500">Withdrawn + Pending</p>
                <p className="text-sm font-medium text-slate-700">({formatCurrency(withdrawn)} + {formatCurrency(pending)})</p>
              </div>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(withdrawn + pending)}</p>
            </div>

            <div className="rounded-xl border border-green-100 bg-green-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-green-700">Available Balance</p>
                <p className="text-xl font-bold text-green-700">{formatCurrency(available)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Daily Earnings Trend</h3>
              </div>
              <p className="mt-1 text-xs text-slate-500">Your daily earnings breakdown by certificate type (Last 30 days)</p>
            </div>
            <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
              {(["Daily", "Weekly"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTrendType(type)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    trendType === type
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {data.earningsChart.length > 0 ? (
            <div className="mt-4 h-70">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.earningsChart} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickFormatter={(value) => `₹${value}`} axisLine={{ stroke: "#e2e8f0" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 10 }}
                    formatter={(value: number | string | undefined) => [formatCurrency(Number(value ?? 0)), "Earnings"]}
                    labelFormatter={(date) => `Date: ${date}`}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 5 }} fill="url(#colorEarnings)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-6 flex h-48 items-center justify-center">
              <p className="text-sm text-slate-500">No earnings data yet. Start accepting consultations to see your earnings here.</p>
            </div>
          )}

          <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 text-center">
            <div>
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-sm font-semibold text-slate-800">{totalCertificates} certificates</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Avg. Daily</p>
              <p className="text-sm font-semibold text-slate-800">{formatCurrency(averageDaily)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Highest</p>
              <p className="text-sm font-semibold text-slate-800">{formatCurrency(highest)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
