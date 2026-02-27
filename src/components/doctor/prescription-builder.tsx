"use client";

import { Plus, Trash2 } from "lucide-react";
import type { PrescriptionItemData } from "@/types";

interface PrescriptionBuilderProps {
  items: PrescriptionItemData[];
  onChange: (items: PrescriptionItemData[]) => void;
  disabled?: boolean;
}

export function PrescriptionBuilder({
  items,
  onChange,
  disabled = false,
}: PrescriptionBuilderProps) {
  const addItem = () => {
    onChange([...items, { medicineName: "", dosage: "", duration: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof PrescriptionItemData,
    value: string
  ) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Prescription</label>
        <button
          type="button"
          onClick={addItem}
          disabled={disabled}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus className="h-3 w-3" />
          Add Medicine
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2 rounded-lg border bg-card p-3"
          >
            <div className="grid flex-1 gap-2 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Medicine Name
                </label>
                <input
                  type="text"
                  value={item.medicineName}
                  onChange={(e) =>
                    updateItem(index, "medicineName", e.target.value)
                  }
                  disabled={disabled}
                  placeholder="e.g. Paracetamol"
                  className="w-full rounded-md border bg-background px-2.5 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Dosage
                </label>
                <input
                  type="text"
                  value={item.dosage}
                  onChange={(e) =>
                    updateItem(index, "dosage", e.target.value)
                  }
                  disabled={disabled}
                  placeholder="e.g. 500mg Twice Daily"
                  className="w-full rounded-md border bg-background px-2.5 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Duration
                </label>
                <input
                  type="text"
                  value={item.duration}
                  onChange={(e) =>
                    updateItem(index, "duration", e.target.value)
                  }
                  disabled={disabled}
                  placeholder="e.g. 5 days"
                  className="w-full rounded-md border bg-background px-2.5 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={disabled || items.length <= 1}
              className="mt-5 rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
