"use client";

import { CreditCard, AlertCircle } from "lucide-react";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import type { FailedPaymentItem } from "@/types";

interface FailedPaymentsProps {
  payments: FailedPaymentItem[];
}

export function FailedPayments({ payments }: FailedPaymentsProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-lg bg-red-50 p-2">
          <CreditCard className="h-4 w-4 text-red-600" />
        </div>
        <h3 className="font-semibold">Failed Payments</h3>
        {payments.length > 0 && (
          <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-100 px-1.5 text-xs font-medium text-red-700">
            {payments.length}
          </span>
        )}
      </div>
      {payments.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          No failed payments
        </p>
      ) : (
        <div className="space-y-3">
          {payments.slice(0, 5).map((payment) => (
            <div
              key={payment.id}
              className="flex items-center gap-3 rounded-lg border border-red-100 bg-red-50/30 p-3"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{payment.userName}</p>
                <p className="text-xs text-muted-foreground">
                  App: {payment.applicationDisplayId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-red-600">
                  {formatCurrency(payment.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeDate(payment.failedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
