"use client";

import { PAYMENT_OPTIONS, SPECIAL_FORMAT_FEE } from "@/lib/certificate-types";
import type { PaymentTierId, DocumentFormat } from "@/types";

interface PriceBreakdownProps {
  paymentTier: PaymentTierId | "";
  documentFormat: DocumentFormat;
  specialFormatRequested: boolean;
  couponDiscount: number;
  couponCode: string;
}

export function PriceBreakdown({
  paymentTier,
  documentFormat,
  specialFormatRequested,
  couponDiscount,
  couponCode,
}: PriceBreakdownProps) {
  const tier = paymentTier
    ? PAYMENT_OPTIONS.find((t) => t.id === paymentTier)
    : null;

  if (!tier) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
        Select a payment tier to see price breakdown
      </div>
    );
  }

  const basePrice = tier.price;
  const specialFee =
    specialFormatRequested && documentFormat === "handwritten"
      ? SPECIAL_FORMAT_FEE
      : 0;
  const subtotal = basePrice + specialFee;
  const total = Math.max(0, subtotal - couponDiscount);

  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
      <h4 className="text-sm font-semibold">Price Breakdown</h4>
      <div className="space-y-1.5 text-sm">
        <Row
          label={`${tier.shortLabel} — ${tier.label}`}
          amount={basePrice}
        />
        {specialFee > 0 && (
          <Row label="Special Attestation Format" amount={specialFee} />
        )}
        {couponDiscount > 0 && (
          <Row
            label={`Coupon (${couponCode})`}
            amount={-couponDiscount}
            className="text-green-600"
          />
        )}
        <hr className="my-1" />
        <div className="flex items-center justify-between font-semibold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
      {!tier.refundable && (
        <p className="text-xs text-amber-600">
          ⚠ This tier is non-refundable.
        </p>
      )}
    </div>
  );
}

function Row({
  label,
  amount,
  className = "",
}: {
  label: string;
  amount: number;
  className?: string;
}) {
  const isNegative = amount < 0;
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-muted-foreground">{label}</span>
      <span>
        {isNegative ? "−" : ""}₹{Math.abs(amount)}
      </span>
    </div>
  );
}
