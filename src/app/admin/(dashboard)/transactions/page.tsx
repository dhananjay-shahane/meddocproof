"use client";

import { useState } from "react";
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
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  ShoppingCart,
  Download,
  Eye,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import type { TransactionFilters } from "@/types";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

const certificateTypes = [
  { value: "", label: "All Certificates" },
  { value: "sick-leave", label: "Sick Leave Certificate" },
  { value: "medical-fitness", label: "Medical Fitness Certificate" },
  { value: "recovery", label: "Recovery Certificate" },
  { value: "caretaker", label: "Caretaker Certificate" },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "successful", label: "Successful" },
  { value: "authorized", label: "Authorized" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

// Mock transaction data matching the screenshot
const mockTransactions = [
  {
    id: "1",
    date: "15/03/26, 16:19",
    customerName: "Jeet Majumder",
    customerEmail: "jeetmajumdar6@gmail.com",
    certificateType: "Sick Leave Certificate",
    certificateFormat: "digital-basic",
    amount: 599.0,
    gatewayFee: 17.1,
    doctorFee: 2.5,
    feeNote: "Gateway + Doctor",
    status: "successful",
  },
  {
    id: "2",
    date: "15/03/26, 15:43",
    customerName: "Sharmavivek65122",
    customerEmail: "sharmavivek65122@gmail.com",
    certificateType: "Medical Fitness Certificate",
    certificateFormat: "digital-basic",
    amount: 699.0,
    gatewayFee: 19.96,
    doctorFee: null,
    feeNote: "Gateway Fee",
    status: "successful",
  },
  {
    id: "3",
    date: "14/03/26, 22:16",
    customerName: "Gautam",
    customerEmail: "gautamanalyst33@gmail.com",
    certificateType: "Medical Fitness Certificate",
    certificateFormat: "digital-basic",
    amount: 699.0,
    gatewayFee: 19.96,
    doctorFee: 2.0,
    feeNote: "Gateway + Doctor",
    status: "successful",
  },
  {
    id: "4",
    date: "14/03/26, 21:31",
    customerName: "Deepak Kumar",
    customerEmail: "dk602743@gmail.com",
    certificateType: "Medical Fitness Certificate",
    certificateFormat: "handwritten",
    amount: 1399.0,
    gatewayFee: null,
    doctorFee: null,
    feeNote: "No Doctor Assigned",
    status: "failed",
  },
  {
    id: "5",
    date: "14/03/26, 16:05",
    customerName: "Ankit.bafna",
    customerEmail: "ankit.bafna@gmail.com",
    certificateType: "Medical Fitness Certificate",
    certificateFormat: "handwritten",
    amount: 1399.0,
    gatewayFee: 39.94,
    doctorFee: 3.0,
    feeNote: "Gateway + Doctor",
    status: "successful",
  },
  {
    id: "6",
    date: "14/03/26, 11:28",
    customerName: "Namita Mishra",
    customerEmail: "namitamishra100@gmail.com",
    certificateType: "Sick Leave Certificate",
    certificateFormat: "digital-basic",
    amount: 599.0,
    gatewayFee: 17.1,
    doctorFee: 2.5,
    feeNote: "Gateway + Doctor",
    status: "successful",
  },
  {
    id: "7",
    date: "12/03/26, 10:33",
    customerName: "Tamilselvi G",
    customerEmail: "gtsece93@gmail.com",
    certificateType: "Sick Leave Certificate",
    certificateFormat: "digital-basic",
    amount: 599.0,
    gatewayFee: 17.1,
    doctorFee: 2.0,
    feeNote: "Gateway + Doctor",
    status: "successful",
  },
];

export default function TransactionsPage() {
  const { data, loading, error, filters, setFilters, refetch } = useAdminTransactions();
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [certificateFilter, setCertificateFilter] = useState("");

  const handleClearFilters = () => {
    setSearchInput("");
    setStatusFilter("");
    setCertificateFilter("");
    setFilters({ page: 1 });
  };

  // Stats data
  const stats = {
    totalTransactions: 568,
    totalRevenue: 281225.0,
    netRevenue: 257137.83,
    successRate: 66.9,
    successful: 380,
    authorized: 0,
    failed: 162,
    refunds: 26,
    averageOrder: 740.07,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500">
            Medical certificate app transactions from Razorpay API (current month)
          </p>
        </div>
        <div className="flex items-center gap-3">
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
      <div className="grid gap-4 grid-cols-4">
        {/* Total Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-600">
              Total Transactions
            </span>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</p>
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
          <p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-xs text-blue-200 mt-1">
            From 380 successful payments
          </p>
        </div>

        {/* Net Revenue */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-600">Net Revenue</span>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(stats.netRevenue)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            After ₹7967.17 fees, ₹16120.00 refunds
          </p>
        </div>

        {/* Success Rate */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-600">Success Rate</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.successRate}%</p>
          <p className="text-xs text-gray-500 mt-1">Successful payment rate</p>
        </div>
      </div>

      {/* Stats Cards - Row 2 */}
      <div className="grid gap-4 grid-cols-5">
        {/* Successful */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Successful</span>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.successful}</p>
          <p className="text-xs text-gray-500 mt-1">Captured payments</p>
        </div>

        {/* Authorized */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Authorized</span>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-amber-600">{stats.authorized}</p>
          <p className="text-xs text-gray-500 mt-1">Pending capture</p>
        </div>

        {/* Failed */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Failed</span>
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
          <p className="text-xs text-gray-500 mt-1">Payment failures</p>
        </div>

        {/* Refunds */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Refunds</span>
            <RotateCcw className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{stats.refunds}</p>
          <p className="text-xs text-gray-500 mt-1">₹16,120.00 refunded</p>
        </div>

        {/* Average Order */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Average Order</span>
            <ShoppingCart className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-blue-600">
            ₹{stats.averageOrder.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Per successful order</p>
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

        <div className="grid gap-4 grid-cols-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Order ID, Payment ID, Refund ID, Customer..."
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

          {/* Certificate Type */}
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1.5">
              Certificate Type
            </label>
            <div className="relative">
              <select
                value={certificateFilter}
                onChange={(e) => setCertificateFilter(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {certificateTypes.map((type) => (
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
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                readOnly
                value="Dec 15 - Mar 15, 2026"
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Certificate</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Fees</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500">{t.date}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {t.customerName}
                      </p>
                      <p className="text-xs text-blue-600">{t.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {t.certificateType}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t.certificateFormat}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ₹{t.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {t.gatewayFee !== null ? (
                      <div>
                        <p className="text-orange-600 font-medium">
                          ₹{t.gatewayFee.toFixed(2)}
                        </p>
                        {t.doctorFee !== null && (
                          <p className="text-green-600 text-xs">
                            ₹{t.doctorFee.toFixed(2)}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">{t.feeNote}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-500">N/A</p>
                        <p className="text-xs text-gray-500">{t.feeNote}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {t.status === "successful" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Successful
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <XCircle className="h-3 w-3" />
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </button>
                      {t.status === "successful" ? (
                        <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50">
                          <RotateCcw className="h-3 w-3" />
                          Refund
                        </button>
                      ) : (
                        <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">
                          <RefreshCw className="h-3 w-3" />
                          Retry
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
            Showing 1–7 of 568 transactions
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="p-2 rounded-lg border border-gray-300 text-gray-400 cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg">
              1
            </span>
            <span className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
              2
            </span>
            <span className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
              3
            </span>
            <span className="text-gray-500">...</span>
            <span className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
              82
            </span>
            <button className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
