"use client";

import { AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { NeedAttentionItem } from "@/types";
import { useRouter } from "next/navigation";

interface NeedAttentionProps {
  items: NeedAttentionItem[];
}

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-blue-100 text-blue-700",
};

export function NeedAttention({ items }: NeedAttentionProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-lg bg-red-50 p-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </div>
        <h3 className="font-semibold">Needs Attention</h3>
        {items.length > 0 && (
          <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-100 px-1.5 text-xs font-medium text-red-700">
            {items.length}
          </span>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          All caught up! No items need attention.
        </p>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.userName}</p>
                <p className="text-xs text-muted-foreground">{item.reason}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatRelativeDate(item.createdAt)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[item.priority]}`}
              >
                {item.priority}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  router.push(`/admin/applications?id=${item.applicationId}`)
                }
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
