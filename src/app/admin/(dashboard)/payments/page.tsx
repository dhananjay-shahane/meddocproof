"use client";

import { useAdminPayments } from "@/hooks/use-admin-payments";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  AlertTriangle,
  ArrowUpDown,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  IndianRupee,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { PaymentOverviewData, PaymentWithRelations, AdminWithdrawalData } from "@/types";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  refunded: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  approved: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function StatCard({
  label,
  value,
  icon: Icon,
  change,
  sub,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  change?: number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {change !== undefined && (
          <span
            className={`flex items-center text-xs font-medium ${
              change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="mr-0.5 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-0.5 h-3 w-3" />
            )}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
    </div>
  );
}

function RecentPaymentsTable({ payments }: { payments: PaymentWithRelations[] }) {
  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-6 py-4">
        <h3 className="font-semibold">Recent Payments</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="px-6 py-3">
                  <p className="font-medium">{p.user.fullName}</p>
                  <p className="text-xs text-muted-foreground">{p.user.phoneNumber}</p>
                </td>
                <td className="px-6 py-3 font-medium">{formatCurrency(p.amount)}</td>
                <td className="px-6 py-3">
                  <span className="capitalize">
                    {p.application.certificateType.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColors[p.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-muted-foreground">
                  {format(new Date(p.createdAt), "dd MMM yyyy, HH:mm")}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WithdrawalsTable({
  withdrawals,
  onAction,
  processing,
}: {
  withdrawals: AdminWithdrawalData[];
  onAction: (id: string, action: "approve" | "reject" | "complete") => void;
  processing: boolean;
}) {
  const pending = withdrawals.filter((w) => w.status === "pending" || w.status === "approved");

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-6 py-4">
        <h3 className="font-semibold">
          Withdrawal Requests
          {pending.length > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
              {pending.length}
            </span>
          )}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3">Doctor</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Balance</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Requested</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {withdrawals.map((w) => (
              <tr key={w.id} className="hover:bg-muted/30">
                <td className="px-6 py-3">
                  <p className="font-medium">{w.doctor.fullName}</p>
                  <p className="text-xs text-muted-foreground">{w.doctor.email}</p>
                </td>
                <td className="px-6 py-3 font-semibold text-red-600">
                  {formatCurrency(w.amount)}
                </td>
                <td className="px-6 py-3 text-muted-foreground">
                  {w.doctor.wallet ? formatCurrency(w.doctor.wallet.balance) : "N/A"}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColors[w.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {w.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-muted-foreground">
                  {format(new Date(w.requestedAt), "dd MMM yyyy")}
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-1">
                    {w.status === "pending" && (
                      <>
                        <button
                          onClick={() => onAction(w.id, "approve")}
                          disabled={processing}
                          className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onAction(w.id, "reject")}
                          disabled={processing}
                          className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {w.status === "approved" && (
                      <button
                        onClick={() => onAction(w.id, "complete")}
                        disabled={processing}
                        className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        Complete
                      </button>
                    )}
                    {(w.status === "completed" || w.status === "rejected") && (
                      <span className="text-xs text-muted-foreground">
                        {w.processedAt
                          ? format(new Date(w.processedAt), "dd MMM")
                          : "—"}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {withdrawals.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No withdrawal requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatsGrid({ stats }: { stats: PaymentOverviewData["stats"] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        icon={IndianRupee}
        change={stats.revenueGrowth}
        sub="vs last month"
      />
      <StatCard
        label="Monthly Revenue"
        value={formatCurrency(stats.monthlyRevenue)}
        icon={DollarSign}
        sub={`Weekly: ${formatCurrency(stats.weeklyRevenue)}`}
      />
      <StatCard
        label="Avg Order Value"
        value={formatCurrency(stats.averageOrderValue)}
        icon={CreditCard}
        sub={`${stats.completedPayments} completed`}
      />
      <StatCard
        label="Doctor Payouts"
        value={formatCurrency(stats.totalDoctorPayouts)}
        icon={ArrowUpDown}
        sub={`${stats.pendingWithdrawals} pending`}
      />
    </div>
  );
}

function MiniStats({ stats }: { stats: PaymentOverviewData["stats"] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <div>
          <p className="text-xs text-muted-foreground">Completed</p>
          <p className="font-semibold">{stats.completedPayments}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
        <XCircle className="h-5 w-5 text-red-500" />
        <div>
          <p className="text-xs text-muted-foreground">Failed</p>
          <p className="font-semibold">{stats.failedPayments}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
        <ArrowUpDown className="h-5 w-5 text-blue-500" />
        <div>
          <p className="text-xs text-muted-foreground">Refunded</p>
          <p className="font-semibold">{stats.refundedPayments}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
        <Clock className="h-5 w-5 text-yellow-500" />
        <div>
          <p className="text-xs text-muted-foreground">Pending Withdrawals</p>
          <p className="font-semibold">{stats.pendingWithdrawals}</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  const {
    data,
    withdrawals,
    loading,
    error,
    refetch,
    processWithdrawal,
    processing,
  } = useAdminPayments();

  const handleWithdrawalAction = async (
    id: string,
    action: "approve" | "reject" | "complete"
  ) => {
    try {
      await processWithdrawal(id, action);
      toast.success(`Withdrawal ${action}d successfully`);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
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
          <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">
            Track all payment transactions and revenue.
          </p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {data && (
        <>
          <StatsGrid stats={data.stats} />
          <MiniStats stats={data.stats} />
          <RecentPaymentsTable payments={data.recentPayments} />
        </>
      )}

      <WithdrawalsTable
        withdrawals={withdrawals}
        onAction={handleWithdrawalAction}
        processing={processing}
      />
    </div>
  );
}
