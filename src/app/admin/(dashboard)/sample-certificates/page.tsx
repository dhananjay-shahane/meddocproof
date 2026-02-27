"use client";

import { useState, useCallback } from "react";
import { useAdminSampleCertificates } from "@/hooks/use-admin-sample-certificates";
import { ALL_CERTIFICATE_TYPES, CERT_TYPE_LABELS } from "@/lib/certificate-types";
import {
  FileImage,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  X,
  Check,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSampleCertificatesPage() {
  const {
    samples,
    loading,
    error,
    saveSample,
    toggleActive,
    deleteSample,
  } = useAdminSampleCertificates();

  const [addingType, setAddingType] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState("");

  // Build a lookup map: certificateType => sample
  const sampleMap = new Map(samples.map((s) => [s.certificateType, s]));

  // Certificate types that don't have a sample yet
  const availableTypes = ALL_CERTIFICATE_TYPES.filter(
    (ct) => !sampleMap.has(ct.slug)
  );

  const handleSave = useCallback(async () => {
    if (!addingType || !fileUrl.trim()) {
      toast.error("Please enter a file URL");
      return;
    }
    const success = await saveSample(addingType, fileUrl.trim());
    if (success) {
      toast.success("Sample certificate saved");
      setAddingType(null);
      setFileUrl("");
    } else {
      toast.error("Failed to save sample certificate");
    }
  }, [addingType, fileUrl, saveSample]);

  const handleToggle = useCallback(
    async (id: string, isActive: boolean) => {
      const success = await toggleActive(id, isActive);
      if (success) toast.success(isActive ? "Sample activated" : "Sample hidden");
      else toast.error("Failed to update");
    },
    [toggleActive]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const success = await deleteSample(id);
      if (success) toast.success("Sample deleted");
      else toast.error("Failed to delete");
    },
    [deleteSample]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sample Certificates</h2>
          <p className="text-muted-foreground">
            Upload sample certificate images/PDFs shown on the public page.
          </p>
        </div>
        {availableTypes.length > 0 && !addingType && (
          <button
            onClick={() => setAddingType(availableTypes[0].slug)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Sample
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Add New Form */}
      {addingType && (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold">Add Sample Certificate</h3>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-sm font-medium">Certificate Type</label>
              <select
                value={addingType}
                onChange={(e) => setAddingType(e.target.value)}
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                {availableTypes.map((ct) => (
                  <option key={ct.slug} value={ct.slug}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">
                File URL (image or PDF link)
              </label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://example.com/sample.png"
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Check className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setAddingType(null);
                  setFileUrl("");
                }}
                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Samples */}
      {samples.length === 0 && !addingType ? (
        <div className="rounded-xl border bg-card p-12 text-center shadow-sm">
          <FileImage className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No Sample Certificates</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add sample certificate images to display on the public page.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {samples.map((sample) => (
            <div
              key={sample.id}
              className={`rounded-xl border bg-card p-5 shadow-sm ${
                !sample.isActive ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">
                    {CERT_TYPE_LABELS[sample.certificateType] || sample.certificateType}
                  </h3>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      sample.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {sample.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
                <a
                  href={sample.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border p-2 text-muted-foreground hover:bg-muted"
                  title="Open file"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <p className="mt-2 truncate text-xs text-muted-foreground">
                {sample.fileUrl}
              </p>

              <div className="mt-3 flex gap-1">
                <button
                  onClick={() => handleToggle(sample.id, !sample.isActive)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                  title={sample.isActive ? "Hide" : "Activate"}
                >
                  {sample.isActive ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(sample.id)}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
