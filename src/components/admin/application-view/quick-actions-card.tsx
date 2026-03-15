"use client";

import { Send, FileText, Download } from "lucide-react";
import { toast } from "sonner";

interface QuickActionsCardProps {
  applicationId: string;
}

export function QuickActionsCard({ applicationId }: QuickActionsCardProps) {
  const handleSendWhatsApp = () => {
    toast.info("WhatsApp message feature coming soon");
  };

  const handleGenerateReport = () => {
    toast.info("Report generation coming soon");
  };

  const handleExportData = () => {
    toast.info("Export feature coming soon");
  };

  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="font-semibold text-base mb-4">Quick Actions</h3>

      <div className="space-y-1">
        <button
          onClick={handleSendWhatsApp}
          className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          <Send className="h-4 w-4 text-muted-foreground" />
          Send WhatsApp Message
        </button>
        <button
          onClick={handleGenerateReport}
          className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          <FileText className="h-4 w-4 text-muted-foreground" />
          Generate Report
        </button>
        <button
          onClick={handleExportData}
          className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          <Download className="h-4 w-4 text-muted-foreground" />
          Export Data
        </button>
      </div>
    </div>
  );
}
