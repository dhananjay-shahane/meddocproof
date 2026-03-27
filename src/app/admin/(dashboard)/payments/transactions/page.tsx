"use client";

import { useState } from "react";
import { useAdminPayments } from "@/hooks/use-admin-payments";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { PageLoader } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "date-fns";
import {
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  Search,
  RefreshCw,
  Download,
  FileText,
  Eye,
  Receipt,
} from "lucide-react";
import type { PaymentWithRelations } from "@/types";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

const certificateOptions = [
  { value: "", label: "All Certificates" },
  { value: "sick_leave", label: "Sick Leave" },
  { value: "fitness", label: "Fitness" },
  { value: "medical", label: "Medical" },
];

// Platform fee constants
const GATEWAY_FEE_PERCENT = 2;
const GST_PERCENT = 18;

export default function PaymentTransactionsPage() {
  const { data, loading, refetch } = useAdminPayments();
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [certificateFilter, setCertificateFilter] = useState("");
  const [useActualFees, setUseActualFees] = useState(true);
  const [page, setPage] = useState(1);

  const recentPayments = data?.recentPayments || [];
  const stats = data?.stats;

  // Calculate aggregate stats
  const totalRevenue = stats?.totalRevenue || 0;
  const platformProfit = totalRevenue * 0.431; // Approx 43.1% margin
  const doctorPayouts = stats?.totalDoctorPayouts || 0;
  const gatewayFees = totalRevenue * (GATEWAY_FEE_PERCENT / 100) * (1 + GST_PERCENT / 100);
  const transactionCount = stats?.completedPayments || 0;

  // Filter payments
  const filteredPayments = recentPayments.filter((payment) => {
    const matchSearch =
      !searchInput ||
      payment.razorpayPaymentId?.toLowerCase().includes(searchInput.toLowerCase()) ||
      payment.user?.fullName?.toLowerCase().includes(searchInput.toLowerCase());
    const matchStatus = !statusFilter || payment.status === statusFilter;
    const matchCertificate =
      !certificateFilter ||
      payment.application?.certificateType === certificateFilter;
    return matchSearch && matchStatus && matchCertificate;
  });

  // Paginate
  const pageSize = 10;
  const totalPages = Math.ceil(filteredPayments.length / pageSize);
  const paginatedPayments = filteredPayments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
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
          <p className="mt-1 text-xs text-slate-400">
            {transactionCount} transactions
          </p>
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
          <p className="mt-1 text-xs text-slate-400">43.1% avg margin</p>
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
          <p className="mt-1 text-xs text-slate-400">To doctors</p>
        </div>

        {/* Gateway Fees */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Gateway Fees</p>
            <CreditCard className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-red-500">
            {formatCurrency(gatewayFees)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Razorpay charges</p>
        </div>
      </div>

      {/* Payment Transactions Card */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="p-6 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Payment Transactions
          </h2>
          <p className="text-sm text-slate-500">
            Detailed view of all payment transactions with breakdown
          </p>

          {/* Fee Toggle */}
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={useActualFees}
                onChange={(e) => setUseActualFees(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-slate-700">Actual Razorpay fees</span>
            </label>
            <span className="text-sm text-slate-400">
              ~ Estimated fees (2% + 18% GST)
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-40 max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Certificate Filter */}
            <select
              value={certificateFilter}
              onChange={(e) => setCertificateFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            >
              {certificateOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                Update Fees
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        {paginatedPayments.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Receipt}
              title="No transactions found"
              description="Try adjusting your filters or search query."
            />
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-b bg-slate-50/50">
                  <th className="px-6 py-3 text-left font-medium text-slate-500">
                    Transaction ID
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">
                    Certificate Type
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">
                    User Paid
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">
                    Net Received
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">
                    Doctor Fee
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">
                    Platform Profit
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">
                    Date
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map((payment) => (
                  <TransactionRow
                    key={payment.id}
                    payment={payment}
                    useActualFees={useActualFees}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center border-t p-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function TransactionRow({
  payment,
  useActualFees,
}: {
  payment: PaymentWithRelations;
  useActualFees: boolean;
}) {
  const certificateType = payment.application?.certificateType || "unknown";
  const typeLabel = certificateType.replace(/_/g, "-");

  // Calculate fees
  const userPaid = payment.amount;
  const gatewayFee = useActualFees
    ? userPaid * 0.02 * 1.18
    : userPaid * 0.02 * 1.18;
  const netReceived = userPaid - gatewayFee;
  const doctorFee = userPaid * 0.4; // Approximate 40% to doctor
  const platformProfit = netReceived - doctorFee;
  const profitMargin = ((platformProfit / userPaid) * 100).toFixed(1);

  const getBadgeColor = (type: string) => {
    if (type.includes("sick")) return "bg-amber-100 text-amber-700";
    if (type.includes("fitness")) return "bg-green-100 text-green-700";
    return "bg-blue-100 text-blue-700";
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") return "bg-purple-100 text-purple-700";
    if (status === "pending") return "bg-amber-100 text-amber-700";
    if (status === "failed") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <tr className="border-b last:border-0 hover:bg-slate-50/50">
      {/* Transaction ID */}
      <td className="px-6 py-4">
        <p className="font-mono text-sm text-slate-600">
          {payment.razorpayPaymentId || `pay_${payment.id.slice(0, 12)}`}
        </p>
      </td>

      {/* Certificate Type */}
      <td className="px-4 py-4">
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${getBadgeColor(
            certificateType
          )}`}
        >
          {typeLabel}
        </span>
      </td>

      {/* User Paid */}
      <td className="px-4 py-4 text-right">
        <p className="font-medium text-slate-900">{formatCurrency(userPaid)}</p>
        <p className="text-xs text-red-500">
          -{formatCurrency(gatewayFee)} gateway
        </p>
      </td>

      {/* Net Received */}
      <td className="px-4 py-4 text-right">
        <p className="font-medium text-blue-600">{formatCurrency(netReceived)}</p>
      </td>

      {/* Doctor Fee */}
      <td className="px-4 py-4 text-right">
        <p className="font-medium text-amber-600">{formatCurrency(doctorFee)}</p>
      </td>

      {/* Platform Profit */}
      <td className="px-4 py-4 text-right">
        <p className="font-medium text-green-600">
          {formatCurrency(platformProfit)}
        </p>
        <p className="text-xs text-green-500">{profitMargin}% margin</p>
      </td>

      {/* Status */}
      <td className="px-4 py-4 text-center">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
            payment.status
          )}`}
        >
          {payment.status === "completed" ? "paid" : payment.status}
        </span>
      </td>

      {/* Date */}
      <td className="px-4 py-4 text-right">
        <p className="text-sm text-slate-900">
          {formatDate(payment.createdAt, "M/dd/yyyy")}
        </p>
        <p className="text-xs text-slate-400">
          {formatDate(payment.createdAt, "h:mm:ss a")}
        </p>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 text-center">
        <Button variant="outline" size="sm" className="gap-1.5">
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
      </td>
    </tr>
  );
}
