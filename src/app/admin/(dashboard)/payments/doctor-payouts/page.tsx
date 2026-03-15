"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  TrendingUp,
  Wallet,
  DollarSign,
  Search,
  RefreshCw,
  Download,
  Eye,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/loading-spinner";
import { useDoctorsOverview } from "@/hooks/use-doctors-overview";
import type { Doctor, DoctorFiltersState } from "@/types";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

export default function DoctorPayoutsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page] = useState(1);

  const filters: DoctorFiltersState = {
    search,
    status: statusFilter === "all" ? "" : statusFilter,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  const { data, summary, loading, refetch } = useDoctorsOverview({
    filters,
    page,
    limit: 50,
  });

  const doctors: Doctor[] = data?.items || [];

  // Calculate stats from real data
  const totalDoctors = summary?.totalDoctors || doctors.length;
  const totalEarnings = summary?.totalEarnings || doctors.reduce((sum: number, d: Doctor) => sum + (d.wallet?.totalEarnings || 0), 0);
  const availableBalance = doctors.reduce((sum: number, d: Doctor) => sum + (d.wallet?.balance || 0), 0);
  const pendingWithdrawals = doctors.reduce((sum: number, d: Doctor) => sum + (d.wallet?.pendingWithdrawals || 0), 0);

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
        {/* Total Doctors */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Doctors</p>
            <Users className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalDoctors}</p>
          <p className="mt-1 text-xs text-slate-400">Active doctors with wallets</p>
        </div>

        {/* Total Earnings */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Earnings</p>
            <TrendingUp className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {formatCurrency(totalEarnings)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Lifetime doctor earnings</p>
        </div>

        {/* Available Balance */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Available Balance</p>
            <Wallet className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(availableBalance)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Ready for withdrawal</p>
        </div>

        {/* Pending Withdrawals */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Pending Withdrawals</p>
            <DollarSign className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {formatCurrency(pendingWithdrawals)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Awaiting processing</p>
        </div>
      </div>

      {/* Section Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Doctor Wallet Management</h1>
        <p className="text-sm text-slate-500">
          Overview of all doctor wallets, earnings, and withdrawal status
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-64 rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
          >
            <option value="all">All Status</option>
            <option value="approved">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50/50">
                <th className="px-6 py-3 text-left font-medium text-slate-500">
                  Doctor
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Total Earnings
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Available Balance
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Withdrawn
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Pending
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Consultations
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Avg/Consultation
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {doctors.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    No doctors found
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => {
                  const wallet = doctor.wallet;
                  const totalEarnings = wallet?.totalEarnings || 0;
                  const balance = wallet?.balance || 0;
                  const withdrawn = wallet?.totalWithdrawn || 0;
                  const pending = wallet?.pendingWithdrawals || 0;
                  const consultations = doctor.completedCertificates || 0;
                  const avgConsultation = consultations > 0 ? totalEarnings / consultations : 0;
                  const isActive = doctor.isActive && doctor.status === "approved";

                  return (
                    <tr
                      key={doctor.id}
                      className="border-b last:border-0 hover:bg-slate-50/50"
                    >
                      {/* Doctor */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{doctor.fullName}</p>
                        <p className="text-xs text-slate-500">{doctor.phoneNumber || "-"}</p>
                        <p className="text-xs text-blue-500">ID: {doctor.id}</p>
                      </td>

                      {/* Total Earnings */}
                      <td className="px-4 py-4">
                        <p
                          className={
                            totalEarnings > 0
                              ? "font-medium text-amber-600"
                              : "text-slate-500"
                          }
                        >
                          {formatCurrency(totalEarnings)}
                        </p>
                      </td>

                      {/* Available Balance */}
                      <td className="px-4 py-4">
                        <p className="text-slate-500">
                          {formatCurrency(balance)}
                        </p>
                      </td>

                      {/* Withdrawn */}
                      <td className="px-4 py-4">
                        <p className="text-slate-500">
                          {formatCurrency(withdrawn)}
                        </p>
                      </td>

                      {/* Pending */}
                      <td className="px-4 py-4">
                        <p
                          className={
                            pending > 0
                              ? "font-medium text-amber-600"
                              : "text-slate-500"
                          }
                        >
                          {formatCurrency(pending)}
                        </p>
                      </td>

                      {/* Consultations */}
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">
                          {consultations}
                        </p>
                        <p className="text-xs text-slate-400">completed</p>
                      </td>

                      {/* Avg/Consultation */}
                      <td className="px-4 py-4">
                        <p className="text-slate-500">
                          {formatCurrency(avgConsultation)}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="text-sm text-slate-500">Inactive</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => router.push(`/admin/payments/doctor-payouts/${doctor.id}`)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
