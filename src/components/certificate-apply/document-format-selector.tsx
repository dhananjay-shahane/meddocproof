"use client";

import { DOCUMENT_FORMATS } from "@/lib/certificate-types";
import type { DocumentFormat } from "@/types";
import { FileText, PenTool } from "lucide-react";

interface DocumentFormatSelectorProps {
  value: DocumentFormat | "";
  onChange: (format: DocumentFormat) => void;
}

const ICONS: Record<string, React.ElementType> = {
  digital: FileText,
  handwritten: PenTool,
};

export function DocumentFormatSelector({
  value,
  onChange,
}: DocumentFormatSelectorProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        Document Format <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-3">
        {DOCUMENT_FORMATS.map((fmt) => {
          const isSelected = value === fmt.value;
          const Icon = ICONS[fmt.value] ?? FileText;
          return (
            <button
              key={fmt.value}
              type="button"
              onClick={() => onChange(fmt.value as DocumentFormat)}
              className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-muted bg-muted/30 hover:border-muted-foreground/20"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  isSelected
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">{fmt.label}</p>
                <p className="text-xs text-muted-foreground">
                  {fmt.value === "digital"
                    ? "Delivered via WhatsApp/Email"
                    : "Physical copy option available"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
