"use client";

import { SPECIAL_FORMAT_FEE } from "@/lib/certificate-types";
import { FileUploadField } from "./file-upload-field";
import { Info } from "lucide-react";

interface SpecialAttestationFieldProps {
  requested: boolean;
  onRequestedChange: (v: boolean) => void;
  fileUrl: string;
  onFileChange: (url: string) => void;
  documentFormat: string;
}

export function SpecialAttestationField({
  requested,
  onRequestedChange,
  fileUrl,
  onFileChange,
  documentFormat,
}: SpecialAttestationFieldProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-2 block text-sm font-medium">
          Special Format Attestation
        </label>
        <p className="mb-3 text-xs text-muted-foreground">
          Need a specific format or attestation? Extra fee of ₹{SPECIAL_FORMAT_FEE}{" "}
          applies. Handwritten format may take up to 48 hours.
        </p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="specialFormat"
              checked={!requested}
              onChange={() => {
                onRequestedChange(false);
                onFileChange("");
              }}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm">No</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="specialFormat"
              checked={requested}
              onChange={() => onRequestedChange(true)}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm">
              Yes{" "}
              <span className="font-semibold text-primary">
                (+₹{SPECIAL_FORMAT_FEE})
              </span>
            </span>
          </label>
        </div>
      </div>

      {requested && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              {documentFormat === "handwritten"
                ? "Handwritten special format may take up to 48 hours for processing."
                : "Upload the required format template. Our doctor will follow it."}
            </span>
          </div>
          <FileUploadField
            label="Upload Special Format File"
            required
            value={fileUrl}
            onChange={onFileChange}
            category="specialFormat"
            accept="image/*,application/pdf"
            hint="Upload PDF or image of the required format"
          />
        </div>
      )}
    </div>
  );
}
