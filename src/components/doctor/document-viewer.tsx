"use client";

import { FileText, Image, Film, Download } from "lucide-react";
import { format } from "date-fns";
import type { Document } from "@/types";

interface DocumentViewerProps {
  documents: Document[];
}

function getFileIcon(contentType: string) {
  if (contentType.startsWith("image/")) return Image;
  if (contentType.startsWith("video/")) return Film;
  return FileText;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentViewer({ documents }: DocumentViewerProps) {
  if (documents.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <FileText className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          No documents uploaded
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">
        Documents ({documents.length})
      </h4>
      <div className="grid gap-2 sm:grid-cols-2">
        {documents.map((doc) => {
          const Icon = getFileIcon(doc.contentType);
          return (
            <div
              key={doc.id}
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {doc.originalName}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatSize(doc.size)}</span>
                  <span>•</span>
                  <span>
                    {format(new Date(doc.createdAt), "MMM dd, yyyy")}
                  </span>
                  {doc.category && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{doc.category}</span>
                    </>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                title="Download"
                onClick={() => window.open(doc.filePath, "_blank")}
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
