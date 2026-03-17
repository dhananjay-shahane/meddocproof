"use client";

import { useAdminPaymentFix } from "@/hooks/use-admin-payment-fix";
import {
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Loader2,
  Wrench,
  ArrowRightLeft,
  Ban,
  RotateCcw,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

const issueTypeLabels: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: Ban,
  },
  stuck: {
    label: "Stuck / Pending",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: AlertTriangle,
  },
  mismatch: {
    label: "State Mismatch",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    icon: ArrowRightLeft,
  },
};

export default function PaymentFixPage() {
  const { data, loading, error, refetch, fixPayment, fixing } = useAdminPaymentFix();

  const handleFix = async (id: string, action: "mark_completed" | "retry" | "refund") => {
    try {
      await fixPayment(id, action);
      toast.success(`Payment ${action.replace(/_/g, " ")} successful`);
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payment Fix</h2>
          <p className="text-muted-foreground">
            Fix and reconcile failed or stuck payments.
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

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
          <Ban className="h-6 w-6 text-red-500" />
          <div>
            <p className="text-sm text-muted-foreground">Failed</p>
            <p className="text-xl font-bold">
              {data.filter((d) => d.issueType === "failed").length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          <div>
            <p className="text-sm text-muted-foreground">Stuck</p>
            <p className="text-xl font-bold">
              {data.filter((d) => d.issueType === "stuck").length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
          <ArrowRightLeft className="h-6 w-6 text-orange-500" />
          <div>
            <p className="text-sm text-muted-foreground">Mismatched</p>
            <p className="text-xl font-bold">
              {data.filter((d) => d.issueType === "mismatch").length}
            </p>
          </div>
        </div>
      </div>

      {/* Issues List */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <p className="mt-4 text-lg font-medium">All Clear!</p>
          <p className="text-sm text-muted-foreground">No payment issues detected.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => {
            const issueInfo = issueTypeLabels[item.issueType] || issueTypeLabels.failed;
            const IssueIcon = issueInfo.icon;

            return (
              <div
                key={item.id}
                className="rounded-xl border bg-card p-5 shadow-sm transition-colors hover:bg-muted/30"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-muted p-2">
                      <IssueIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.user.fullName}</p>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${issueInfo.color}`}
                        >
                          {issueInfo.label}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {item.user.phoneNumber} • {formatCurrency(item.amount)} •{" "}
                        <span className="capitalize">
                          {item.application.certificateType.replace(/_/g, " ")}
                        </span>
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>
                          Payment: {item.status} | App: {item.application.status} |
                          {item.application.paymentCompleted
                            ? " Payment marked"
                            : " Payment NOT marked"}
                        </span>
                        <span>
                          {format(new Date(item.createdAt), "dd MMM yyyy, HH:mm")}
                        </span>
                      </div>
                      {(item.orderId || item.paymentId) && (
                        <p className="mt-1 text-xs font-mono text-muted-foreground">
                          {item.orderId && `Order: ${item.orderId}`}
                          {item.orderId && item.paymentId && " | "}
                          {item.paymentId && `Pay: ${item.paymentId}`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 sm:shrink-0">
                    {item.issueType === "mismatch" && (
                      <button
                        onClick={() => handleFix(item.id, "mark_completed")}
                        disabled={fixing}
                        className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Sync Status
                      </button>
                    )}
                    {item.issueType === "failed" && (
                      <>
                        <button
                          onClick={() => handleFix(item.id, "mark_completed")}
                          disabled={fixing}
                          className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          <Wrench className="h-3.5 w-3.5" />
                          Mark Paid
                        </button>
                        <button
                          onClick={() => handleFix(item.id, "refund")}
                          disabled={fixing}
                          className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Refund
                        </button>
                      </>
                    )}
                    {item.issueType === "stuck" && (
                      <>
                        <button
                          onClick={() => handleFix(item.id, "mark_completed")}
                          disabled={fixing}
                          className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Mark Paid
                        </button>
                        <button
                          onClick={() => handleFix(item.id, "retry")}
                          disabled={fixing}
                          className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Retry
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
