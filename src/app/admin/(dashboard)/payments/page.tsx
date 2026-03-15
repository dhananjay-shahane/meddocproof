"use client";

import { useState } from "react";
import { useAdminPayments } from "@/hooks/use-admin-payments";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/loading-spinner";
import { formatDate } from "date-fns";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  RefreshCw,
  FileText,
  BarChart3,
  Calendar,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import type { PaymentOverviewData, PaymentWithRelations } from "@/types";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

type TimePeriod = "today" | "current_month" | "previous_month";

export default function PaymentsPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("today");
  const { data, loading, refetch } = useAdminPayments();

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  const stats = data?.stats;
  const recentPayments = data?.recentPayments || [];

  // Calculate derived stats
  const totalRevenue = stats?.totalRevenue || 0;
  const doctorPayouts = stats?.totalDoctorPayouts || 0;
  const platformProfit = totalRevenue - doctorPayouts;
  const profitMargin = totalRevenue > 0 ? (platformProfit / totalRevenue) * 100 : 0;
  const avgPerDoctor = doctorPayouts > 0 ? doctorPayouts / (stats?.completedPayments || 1) : 0;

  // Group transactions by certificate type for the chart
  const certificateTypeStats = recentPayments.reduce(
    (acc, payment) => {
      const type = payment.application?.certificateType || "other";
      if (!acc[type]) {
        acc[type] = { count: 0, revenue: 0 };
      }
      acc[type].count += 1;
      acc[type].revenue += payment.amount;
      return acc;
    },
    {} as Record<string, { count: number; revenue: number }>
  );

  const topCertTypes = Object.entries(certificateTypeStats)
    .map(([type, data]) => ({
      type: type.replace(/_/g, " "),
      count: data.count,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const maxRevenue = Math.max(...topCertTypes.map((t) => t.revenue), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Payment Management</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Revenue</p>
            <DollarSign className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalRevenue)}
          </p>
          <div className="mt-1 flex items-center gap-1">
            {(stats?.revenueGrowth || 0) >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            )}
            <span
              className={`text-xs font-medium ${
                (stats?.revenueGrowth || 0) >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {Math.abs(stats?.revenueGrowth || 0).toFixed(1)}% from last month
            </span>
          </div>
        </div>

        {/* Platform Profit */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Platform Profit</p>
            <TrendingUp className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {formatCurrency(platformProfit)}
          </p>
          <div className="mt-1 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-xs font-medium text-blue-600">
              {profitMargin.toFixed(1)}% from last month
            </span>
          </div>
        </div>

        {/* Doctor Payouts */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Doctor Payouts</p>
            <Users className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(doctorPayouts)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            to {stats?.completedPayments || 0} active doctors
          </p>
        </div>

        {/* Pending Withdrawals */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Pending Withdrawals</p>
            <Clock className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-red-500">
            {formatCurrency(stats?.pendingWithdrawals || 0)}
          </p>
          <p className="mt-1 text-xs text-slate-400">keep zero approval</p>
        </div>
      </div>

      {/* Time Period Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTimePeriod("today")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            timePeriod === "today"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setTimePeriod("current_month")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            timePeriod === "current_month"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Current Month
        </button>
        <button
          onClick={() => setTimePeriod("previous_month")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            timePeriod === "previous_month"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Previous Month
        </button>
      </div>

      {/* Today's Performance Card */}
      <div className="rounded-xl border-l-4 border-l-blue-500 border bg-card p-5 shadow-sm max-w-md">
        <h3 className="text-blue-600 font-medium mb-3">Today&apos;s Performance</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Transactions</span>
            <span className="font-medium">{stats?.totalTransactions || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Revenue</span>
            <span className="font-medium text-blue-600">
              {formatCurrency(stats?.todayRevenue || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Profit</span>
            <span className="font-medium text-blue-600">
              {formatCurrency((stats?.todayRevenue || 0) * (profitMargin / 100))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Doctor Fees</span>
            <span className="font-medium">
              {formatCurrency((stats?.todayRevenue || 0) * (1 - profitMargin / 100))}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* View Transactions */}
        <Link href="/admin/payments/transactions">
          <div className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">View Transactions</p>
              <Calendar className="h-5 w-5 text-slate-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {stats?.totalTransactions || 0}
            </p>
            <p className="mt-1 text-xs text-slate-400">this month</p>
          </div>
        </Link>

        {/* Manage Withdrawals */}
        <Link href="/admin/payments/withdrawals">
          <div className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Manage Withdrawals</p>
              <MessageSquare className="h-5 w-5 text-slate-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formatCurrency(0)}
            </p>
            <p className="mt-1 text-xs text-slate-400">Pending approval</p>
          </div>
        </Link>

        {/* Doctor Payouts */}
        <Link href="/admin/payments/doctor-payouts">
          <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Doctor Payouts</p>
              <Users className="h-5 w-5 text-slate-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {stats?.completedPayments || 0}
            </p>
            <p className="mt-1 text-xs text-slate-400">Active doctors</p>
          </div>
        </Link>

        {/* View Analytics */}
        <Link href="/admin/payments/analytics">
          <div className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">View Analytics</p>
              <BarChart3 className="h-5 w-5 text-slate-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {profitMargin.toFixed(2)}%
            </p>
            <p className="mt-1 text-xs text-slate-400">Profit margin</p>
          </div>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="p-6 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>
          <p className="text-sm text-slate-500">Latest payment activities</p>
        </div>

        <div className="px-6 pb-4 space-y-3">
          {recentPayments.slice(0, 5).map((payment) => (
            <TransactionRow key={payment.id} payment={payment} />
          ))}

          {recentPayments.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              No transactions found
            </div>
          )}
        </div>

        {recentPayments.length > 0 && (
          <div className="border-t p-4 text-center">
            <Link
              href="/admin/payments/transactions"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Transactions
            </Link>
          </div>
        )}
      </div>

      {/* Top Certificate Types */}
      {topCertTypes.length > 0 && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Top Certificate Types
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Best performing certificate categories
          </p>

          <div className="space-y-4">
            {topCertTypes.map((cert) => (
              <div key={cert.type}>
                <div className="flex justify-between mb-1">
                  <div>
                    <p className="font-medium text-slate-900 capitalize">
                      {cert.type}
                    </p>
                    <p className="text-xs text-slate-400">
                      {cert.count} certificates
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">
                      {formatCurrency(cert.revenue)}
                    </p>
                    <p className="text-xs text-green-500">
                      +₹{((cert.revenue * profitMargin) / 100).toFixed(0)} profit
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${(cert.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TransactionRow({ payment }: { payment: PaymentWithRelations }) {
  const certificateType = payment.application?.certificateType || "unknown";
  const typeLabel = certificateType.replace(/_/g, " ");
  const profit = payment.amount * 0.5; // Approximate profit

  const getBadgeColor = (type: string) => {
    if (type.includes("sick")) return "bg-amber-100 text-amber-700";
    if (type.includes("fitness")) return "bg-green-100 text-green-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center ${getBadgeColor(
            certificateType
          )}`}
        >
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${getBadgeColor(
                certificateType
              )}`}
            >
              {typeLabel}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {formatDate(payment.createdAt, "M/dd/yyyy")} - App #{payment.applicationId?.slice(-8)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-slate-900">
          {formatCurrency(payment.amount)}
        </p>
        <p className="text-xs text-green-500">+₹{profit.toFixed(0)} profit</p>
      </div>
    </div>
  );
}
