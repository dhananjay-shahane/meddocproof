"use client";

import { PAYMENT_OPTIONS } from "@/lib/certificate-types";
import type { PaymentTierId, DocumentFormat } from "@/types";
import { Check, AlertTriangle } from "lucide-react";

interface PaymentTierSelectorProps {
  selectedTier: PaymentTierId | "";
  documentFormat: DocumentFormat | "";
  onSelect: (tierId: PaymentTierId) => void;
}

export function PaymentTierSelector({
  selectedTier,
  documentFormat,
  onSelect,
}: PaymentTierSelectorProps) {
  const filteredTiers = documentFormat
    ? PAYMENT_OPTIONS.filter((t) => t.documentFormat === documentFormat)
    : PAYMENT_OPTIONS;

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        Select Payment Tier <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2">
        {filteredTiers.map((tier) => {
          const isSelected = selectedTier === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelect(tier.id as PaymentTierId)}
              className={`flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-transparent bg-muted/30 hover:border-muted-foreground/20"
              }`}
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/40"
                }`}
              >
                {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{tier.shortLabel}</p>
                <p className="text-xs text-muted-foreground">{tier.description}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">₹{tier.price}</p>
                {!tier.refundable && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                    <AlertTriangle className="h-3 w-3" />
                    Non-refundable
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
