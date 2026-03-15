"use client";

import { FileText, Download, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Document } from "@/types";

interface DocumentsTabProps {
  documents: Document[];
}

export function DocumentsTab({ documents }: DocumentsTabProps) {
  const handleDownload = (doc: Document) => {
    window.open(doc.filePath, "_blank");
  };

  const handleView = (doc: Document) => {
    window.open(doc.filePath, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-purple-50 p-2">
          <FileText className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Uploaded Documents</h2>
          <p className="text-sm text-muted-foreground">
            Review all documents submitted with this application
          </p>
        </div>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-lg bg-muted/50 p-4 mb-4">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-50 p-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{doc.originalName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {doc.category && (
                      <Badge variant="outline" className="text-xs">
                        {doc.category}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {doc.contentType}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {(doc.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleView(doc)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(doc)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
