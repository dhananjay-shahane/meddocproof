"use client";

interface PaymentInfoCardProps {
  paymentCompleted: boolean;
}

export function PaymentInfoCard({ paymentCompleted }: PaymentInfoCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="font-semibold text-base mb-4">Payment Information</h3>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Status:</span>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            paymentCompleted
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {paymentCompleted ? "Paid" : "Pending"}
        </span>
      </div>
    </div>
  );
}
