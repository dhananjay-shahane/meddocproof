"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

// Mock analytics data
const mockStats = {
  grossRevenue: 32065,
  transactionCount: 45,
  platformProfit: 12500,
  profitRate: "% effective rate",
  doctorPayouts: 18000,
  doctorCount: 12,
  gatewayFees: 756.5,
  gatewayRate: 2.36,
};

// Daily trend data for the chart
const dailyTrendData = [
  { date: "2026-03-01", revenue: 1500, profit: 650 },
  { date: "2026-03-02", revenue: 2200, profit: 950 },
  { date: "2026-03-03", revenue: 2800, profit: 1200 },
  { date: "2026-03-04", revenue: 3200, profit: 1380 },
  { date: "2026-03-05", revenue: 3500, profit: 1500 },
  { date: "2026-03-06", revenue: 2100, profit: 900 },
  { date: "2026-03-07", revenue: 1800, profit: 780 },
  { date: "2026-03-08", revenue: 2500, profit: 1080 },
  { date: "2026-03-09", revenue: 4200, profit: 1800 },
  { date: "2026-03-10", revenue: 5100, profit: 2200 },
  { date: "2026-03-11", revenue: 3800, profit: 1640 },
  { date: "2026-03-12", revenue: 3200, profit: 1380 },
  { date: "2026-03-13", revenue: 2900, profit: 1250 },
  { date: "2026-03-14", revenue: 3400, profit: 1470 },
  { date: "2026-03-15", revenue: 2800, profit: 1200 },
];

// Certificate revenue breakdown
const certificateRevenue = [
  { type: "sick-leave", label: "Sick Leave", revenue: 22866, transactions: 34, margin: 42.8 },
  { type: "fitness", label: "Fitness", revenue: 5085, transactions: 11, margin: 44.0 },
];

// Gateway breakdown
const gatewayBreakdown = {
  gatewayFeePercent: 2,
  gstPercent: 18,
  totalDeduction: 756.5,
  grossRevenue: 32065,
  gatewayDeduction: 756.5,
  netReceived: 31308.5,
  effectiveRate: 2.36,
};

export default function PaymentAnalyticsPage() {
  const [dateRange, setDateRange] = useState("this_month");

  // Calculate chart dimensions
  const chartWidth = 1200;
  const chartHeight = 200;
  const padding = { top: 20, right: 40, bottom: 40, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Find max value for scaling
  const maxRevenue = Math.max(...dailyTrendData.map((d) => d.revenue));
  const yScale = (value: number) =>
    innerHeight - (value / maxRevenue) * innerHeight;

  // Generate line paths
  const revenuePath = dailyTrendData
    .map((d, i) => {
      const x = padding.left + (i / (dailyTrendData.length - 1)) * innerWidth;
      const y = padding.top + yScale(d.revenue);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const profitPath = dailyTrendData
    .map((d, i) => {
      const x = padding.left + (i / (dailyTrendData.length - 1)) * innerWidth;
      const y = padding.top + yScale(d.profit);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  // Pie chart calculations
  const totalCertRevenue = certificateRevenue.reduce((sum, c) => sum + c.revenue, 0);
  const sickLeavePercent = (certificateRevenue[0].revenue / totalCertRevenue) * 100;
  const fitnessPercent = (certificateRevenue[1].revenue / totalCertRevenue) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Revenue Analytics</h1>
          <p className="text-sm text-slate-500">
            Comprehensive revenue breakdown and profit analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
          >
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_quarter">This Quarter</option>
            <option value="this_year">This Year</option>
          </select>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Gross Revenue */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Gross Revenue</p>
            <DollarSign className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(mockStats.grossRevenue)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {mockStats.transactionCount} transactions
          </p>
        </div>

        {/* Platform Profit */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Platform Profit</p>
            <TrendingUp className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(mockStats.platformProfit)}
          </p>
          <p className="mt-1 text-xs text-slate-400">% effective rate</p>
        </div>

        {/* Doctor Payouts */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Doctor Payouts</p>
            <Users className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(mockStats.doctorPayouts)}
          </p>
          <p className="mt-1 text-xs text-slate-400">To doctors</p>
        </div>

        {/* Gateway Fees */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Gateway Fees</p>
            <CreditCard className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-red-500">
            {formatCurrency(mockStats.gatewayFees)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {mockStats.gatewayRate}% effective
          </p>
        </div>
      </div>

      {/* Daily Revenue Trend */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Daily Revenue Trend</h2>
        <p className="text-sm text-slate-500">Revenue and profit trends over time</p>

        <div className="mt-4 overflow-x-auto">
          <svg
            width="100%"
            height={chartHeight + 20}
            viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`}
            className="min-w-200"
          >
            {/* Grid lines */}
            {[0, 1500, 3000, 4500, 6000].map((value, i) => (
              <g key={value}>
                <line
                  x1={padding.left}
                  y1={padding.top + yScale(value)}
                  x2={chartWidth - padding.right}
                  y2={padding.top + yScale(value)}
                  stroke="#e2e8f0"
                  strokeDasharray="4"
                />
                <text
                  x={padding.left - 10}
                  y={padding.top + yScale(value) + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-xs"
                >
                  {value}
                </text>
              </g>
            ))}

            {/* X-axis labels */}
            {dailyTrendData.map((d, i) => {
              const x = padding.left + (i / (dailyTrendData.length - 1)) * innerWidth;
              return (
                <text
                  key={d.date}
                  x={x}
                  y={chartHeight + 10}
                  textAnchor="middle"
                  className="fill-slate-400 text-xs"
                >
                  {d.date}
                </text>
              );
            })}

            {/* Revenue line (purple) */}
            <path
              d={revenuePath}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth={2}
            />

            {/* Profit line (green) */}
            <path
              d={profitPath}
              fill="none"
              stroke="#22c55e"
              strokeWidth={2}
            />

            {/* Data points - Revenue */}
            {dailyTrendData.map((d, i) => {
              const x = padding.left + (i / (dailyTrendData.length - 1)) * innerWidth;
              const y = padding.top + yScale(d.revenue);
              return (
                <circle
                  key={`rev-${d.date}`}
                  cx={x}
                  cy={y}
                  r={4}
                  fill="white"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
              );
            })}

            {/* Data points - Profit */}
            {dailyTrendData.map((d, i) => {
              const x = padding.left + (i / (dailyTrendData.length - 1)) * innerWidth;
              const y = padding.top + yScale(d.profit);
              return (
                <circle
                  key={`prof-${d.date}`}
                  cx={x}
                  cy={y}
                  r={4}
                  fill="white"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-500"></div>
            <span className="text-sm text-slate-600">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-slate-600">Profit</span>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by Certificate Type - Pie Chart */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Revenue by Certificate Type
          </h2>
          <p className="text-sm text-slate-500">
            Breakdown of revenue by certificate category
          </p>

          <div className="mt-6 flex items-center justify-center">
            <div className="relative">
              <svg width="200" height="200" viewBox="0 0 200 200">
                {/* Sick Leave slice (purple) */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="transparent"
                  stroke="#6366f1"
                  strokeWidth="40"
                  strokeDasharray={`${(sickLeavePercent / 100) * 502.4} 502.4`}
                  transform="rotate(-90 100 100)"
                />
                {/* Fitness slice (green) */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="transparent"
                  stroke="#22c55e"
                  strokeWidth="40"
                  strokeDasharray={`${(fitnessPercent / 100) * 502.4} 502.4`}
                  strokeDashoffset={`-${(sickLeavePercent / 100) * 502.4}`}
                  transform="rotate(-90 100 100)"
                />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="mt-4 flex justify-center gap-8">
            <div className="text-center">
              <p className="text-sm text-indigo-600">
                sick-leave: {sickLeavePercent.toFixed(0)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-green-600">
                fitness: {fitnessPercent.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Performance */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Certificate Performance
          </h2>
          <p className="text-sm text-slate-500">
            Detailed performance metrics by certificate type
          </p>

          <div className="mt-6 space-y-4">
            {certificateRevenue.map((cert) => (
              <div
                key={cert.type}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-sm ${
                      cert.type === "sick-leave" ? "bg-indigo-500" : "bg-green-500"
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium text-slate-900">{cert.type}</p>
                    <p className="text-xs text-slate-400">
                      {cert.transactions} transactions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(cert.revenue)}
                  </p>
                  <p className="text-xs text-green-600">{cert.margin}% margin</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Gateway Breakdown */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Payment Gateway Breakdown
        </h2>
        <p className="text-sm text-slate-500">
          Detailed analysis of Razorpay fees and charges
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Fee Structure */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Gateway Fees ({gatewayBreakdown.gatewayFeePercent}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                GST on Fees ({gatewayBreakdown.gstPercent}%)
              </span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-sm font-medium text-slate-700">
                Total Deduction
              </span>
              <span className="font-semibold text-red-500">
                {formatCurrency(gatewayBreakdown.totalDeduction)}
              </span>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Gross Revenue</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Gateway Deduction</span>
              <span className="text-sm text-red-500">
                -{formatCurrency(gatewayBreakdown.gatewayDeduction)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-sm font-medium text-slate-700">
                Net Received
              </span>
            </div>
          </div>

          {/* Effective Rate */}
          <div className="flex flex-col items-end justify-center">
            <p className="text-3xl font-bold text-blue-600">
              {gatewayBreakdown.effectiveRate}%
            </p>
            <p className="text-sm text-slate-500">Effective Gateway Rate</p>
            <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Optimised Rate (2%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
